import { useEffect, useRef, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import * as Y from 'yjs';
import { HocuspocusProvider } from '@hocuspocus/provider';
import { useStore } from '../store';
import { createYjsSync } from './yjsSync';

const COLLAB_URL = import.meta.env.VITE_COLLAB_URL || 'ws://localhost:1234';
const COLORS = ['#6366f1', '#f43f5e', '#10b981', '#f59e0b', '#0ea5e9', '#d946ef', '#14b8a6'];

export function colorFor(id = '') {
  let hash = 0;
  for (let i = 0; i < id.length; i += 1) hash = (hash * 31 + id.charCodeAt(i)) >>> 0;
  return COLORS[hash % COLORS.length];
}

/**
 * Connects a flow to the collaboration server: binds the shared Yjs document to
 * the store and broadcasts/receives presence (live cursors) via Awareness.
 */
export function useFlowCollab(flowId, seed) {
  const { getToken } = useAuth();
  const { user } = useUser();
  const [status, setStatus] = useState('connecting'); // connecting | connected | error
  const [synced, setSynced] = useState(false);
  const [cursors, setCursors] = useState([]);
  const awarenessRef = useRef(null);
  const syncRef = useRef(null);
  const seedRef = useRef(seed);
  seedRef.current = seed;

  useEffect(() => {
    let cancelled = false;
    const doc = new Y.Doc();
    let provider;

    (async () => {
      const token = await getToken();
      if (cancelled) return;

      const sync = createYjsSync(doc, useStore);
      syncRef.current = sync;
      useStore.getState().setSync(sync);

      provider = new HocuspocusProvider({
        url: COLLAB_URL,
        name: flowId,
        document: doc,
        token,
        onAuthenticationFailed: () => !cancelled && setStatus('error'),
        onStatus: ({ status: s }) => !cancelled && setStatus(s === 'connected' ? 'connected' : 'connecting'),
        onSynced: () => {
          if (cancelled) return;
          sync.seedIfEmpty(seedRef.current?.nodes || [], seedRef.current?.edges || []);
          setSynced(true);
        },
      });

      const awareness = provider.awareness;
      awarenessRef.current = awareness;
      awareness.setLocalStateField('user', {
        name: user?.firstName || user?.username || 'Guest',
        color: colorFor(user?.id),
      });

      awareness.on('change', () => {
        if (cancelled) return;
        const others = [];
        awareness.getStates().forEach((state, clientId) => {
          if (clientId === awareness.clientID || !state.user) return;
          others.push({ clientId, ...state.user, cursor: state.cursor || null });
        });
        setCursors(others);
      });
    })();

    return () => {
      cancelled = true;
      useStore.getState().setSync(null);
      syncRef.current?.destroy();
      syncRef.current = null;
      provider?.destroy();
      doc.destroy();
      useStore.getState().resetGraph();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flowId]);

  const setCursor = (point) => {
    awarenessRef.current?.setLocalStateField('cursor', point);
  };

  const getSnapshot = () => syncRef.current?.snapshot() || { nodes: [], edges: [] };
  const restore = (snapshot) => syncRef.current?.replaceAll(snapshot?.nodes || [], snapshot?.edges || []);

  return { status, synced, cursors, setCursor, getSnapshot, restore };
}
