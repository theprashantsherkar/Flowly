# Deploying Flowly

Flowly is three deployables plus a database:

| Piece            | What it is                    | Suggested host        |
| ---------------- | ----------------------------- | --------------------- |
| `apps/web`       | Static Vite build (React)     | **Vercel**            |
| `apps/api`       | Express REST API (long-running) | **Render** / Railway |
| `apps/collab`    | Hocuspocus WebSocket server   | **Render** / Railway  |
| database         | PostgreSQL                    | **Neon** (already)    |

Config already in the repo: `vercel.json` (web), `render.yaml` (api + collab).

Deploy order matters because the services reference each other's URLs:
**DB → API → collab → web → wire URLs back.**

---

## 0. Prerequisites
- A **Neon** database (you already have one, or create a fresh prod branch).
- A **Clerk production instance** (dev keys only work on localhost — see step 2).
- Accounts on **Render** and **Vercel** (both have free tiers).
- Push this repo to GitHub so the hosts can build from it.

## 1. Database (Neon)
- Reuse your Neon `DATABASE_URL`, or create a separate production database.
- Migrations run automatically on the API's first deploy (`prisma migrate deploy`
  via `preDeployCommand` in `render.yaml`). To run manually:
  ```bash
  DATABASE_URL="<neon-url>" npm run prisma:deploy --workspace @flowly/api
  ```

## 2. Clerk (production instance) — the trickiest step
Dev keys (`pk_test_` / `sk_test_`) **do not work on a real domain**.
1. In the Clerk dashboard, create a **Production** instance for your app.
2. Follow Clerk's steps to add your web domain and the required **DNS records**
   (Clerk's Frontend API lives on a subdomain of your domain).
3. Grab the production keys: **`pk_live_…`** (web) and **`sk_live_…`** (api + collab).
4. Add your Vercel domain to Clerk's allowed origins.

## 3. API on Render
1. New → **Blueprint** → point at this repo. Render reads `render.yaml` and
   creates `flowly-api` and `flowly-collab`.
2. On **flowly-api**, set the env vars (marked `sync: false`, so you enter them):
   - `DATABASE_URL` = your Neon URL
   - `CLERK_SECRET_KEY` = `sk_live_…`
   - `WEB_ORIGIN` = your web URL (fill in after step 5, then redeploy)
3. Deploy. Health check: `GET /api/health` should return `{"status":"ok"}`.
   Note the service URL, e.g. `https://flowly-api.onrender.com`.

## 4. Collab on Render
1. On **flowly-collab**, set `DATABASE_URL` and `CLERK_SECRET_KEY` (same values).
2. Deploy. Note its URL, e.g. `https://flowly-collab.onrender.com`.
   The browser will connect to it over **`wss://`** (secure WebSocket).
   - No `healthCheckPath` is set for collab (Hocuspocus has no health route);
     Render's open-port check is enough.

## 5. Web on Vercel
1. New Project → import this repo. Vercel reads `vercel.json`
   (build = build `@flowly/shared` then `@flowly/web`, output `apps/web/dist`,
   SPA rewrites for React Router).
2. Set **Environment Variables** (build-time — must be set before the build):
   - `VITE_CLERK_PUBLISHABLE_KEY` = `pk_live_…`
   - `VITE_API_URL` = `https://flowly-api.onrender.com/api`  ← note the `/api`
   - `VITE_COLLAB_URL` = `wss://flowly-collab.onrender.com`  ← **wss**, not ws
3. Deploy. Note the web URL, e.g. `https://flowly.vercel.app`.

## 6. Wire the URLs back
1. Set the API's `WEB_ORIGIN` = your Vercel URL (for CORS) and **redeploy the API**.
2. Add the Vercel domain to Clerk's production allowed origins (step 2.4).

## 7. Verify
- Visit the web URL → sign up (Clerk prod) → dashboard loads.
- Create a flow, drop shapes → the connection dot is green (collab connected).
- Open the same team flow in a second browser/account → live cursors + edits sync.
- Export a PNG; save/restore a version.

---

## Environment variables at a glance

**Web (Vercel — build-time):**
```
VITE_CLERK_PUBLISHABLE_KEY = pk_live_...
VITE_API_URL               = https://<api-host>/api
VITE_COLLAB_URL            = wss://<collab-host>
```

**API (Render):**
```
DATABASE_URL      = postgresql://...neon.../neondb?sslmode=require
CLERK_SECRET_KEY  = sk_live_...
WEB_ORIGIN        = https://<web-host>
# PORT is injected by the host
```

**Collab (Render):**
```
DATABASE_URL      = (same as API)
CLERK_SECRET_KEY  = (same as API)
# PORT is injected by the host
```

## Gotchas checklist
- [ ] `VITE_COLLAB_URL` uses **`wss://`** — an HTTPS page can't open an insecure `ws://`.
- [ ] `VITE_API_URL` ends with **`/api`**.
- [ ] `WEB_ORIGIN` on the API exactly matches the Vercel origin (no trailing slash).
- [ ] Using **`pk_live_` / `sk_live_`** everywhere in prod (not the `_test_` keys).
- [ ] Vite env vars are read **at build time** — change one → **redeploy** the web app.
- [ ] Free Render services **cold-start** (sleep when idle); first request/connection can lag.
- [ ] `apps/api` and `apps/web`/`apps/collab` never commit their `.env` files (gitignored).

## Railway instead of Render
Create two services from this repo. For each, set the **build** and **start**
commands to the same ones in `render.yaml`, add the env vars above, and expose
the port. Railway supports WebSockets, so collab works the same way.
