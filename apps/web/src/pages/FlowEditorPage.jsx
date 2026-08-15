import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { shallow } from 'zustand/shallow';
import { useStore } from '../store';
import { useApi } from '../hooks/useApi';
import { PipelineToolbar } from '../toolbar';
import { PipelineUI } from '../ui';

// Drop transient ReactFlow UI state so we don't persist selection/drag flags.
const stripTransient = ({ selected, dragging, resizing, ...node }) => node;

const selector = (s) => ({
  nodes: s.nodes,
  edges: s.edges,
  setGraph: s.setGraph,
  resetGraph: s.resetGraph,
});

function SaveIndicator({ state }) {
  const map = {
    saved: ['All changes saved', 'text-emerald-400'],
    saving: ['Saving…', 'text-slate-400'],
    error: ['Save failed', 'text-rose-400'],
  };
  const [label, color] = map[state] || map.saved;
  return <span className={`text-xs ${color}`}>{label}</span>;
}

export default function FlowEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const api = useApi();
  const { nodes, edges, setGraph, resetGraph } = useStore(selector, shallow);

  const [title, setTitle] = useState('');
  const [loadState, setLoadState] = useState('loading'); // loading | ready | error
  const [saveState, setSaveState] = useState('saved'); // saved | saving | error
  const hydratedRef = useRef(false);

  // Load the flow document and hydrate the canvas.
  useEffect(() => {
    let active = true;
    hydratedRef.current = false;
    setLoadState('loading');
    api
      .getFlow(id)
      .then((flow) => {
        if (!active) return;
        setTitle(flow.title);
        const doc = flow.document || {};
        setGraph({ nodes: doc.nodes || [], edges: doc.edges || [] });
        setLoadState('ready');
        // Only enable autosave after the loaded document has been applied.
        requestAnimationFrame(() => {
          hydratedRef.current = true;
        });
      })
      .catch(() => active && setLoadState('error'));

    return () => {
      active = false;
      resetGraph();
    };
  }, [id, api, setGraph, resetGraph]);

  // Debounced autosave whenever the graph changes.
  useEffect(() => {
    if (!hydratedRef.current) return;
    setSaveState('saving');
    const handle = setTimeout(() => {
      api
        .updateFlow(id, { document: { nodes: nodes.map(stripTransient), edges } })
        .then(() => setSaveState('saved'))
        .catch(() => setSaveState('error'));
    }, 800);
    return () => clearTimeout(handle);
  }, [nodes, edges, api, id]);

  const saveTitle = useCallback(async () => {
    const trimmed = title.trim();
    if (!trimmed) return;
    try {
      await api.updateFlow(id, { title: trimmed });
    } catch {
      // non-critical; canvas autosave surfaces errors
    }
  }, [title, api, id]);

  if (loadState === 'loading') {
    return (
      <div className="grid min-h-screen place-items-center bg-canvas text-slate-300">Loading flow…</div>
    );
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
        <SaveIndicator state={saveState} />
      </header>
      <PipelineToolbar />
      <PipelineUI />
    </div>
  );
}
