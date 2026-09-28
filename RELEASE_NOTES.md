# v5.0.0 Release Notes — Public Commons Hardening

Texas Connectivity & Opportunity OS v5 preserves the multidisciplinary v4 suite while hardening the requested default-public-room collaboration model.

## Added / changed

- Hosted/online startup automatically attempts to join the public room `texas-connectivity-public` using Trystero 0.25.3 + Nostr discovery.
- App ID advanced to `texas-connectivity-opportunity-os-v5` to prevent accidental intermixing with older protocol clients.
- The public room is intentionally passwordless; custom rooms retain optional shared-password support.
- Shared records receive an explicit `collaborationRoom` and `collaborationVisibility` marker.
- Join-time peer snapshots are filtered to the active room only.
- Internal/Sensitive records created while in the public commons are retained locally and not broadcast.
- Presence now explicitly marks identity as unverified; peer/client IDs, names, roles and organizations are not treated as authenticated identity.
- Public-room reconnect control added to Multiplayer Commons.
- TURN remains visible and optional as a fallback for direct WebRTC traversal failures.
- Same-device `BroadcastChannel` remains the no-network fallback and is used if automatic public Trystero startup cannot connect.
- Simplified Advanced Guides now use the exact learning ladder: one-minute explanation → actionable steps → advanced explanation → expert/implementation detail, followed by failure modes, cross-domain handoffs and verification.
- Splash copy updated to explain automatic public presence without implying that all local records are automatically shared.
- Service-worker cache version advanced to v5.
- Static smoke tests expanded for public-room autojoin, room-scoped snapshots and privacy guard invariants.

## Preserved

- animated connectivity/evidence/collaboration/opportunity splash;
- reduced-motion behavior and immediate Enter workspace control;
- accessible focus/keyboard tooltips;
- Nostr/MQTT/BitTorrent/IPFS strategy options;
- direct WebRTC projects/tasks/comments/decisions/evidence/handoff synchronization;
- IndexedDB local-first storage and validated JSON backup/import;
- WebLLM dedicated worker and deterministic fallback planning;
- installable PWA, manifest, versioned service worker and offline data shell;
- legacy/optional Node/WebSocket adapter;
- current Texas evidence/program layers and 111-section requirements atlas.

## Important boundaries

Automatic presence in the public commons does **not** authenticate identity, make the room suitable for regulated records, or transmit arbitrary local IndexedDB contents. Only records explicitly shared through collaboration workflows and tagged to the active room enter snapshots/events.

Live two-device/NAT/TURN behavior must still be tested in the target deployment environment.
