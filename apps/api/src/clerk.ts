import { createClerkClient, verifyToken } from '@clerk/backend';
import { env } from './env';

const clerkClient = createClerkClient({ secretKey: env.clerkSecretKey });

/** Verifies a Clerk session JWT and returns its claims (throws if invalid). */
export function verifySessionToken(token: string) {
  return verifyToken(token, { secretKey: env.clerkSecretKey });
}

/** Fetches profile details (email, name, avatar) for a Clerk user id. */
export async function getUserProfile(clerkId: string) {
  const user = await clerkClient.users.getUser(clerkId);
  const email =
    user.emailAddresses.find((e) => e.id === user.primaryEmailAddressId)?.emailAddress ??
    user.emailAddresses[0]?.emailAddress ??
    null;
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || user.username || null;
  return { email, name, avatarUrl: user.imageUrl ?? null };
}
