import {all,get,put,del,uid,now} from './db.js';

const ENTITY_STORE={task:'tasks',decision:'decisions',comment:'comments',project:'projects',evidence:'evidence',activity:'activity',handoff:'handoffs'};
export const TRYSTERO_VERSION='0.25.3';
export const DEFAULT_PUBLIC_ROOM='texas-connectivity-public';
export const APP_ID='texas-connectivity-opportunity-os-v5';
const IMPORTS={
  nostr:`https://esm.sh/trystero@${TRYSTERO_VERSION}?bundle`,
  mqtt:`https://esm.sh/@trystero-p2p/mqtt@${TRYSTERO_VERSION}?bundle`,
  torrent:`https://esm.sh/@trystero-p2p/torrent@${TRYSTERO_VERSION}?bundle`,
  ipfs:`https://esm.sh/@trystero-p2p/ipfs@${TRYSTERO_VERSION}?bundle`
};
const cmp=(a,b)=>{const ta=Date.parse(a?.modifiedAt||a?.createdAt||0)||0,tb=Date.parse(b?.modifiedAt||b?.createdAt||0)||0;if(ta!==tb)return ta-tb;return String(a?.clientId||'').localeCompare(String(b?.clientId||''));};
const sensitive=v=>/^(internal|sensitive)/i.test(String(v||'').trim());

