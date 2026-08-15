# @flowly/collab

Real-time collaboration server for Flowly, built on [Hocuspocus](https://tiptap.dev/hocuspocus)
(a Yjs WebSocket backend). Authenticates rooms against the API, syncs the shared
CRDT document, broadcasts presence/cursors via Awareness, and persists document
state to PostgreSQL.

**Status:** scaffolded in Phase 0, implemented in Phase 3.
