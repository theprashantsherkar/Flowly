# Flowly

A collaborative whiteboard & flow builder — think Whimsical, but a flow builder
that's also a freeform canvas. Real-time multiplayer editing, teams with
role-based access, and shareable join links.

> Flowly began as a VectorShift take-home (a single-player ReactFlow node
> builder + a FastAPI DAG checker) and is being rebuilt into a full-stack,
> multiplayer product.

## Monorepo layout

```
apps/
  web/        React 18 + ReactFlow + Zustand + Tailwind (Vite)
  api/        NestJS + Prisma + PostgreSQL — REST + RBAC        (Phase 1)
  collab/     Hocuspocus (Yjs) real-time collaboration server   (Phase 3)
packages/
  shared/     Shared TS: graph analysis (DAG), node registry, Zod schemas
```

Managed with **npm workspaces**.

## Getting started

```bash
npm install                          # install every workspace
npm run build --workspace @flowly/shared   # build the shared package first
npm run dev:web                      # Vite dev server on http://localhost:3000
```

## Tech stack

| Layer     | Choice                                             |
| --------- | -------------------------------------------------- |
| Web       | React 18, ReactFlow 11, Zustand, Tailwind, Vite    |
| API       | NestJS, Prisma, PostgreSQL                         |
| Auth      | Clerk (managed)                                    |
| Realtime  | Yjs + Hocuspocus (CRDT, conflict-free merge)       |
| Shared    | TypeScript, Zod                                    |

## Roadmap

- **Phase 0 — Foundation** ✅ monorepo, Vite migration, shared package
- **Phase 1** — Clerk auth + persistent flows (dashboard, save/load)
- **Phase 2** — Teams + RBAC (owner/admin/member) + invite links
- **Phase 3** — Real-time collaboration (live cursors, CRDT sync)
- **Phase 4** — Freeform whiteboard shapes, version history, comments, export
- **Phase 5** — AI (explain-flow, text-to-diagram), live DAG validation, deploy

## Testing

```bash
npm run test --workspace @flowly/shared    # graph/DAG unit tests (vitest)
```
