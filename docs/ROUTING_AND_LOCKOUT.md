# Routing Speed & Login Lockout

## Routing speed

### Current setup
- **Middleware** (`client/src/middleware.ts`): Runs on every request (except `_next/static`, `_next/image`, `api`). Only checks for auth cookie on protected routes and redirects to `/login` if missing. No heavy work; routing stays fast.
- **Next.js config**: `compress: true`, `swcMinify: true`, `optimizePackageImports` for icons/framer-motion, `productionBrowserSourceMaps: false` to keep builds smaller.
- **Auth provider**: Token validation runs **once on app load** when a stored token exists. It does **not** run again on in-app navigation, so moving between dashboard pages does not trigger an extra API call.
- **Layouts** (doctor/patient/admin): Use `useAuth()` and show a loading state until `loading` is false. First paint after login depends on `validateToken` completing; after that, client-side navigation does not re-validate.

### Tips to keep routing fast
- Keep middleware logic minimal (current state is good).
- Use Next.js `<Link>` for in-app navigation so pages are prefetched.
- If you add more auth checks in layout, avoid calling the API on every route change; rely on context or a single validation on load.

---

## Login lockout (wrong password)

When someone enters the wrong password repeatedly, the account is **temporarily locked** so they cannot keep trying.

### Policy (all roles)
- **After 5 failed login attempts** (wrong password), the account is locked.
- **Lock duration: 2 hours** from the 5th failed attempt.
- After 2 hours, the lock expires and the user can try again (attempt count is reset after a successful login).

### Implemented for
- **Patient** – lockout added (same as below).
- **Doctor** – lockout added (same as below).
- **Admin** – was already present; lock message now includes “Try again in X minutes”.

### User-facing message when locked
- API returns: `"Account is temporarily locked due to multiple failed login attempts. Try again in X minutes."`
- The frontend should show this message when the login API returns it (e.g. in the login form error state).

### Backend details
- **Models**: `Patient`, `Doctor`, and `Admin` have `loginAttempts`, `lockUntil`, virtual `isLocked`, and methods `incLoginAttempts()` and `resetLoginAttempts()`.
- **Auth routes**: On wrong password, `incLoginAttempts()` is called. On successful login, `resetLoginAttempts()` is called. Before checking password, the route checks `isLocked` and returns the lock message if true.
