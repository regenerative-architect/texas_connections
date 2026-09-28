# Security & Privacy Notes

## Client

- User-supplied strings are HTML-escaped before rendering in the main application.
- Imported backups require the expected application schema.
- No application secrets are embedded.
- External links use `noopener`.
- Precise geolocation is not requested.
- IndexedDB is the default for user records.
- Hosted/online startup automatically attempts public-room collaboration presence. WebLLM remains user-triggered. Durable collaboration records are shared only through explicit collaboration workflows.

## Optional legacy server

The optional/legacy reference server includes:

- path traversal checks for static serving;
- WebSocket message-size limit;
- allowed collaboration entity types;
- room-name sanitization;
- event-ID de-duplication;
- optional shared room-server secret;
- bounded recent event history;
- a basic Content Security Policy on HTML responses.

It does **not** provide production-grade authentication, identity proofing, role authorization, encryption at rest, regulated-record handling or multi-tenant isolation. Add those controls before using it for sensitive institutional work.

## Sensitive information

Do not place protected health information, student education records, credentials, exact vulnerable-household locations or similarly sensitive records into public/shared rooms. Store only the minimum planning data required for the task.

## CSP, Trystero and WebLLM

The optional Node server CSP restricts executable script origins to the same origin plus the pinned module CDNs used by the reference integration. `connect-src` permits HTTPS/WebSocket destinations because the selectable Trystero discovery strategies, TURN endpoints and model hosting are deployment-dependent. Revalidate and tighten network destinations for controlled institutional deployments whenever concrete discovery relays/model hosts are known.


## v5 peer-room boundary

- Trystero presence labels, client IDs and peer identifiers are self-asserted/transport metadata and are not proof of human, employer, agency or institutional identity.
- The hosted app automatically enters the public room `texas-connectivity-public` when possible. Treat it as a public surface.
- Records are tagged with `collaborationRoom`; snapshots are filtered to the active room.
- Internal/Sensitive records are kept local-only while the active room is the public commons.
- A shared room password reduces accidental/unauthorized room participation and protects Trystero session descriptions; it is not a complete institutional IAM system.
- TURN is an explicit fallback for traversal failures. If TURN credentials are entered, treat them as sensitive session configuration and do not publish them in screenshots/backups.
- Peer-to-peer does not mean "no metadata anywhere": discovery services, network providers and TURN infrastructure can observe network-level metadata according to their own operation.
- Do not synchronize regulated student, medical, credential, secret infrastructure or household-identifying data in public/unmanaged rooms.
- Typed handoffs include a privacy classification field so teams can stop a workflow before transferring information that belongs in an approved protected system.
