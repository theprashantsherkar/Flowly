# @flowly/api

Express + TypeScript + Prisma REST API for Flowly. Handles auth (Clerk JWT
verification with just-in-time user provisioning), users, flows, and (later)
teams, RBAC, invites, versions and comments.

## Layout

```
src/
  index.ts              app bootstrap, CORS, routes, error handler
  env.ts                dotenv config
  prisma.ts             PrismaClient singleton
  clerk.ts              Clerk token verification + profile lookup
  middleware/           requireAuth, validateBody (zod), error handler, asyncHandler
  services/             users + flows business logic
  routes/               /api/users, /api/flows
prisma/schema.prisma    User + Flow models
```

## Run

```bash
docker compose up -d                 # Postgres (from repo root)
npm run prisma:migrate --workspace @flowly/api   # create tables
npm run start:dev --workspace @flowly/api        # http://localhost:4000/api
```

Set `CLERK_SECRET_KEY` in `apps/api/.env` (copy from `.env.example`) before
protected routes will work.
