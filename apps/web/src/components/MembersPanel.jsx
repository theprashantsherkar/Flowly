import { useCallback, useEffect, useState } from 'react';
import { Copy, Check, UserPlus } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { ConfirmDialog } from './ui/prompt-dialog';
import { cn } from '../lib/cn';

const ROLES = ['OWNER', 'ADMIN', 'MEMBER'];
const roleBadge = {
  OWNER: 'bg-amber-500/15 text-amber-300',
  ADMIN: 'bg-blue-500/15 text-blue-300',
  MEMBER: 'bg-slate-500/15 text-slate-300',
};

export function MembersPanel({ team, myRole, onClose }) {
  const api = useApi();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteUrl, setInviteUrl] = useState('');
  const [inviteRole, setInviteRole] = useState('MEMBER');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [removeTarget, setRemoveTarget] = useState(null);

  const canManage = myRole === 'OWNER' || myRole === 'ADMIN';
  const isOwner = myRole === 'OWNER';

  const load = useCallback(() => {
    setLoading(true);
    api
      .getMembers(team.id)
      .then(setMembers)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [api, team.id]);

  useEffect(() => {
    load();
  }, [load]);

  const generateInvite = async () => {
    setError('');
    try {
      const { token } = await api.createInvite(team.id, { role: inviteRole });
      setInviteUrl(`${window.location.origin}/invite/${token}`);
    } catch (e) {
      setError(e.message);
    }
  };

  const copyInvite = async () => {
    await navigator.clipboard.writeText(inviteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const changeRole = async (userId, role) => {
    try {
      await api.changeRole(team.id, userId, role);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  const removeMember = async () => {
    if (!removeTarget) return;
    try {
      await api.removeMember(team.id, removeTarget.userId);
      load();
    } catch (e) {
      setError(e.message);
    }
  };

  return (
    <Dialog open onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>{team.name}</DialogTitle>
          <DialogDescription>Manage members and roles.</DialogDescription>
        </DialogHeader>

        {error && (
          <p className="mb-3 rounded-md bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
        )}

        <div className="max-h-64 space-y-2 overflow-y-auto">
          {loading ? (
            <p className="text-sm text-slate-400">Loading…</p>
          ) : (
            members.map((m) => (
              <div
                key={m.userId}
                className="flex items-center justify-between gap-3 rounded-lg border border-borderSoft bg-panelLight px-3 py-2"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">{m.name || m.email}</p>
                  <p className="truncate text-xs text-slate-400">{m.email}</p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
                  {isOwner ? (
                    <Select value={m.role} onValueChange={(role) => changeRole(m.userId, role)}>
                      <SelectTrigger className="h-8 w-[110px] text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES.map((r) => (
                          <SelectItem key={r} value={r}>
                            {r}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', roleBadge[m.role])}>
                      {m.role}
                    </span>
                  )}
                  {canManage && (
                    <Button variant="ghost" size="sm" onClick={() => setRemoveTarget(m)}>
                      Remove
                    </Button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {canManage && (
          <div className="mt-5 border-t border-borderSoft pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">Invite people</p>
            {inviteUrl ? (
              <div className="flex gap-2">
                <Input readOnly value={inviteUrl} className="flex-1 text-xs" />
                <Button variant="secondary" onClick={copyInvite}>
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? 'Copied' : 'Copy'}
                </Button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Select value={inviteRole} onValueChange={setInviteRole}>
                  <SelectTrigger className="w-[120px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MEMBER">Member</SelectItem>
                    <SelectItem value="ADMIN">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={generateInvite}>
                  <UserPlus size={15} /> Create invite link
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>

      <ConfirmDialog
        open={!!removeTarget}
        onOpenChange={(v) => !v && setRemoveTarget(null)}
        title="Remove member?"
        description={`${removeTarget?.name || removeTarget?.email} will lose access to this team.`}
        confirmLabel="Remove"
        destructive
        onConfirm={removeMember}
      />
    </Dialog>
  );
}
