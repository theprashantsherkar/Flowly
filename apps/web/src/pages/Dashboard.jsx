import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { useApi } from '../hooks/useApi';
import { MembersPanel } from '../components/MembersPanel';

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

const roleBadge = {
  OWNER: 'bg-amber-500/20 text-amber-300',
  ADMIN: 'bg-indigo-500/20 text-indigo-300',
  MEMBER: 'bg-slate-500/20 text-slate-300',
};

export default function Dashboard() {
  const api = useApi();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [teams, setTeams] = useState([]);
  const [flows, setFlows] = useState([]);
  const [selectedTeamId, setSelectedTeamId] = useState(searchParams.get('team') || '');
  const [status, setStatus] = useState('loading');
  const [creating, setCreating] = useState(false);
  const [showMembers, setShowMembers] = useState(false);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [teamsData, flowsData] = await Promise.all([api.listTeams(), api.listFlows()]);
      setTeams(teamsData);
      setFlows(flowsData);
      setSelectedTeamId((current) => {
        if (current && teamsData.some((t) => t.id === current)) return current;
        return teamsData[0]?.id || '';
      });
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  const selectedTeam = useMemo(
    () => teams.find((t) => t.id === selectedTeamId),
    [teams, selectedTeamId]
  );
  const teamFlows = useMemo(
    () =>
      flows.filter(
        (f) => f.teamId === selectedTeamId || (selectedTeam?.isPersonal && !f.teamId)
      ),
    [flows, selectedTeamId, selectedTeam]
  );

  const selectTeam = (id) => {
    setSelectedTeamId(id);
    setSearchParams(id ? { team: id } : {});
  };

  const handleCreateFlow = async () => {
    setCreating(true);
    try {
      const flow = await api.createFlow({ teamId: selectedTeamId || undefined });
      navigate(`/flow/${flow.id}`);
    } catch {
      setCreating(false);
    }
  };

  const handleNewTeam = async () => {
    const name = window.prompt('Name your team');
    if (!name || !name.trim()) return;
    const team = await api.createTeam(name.trim());
    await load();
    selectTeam(team.id);
  };

  const handleRename = async (flow) => {
    const title = window.prompt('Rename flow', flow.title);
    if (!title || title.trim() === flow.title) return;
    await api.updateFlow(flow.id, { title: title.trim() });
    load();
  };

  const handleDelete = async (flow) => {
    if (!window.confirm(`Delete "${flow.title}"?`)) return;
    await api.deleteFlow(flow.id);
    setFlows((prev) => prev.filter((f) => f.id !== flow.id));
  };

  return (
    <div className="min-h-screen bg-canvas text-slate-100">
      <header className="flex items-center justify-between border-b border-borderSoft bg-panel px-8 py-4">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">
            Flowly<span className="text-accent">.</span>
          </span>
          {teams.length > 0 && (
            <select
              value={selectedTeamId}
              onChange={(e) => selectTeam(e.target.value)}
              className="rounded-lg border border-borderSoft bg-panelLight px-3 py-1.5 text-sm text-slate-200"
            >
              {teams.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.isPersonal ? 'Personal' : t.name}
                </option>
              ))}
            </select>
          )}
          <button
            type="button"
            onClick={handleNewTeam}
            className="text-sm text-slate-400 hover:text-white"
          >
            + Team
          </button>
        </div>
        <UserButton afterSignOutUrl="/" />
      </header>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{selectedTeam?.isPersonal ? 'Your flows' : selectedTeam?.name}</h1>
            {selectedTeam && (
              <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleBadge[selectedTeam.role]}`}>
                {selectedTeam.role}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {selectedTeam && !selectedTeam.isPersonal && (
              <button
                type="button"
                onClick={() => setShowMembers(true)}
                className="rounded-lg border border-borderSoft px-4 py-2 text-sm font-semibold text-slate-200 hover:border-accent"
              >
                👥 Members ({selectedTeam.memberCount})
              </button>
            )}
            <button
              type="button"
              onClick={handleCreateFlow}
              disabled={creating}
              className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition hover:bg-accentHover disabled:opacity-60"
            >
              {creating ? 'Creating…' : '+ New flow'}
            </button>
          </div>
        </div>

        {status === 'loading' && <p className="text-slate-400">Loading…</p>}
        {status === 'error' && (
          <p className="text-rose-400">Couldn’t load your workspace. Is the API running on :4000?</p>
        )}

        {status === 'ready' && teamFlows.length === 0 && (
          <div className="rounded-xl border border-dashed border-borderSoft p-12 text-center text-slate-400">
            No flows here yet. Create your first one to get started.
          </div>
        )}

        {status === 'ready' && teamFlows.length > 0 && (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {teamFlows.map((flow) => (
              <li
                key={flow.id}
                className="group flex flex-col justify-between rounded-xl border border-borderSoft bg-panel p-5 transition hover:border-accent"
              >
                <button type="button" onClick={() => navigate(`/flow/${flow.id}`)} className="text-left">
                  <h2 className="font-semibold text-slate-100">{flow.title}</h2>
                  <p className="mt-1 text-xs text-slate-400">Edited {formatDate(flow.updatedAt)}</p>
                </button>
                <div className="mt-4 flex gap-3 text-xs">
                  <button type="button" onClick={() => handleRename(flow)} className="text-slate-400 hover:text-white">
                    Rename
                  </button>
                  <button type="button" onClick={() => handleDelete(flow)} className="text-slate-400 hover:text-rose-400">
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

      {showMembers && selectedTeam && (
        <MembersPanel team={selectedTeam} myRole={selectedTeam.role} onClose={() => setShowMembers(false)} />
      )}
    </div>
  );
}
