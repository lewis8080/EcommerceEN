# Project memory

## Product intent & audience

- Internal admin tool with a login screen; protects access to admin functionality.
- Requires authentication via admin credentials (username `super`, password `900102`).

## Brand personality & voice

- (Nothing inferred yet.)

## Visual design & UX direction

- (Nothing inferred yet beyond the existence of a login UI.)

## Decisions, constraints & rationale

- Framework: Vite + React.
- Database: PostgreSQL with `pgcrypto` extension available.
- **Security decision:** Admin password must be stored as a bcrypt hash in a database table, not hard-coded in backend source. Username `super`, password `900102` (intended as seed credentials).
- Planned schema: an `admin_accounts` table seeded with the `super` account and its bcrypt hash.
- Planned backend change: replace hard-coded credentials with a database lookup / login-check function callable only by the server.
- Current state: hard-coded credentials remain in backend code because the database migration tool failed repeatedly (sandbox connection error). Plain DB queries succeed, so the DB service itself is reachable.
- Migration approach pending: retry once the migration tool is available.

## Open questions & assumptions

- Whether the migration tool failure is transient or a persistent sandbox limitation to work around.
- Exact table/schema name for admin accounts (to be finalized at migration time).
- Whether the login-check function should use Postgres RLS / `SECURITY DEFINER` to restrict access to the server role only.
- Whether additional admin accounts or password-change flows are needed beyond the single `super` seed account.
- How the backend currently connects to Postgres and whether it already has a server-only DB role distinct from client access.