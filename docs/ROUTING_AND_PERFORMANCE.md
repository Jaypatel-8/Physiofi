# Routing & Performance

## Routing & first load (logged-in users)

- **Logged-in users opening the site**  
  If the auth cookie is present, visiting `/` or `/login` is redirected by **middleware** to `/dashboard`. The dashboard page then redirects to the role-specific dashboard (`/patient/dashboard`, `/doctor/dashboard`, or `/admin/dashboard`). So the first screen is the correct dashboard, not the login page.

- **Auth cookie**  
  On initial load, `AuthProvider` sets the auth cookie from `localStorage` as soon as a stored token exists, so the next request (e.g. refresh on a dashboard URL) is allowed by middleware.

- **Protected routes**  
  `/patient/*`, `/doctor/*`, `/admin/*` are protected in middleware; missing cookie sends the user to `/login?redirect=...`.

## Load speed & performance

- **Middleware**  
  Sets long-lived cache headers for static assets and fonts; security headers are applied on all non-static requests.

- **Next.js**
  - Compression enabled.
  - Images: AVIF/WebP, Unsplash allowed, long cache TTL.
  - Package imports optimized for heroicons, framer-motion, date-fns, chart.js.
  - Production: console stripped (except error/warn), no source maps.

- **Fonts**  
  `display: swap` and fallbacks so text renders without waiting for font files.

- **Home page**  
  Heavy sections (About, Services, Testimonials, Contact, Footer, FAB, BookingPopup) are loaded with `next/dynamic` to reduce initial JS.

- **Images**  
  Hero and key service/team images use Unsplash CDN with `next/image` (sizes, lazy loading) for good LCP and bandwidth use.

To measure load and routing speed, use Lighthouse or Chrome DevTools (Network, Performance) on the deployed or production build.
