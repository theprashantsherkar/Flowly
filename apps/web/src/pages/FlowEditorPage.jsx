import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';
import { shallow } from 'zustand/shallow';
import { Hand, History, MessageSquare, MousePointer2, Trash2 } from 'lucide-react';
import { useStore } from '../store';
import { useApi } from '../hooks/useApi';
import { useFlowCollab, colorFor } from '../collab/useFlowCollab';
import { PipelineToolbar } from '../toolbar';
import { PipelineUI } from '../ui';
import { ExportMenu } from '../components/ExportMenu';
import { VersionPanel } from '../components/VersionPanel';
import { OnboardingTutorial } from '../components/OnboardingTutorial';
import { BrandLink } from '../components/BrandLink';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { cn } from '../lib/cn';

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
  const { user } = useUser();
  const { status, synced, cursors, setCursor, getSnapshot, restore } = useFlowCollab(id, initialDoc);
  const { nodes, edges } = useStore(editorSelector, shallow);

  const me = useMemo(
    () => ({ name: user?.firstName || user?.username || 'Guest', color: colorFor(user?.id) }),
    [user]
  );

  const deleteSelected = useStore((s) => s.deleteSelected);
  const hasSelection = useStore((s) => s.nodes.some((n) => n.selected) || s.edges.some((e) => e.selected));

  const [title, setTitle] = useState(initialTitle);
  const [saveState, setSaveState] = useState('saved');
  const [commentMode, setCommentMode] = useState(false);
  const [selectMode, setSelectMode] = useState(false);
  const [showVersions, setShowVersions] = useState(false);

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
      <header className="flex items-center justify-between gap-4 border-b border-borderSoft bg-panel px-4 py-2.5">
        <div className="flex items-center gap-3">
          <BrandLink />
          <span className="text-borderSoft">/</span>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={(e) => e.key === 'Enter' && e.currentTarget.blur()}
            className="h-8 w-48 border-transparent bg-transparent font-semibold hover:bg-panelLight focus:bg-panelLight"
          />
        </div>

        <div className="flex items-center gap-2">
          {/* Move / select tools */}
          <div className="flex items-center rounded-lg border border-borderSoft bg-panelLight p-0.5">
            <Button
              variant={selectMode ? 'ghost' : 'secondary'}
              size="iconSm"
              title="Move / pan"
              onClick={() => setSelectMode(false)}
            >
              <Hand size={15} />
            </Button>
            <Button
              variant={selectMode ? 'secondary' : 'ghost'}
              size="iconSm"
              title="Select (drag a box to multi-select)"
              onClick={() => setSelectMode(true)}
            >
              <MousePointer2 size={15} />
            </Button>
          </div>
          <Button
            variant="ghost"
            size="iconSm"
            title="Delete selection"
            disabled={!hasSelection}
            onClick={deleteSelected}
          >
            <Trash2 size={15} />
          </Button>

          <span className="mx-1 h-5 w-px bg-borderSoft" />

          <PresenceBar status={status} cursors={cursors} />
          <Button
            variant={commentMode ? 'default' : 'secondary'}
            size="sm"
            title="Comment mode — click the canvas to leave a comment"
            onClick={() => setCommentMode((v) => !v)}
          >
            <MessageSquare size={15} /> Comment
          </Button>
          <EdgeStylePicker />
          <span data-tour="export" className="inline-flex">
            <ExportMenu title={title} />
          </span>
          <Button
            data-tour="history"
            variant="secondary"
            size="sm"
            onClick={() => setShowVersions(true)}
          >
            <History size={15} /> History
          </Button>
          <SaveIndicator state={saveState} />
        </div>
      </header>
      <PipelineToolbar />
      <PipelineUI
        cursors={cursors}
        onCursorMove={setCursor}
        commentMode={commentMode}
        selectMode={selectMode}
        me={me}
      />

      {showVersions && (
        <VersionPanel
          flowId={id}
          api={api}
          getSnapshot={getSnapshot}
          restore={restore}
          onClose={() => setShowVersions(false)}
        />
      )}

      <OnboardingTutorial />
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
