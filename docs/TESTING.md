# Testing Record — v5

Build date: 2026-09-28

## Performed in the build environment

- dependency-free `tests/static_smoke.py` completed successfully;
- all 111 requirements remain present;
- all 10 Simplified Advanced Guides remain present;
- current evidence/program, partner-sector and collaboration-role minimum counts checked;
- JavaScript syntax checks with `node --check` for all client modules, service worker and `server/server.js`;
- JSON parsing for all bundled JSON/schema/package files;
- every service-worker precache target checked for existence;
- v5 Trystero app-ID/version pin, four discovery strategies, automatic public-room startup, BroadcastChannel fallback, snapshot exchange, room-scoped snapshot filtering, public privacy guard, TURN control and identity warning checked statically;
- splash progression, reduced-motion CSS, focus-visible tooltip behavior, guide learning ladder, WebLLM worker and PWA registration checked statically;
- local static HTTP server returned HTTP 200 for the app shell, manifest, service worker, guide data, collaboration module, WebLLM worker and P2P documentation;
- release ZIP integrity checked after packaging;
- SHA-256 release hashes regenerated after final edits.

## Not fully performed

- live browser UI automation across every route/control;
- full PWA installation on Chrome/Safari/Firefox/mobile;
- actual WebLLM model download/inference (large external runtime/model prerequisites);
- live two-device Trystero/Nostr/WebRTC interoperability test across independent networks/NATs;
- live default-public-room discovery with an independently hosted second client;
- live MQTT/BitTorrent/IPFS discovery interoperability test;
- live TURN relay test with production credentials;
- live multi-device test of the optional legacy WebSocket adapter;
- production reverse-proxy/TLS deployment;
- accessibility certification or formal WCAG 2.2 AA audit;
- penetration/security audit.

Do not describe these unperformed tests as passed. Deployment teams should perform browser/device, Trystero/WebRTC/TURN, PWA, accessibility, privacy and security verification in the target hosting environment.
