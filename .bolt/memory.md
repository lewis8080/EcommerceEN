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
- **Security decision implemented:** Admin password is stored as a bcrypt hash in the database, not in backend source. Username `super`, password `900102` are seed credentials in the DB.
- Schema: an `admin_accounts` table seeded with the `super` account and its bcrypt hash is now in place.
- Backend login now queries the database instead of checking hard-coded credentials. Hard-coded username/password removed from backend code. Updated function deployed.
- DB-side objects verified directly: table, seeded row, login-check function, and access rules all confirmed.
- Project builds successfully; password string no longer appears anywhere in source.
- Live login could not be tested from sandbox because Supabase connection details are not in the shell environment. DB-level check passed, so end-to-end login is expected to work but needs user confirmation.

## Open questions & assumptions

- Whether live login works end-to-end (pending user manual test via the admin sign-in page).
- Whether the login-check function uses Postgres RLS / `SECURITY DEFINER` to restrict access to the server role only (objects exist but exact implementation details not confirmed).
- How the backend connects to Postgres and whether it already has a server-only DB role distinct from client access.
- Whether additional admin accounts or password-change flows are needed beyond the single `super` seed account.