import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserButton } from '@clerk/clerk-react';
import { FileText, MoreVertical, Pencil, Plus, Trash2, User, Users } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import { MembersPanel } from '../components/MembersPanel';
import { TEMPLATES } from '../lib/templates';
import { BrandLink } from '../components/BrandLink';
import { Button } from '../components/ui/button';
import { PromptDialog, ConfirmDialog } from '../components/ui/prompt-dialog';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../components/ui/dropdown-menu';
import { cn } from '../lib/cn';

function formatDate(value) {
  try {
    return new Date(value).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
}

const roleBadge = {
  OWNER: 'bg-amber-500/15 text-amber-300',
  ADMIN: 'bg-blue-500/15 text-blue-300',
  MEMBER: 'bg-slate-500/15 text-slate-300',
};

function FlowCard({ flow, onOpen, onRename, onDelete }) {
  return (
    <div className="group relative rounded-xl border border-borderSoft bg-panel p-5 transition-colors hover:bg-panelLight">
      <button type="button" onClick={onOpen} className="block w-full text-left">
        <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-panelLight text-slate-400 transition-colors group-hover:bg-panel">
          <FileText size={18} />
        </span>
        <h3 className="mt-3 truncate font-medium text-slate-100">{flow.title}</h3>
        <p className="mt-1 text-xs text-slate-500">Edited {formatDate(flow.updatedAt)}</p>
      </button>
      <div className="absolute right-2.5 top-2.5 opacity-0 transition group-hover:opacity-100 data-[open=true]:opacity-100">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="iconSm" aria-label="Flow actions">
              <MoreVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => onRename(flow)}>
              <Pencil size={14} /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem destructive onSelect={() => onDelete(flow)}>
              <Trash2 size={14} /> Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}

function SidebarItem({ active, icon, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
        active ? 'bg-panelLight text-white' : 'text-slate-400 hover:bg-panel hover:text-slate-200'
      )}
    >
      {icon}
      <span className="truncate">{label}</span>
    </button>
  );
}

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
  const [showTemplates, setShowTemplates] = useState(false);
  const [showNewTeam, setShowNewTeam] = useState(false);
  const [renameTarget, setRenameTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const load = useCallback(async () => {
    setStatus('loading');
    try {
      const [teamsData, flowsData] = await Promise.all([api.listTeams(), api.listFlows()]);
      setTeams(teamsData);
      setFlows(flowsData);
      setSelectedTeamId((current) => {
        if (current && teamsData.some((t) => t.id === current)) return current;
        const personal = teamsData.find((t) => t.isPersonal);
        return personal?.id || teamsData[0]?.id || '';
      });
      setStatus('ready');
    } catch {
      setStatus('error');
    }
  }, [api]);

  useEffect(() => {
    load();
  }, [load]);

  const personalTeam = useMemo(() => teams.find((t) => t.isPersonal), [teams]);
  const otherTeams = useMemo(() => teams.filter((t) => !t.isPersonal), [teams]);
  const selectedTeam = useMemo(() => teams.find((t) => t.id === selectedTeamId), [teams, selectedTeamId]);
  const teamFlows = useMemo(
    () => flows.filter((f) => f.teamId === selectedTeamId || (selectedTeam?.isPersonal && !f.teamId)),
    [flows, selectedTeamId, selectedTeam]
  );

  const selectTeam = (id) => {
    setSelectedTeamId(id);
    setSearchParams(id ? { team: id } : {});
  };

  const handleCreateFromTemplate = async (template) => {
    setShowTemplates(false);
    setCreating(true);
    try {
      const flow = await api.createFlow({
        teamId: selectedTeamId || undefined,
        title: template.id === 'blank' ? undefined : template.name,
      });
      const doc = template.build();
      if (doc.nodes.length || doc.edges.length) await api.updateFlow(flow.id, { document: doc });
      navigate(`/flow/${flow.id}`);
    } catch {
      setCreating(false);
    }
  };

  const createTeam = async (name) => {
    if (!name) return;
    const team = await api.createTeam(name);
    await load();
    selectTeam(team.id);
  };

  const renameFlow = async (title) => {
    if (!renameTarget || !title || title === renameTarget.title) return;
    await api.updateFlow(renameTarget.id, { title });
    load();
  };

  const deleteFlow = async () => {
    if (!deleteTarget) return;
    await api.deleteFlow(deleteTarget.id);
    setFlows((prev) => prev.filter((f) => f.id !== deleteTarget.id));
  };

  return (
    <div className="flex min-h-screen bg-canvas text-slate-100">
      {/* Sidebar */}
      <aside className="flex w-60 flex-col border-r border-borderSoft bg-panel/40 px-3 py-4">
        <div className="px-2">
          <BrandLink />
        </div>

        <div className="mt-6 space-y-1">
          <p className="px-3 pb-1 text-[11px] font-semibold uppercase tracking-wide text-slate-500">Personal</p>
          {personalTeam && (
            <SidebarItem
              active={selectedTeamId === personalTeam.id}
              icon={<User size={16} />}
              label="My flows"
              onClick={() => selectTeam(personalTeam.id)}
            />
          )}
        </div>

        <div className="mt-6 space-y-1">
          <div className="flex items-center justify-between px-3 pb-1">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">Teams</p>
            <button
              type="button"
              onClick={() => setShowNewTeam(true)}
              className="text-slate-500 transition hover:text-white"
              aria-label="New team"
            >
              <Plus size={15} />
            </button>
          </div>
          {otherTeams.length === 0 && (
            <p className="px-3 py-1 text-xs text-slate-600">No teams yet</p>
          )}
          {otherTeams.map((t) => (
            <SidebarItem
              key={t.id}
              active={selectedTeamId === t.id}
              icon={<Users size={16} />}
              label={t.name}
              onClick={() => selectTeam(t.id)}
            />
          ))}
        </div>

        <div className="mt-auto flex items-center gap-2 border-t border-borderSoft px-2 pt-4">
          <UserButton afterSignOutUrl="/" />
          <span className="text-xs text-slate-500">Account</span>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-5xl px-8 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold tracking-tight">
                {selectedTeam?.isPersonal ? 'My flows' : selectedTeam?.name || 'Flows'}
              </h1>
              {selectedTeam && !selectedTeam.isPersonal && (
                <span className={cn('rounded-full px-2 py-0.5 text-[10px] font-semibold', roleBadge[selectedTeam.role])}>
                  {selectedTeam.role}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {selectedTeam && !selectedTeam.isPersonal && (
                <Button variant="secondary" size="sm" onClick={() => setShowMembers(true)}>
                  <Users size={15} /> Members ({selectedTeam.memberCount})
                </Button>
              )}
              <Button size="sm" onClick={() => setShowTemplates(true)} disabled={creating}>
                <Plus size={15} /> {creating ? 'Creating…' : 'New flow'}
              </Button>
            </div>
          </div>

          {status === 'loading' && <p className="text-slate-400">Loading…</p>}
          {status === 'error' && (
            <p className="text-red-400">Couldn’t load your workspace. Is the API running on :4000?</p>
          )}

          {status === 'ready' && teamFlows.length === 0 && (
            <div className="rounded-xl border border-dashed border-borderSoft p-16 text-center">
              <p className="text-slate-400">No flows here yet.</p>
              <Button className="mt-4" onClick={() => setShowTemplates(true)}>
                <Plus size={15} /> Create your first flow
              </Button>
            </div>
          )}

          {status === 'ready' && teamFlows.length > 0 && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {teamFlows.map((flow) => (
                <FlowCard
                  key={flow.id}
                  flow={flow}
                  onOpen={() => navigate(`/flow/${flow.id}`)}
                  onRename={setRenameTarget}
                  onDelete={setDeleteTarget}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {showMembers && selectedTeam && (
        <MembersPanel team={selectedTeam} myRole={selectedTeam.role} onClose={() => setShowMembers(false)} />
      )}

      <PromptDialog
        open={showNewTeam}
        onOpenChange={setShowNewTeam}
        title="Create a team"
        description="Teams let you share flows and collaborate with others."
        placeholder="Team name"
        submitLabel="Create team"
        onSubmit={createTeam}
      />

      <PromptDialog
        open={!!renameTarget}
        onOpenChange={(v) => !v && setRenameTarget(null)}
        title="Rename flow"
        placeholder="Flow name"
        defaultValue={renameTarget?.title || ''}
        submitLabel="Rename"
        onSubmit={renameFlow}
      />

      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
        title="Delete flow?"
        description={`"${deleteTarget?.title}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        destructive
        onConfirm={deleteFlow}
      />

      <Dialog open={showTemplates} onOpenChange={setShowTemplates}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Start a new flow</DialogTitle>
            <DialogDescription>Pick a starting point.</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => handleCreateFromTemplate(t)}
                className="rounded-xl border border-borderSoft bg-panelLight p-4 text-left transition-colors hover:bg-panel"
              >
                <h3 className="font-medium text-slate-100">{t.name}</h3>
                <p className="mt-1 text-xs text-slate-400">{t.description}</p>
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
