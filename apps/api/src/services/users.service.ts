import type { User } from '@prisma/client';
import { prisma } from '../prisma';
import { getUserProfile } from '../clerk';
import { randomSuffix } from '../lib/ids';

/** Every user gets exactly one personal team they own. Idempotent — also
 *  backfills users created before personal teams existed. */
async function ensurePersonalTeam(user: User) {
  const existing = await prisma.membership.findFirst({
    where: { userId: user.id, team: { isPersonal: true } },
  });
  if (existing) return;

  await prisma.team.create({
    data: {
      name: `${user.name ?? 'My'}'s space`,
      slug: `personal-${randomSuffix()}`,
      isPersonal: true,
      members: { create: { userId: user.id, role: 'OWNER' } },
    },
  });
}

/**
 * Resolves the local DB user for a Clerk id, creating it on first sight
 * (just-in-time provisioning) and guaranteeing a personal team exists.
 */
export async function resolveByClerkId(clerkId: string) {
  let user = await prisma.user.findUnique({ where: { clerkId } });

  if (!user) {
    const profile = await getUserProfile(clerkId);
    user = await prisma.user.upsert({
      where: { clerkId },
      update: {},
      create: {
        clerkId,
        email: profile.email ?? `${clerkId}@users.flowly.local`,
        name: profile.name,
        avatarUrl: profile.avatarUrl,
      },
    });
  }

  await ensurePersonalTeam(user);
  return user;
}
