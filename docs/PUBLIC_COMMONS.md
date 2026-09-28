# Default Public Texas Commons

## Purpose

The default public room gives independently hosted users a common coordination surface without requiring a central application database or account system.

Room ID: `texas-connectivity-public`  
Default discovery: Nostr  
Application namespace: `texas-connectivity-opportunity-os-v5`  
P2P runtime: Trystero 0.25.3 + WebRTC

## Automatic startup

When the modular app runs over HTTP(S):

1. the workspace renders immediately;
2. the app attempts to join the default public room in the background;
3. if Trystero/Nostr setup is unavailable, the app switches to the same-device BroadcastChannel fallback;
4. the collaboration badge reports the active mode.

The automatic connection does not upload the browser's entire IndexedDB database.

## What can synchronize

The collaboration protocol recognizes:

- projects;
- tasks;
- comments/coordination notes;
- decisions;
- evidence records;
- activity records;
- cross-domain handoffs.

A record is synchronized only after a collaboration workflow broadcasts it. v5 adds:

- `collaborationRoom` — the room that owns the shared record;
- `collaborationVisibility` — `public` for the default commons, otherwise `room`.

Snapshots include only records whose `collaborationRoom` matches the active room.

## Public-room privacy guard

If a record carries a `privacyClass` beginning with `Internal` or `Sensitive`, the v5 reference client stores it locally with `localOnly: true` instead of broadcasting it while the public room is active.

This is a guardrail, not a compliance guarantee. It cannot classify every sensitive field automatically and should not be used as permission to place regulated records into the app.

## Identity boundary

Presence contains self-asserted coordination metadata. It does not prove:

- legal identity;
- employment;
- agency affiliation;
- professional licensure;
- school/university affiliation;
- corporate authority;
- government authority;
- authorization to access protected records.

Institutions requiring verified membership need an approved identity/admission layer outside the reference public commons.

## Custom rooms

For non-public collaboration:

1. choose a hard-to-guess room ID;
2. optionally add a shared room password;
3. select Nostr, MQTT, BitTorrent or IPFS discovery;
4. exchange room settings/password out-of-band;
5. define who may join and what data may be shared;
6. configure TURN only when direct WebRTC traversal fails or policy requires it.

## TURN

TURN is a disclosed fallback relay. It does not replace WebRTC encryption, but it changes the network path because encrypted traffic can traverse the relay. Treat TURN credentials as sensitive configuration.

## Operational recommendation

Use the public commons for low-sensitivity coordination, discovery of collaborators, public project/evidence exchange and cross-domain handoffs. Move regulated, confidential, procurement-sensitive, security-sensitive or personally identifying work into approved organizational systems or governed custom rooms with appropriate identity/access controls.
