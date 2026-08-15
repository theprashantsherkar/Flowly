import { useCallback, useEffect, useState } from 'react';
import { X, Save, History } from 'lucide-react';
import { Button } from './ui/button';
import { PromptDialog, ConfirmDialog } from './ui/prompt-dialog';

const stripTransient = ({ selected, dragging, resizing, ...node }) => node;

export function VersionPanel({ flowId, api, getSnapshot, restore, onClose }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [showSave, setShowSave] = useState(false);
  const [restoreTarget, setRestoreTarget] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    api
      .listVersions(flowId)
      .then(setVersions)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api, flowId]);

  useEffect(() => {
    load();
  }, [load]);

  const saveVersion = async (label) => {
    setBusy(true);
    setError('');
    try {
      const snap = getSnapshot();
      await api.saveVersion(flowId, { nodes: snap.nodes.map(stripTransient), edges: snap.edges }, label || undefined);
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const restoreVersion = async () => {
    if (!restoreTarget) return;
    setBusy(true);
    try {
      const version = await api.getVersion(flowId, restoreTarget.id);
      restore(version.snapshot);
      onClose();
    } catch (e) {
      setError(e.message);
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="flex h-full w-80 flex-col border-l border-borderSoft bg-panel p-5 shadow-node"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-100">
            <History size={18} /> Version history
          </h2>
          <Button variant="ghost" size="iconSm" onClick={onClose} aria-label="Close">
            <X size={18} />
          </Button>
        </div>

        <Button className="mb-4 w-full" onClick={() => setShowSave(true)} disabled={busy}>
          <Save size={15} /> Save current version
        </Button>

        {error && <p className="mb-3 text-sm text-red-400">{error}</p>}

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-slate-400">Loading…</p>
          ) : versions.length === 0 ? (
            <p className="text-sm text-slate-400">No saved versions yet.</p>
          ) : (
            <ul className="space-y-2">
              {versions.map((v) => (
                <li
                  key={v.id}
                  className="flex items-center justify-between gap-2 rounded-lg border border-borderSoft bg-panelLight px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm text-slate-100">{v.label || 'Snapshot'}</p>
                    <p className="text-xs text-slate-500">{new Date(v.createdAt).toLocaleString()}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => setRestoreTarget(v)} disabled={busy}>
                    Restore
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <PromptDialog
          open={showSave}
          onOpenChange={setShowSave}
          title="Save version"
          description="Give this snapshot a name so you can find it later."
          placeholder="e.g. Before big refactor"
          submitLabel="Save version"
          onSubmit={saveVersion}
        />
        <ConfirmDialog
          open={!!restoreTarget}
          onOpenChange={(v) => !v && setRestoreTarget(null)}
          title="Restore this version?"
          description="This replaces the current canvas for everyone in the room."
          confirmLabel="Restore"
          onConfirm={restoreVersion}
        />
      </div>
    </div>
  );
}
