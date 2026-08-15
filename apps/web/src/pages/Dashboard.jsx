import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { useApi } from '../hooks/useApi';

function formatDate(value) {
  try {
    return new Date(value).toLocaleString();
  } catch {
    return '';
  }
}

export default function Dashboard() {
  const api = useApi();
  const navigate = useNavigate();
  const [flows, setFlows] = useState([]);
  const [status, setStatus] = useState('loading'); // loading | ready | error
  const [creating, setCreating] = useState(false);

  const load = useCallback(() => {
    setStatus('loading');
    api
      .listFlows()
      .then((data) => {
        setFlows(data);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async () => {
    setCreating(true);
    try {
      const flow = await api.createFlow();
      navigate(`/flow/${flow.id}`);
    } catch {
      setCreating(false);
    }
  };

  const handleRename = async (flow) => {
    const title = window.prompt('Rename flow', flow.title);
    if (!title || title.trim() === flow.title) return;
    await api.updateFlow(flow.id, { title: title.trim() });
    load();
  };

  const handleDelete = async (flow) => {
    if (!window.confirm(`Delete "${flow.title}"? This cannot be undone.`)) return;
    await api.deleteFlow(flow.id);
    setFlows((prev) => prev.filter((f) => f.id !== flow.id));
  };

  return (
    <div className="min-h-screen bg-canvas text-slate-100">
      <header className="flex items-center justify-between border-b border-borderSoft bg-panel px-8 py-4">
        <span className="text-lg font-semibold">
          Flowly<span className="text-accent">.</span>
        </span>
        <UserButton afterSignOutUrl="/" />
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-2xl font-semibold">Your flows</h1>
          <button
            type="button"
            onClick={handleCreate}
            disabled={creating}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accentHover disabled:opacity-60"
          >
            {creating ? 'Creating…' : '+ New flow'}
          </button>
        </div>

        {status === 'loading' && <p className="text-slate-400">Loading…</p>}
        {status === 'error' && (
          <p className="text-rose-400">
            Couldn’t load your flows. Is the API running on http://localhost:4000?
          </p>
        )}

        {status === 'ready' && flows.length === 0 && (
          <div className="rounded-xl border border-dashed border-borderSoft p-12 text-center text-slate-400">
            No flows yet. Create your first one to get started.
          </div>
        )}

        {status === 'ready' && flows.length > 0 && (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {flows.map((flow) => (
              <li
                key={flow.id}
                className="group flex flex-col justify-between rounded-xl border border-borderSoft bg-panel p-5 transition hover:border-accent"
              >
                <button
                  type="button"
                  onClick={() => navigate(`/flow/${flow.id}`)}
                  className="text-left"
                >
                  <h2 className="font-semibold text-slate-100">{flow.title}</h2>
                  <p className="mt-1 text-xs text-slate-400">Edited {formatDate(flow.updatedAt)}</p>
                </button>
                <div className="mt-4 flex gap-3 text-xs">
                  <button
                    type="button"
                    onClick={() => handleRename(flow)}
                    className="text-slate-400 hover:text-white"
                  >
                    Rename
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(flow)}
                    className="text-slate-400 hover:text-rose-400"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </div>
  );
}
