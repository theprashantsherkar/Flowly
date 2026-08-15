import type { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { HttpError } from '../middleware/error';
import { getMembership, requireMembership } from './teams.service';
import { hasRole } from '../lib/rbac';
import type { CreateFlowInput, UpdateFlowInput } from '../routes/flows.schemas';

/** Summary list for the dashboard: the user's own flows + all their teams' flows. */
export async function listFlows(userId: string) {
  const teamIds = (
    await prisma.membership.findMany({ where: { userId }, select: { teamId: true } })
  ).map((m) => m.teamId);

  return prisma.flow.findMany({
    where: { OR: [{ ownerId: userId }, { teamId: { in: teamIds } }] },
    orderBy: { updatedAt: 'desc' },
    select: {
      id: true,
      title: true,
      thumbnailUrl: true,
      createdAt: true,
      updatedAt: true,
      teamId: true,
      team: { select: { id: true, name: true, isPersonal: true } },
    },
  });
}

export async function createFlow(userId: string, input: CreateFlowInput) {
  if (input.teamId) {
    await requireMembership(userId, input.teamId); // must belong to the team
  }
  return prisma.flow.create({
    data: { ownerId: userId, title: input.title ?? 'Untitled flow', teamId: input.teamId ?? null },
  });
}

/** Loads a flow after checking access. Owner always allowed; team members allowed. */
async function loadFlowWithAccess(userId: string, id: string, requireAdminToDelete = false) {
  const flow = await prisma.flow.findUnique({ where: { id } });
  if (!flow) throw new HttpError(404, 'Flow not found');

  if (flow.ownerId === userId) return flow;

  if (!flow.teamId) throw new HttpError(403, 'You do not have access to this flow');
  const membership = await getMembership(userId, flow.teamId);
  if (!membership) throw new HttpError(403, 'You do not have access to this flow');

  if (requireAdminToDelete && !hasRole(membership.role, 'ADMIN')) {
    throw new HttpError(403, 'Only team admins can delete this flow');
  }
  return flow;
}

export function getFlow(userId: string, id: string) {
  return loadFlowWithAccess(userId, id);
}

export async function updateFlow(userId: string, id: string, input: UpdateFlowInput) {
  await loadFlowWithAccess(userId, id); // any member may edit

  const data: Prisma.FlowUpdateInput = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.document !== undefined) data.document = input.document as Prisma.InputJsonValue;
  if (input.thumbnailUrl !== undefined) data.thumbnailUrl = input.thumbnailUrl;

  return prisma.flow.update({ where: { id }, data });
}

export async function deleteFlow(userId: string, id: string) {
  await loadFlowWithAccess(userId, id, true); // owner or team admin
  await prisma.flow.delete({ where: { id } });
  return { id };
}
