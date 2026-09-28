# Collaboration Protocol — v5

## Primary runtime

The browser client uses Trystero 0.25.3 with a version-isolated application ID:

`texas-connectivity-opportunity-os-v5`

Supported discovery modules:

- Nostr — default
- MQTT
- BitTorrent
- IPFS

Hosted/online startup automatically attempts to enter `texas-connectivity-public` using Nostr. Custom rooms may use another discovery strategy and an optional shared password. An explicit TURN configuration array can be supplied when direct WebRTC traversal fails.

## Trystero action objects

The client creates three actions with `room.makeAction()`:

- `txco-event` — durable collaboration entities/events
- `txco-presence` — ephemeral member presence
- `txco-state` — join-time peer snapshots

The 0.25.x action-object API is used through each action's `send` method and `onMessage` handler.

## Durable event shape

```json
{
  "type": "event",
  "eventId": "evt-uuid",
  "room": "texas-connectivity-public",
  "entityType": "handoff",
  "payload": {
    "id": "handoff-uuid",
    "fromDomain": "health",
    "toDomain": "connectivity",
    "request": "Verify upload reliability at the rural clinic",
    "status": "Requested",
    "privacyClass": "Public",
    "collaborationRoom": "texas-connectivity-public",
    "collaborationVisibility": "public",
    "modifiedAt": "2026-09-28T00:00:00Z",
    "clientId": "..."
  },
  "actor": {
    "clientId": "...",
    "name": "...",
    "role": "health",
    "identityVerified": false
  }
}
```

Durable synchronized entity types:

- `project`
- `task`
- `decision`
- `comment`
- `evidence`
- `activity`
- `handoff`

## Public-room privacy guard

When the active room is `texas-connectivity-public`, a record marked `Internal` or `Sensitive...` through `privacyClass` is persisted with `localOnly: true` and is not transmitted through the room.

The guard is not a substitute for a protected institutional records system.

## Snapshot shape and boundary

```json
{
  "type": "snapshot",
  "room": "texas-connectivity-public",
  "scope": "current-room-only",
  "entities": {
    "project": [],
    "task": [],
    "decision": [],
    "comment": [],
    "evidence": [],
    "activity": [],
    "handoff": []
  },
  "sentAt": "..."
}
```

Only records whose `collaborationRoom` equals the active room are included. Local-only records are excluded.

## Merge rule

Received records are written to IndexedDB when no local record exists or when the incoming version wins the deterministic comparison:

1. `modifiedAt` timestamp;
2. `clientId` lexical tie-break.

The reference is a last-write-wins replication strategy, not a full CRDT.

## Presence

Presence is ephemeral and includes `identityVerified: false`. Peer/client identifiers, names, organizations and role labels are not proof of identity or authorization.

## Same-device fallback

`BroadcastChannel` uses the same room/event model among same-origin tabs/windows in a browser profile and requires no external network.

## Optional legacy WebSocket adapter

`server/server.js` retains a conventional `/ws` relay for compatibility/testing/institutional adaptation. The v5 application does not automatically depend on it.

Teams that deliberately adopt it must add controls appropriate to their context, potentially including authenticated identity, authorization, durable storage, backups, audit, abuse controls, rate limits and regulated-record safeguards.