export class Collaboration {
  constructor({onEvent=()=>{},onPresence=()=>{},onStatus=()=>{}}={}){
    this.onEvent=onEvent;this.onPresence=onPresence;this.onStatus=onStatus;
    this.clientId=localStorage.getItem('txco.clientId')||crypto.randomUUID();
    localStorage.setItem('txco.clientId',this.clientId);
    this.name=localStorage.getItem('txco.name')||`Navigator-${this.clientId.slice(0,4)}`;
    this.role=localStorage.getItem('txco.role')||'resident';
    this.room=localStorage.getItem('txco.room')||DEFAULT_PUBLIC_ROOM;
    this.presence=new Map();this.bc=null;this.trysteroRoom=null;this.actions={};
    this.mode='offline';this.heartbeat=null;this.peerCount=0;
  }
  identity(){return {clientId:this.clientId,name:this.name,role:this.role,room:this.room,identityVerified:false,lastSeen:now()}}
  isPublicRoom(){return this.room===DEFAULT_PUBLIC_ROOM}
  configure({name,role,room}){
    if(name){this.name=name;localStorage.setItem('txco.name',name)}
    if(role){this.role=role;localStorage.setItem('txco.role',role)}
    if(room){this.room=room;localStorage.setItem('txco.room',room)}
  }
  async startPublic({strategy='nostr'}={}){
    this.configure({room:DEFAULT_PUBLIC_ROOM});
    if(!navigator.onLine){await this.startLocal();return {mode:'local',reason:'offline'}}
    try{await this.connectTrystero({strategy});return {mode:'p2p'}}
    catch(error){
      console.warn('Default public Trystero room unavailable; using same-device BroadcastChannel fallback.',error);
      await this.startLocal();
      this.onStatus({mode:'local BroadcastChannel · public fallback',connected:true,decentralized:false,publicRoom:true,room:this.room,fallbackReason:error?.message||String(error)});
      return {mode:'local',reason:error?.message||String(error)};
    }
  }
  async startLocal(){
    this.stop();this.mode='local';
    this.bc=new BroadcastChannel(`txco:${this.room}`);
    this.bc.onmessage=e=>this.receive(e.data,'local');
    this.onStatus({mode:'local BroadcastChannel',connected:true,decentralized:false,publicRoom:this.isPublicRoom(),room:this.room});
    this.sendPresence();this.heartbeat=setInterval(()=>this.sendPresence(),10000);
  }
  async connectTrystero({strategy='nostr',password='',turnConfig=null}={}){
    this.stop();this.mode=`p2p:${strategy}`;
    const spec=IMPORTS[strategy]||IMPORTS.nostr;
    this.onStatus({mode:this.mode,connected:false,connecting:true,publicRoom:this.isPublicRoom(),room:this.room,strategy});
    const mod=await import(spec);
    const config={appId:APP_ID};
    if(password)config.password=password;
    if(turnConfig)config.turnConfig=turnConfig;
    const room=mod.joinRoom(config,this.room,{onJoinError:details=>this.onStatus({mode:this.mode,connected:false,publicRoom:this.isPublicRoom(),room:this.room,strategy,joinError:details?.error?.message||String(details?.error||'Peer connection failed; TURN may be required.')})});
    this.trysteroRoom=room;
    const eventAction=room.makeAction('txco-event');
    const presenceAction=room.makeAction('txco-presence');
    const stateAction=room.makeAction('txco-state');
    this.actions={eventAction,presenceAction,stateAction};
    eventAction.onMessage=(msg,{peerId})=>this.receive(msg,'trystero',peerId);
    presenceAction.onMessage=(member,{peerId})=>this.updatePresence({...member,peerId,identityVerified:false});
    stateAction.onMessage=(snap,{peerId})=>this.applySnapshot(snap,peerId);
    room.onPeerJoin=async peerId=>{
      this.peerCount++;
      presenceAction.send(this.identity(),{target:peerId});
      stateAction.send(await this.snapshot(),{target:peerId});
      this.onStatus({mode:this.mode,connected:true,decentralized:true,peerCount:this.peerCount,strategy,publicRoom:this.isPublicRoom(),room:this.room});
    };
    room.onPeerLeave=peerId=>{
      this.peerCount=Math.max(0,this.peerCount-1);
      for(const [id,m] of this.presence)if(m.peerId===peerId)this.presence.delete(id);
      this.onPresence([...this.presence.values()]);
      this.onStatus({mode:this.mode,connected:true,decentralized:true,peerCount:this.peerCount,strategy,publicRoom:this.isPublicRoom(),room:this.room});
    };
    this.updatePresence(this.identity());
    this.onStatus({mode:this.mode,connected:true,decentralized:true,peerCount:0,strategy,publicRoom:this.isPublicRoom(),room:this.room});
    this.heartbeat=setInterval(()=>this.sendPresence(),10000);
  }
  stop(){
    clearInterval(this.heartbeat);this.heartbeat=null;
    if(this.bc){this.bc.close();this.bc=null}
    if(this.trysteroRoom){try{this.trysteroRoom.leave()}catch{}this.trysteroRoom=null}
    this.actions={};this.presence.clear();this.peerCount=0;this.onPresence([]);
  }
  async snapshot(){
    const out={};
    for(const [entity,store] of Object.entries(ENTITY_STORE)){
      const rows=await all(store);
      out[entity]=rows.filter(r=>r?.collaborationRoom===this.room&&!r?.localOnly);
    }
    return {type:'snapshot',room:this.room,entities:out,sentAt:now(),scope:'current-room-only'};
  }
  async applySnapshot(snap){
    if(!snap?.entities||snap.room!==this.room)return;
    for(const [entity,rows] of Object.entries(snap.entities))for(const payload of rows||[])await this.applyEvent({entityType:entity,room:this.room,payload},true);
    this.onEvent({type:'snapshot',room:this.room});
  }
  async broadcast(type,payload,{persist=true}={}){
    const base={...payload,clientId:this.clientId,modifiedAt:payload.modifiedAt||now()};
    if(this.isPublicRoom()&&sensitive(base.privacyClass)){
      const localPayload={...base,collaborationRoom:null,localOnly:true};
      if(persist)await this.applyEvent({entityType:type,room:null,payload:localPayload},false);
      this.onEvent({type:'local-only',entityType:type,payload:localPayload,reason:'privacy-class'});
      return {localOnly:true,payload:localPayload};
    }
    const scoped={...base,collaborationRoom:this.room,collaborationVisibility:this.isPublicRoom()?'public':'room'};
    const event={type:'event',eventId:uid('evt'),room:this.room,entityType:type,payload:scoped,actor:this.identity(),sentAt:now()};
    if(persist)await this.applyEvent(event,false);
    if(this.mode==='local'&&this.bc)this.bc.postMessage(event);
    if(this.mode.startsWith('p2p:')&&this.actions.eventAction)await this.actions.eventAction.send(event);
    return {localOnly:false,event,payload:scoped};
  }
  sendPresence(){
    const member=this.identity(),msg={type:'presence',room:this.room,member};
    if(this.mode==='local'&&this.bc)this.bc.postMessage(msg);
    if(this.mode.startsWith('p2p:')&&this.actions.presenceAction)this.actions.presenceAction.send(member);
    this.updatePresence(member);
  }
  async receive(msg,source,peerId){
    if(!msg||msg.room!==this.room)return;
    if(msg.type==='presence'){this.updatePresence({...msg.member,peerId,identityVerified:false});return}
    if(msg.type==='event'){
      if(msg.actor?.clientId===this.clientId&&source==='local')return;
      if(msg.payload?.collaborationRoom!==this.room)return;
      await this.applyEvent(msg,true);
    }
  }
  updatePresence(member){
    if(!member?.clientId)return;
    this.presence.set(member.clientId,{...member,identityVerified:false,lastSeen:Date.now()});
    const cutoff=Date.now()-30000;
    for(const [id,m] of this.presence)if(m.lastSeen<cutoff)this.presence.delete(id);
    this.onPresence([...this.presence.values()]);
  }
  async applyEvent(ev,notify=true){
    const store=ENTITY_STORE[ev.entityType];if(!store)return;
    const incoming=ev.payload;if(!incoming?.id)return;
    const existing=await get(store,incoming.id);
    if(!existing||cmp(existing,incoming)<=0){
      if(incoming.deleted)await del(store,incoming.id);else await put(store,incoming);
      if(notify)this.onEvent(ev);
    }
  }
}
