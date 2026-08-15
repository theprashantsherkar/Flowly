import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { useStore } from '../store';
import { useApi } from '../hooks/useApi';
import { useFlowCollab } from '../collab/useFlowCollab';
import { PipelineToolbar } from '../toolbar';
import { PipelineUI } from '../ui';

const stripTransient = ({ selected, dragging, resizing, ...node }) => node;

function SaveIndicator({ state }) {
  const map = {
    saved: ['All changes saved', 'text-emerald-400'],
    saving: ['Saving…', 'text-slate-400'],
    error: ['Save failed', 'text-rose-400'],
  };
  const [label, color] = map[state] || map.saved;
  return <span className={`text-xs ${color}`}>{label}</span>;
}

const STATUS_DOT = {
  connected: 'bg-emerald-400',
  connecting: 'bg-amber-400 animate-pulse',
  error: 'bg-rose-500',
};

function PresenceBar({ status, cursors }) {
  const people = cursors.slice(0, 5);
  return (
    <div className="flex items-center gap-2">
      <span className={`h-2 w-2 rounded-full ${STATUS_DOT[status] || STATUS_DOT.connecting}`} title={status} />
      <div className="flex -space-x-2">
        {people.map((p) => (
          <span
            key={p.clientId}
            title={p.name}
            className="grid h-6 w-6 place-items-center rounded-full border-2 border-panel text-[10px] font-semibold text-white"
            style={{ background: p.color }}
          >
            {(p.name || '?').slice(0, 1).toUpperCase()}
          </span>
        ))}
      </div>
      {cursors.length > 0 && <span className="text-xs text-slate-400">{cursors.length} here</span>}
    </div>
  );
}

const LINE_STYLES = [
  { key: 'solid', preview: 'border-t-2 border-solid' },
  { key: 'dashed', preview: 'border-t-2 border-dashed' },
  { key: 'dotted', preview: 'border-t-2 border-dotted' },
];

function EdgeStylePicker() {
  const edgeStyle = useStore((s) => s.edgeStyle);
  const setEdgeStyle = useStore((s) => s.setEdgeStyle);
  const setSelectedEdgesStyle = useStore((s) => s.setSelectedEdgesStyle);
  const choose = (key) => {
    setEdgeStyle(key);
    setSelectedEdgesStyle(key);
  };
  return (
    <div className="flex items-center gap-1 rounded-lg border border-borderSoft bg-panelLight p-1">
      {LINE_STYLES.map((s) => (
        <button
          key={s.key}
          type="button"
          title={`${s.key} lines`}
          onClick={() => choose(s.key)}
          className={`flex h-7 w-10 items-center justify-center rounded-md transition ${
            edgeStyle === s.key ? 'bg-accent/20 ring-1 ring-accent' : 'hover:bg-panel'
          }`}
        >
          <span className={`w-6 ${s.preview} border-slate-200`} />
        </button>
      ))}
    </div>
  );
}

const editorSelector = (s) => ({ nodes: s.nodes, edges: s.edges });

function CollabEditor({ id, initialTitle, initialDoc }) {
  const navigate = useNavigate();
  const api = useApi();
  const { status, synced, cursors, setCursor, getSnapshot } = useFlowCollab(id, initialDoc);
  const { nodes, edges } = useStore(editorSelector, shallow);

  const [title, setTitle] = useState(initialTitle);
  const [saveState, setSaveState] = useState('saved');

  // Keep churny callbacks in refs so cursor-driven re-renders don't reset the
  // autosave debounce (only real graph changes should).
  const saveRefs = useRef({ api, id, getSnapshot });
  saveRefs.current = { api, id, getSnapshot };

  // Debounced snapshot of the live doc into the REST document (dashboard/thumbnail).
  useEffect(() => {
    if (!synced) return;
    setSaveState('saving');
    const handle = setTimeout(() => {
      const { api: a, id: fid, getSnapshot: snapshot } = saveRefs.current;
      const snap = snapshot();
      a.updateFlow(fid, { document: { nodes: snap.nodes.map(stripTransient), edges: snap.edges } })
        .then(() => setSaveState('saved'))
        .catch(() => setSaveState('error'));
    }, 900);
    return () => clearTimeout(handle);
  }, [nodes, edges, synced]);

  const saveTitle = useCallback(async () => {
    const trimmed = title.trim();
    if (!trimmed || trimmed === initialTitle) return;
    try {
      await api.updateFlow(id, { title: trimmed });
    } catch {
      // non-critical
    }
  }, [title, initialTitle, api, id]);

  return (
    <div className="flex h-screen flex-col bg-canvas">
      <header className="flex items-center justify-between gap-4 border-b border-borderSoft bg-panel px-6 py-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            title="Back to dashboard"
            className="text-lg text-slate-400 hover:text-white"
          >
            ←
          </button>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="rounded-md bg-transparent px-2 py-1 text-sm font-semibold text-slate-100 outline-none hover:bg-panelLight focus:bg-panelLight"
          />
        </div>
        <div className="flex items-center gap-4">
          <PresenceBar status={status} cursors={cursors} />
          <EdgeStylePicker />
          <SaveIndicator state={saveState} />
        </div>
      </header>
      <PipelineToolbar />
      <PipelineUI cursors={cursors} onCursorMove={setCursor} />
    </div>
  );
}

export default function FlowEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const [loadState, setLoadState] = useState('loading'); // loading | ready | error
  const dataRef = useRef({ title: 'Untitled flow', doc: { nodes: [], edges: [] } });

  useEffect(() => {
    let active = true;
    setLoadState('loading');
    api
      .getFlow(id)
      .then((flow) => {
        if (!active) return;
        dataRef.current = { title: flow.title, doc: flow.document || { nodes: [], edges: [] } };
        setLoadState('ready');
      })
      .catch(() => active && setLoadState('error'));
    return () => {
      active = false;
    };
  }, [id, api]);

  if (loadState === 'loading') {
    return <div className="grid min-h-screen place-items-center bg-canvas text-slate-300">Loading flow…</div>;
  }
  if (loadState === 'error') {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas text-center text-slate-300">
        <div>
          <p className="text-rose-400">Couldn’t open this flow.</p>
          <button
            type="button"
            onClick={() => navigate('/dashboard')}
            className="mt-4 rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white"
          >
            Back to dashboard
          </button>
        </div>
      </div>
    );
  }

  return <CollabEditor id={id} initialTitle={dataRef.current.title} initialDoc={dataRef.current.doc} />;
}
