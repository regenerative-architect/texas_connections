# Optional legacy WebSocket adapter

This directory is retained as an optional conventional relay/static-server adapter. **Texas Connectivity & Opportunity OS v5 uses Trystero 0.25.3 + WebRTC as its primary multiplayer path and does not require this server.**

Use this adapter only when an organization deliberately wants a conventional WebSocket room relay or needs it as a migration bridge. The v5 client is not automatically wired to it.

```bash
npm install
npm start
```

The adapter exposes `/healthz` and `/ws`, keeps bounded event history, can persist JSONL event records, and accepts the collaboration entity types used by the reference model including cross-domain handoffs. It is not an institutional identity, authorization or compliance system.
