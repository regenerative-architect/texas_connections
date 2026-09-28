# Deployment

## Recommended: static HTTPS/PWA + Trystero/WebRTC

The normal v5 deployment is a static HTTPS site. No custom application server is required for decentralized rooms. On startup, hosted/online clients attempt to join the shared public Nostr room `texas-connectivity-public`. Trystero performs discovery/signaling through the selected strategy and collaboration data travels over browser-to-browser WebRTC once peers connect.

Requirements:

- correct MIME types for ES modules, JSON, webmanifest, SVG and PNG;
- HTTPS in production for service workers/PWA/WebGPU expectations;
- `index.html` and `sw.js` under the same application scope;
- preserve relative paths;
- allow outbound connections needed by the chosen Trystero discovery strategy and, when configured, TURN;
- allow the documented WebLLM distribution/model hosts if local AI is enabled.

For local testing:

```bash
python -m http.server 8080
```

Open `http://localhost:8080/`. Localhost is a secure-context exception suitable for service-worker development.

## Same-device / offline collaboration

`BroadcastChannel` is available for same-origin tabs/windows and does not require Trystero or the network. Local records remain in IndexedDB. New cross-device rooms require network connectivity.

## TURN

Direct WebRTC does not traverse every NAT/firewall topology. The Multiplayer Commons exposes an optional TURN JSON configuration. TURN is a fallback, not hidden infrastructure. Protect TURN credentials and apply provider/network policy appropriate to the deployment.

## Optional legacy Node/WebSocket adapter

`server/server.js` can serve the static parent directory and exposes `/ws` for teams that intentionally want a conventional relay. It is **not required** for the v5 Trystero client and is not automatically selected by it.

```bash
cd server
npm install
PORT=8787 HOST=0.0.0.0 npm start
```

Optional settings:

- `ROOM_SECRET` — when non-empty, legacy `/ws` connections must include `?key=...`;
- `PERSIST_ROOMS=false` — disables JSONL event persistence.

If an institution adopts this adapter, add identity/authentication, per-room authorization, durable database storage, backup/retention policy, rate limiting, abuse controls, audit policy, TLS/secret management and a privacy/legal review before sensitive use.

## Service-worker update flow

Increment `VERSION` in `sw.js` when changing cached shell/data files. Old caches are removed on activation. The service worker caches only same-origin application resources and deliberately does not proxy WebLLM model artifacts, discovery networks, TURN traffic or external government sites.

## Direct-file mode

Use `standalone.html` for a direct-file compatibility experience. Do not expect service workers/PWA installation or the modular Trystero runtime to behave as a hosted site under `file://`.
