const DB_NAME='tx-connectivity-opportunity-os';
const DB_VERSION=4;
export const STORES=['profiles','speedTests','outages','devices','projects','tasks','decisions','comments','evidence','activity','outbox','settings','scenarios','resources','members','handoffs','organizations'];
let dbPromise;
export function openDB(){
  if(dbPromise) return dbPromise;
  dbPromise=new Promise((resolve,reject)=>{
    const req=indexedDB.open(DB_NAME,DB_VERSION);
    req.onupgradeneeded=()=>{
      const db=req.result;
      for(const s of STORES){if(!db.objectStoreNames.contains(s))db.createObjectStore(s,{keyPath:'id'});}
    };
    req.onsuccess=()=>resolve(req.result);
    req.onerror=()=>reject(req.error);
  });
  return dbPromise;
}
export async function all(store){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(store,'readonly').objectStore(store).getAll();r.onsuccess=()=>res(r.result||[]);r.onerror=()=>rej(r.error);});}
export async function get(store,id){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(store,'readonly').objectStore(store).get(id);r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
export async function put(store,obj){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(store,'readwrite').objectStore(store).put(obj);r.onsuccess=()=>res(obj);r.onerror=()=>rej(r.error);});}
export async function del(store,id){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(store,'readwrite').objectStore(store).delete(id);r.onsuccess=()=>res();r.onerror=()=>rej(r.error);});}
export async function clear(store){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(store,'readwrite').objectStore(store).clear();r.onsuccess=()=>res();r.onerror=()=>rej(r.error);});}
export async function count(store){const db=await openDB();return new Promise((res,rej)=>{const r=db.transaction(store,'readonly').objectStore(store).count();r.onsuccess=()=>res(r.result);r.onerror=()=>rej(r.error);});}
export async function bulkPut(store,items){const db=await openDB();return new Promise((res,rej)=>{const tx=db.transaction(store,'readwrite');const os=tx.objectStore(store);for(const x of items)os.put(x);tx.oncomplete=()=>res(items.length);tx.onerror=()=>rej(tx.error);});}
export function uid(prefix='id'){return `${prefix}-${crypto.randomUUID()}`}
export function now(){return new Date().toISOString()}
export async function exportBackup(){
  const payload={schema:'tx-connectivity-opportunity-os',version:4,exportedAt:now(),stores:{}};
  for(const s of STORES)payload.stores[s]=await all(s);
  return payload;
}
export async function importBackup(payload,{replace=false}={}){
  if(!payload||payload.schema!=='tx-connectivity-opportunity-os'||typeof payload.stores!=='object'||payload.stores===null)throw new Error('Unsupported backup schema');
  if(!Number.isInteger(payload.version)||payload.version<1||payload.version>DB_VERSION)throw new Error(`Unsupported backup version ${payload.version}`);
  const validated={};
  let total=0;
  for(const s of STORES){
    const rows=payload.stores[s];
    if(rows==null){validated[s]=[];continue}
    if(!Array.isArray(rows))throw new Error(`Invalid store ${s}: expected an array`);
    if(rows.length>50000)throw new Error(`Invalid store ${s}: too many rows`);
    validated[s]=rows.map((row,i)=>{
      if(!row||typeof row!=='object'||Array.isArray(row))throw new Error(`Invalid ${s}[${i}]: expected an object`);
      if(typeof row.id!=='string'||!row.id.trim()||row.id.length>240)throw new Error(`Invalid ${s}[${i}].id`);
      return row;
    });
    total+=rows.length;
    if(total>100000)throw new Error('Backup contains too many records');
  }
  // Validate the entire payload before destructive replacement.
  if(replace){for(const s of STORES)await clear(s)}
  for(const s of STORES){if(validated[s].length)await bulkPut(s,validated[s])}
  return {stores:STORES.length,records:total};
}
