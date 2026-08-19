# Phase 6: admin authentication

Phase 6 implements password-only authentication for one fixed identity, `store-admin`. Passkeys and a separate recovery password are intentionally not used.

## Security model

- Passwords are hashed with Argon2id (64 MiB memory, three iterations) and never stored or logged in plaintext.
- Five consecutive failures lock sign-in for 15 minutes. Successful login resets the failure counter.
- The browser receives a random opaque token plus an HMAC signature in a `HttpOnly`, `SameSite=Strict` cookie. Production cookies also use `Secure`.
- Only a SHA-256 hash of the opaque token is stored in `admin_sessions`.
- Sessions expire after 12 hours by default, are checked against Neon by route middleware, and are checked independently by every API endpoint.
- Logout, password rotation, and the revoke-all command invalidate sessions server-side immediately.
- Unsafe API requests require a same-origin `Origin` header when the browser supplies one.
- Protected responses use `Cache-Control: private, no-store, max-age=0`.
- Authentication events record successful and failed login, lockout, logout, credential changes, and bulk revocation without recording passwords or tokens.

## Vercel environment variables

Configure these separately for Development, Preview, and Production. Do not copy production values into Preview.

| Variable | Value |
| --- | --- |
| `ADMIN_DATABASE_URL` | Neon login granted `emporium_writer`; use the development branch for local/Preview and production only for Production |
| `AUTH_COOKIE_SECRET` | Independent random value generated with `openssl rand -base64 48` |
| `AUTH_SESSION_HOURS` | `12`, or another value from 1 through 168 |

No hostname is embedded in the cookie, so `localhost`, Vercel preview hosts, and `admin.kingstreetemporium.com` work without sharing cookies across hosts. The cookie is host-only by default.

## Initial setup and rotation

After setting the target environment's database URL locally, run:

```text
npm run auth:password
```

The command prompts twice without echoing the password. Use a randomly generated password of at least 16 characters and save it in the business password manager. Running the command again rotates the password and revokes every existing session.

## Lost tablet

1. Run `npm run auth:revoke` with the production `ADMIN_DATABASE_URL` available locally.
2. Confirm the command reports that all sessions were revoked.
3. If the password may also be exposed, run `npm run auth:password` and store the replacement.
4. Sign in on the replacement tablet.

The old tablet cannot use its prior cookie after revocation. There is no browser-based password-reset path; recovery requires authorized access to the deployment database credential and this repository.

## Verification

Automated tests cover cookie signing, tamper rejection, security attributes, and bounded expiry. The acceptance test creates a disposable credential, signs in, verifies the live session, revokes it, and confirms the session can no longer authenticate. Production credential enrollment remains an operator action so no real password enters source control, logs, or development fixtures.
