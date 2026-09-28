#!/usr/bin/env python3
from pathlib import Path
import json,re,sys
ROOT=Path(__file__).resolve().parents[1]
errors=[]
def ok(cond,msg):
    print(('PASS' if cond else 'FAIL'),msg)
    if not cond: errors.append(msg)
for p in ROOT.rglob('*.json'):
    try: json.loads(p.read_text(encoding='utf-8')); ok(True,f'JSON {p.relative_to(ROOT)}')
    except Exception as e: ok(False,f'JSON {p.relative_to(ROOT)}: {e}')
req=json.loads((ROOT/'data/requirements.json').read_text())
g=json.loads((ROOT/'data/guides.json').read_text())
cur=json.loads((ROOT/'data/texas-current.json').read_text())
cross=json.loads((ROOT/'data/cross-domain.json').read_text())
partners=json.loads((ROOT/'data/partner-playbook.json').read_text())
ok(len(req)==111,'111 requirements preserved')
ok(len(g)==10,'10 advanced guides present')
ok(len(cur.get('facts',[]))>=28,'current evidence facts >= 28')
ok(len(cur.get('programs',[]))>=11,'program records >= 11')
ok(len(cross.get('collaborationRoles',[]))>=17,'collaboration roles >= 17')
ok(len(partners.get('sectors',[]))>=13,'partner sectors >= 13')
sw=(ROOT/'sw.js').read_text()
static=sw.split('];',1)[0]
paths=re.findall(r"'\./([^']+)'",static)
for rel in paths: ok((ROOT/rel).exists(),f'precache target {rel}')
app=(ROOT/'assets/js/app.js').read_text(); c=(ROOT/'assets/js/collab.js').read_text(); html=(ROOT/'index.html').read_text(); css=(ROOT/'assets/css/app.css').read_text()
checks={
 'app v5':"APP_VERSION='5.0.0'" in app,
 'Trystero 0.25.3 pinned':"TRYSTERO_VERSION='0.25.3'" in c,
 'v5 isolated Trystero app id':"texas-connectivity-opportunity-os-v5" in c,
 'default public room constant':"DEFAULT_PUBLIC_ROOM='texas-connectivity-public'" in c,
 'automatic public commons startup':'startDefaultPublicCommons()' in app and 'collab.startPublic' in app,
 'Nostr/MQTT/Torrent/IPFS strategies':all(x in c for x in ['nostr','mqtt','torrent','ipfs']),
 'BroadcastChannel local mode':'BroadcastChannel' in c,
 'peer snapshot sync':'stateAction.send(await this.snapshot()' in c,
 'room-scoped snapshots':"r?.collaborationRoom===this.room" in c and "scope:'current-room-only'" in c,
 'public privacy-class guard':'sensitive(base.privacyClass)' in c and 'localOnly:true' in c,
 'unverified identity warning':'identityVerified:false' in c and 'not verified identities' in app,
 'typed handoffs':"handoff:'handoffs'" in c and 'handoffForm' in app,
 'TURN control':'turnConfig' in c and 'turnJson' in app,
 'guide learning ladder':all(x in app for x in ['One-minute explanation','Actionable steps','Advanced explanation','Expert / implementation detail']),
 'animated splash shell':all(x in html for x in ['Connectivity','Evidence','Collaboration','Opportunity','Enter workspace','splashTrack']),
 'reduced motion':'prefers-reduced-motion' in css,
 'focus tooltips':'.tip:focus::after' in css and 'tabindex="0"' in app,
 'WebLLM worker':'webllm-worker.js' in (ROOT/'assets/js/ai.js').read_text(),
 'PWA manifest':'manifest.webmanifest' in html,
 'service worker v5':"txco-v5.0.0" in sw,
 'service worker registration':'serviceWorker' in app,
 'legacy server documented optional':'legacy/optional' in (ROOT/'README.md').read_text().lower(),
}
for k,v in checks.items(): ok(v,k)
if errors:
    print(f'\n{len(errors)} failure(s)')
    sys.exit(1)
print('\nStatic smoke test passed.')
