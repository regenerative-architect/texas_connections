# Texas Connectivity & Opportunity OS v5 — Public Multidisciplinary Commons

A public-ready, local-first Texas connectivity planning and collaboration suite for families, institutions, governments, corporations, educational bodies, health systems, libraries, businesses, utilities, workforce partners, nonprofits and researchers.

**Primary multiplayer architecture:** Trystero 0.25.3 for decentralized peer discovery/signaling and direct browser-to-browser WebRTC room traffic. Hosted/online startup automatically enters the passwordless public room `texas-connectivity-public` using Nostr discovery. MQTT, BitTorrent and IPFS remain selectable for custom rooms. The bundled Node/WebSocket server is legacy/optional and is not required for normal multiplayer. `BroadcastChannel` provides the same-device/zero-network fallback.

**Systems architecture/concept:** Ricky Foster + Navi · Planetary Restoration Archive.

## v5 highlights

- animated, skippable splash with Connectivity → Evidence → Collaboration → Opportunity progression, network rings, loading track and reduced-motion behavior;
- 10 Simplified Advanced Guides using one-minute explanation → actionable steps → advanced explanation → expert/implementation detail, plus failure modes, cross-domain handoffs and verification;
- accessible mouse/keyboard/focus tooltips for room IDs, discovery strategies, passwords, disciplinary roles, peer networking and TURN;
- Trystero 0.25.3 action-object API (`makeAction()` → action object with `send` / `onMessage`);
- Nostr discovery by default, selectable MQTT / BitTorrent / IPFS discovery, one collaboration event model across strategies;
- direct WebRTC synchronization of projects, tasks, comments, decisions, evidence and typed cross-domain handoffs;
- automatic default public commons (`texas-connectivity-public`) in hosted/online mode, while custom/private rooms remain available;
- room-scoped shared records and room-scoped join snapshots so state from one room is not leaked into another;
- privacy-class guard: Internal/Sensitive records created while in the public commons are retained locally rather than broadcast;
- peer snapshot exchange when a participant joins, allowing current local records to converge without a central application database;
- ephemeral presence with an explicit warning that peer IDs/names are not verified human or organizational identities;
- optional shared room password and explicit TURN JSON configuration for networks where direct WebRTC cannot be established;
- same-device multiplayer through `BroadcastChannel`, requiring neither Trystero nor the network;
- IndexedDB local-first records, portable validated JSON backup/import, CSV evidence export, deterministic record conflict reconciliation and explicit reset controls;
- WebLLM 0.2.85 dedicated-worker architecture with browser-side WebGPU inference when available and deterministic planning fallbacks when it is not;
- installable PWA, manifest, versioned service worker and offline shell/data cache;
- institution/family/business partner playbook and 17-role cross-domain registry;
- typed multidisciplinary handoffs with owner, domain, due date, privacy class, evidence reference, lifecycle status and verification state;
- 28 current official-source Texas evidence facts, 11 program records, and the preserved 111-section requirements atlas;
- optional legacy Node/WebSocket adapter retained for teams that deliberately choose a conventional server relay.

## What the platform is for

The OS separates four related problems that are often conflated:

1. **Availability** — can infrastructure technically reach the location?
2. **Performance and reliability** — does the connection work at the capacity and continuity required?
3. **Adoption and affordability** — can households/organizations obtain devices, service, support and skills?
4. **Opportunity** — can connectivity translate into education, health, work, business, public safety and civic outcomes?

It then lets multidisciplinary teams move through a shared lifecycle:

**Observe → Validate → Design → Fund → Build → Operate → Adopt → Verify**

The lifecycle is deliberately evidence-centered: a project is not considered successful merely because funding was announced or infrastructure was installed.

## Quick start

### Hosted/PWA + Trystero multiplayer (recommended)

Serve the folder over localhost or HTTPS:

```bash
python -m http.server 8080
```

Open `http://localhost:8080/`.

On hosted/online startup, the app attempts to join the default public Nostr room automatically. Open **Multiplayer Commons** to inspect presence, leave/rejoin the public commons, select MQTT/BitTorrent/IPFS, or choose a hard-to-guess custom room ID plus optional shared password. No custom application server is required for the normal Trystero/WebRTC path.

### Same-device Commons

Choose **Same-device local commons** in Multiplayer Commons. `BroadcastChannel` synchronizes collaboration records between tabs/windows of the same browser profile without Trystero or network access.

### Direct-file fallback

Open `standalone.html`. It preserves the prior single-file/local toolkit but does **not** claim service-worker/PWA or module-based Trystero behavior under `file://`.

### Optional legacy WebSocket adapter

The `server/` directory is retained only as a compatibility/institutional adapter. To run it intentionally:

```bash
cd server
npm install
npm start
```

It is not automatically used by the v5 client and is not required by Trystero/WebRTC rooms.

## Collaboration data model

Local durable entity stores include:

- projects;
- tasks;
- decisions;
- comments/coordination notes;
- evidence/activity;
- cross-domain handoffs;
- organizations/partner metadata;
- device, speed and outage observations;
- planning scenarios.

Cross-domain handoffs can connect education, health/telehealth, workforce, libraries, emergency management, public safety, government, families, corporations/ISPs, utilities, research, water, energy, mobility, agriculture and community organizations.

Example:

`rural clinic reliability gap → broadband/network team → power/utility dependency → telehealth team → workforce/training → county emergency-management continuity plan → verification`

## P2P architecture

Trystero handles peer discovery/signaling; application collaboration traffic then uses WebRTC between browsers. The app supports:

- automatic public Nostr commons on hosted/online startup;
- Nostr discovery (default);
- MQTT discovery;
- BitTorrent discovery;
- IPFS discovery;
- room passwords;
- explicit TURN fallback configuration;
- ephemeral peer presence;
- join-time state snapshots filtered to the active room;
- explicit `collaborationRoom` tagging on shared records;
- conflict-aware record reconciliation.

