import { prisma } from '../prisma';
import { getUserProfile } from '../clerk';

/**
 * Resolves the local DB user for a Clerk id, creating it on first sight
 * (just-in-time provisioning). Upsert guards against duplicate creation when a
 * user's first two requests race.
 */
export async function resolveByClerkId(clerkId: string) {
  const existing = await prisma.user.findUnique({ where: { clerkId } });
  if (existing) return existing;

  const profile = await getUserProfile(clerkId);
  return prisma.user.upsert({
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
