import { prisma } from '../prisma';
import { getUserProfile } from '../clerk';
import { randomSuffix } from '../lib/ids';

/**
 * Resolves the local DB user for a Clerk id, creating it on first sight
 * (just-in-time provisioning) together with a personal team they own. Upsert
 * guards against duplicate creation when a user's first two requests race.
 */
export async function resolveByClerkId(clerkId: string) {
  const existing = await prisma.user.findUnique({ where: { clerkId } });
  if (existing) return existing;

  const profile = await getUserProfile(clerkId);
  const displayName = profile.name ?? 'My';

  return prisma.user.upsert({
    where: { clerkId },
    update: {},
    create: {
      clerkId,
      email: profile.email ?? `${clerkId}@users.flowly.local`,
      name: profile.name,
      avatarUrl: profile.avatarUrl,
      memberships: {
        create: {
          role: 'OWNER',
          team: {
            create: {
              name: `${displayName}'s space`,
              slug: `personal-${randomSuffix()}`,
              isPersonal: true,
            },
          },
        },
      },
    },
  });
}
