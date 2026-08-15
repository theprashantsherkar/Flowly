import type { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { HttpError } from '../middleware/error';
import type { CreateFlowInput, UpdateFlowInput } from '../routes/flows.schemas';

/** Summary list for the dashboard (excludes the heavy document payload). */
export function listFlows(userId: string) {
  return prisma.flow.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: 'desc' },
    select: { id: true, title: true, thumbnailUrl: true, createdAt: true, updatedAt: true },
  });
}

export function createFlow(userId: string, input: CreateFlowInput) {
  return prisma.flow.create({
    data: { ownerId: userId, title: input.title ?? 'Untitled flow' },
  });
}

export async function getFlow(userId: string, id: string) {
  const flow = await prisma.flow.findUnique({ where: { id } });
  if (!flow) throw new HttpError(404, 'Flow not found');
  if (flow.ownerId !== userId) throw new HttpError(403, 'You do not have access to this flow');
  return flow;
}

export async function updateFlow(userId: string, id: string, input: UpdateFlowInput) {
  await getFlow(userId, id); // ownership check

  const data: Prisma.FlowUpdateInput = {};
  if (input.title !== undefined) data.title = input.title;
  if (input.document !== undefined) data.document = input.document as Prisma.InputJsonValue;
  if (input.thumbnailUrl !== undefined) data.thumbnailUrl = input.thumbnailUrl;

  return prisma.flow.update({ where: { id }, data });
}

export async function deleteFlow(userId: string, id: string) {
  await getFlow(userId, id); // ownership check
  await prisma.flow.delete({ where: { id } });
  return { id };
}
