/**
 * Zod schemas for validating flow documents crossing the network boundary
 * (import/export, API save/load, AI-generated diagrams). Validating here means
 * malformed JSON is rejected before it ever reaches the canvas or the database.
 */
import { z } from 'zod';

export const xyPositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

// passthrough() keeps ReactFlow's extra fields (width, edge styling, etc.) so a
// saved-then-reloaded flow looks identical, while still validating the essentials.
export const flowNodeSchema = z
  .object({
    id: z.string().min(1),
    type: z.string(),
    position: xyPositionSchema,
    data: z.record(z.any()).default({}),
  })
  .passthrough();

export const flowEdgeSchema = z
  .object({
    id: z.string().min(1),
    source: z.string().min(1),
    target: z.string().min(1),
    sourceHandle: z.string().nullish(),
    targetHandle: z.string().nullish(),
  })
  .passthrough();

export const flowDocumentSchema = z.object({
  nodes: z.array(flowNodeSchema),
  edges: z.array(flowEdgeSchema),
});

export type FlowNode = z.infer<typeof flowNodeSchema>;
export type FlowEdge = z.infer<typeof flowEdgeSchema>;
export type FlowDocument = z.infer<typeof flowDocumentSchema>;

export const ROLES = ['OWNER', 'ADMIN', 'MEMBER'] as const;
export const roleSchema = z.enum(ROLES);
export type Role = z.infer<typeof roleSchema>;
