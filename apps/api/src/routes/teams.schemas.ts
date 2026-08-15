import { z } from 'zod';

export const createTeamSchema = z.object({
  name: z.string().trim().min(1).max(60),
});

// Invites can grant MEMBER or ADMIN — never OWNER.
export const createInviteSchema = z.object({
  role: z.enum(['MEMBER', 'ADMIN']).default('MEMBER'),
  expiresInDays: z.number().int().positive().max(90).optional(),
  maxUses: z.number().int().positive().max(1000).optional(),
});

export const changeRoleSchema = z.object({
  role: z.enum(['OWNER', 'ADMIN', 'MEMBER']),
});
