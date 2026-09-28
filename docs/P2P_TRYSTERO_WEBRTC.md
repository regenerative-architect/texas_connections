# Trystero 0.25.3 + WebRTC Collaboration — v5

The primary collaboration path is decentralized, static-host friendly and local-first.

## Startup behavior

When the modular app is hosted over HTTP(S), it attempts to join the passwordless public room:

`texas-connectivity-public`

using the Nostr discovery strategy. This automatic join exposes only ephemeral coordination presence until a user creates or shares a collaboration record. The public room can be left at any time. If the Nostr/Trystero runtime cannot be reached, the app falls back to same-device `BroadcastChannel` collaboration instead of inventing a successful network connection.

`file://` users should use `standalone.html`; the modular PWA/Trystero path is not claimed for ordinary direct-file use.

## Discovery and direct traffic

1. Trystero 0.25.3 is dynamically imported.
2. Nostr is the default discovery strategy.
3. Custom rooms can select MQTT, BitTorrent or IPFS discovery.
4. `room.makeAction()` uses the 0.25.x action-object API (`send`, `onMessage`).
5. The selected discovery network helps peers exchange the information necessary to establish WebRTC sessions.
6. Projects, tasks, comments, decisions, evidence, handoffs and snapshots then travel through WebRTC between participating browsers.

The application uses one action/event model across all discovery strategies.

## Action channels

- `txco-event` — durable collaboration entities/events
- `txco-presence` — ephemeral presence metadata
- `txco-state` — join-time room snapshot

## Room-scoped persistence and snapshots

Every record broadcast through v5 receives a `collaborationRoom` field. Join-time snapshots filter IndexedDB records to the **active room only**. Local records without the active room tag are not included.

This matters because a browser may participate in several rooms over time. A public-room peer must not receive state that was created in a different/custom room merely because both records live in the same local IndexedDB database.

The reference conflict rule remains deterministic last-write-wins:

1. newest `modifiedAt` wins;
2. equal timestamps are broken deterministically by `clientId` ordering.

This is intentionally auditable and simple; it is not a full CRDT.

## Default public commons

The public room is intentionally passwordless so independently hosted users can discover one shared Texas commons. Treat it as a public coordination surface.

The reference client applies a privacy guard: records whose `privacyClass` begins with `Internal` or `Sensitive` are stored locally rather than broadcast while the active room is the public commons.

This guard is defense-in-depth, not a regulated-record management system. Do not put protected health information, student education records, credentials, precise vulnerable-household locations, secret infrastructure details or other regulated/confidential records into an open room.

## Custom room password

For a custom room, an optional shared password is passed to Trystero's room configuration so session-description encryption derives from the shared secret rather than only app/room identifiers. Share the password out-of-band.

A room password is not human identity verification, institutional authentication, authorization, audit logging or admission control.

## Presence and identity warning

Presence is ephemeral. Client IDs and Trystero peer IDs are transport/coordination identifiers. Display names, organizational labels and disciplinary roles are self-asserted.

**The OS does not verify that a peer is the person, agency, company, school, university, utility, nonprofit or credential-holder they claim to be.**

Organizations requiring verified membership must add an approved identity/admission layer.

## TURN fallback

Direct WebRTC cannot traverse every NAT/firewall configuration. The UI therefore exposes an optional `turnConfig` JSON array of `RTCIceServer` objects.

TURN is treated explicitly as a fallback:

- direct WebRTC remains the preferred path;
- TURN is configured only when direct paths fail or policy requires it;
- WebRTC encryption remains in use, but packet flow can traverse the relay;
- TURN credentials are sensitive runtime configuration and should not be published in room-setting exports/screenshots.

## Same-device fallback

`BroadcastChannel` uses the same collaboration event model between same-origin tabs/windows in one browser profile. It requires neither Trystero nor an external network.

When hosted startup cannot reach Trystero/discovery, v5 activates this local public-commons fallback and reports that state explicitly in the collaboration badge/UI.

## No required central database

Each peer keeps its own IndexedDB copy. Existing peers can provide a room-scoped snapshot when a participant joins, after which later actions continue to converge state.

A central application database is therefore not required by the reference deployment. Institutions can add approved durable/shared storage if their operational, identity, compliance or audit requirements demand it.
