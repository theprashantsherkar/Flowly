import { randomBytes } from 'crypto';

/** An opaque, unguessable invite token (URL-safe). */
export const inviteToken = () => randomBytes(18).toString('base64url');

/** A short random suffix to keep team slugs unique. */
export const randomSuffix = () => randomBytes(4).toString('hex');

export function slugify(input: string): string {
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 40);
  return base || 'team';
}
