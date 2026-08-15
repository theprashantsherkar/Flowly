import { z } from 'zod';
import { flowDocumentSchema } from '@flowly/shared';

export const createFlowSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
});
export type CreateFlowInput = z.infer<typeof createFlowSchema>;

export const updateFlowSchema = z
  .object({
    title: z.string().trim().min(1).max(120).optional(),
    document: flowDocumentSchema.optional(),
    thumbnailUrl: z.string().url().nullable().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: 'No fields to update' });
export type UpdateFlowInput = z.infer<typeof updateFlowSchema>;