Direct WebRTC does not succeed across every NAT/firewall topology. TURN is therefore visible and optional rather than hidden or falsely described as unnecessary.

See `docs/P2P_TRYSTERO_WEBRTC.md` and `docs/PUBLIC_COMMONS.md`.

## Current Texas evidence snapshot

`data/texas-current.json` is a dated reference registry, not a live API. The v5 bundle preserves the current official-source snapshot covering:

- BEAD deployment/final proposal;
- BOOT I/II;
- Middle Mile;
- Pole Replacement;
- Broadband Infrastructure Fund;
- Digital Opportunity;
- Technical Assistance Program;
- broadband workforce grants;
- Texas/FCC mapping;
- E-Rate and Texas State Match;
- public-library connectivity/LIFI;
- rural-hospital connectivity;
- tele-connectivity programs;
- emergency/flood-monitoring connectivity.

Every current record carries source/freshness context. Users should follow the official source before making deadline-, eligibility-, procurement- or status-sensitive decisions.

## Simplified Advanced Guides

The dedicated Guides module contains:

1. Connectivity diagnosis
2. Trystero/WebRTC collaboration
3. Texas broadband-project status
4. Mapping and evidence challenges
5. Multidisciplinary project design
6. Telehealth connectivity
7. Emergency communications
8. WebLLM/local AI
9. PWA/offline architecture
10. Evidence/provenance

Each guide progresses from a one-minute orientation through action steps, advanced explanation and expert implementation detail, then adds common failure modes, cross-domain handoffs and a verification checkpoint.

## WebLLM

The optional local AI assistant uses `@mlc-ai/web-llm` 0.2.85 only after explicit user action:

- inference runs in a dedicated Web Worker;
- WebGPU is required;
- model selection comes from the WebLLM runtime configuration;
- model weights are not bundled;
- first model load requires network access and may be large;
- WebLLM manages its model cache;
- the app service worker deliberately does not intercept/cache third-party model artifacts;
- deterministic planning tools remain available when WebLLM is unavailable.

Do not treat local-model output as verified program eligibility, engineering design, procurement advice, legal advice or evidence.

## PWA and offline behavior

The service worker precaches the application shell, local modules, guides and curated JSON datasets over HTTP(S). IndexedDB stores local structured records. localStorage holds small interface preferences.

Offline does not mean everything works:

- previously cached app/reference material and local tools remain available;
- the automatic public Trystero commons and new cross-device rooms require connectivity;
- official external agency pages require connectivity unless separately cached by the browser;
- first-time WebLLM/model downloads require connectivity;
- service workers do not operate from ordinary `file://` pages.

## Evidence classes

- **A** — official measured/administrative data
- **B** — peer-reviewed evidence
- **C** — institutional analysis/guidance
- **D** — preliminary/incomplete evidence
- **E** — modeled scenario
- **F** — conceptual proposal

The app distinguishes provider-reported availability, measured performance, reliability observations, household adoption, affordability and modeled scenarios.

## Privacy and data sovereignty

- no analytics or hidden telemetry;
- no automatic precise household-location collection;
- local IndexedDB is the default for structured records;
- JSON export/import is explicit;
- hosted/online mode automatically joins the default public commons for ephemeral presence; durable record sharing still occurs only for records explicitly created/shared in the active room;
- peer names, roles, organizations and IDs are self-asserted coordination metadata, not authoritative identity verification;
- the default public room is intentionally passwordless; custom rooms can use a shared password, but passwords do not transform a public browser app into institutional IAM or a compliance system;
- TURN credentials entered in the UI are session configuration and should be treated as sensitive;
- Internal/Sensitive records are blocked from public-room broadcast by the reference client, but teams must still avoid placing regulated personal/medical/student, credential, precise vulnerable-household, or secret operational data into public or ungoverned peer rooms.

See `docs/SECURITY_PRIVACY.md`.

## Directory map

```text
index.html                          modular application shell
standalone.html                     direct-file compatibility edition
manifest.webmanifest                PWA metadata
sw.js                               versioned shell/data cache
offline.html                        offline network fallback
assets/css/app.css                  responsive/accessibility/print UI
assets/js/app.js                    routes, tools, views, workflows
assets/js/db.js                     IndexedDB + data portability
assets/js/collab.js                 BroadcastChannel + Trystero/WebRTC sync
assets/js/ai.js                     WebLLM capability + deterministic fallback
assets/js/webllm-worker.js          dedicated WebLLM worker
icons/icon.svg                      installable app icon
data/texas-current.json             current official-source Texas registry
data/cross-domain.json              multidisciplinary roles/dependencies
data/partner-playbook.json          institution/family/business collaboration model
data/guides.json                    10 layered advanced guides
data/requirements.json              preserved 111-section requirements atlas
schemas/backup.schema.json          portable backup schema reference
tests/static_smoke.py               dependency-free release smoke test
server/                             optional legacy WebSocket adapter
docs/                               architecture/source/security/test/public-commons guidance
integrity/SHA256SUMS.txt            release-file integrity hashes
```

## Zero-Harm / Anti-Inversion

The platform exists to improve connectivity, access, opportunity, safety, resilience, education, health and digital autonomy. Do not use it to expose household locations, conduct covert surveillance, exploit digital-exclusion data, manipulate vulnerable groups, bypass device protections, conceal uncertainty, or present modeled/projected outcomes as measured results.

## Integrity and provenance

`integrity/SHA256SUMS.txt` records release-file hashes. SHA-256 can verify byte integrity against a trusted expected hash; it does **not** independently prove authorship or provenance.

See `docs/TESTING.md` for performed and unperformed validation.
