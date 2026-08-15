# @flowly/collab

Real-time collaboration server for Flowly, built on [Hocuspocus](https://tiptap.dev/hocuspocus)
(a Yjs WebSocket backend).

- **Auth:** `onAuthenticate` verifies the Clerk session token and checks the user
  can access the flow (owner or team member) before granting the room.
- **Persistence:** the `Database` extension loads/stores the Yjs document as
  binary in `Flow.yDocState` (Postgres, via Prisma).
- The room name is the flow id.

## Run

```bash
npm run dev --workspace @flowly/collab   # ws://localhost:1234
```

Reads `DATABASE_URL` and `CLERK_SECRET_KEY` from `apps/api/.env`. Override the
port with `COLLAB_PORT` in `apps/collab/.env`.
