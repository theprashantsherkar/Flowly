import { useCallback, useEffect, useState } from 'react';

const stripTransient = ({ selected, dragging, resizing, ...node }) => node;

export function VersionPanel({ flowId, api, getSnapshot, restore, onClose }) {
  const [versions, setVersions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

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

  const saveVersion = async () => {
    setBusy(true);
    setError('');
    try {
      const label = window.prompt('Name this version (optional)') || undefined;
      const snap = getSnapshot();
      await api.saveVersion(
        flowId,
        { nodes: snap.nodes.map(stripTransient), edges: snap.edges },
        label
      );
      load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const restoreVersion = async (versionId) => {
    if (!window.confirm('Restore this version? It replaces the current canvas for everyone.')) return;
    setBusy(true);
    try {
      const version = await api.getVersion(flowId, versionId);
      restore(version.snapshot);
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/40" onClick={onClose}>
      <div
        className="h-full w-80 border-l border-borderSoft bg-panel p-5 shadow-node"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-100">Version history</h2>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        <button
          type="button"
          onClick={saveVersion}
          disabled={busy}
          className="mb-4 w-full rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accentHover disabled:opacity-60"
        >
          💾 Save current version
        </button>

        {error && <p className="mb-3 text-sm text-rose-400">{error}</p>}

        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : versions.length === 0 ? (
          <p className="text-sm text-slate-400">No saved versions yet.</p>
        ) : (
          <ul className="space-y-2">
            {versions.map((v) => (
              <li
                key={v.id}
                className="flex items-center justify-between rounded-lg border border-borderSoft bg-panelLight px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm text-slate-100">{v.label || 'Snapshot'}</p>
                  <p className="text-xs text-slate-400">{new Date(v.createdAt).toLocaleString()}</p>
                </div>
                <button
                  type="button"
                  onClick={() => restoreVersion(v.id)}
                  disabled={busy}
                  className="text-xs font-semibold text-accent hover:text-accentHover"
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
