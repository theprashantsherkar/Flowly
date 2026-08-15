import { z } from 'zod';

// Flow-document validation. Kept in sync with packages/shared's flowDocumentSchema,
// but inlined here so the API builds without a cross-package build step (Render).
const xyPositionSchema = z.object({ x: z.number(), y: z.number() });

const flowNodeSchema = z
  .object({
    id: z.string().min(1),
    type: z.string(),
    position: xyPositionSchema,
    data: z.record(z.any()).default({}),
  })
  .passthrough();

const flowEdgeSchema = z
  .object({
    id: z.string().min(1),
    source: z.string().min(1),
    target: z.string().min(1),
    sourceHandle: z.string().nullish(),
    targetHandle: z.string().nullish(),
  })
  .passthrough();

const flowDocumentSchema = z.object({
  nodes: z.array(flowNodeSchema),
  edges: z.array(flowEdgeSchema),
});

export const createFlowSchema = z.object({
  title: z.string().trim().min(1).max(120).optional(),
  teamId: z.string().min(1).optional(),
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

export const createVersionSchema = z.object({
  label: z.string().trim().max(80).optional(),
  snapshot: flowDocumentSchema,
});
export type CreateVersionInput = z.infer<typeof createVersionSchema>;
