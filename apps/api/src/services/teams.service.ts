import type { Role } from '@prisma/client';
import { prisma } from '../prisma';
import { HttpError } from '../middleware/error';
import { ROLE_RANK, hasRole } from '../lib/rbac';
import { inviteToken, randomSuffix, slugify } from '../lib/ids';

export function getMembership(userId: string, teamId: string) {
  return prisma.membership.findUnique({ where: { userId_teamId: { userId, teamId } } });
}

/** Ensures the user is a member of the team with at least `min` role, else 403. */
export async function requireMembership(userId: string, teamId: string, min: Role = 'MEMBER') {
  const membership = await getMembership(userId, teamId);
  if (!membership) throw new HttpError(403, 'You are not a member of this team');
  if (!hasRole(membership.role, min)) throw new HttpError(403, 'You do not have permission for this action');
  return membership;
}

export async function listMyTeams(userId: string) {
  const teams = await prisma.team.findMany({
    where: { members: { some: { userId } } },
    orderBy: [{ isPersonal: 'desc' }, { createdAt: 'asc' }],
    include: {
      _count: { select: { members: true, flows: true } },
      members: { where: { userId }, select: { role: true } },
    },
  });
  return teams.map((t) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    isPersonal: t.isPersonal,
    role: t.members[0]?.role ?? 'MEMBER',
    memberCount: t._count.members,
    flowCount: t._count.flows,
  }));
}

export function createTeam(userId: string, name: string) {
  return prisma.team.create({
    data: {
      name,
      slug: `${slugify(name)}-${randomSuffix()}`,
      members: { create: { userId, role: 'OWNER' } },
    },
  });
}

export async function getTeamMembers(userId: string, teamId: string) {
  await requireMembership(userId, teamId);
  const members = await prisma.membership.findMany({
    where: { teamId },
    orderBy: { createdAt: 'asc' },
    include: { user: { select: { id: true, name: true, email: true, avatarUrl: true } } },
  });
  return members.map((m) => ({
    userId: m.userId,
    role: m.role,
    joinedAt: m.createdAt,
    name: m.user.name,
    email: m.user.email,
    avatarUrl: m.user.avatarUrl,
  }));
}

async function countOwners(teamId: string) {
  return prisma.membership.count({ where: { teamId, role: 'OWNER' } });
}

/** Change a member's role. Only owners can do this; a team must keep one owner. */
export async function changeMemberRole(
  actorId: string,
  teamId: string,
  targetUserId: string,
  newRole: Role,
) {
  await requireMembership(actorId, teamId, 'OWNER');
  const target = await getMembership(targetUserId, teamId);
  if (!target) throw new HttpError(404, 'That person is not a member of this team');

  if (target.role === 'OWNER' && newRole !== 'OWNER' && (await countOwners(teamId)) <= 1) {
    throw new HttpError(400, 'A team must have at least one owner — promote someone else first');
  }

  return prisma.membership.update({
    where: { userId_teamId: { userId: targetUserId, teamId } },
    data: { role: newRole },
  });
}

/** Remove a member, or leave the team when actor === target. */
export async function removeMember(actorId: string, teamId: string, targetUserId: string) {
  const actor = await requireMembership(actorId, teamId);
  const target = await getMembership(targetUserId, teamId);
  if (!target) throw new HttpError(404, 'That person is not a member of this team');

  const leaving = actorId === targetUserId;
  if (!leaving && !hasRole(actor.role, 'ADMIN')) {
    throw new HttpError(403, 'Only admins can remove members');
  }
  // An admin can't remove someone of equal-or-higher rank (only owners can).
  if (!leaving && ROLE_RANK[target.role] >= ROLE_RANK[actor.role] && actor.role !== 'OWNER') {
    throw new HttpError(403, 'You cannot remove someone with an equal or higher role');
  }
  if (target.role === 'OWNER' && (await countOwners(teamId)) <= 1) {
    throw new HttpError(400, 'Transfer ownership before removing the last owner');
  }

  await prisma.membership.delete({ where: { userId_teamId: { userId: targetUserId, teamId } } });
  return { userId: targetUserId };
}

export async function createInvite(
  actorId: string,
  teamId: string,
  input: { role: Role; expiresInDays?: number; maxUses?: number },
) {
  await requireMembership(actorId, teamId, 'ADMIN');
  const expiresAt = input.expiresInDays
    ? new Date(Date.now() + input.expiresInDays * 86_400_000)
    : null;
  return prisma.invite.create({
    data: {
      token: inviteToken(),
      teamId,
      role: input.role,
      expiresAt,
      maxUses: input.maxUses ?? null,
      createdById: actorId,
    },
  });
}

function inviteValidity(invite: { expiresAt: Date | null; maxUses: number | null; usedCount: number }) {
  if (invite.expiresAt && invite.expiresAt.getTime() < Date.now()) return { valid: false, reason: 'expired' };
  if (invite.maxUses != null && invite.usedCount >= invite.maxUses) return { valid: false, reason: 'used_up' };
  return { valid: true as const, reason: null };
}

export async function previewInvite(token: string) {
  const invite = await prisma.invite.findUnique({
    where: { token },
    include: { team: { select: { name: true } } },
  });
  if (!invite) throw new HttpError(404, 'This invite link is not valid');
  const validity = inviteValidity(invite);
  return { teamName: invite.team.name, role: invite.role, ...validity };
}

/** Accept an invite (idempotent if already a member). */
export async function acceptInvite(userId: string, token: string) {
  return prisma.$transaction(async (tx) => {
    const invite = await tx.invite.findUnique({ where: { token } });
    if (!invite) throw new HttpError(404, 'This invite link is not valid');

    const validity = inviteValidity(invite);
    if (!validity.valid) {
      throw new HttpError(410, validity.reason === 'expired' ? 'This invite has expired' : 'This invite has been used up');
    }

    const existing = await tx.membership.findUnique({
      where: { userId_teamId: { userId, teamId: invite.teamId } },
    });
    if (existing) return { teamId: invite.teamId, alreadyMember: true };

    await tx.membership.create({ data: { userId, teamId: invite.teamId, role: invite.role } });
    await tx.invite.update({ where: { id: invite.id }, data: { usedCount: { increment: 1 } } });
    return { teamId: invite.teamId, alreadyMember: false };
  });
}
