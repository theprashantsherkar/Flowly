import { useCallback, useEffect, useState } from 'react';
import { useApi } from '../hooks/useApi';

const ROLES = ['OWNER', 'ADMIN', 'MEMBER'];
const roleBadge = {
  OWNER: 'bg-amber-500/20 text-amber-300',
  ADMIN: 'bg-indigo-500/20 text-indigo-300',
  MEMBER: 'bg-slate-500/20 text-slate-300',
};

export function MembersPanel({ team, myRole, onClose }) {
  const api = useApi();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteUrl, setInviteUrl] = useState('');
  const [copying, setCopying] = useState(false);
  const [error, setError] = useState('');

  const canManage = myRole === 'OWNER' || myRole === 'ADMIN';
  const isOwner = myRole === 'OWNER';

  const load = useCallback(() => {
    setLoading(true);
    api
      .getMembers(team.id)
      .then((data) => setMembers(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api, team.id]);

  useEffect(() => {
    load();
  }, [load]);

  const generateInvite = async (role) => {
    setError('');
    try {
      const { token } = await api.createInvite(team.id, { role });
      setInviteUrl(`${window.location.origin}/invite/${token}`);
    } catch (e) {
      setError(e.message);
    }
  };

  const copyInvite = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopying(true);
    setTimeout(() => setCopying(false), 1500);
  };

  const changeRole = async (userId, role) => {
    try {
      await api.changeRole(team.id, userId, role);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const remove = async (userId) => {
    if (!window.confirm('Remove this member from the team?')) return;
    try {
      await api.removeMember(team.id, userId);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4" onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-2xl border border-borderSoft bg-panel p-6 shadow-node"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-100">{team.name}</h2>
            <p className="text-xs text-slate-400">Members & roles</p>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        {error && <p className="mt-3 rounded-md bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p>}

        <div className="mt-4 max-h-64 space-y-2 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-slate-400">Loading…</p>
          ) : (
            members.map((m) => (
              <div
                key={m.userId}
                className="flex items-center justify-between rounded-lg border border-borderSoft bg-panelLight px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">{m.name || m.email}</p>
                  <p className="truncate text-xs text-slate-400">{m.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  {isOwner ? (
                    <select
                      value={m.role}
                      onChange={(e) => changeRole(m.userId, e.target.value)}
                      className="rounded-md border border-borderSoft bg-panel px-2 py-1 text-xs text-slate-200"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {r}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleBadge[m.role]}`}>
                      {m.role}
                    </span>
                  )}
                  {canManage && (
                    <button
                      type="button"
                      onClick={() => remove(m.userId)}
                      className="text-xs text-slate-400 hover:text-rose-400"
                      title="Remove"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {canManage && (
          <div className="mt-5 border-t border-borderSoft pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Invite people
            </p>
            {inviteUrl ? (
              <div className="flex gap-2">
                <input
                  readOnly
                  value={inviteUrl}
                  className="flex-1 rounded-md border border-borderSoft bg-panelLight px-2 py-1.5 text-xs text-slate-300"
                />
                <button
                  type="button"
                  onClick={copyInvite}
                  className="rounded-md bg-accent px-3 py-1.5 text-xs font-semibold text-white"
                >
                  {copying ? 'Copied!' : 'Copy'}
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => generateInvite('MEMBER')}
                  className="rounded-lg border border-borderSoft px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-accent"
                >
                  Invite as member
                </button>
                <button
                  type="button"
                  onClick={() => generateInvite('ADMIN')}
                  className="rounded-lg border border-borderSoft px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-accent"
                >
                  Invite as admin
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
