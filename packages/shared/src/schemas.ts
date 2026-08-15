/**
 * Zod schemas for validating flow documents crossing the network boundary
 * (import/export, API save/load, AI-generated diagrams). Validating here means
 * malformed JSON is rejected before it ever reaches the canvas or the database.
 */
import { z } from 'zod';
import { NODE_TYPES } from './nodeRegistry';

export const xyPositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

export const flowNodeSchema = z.object({
  id: z.string().min(1),
  type: z.enum(NODE_TYPES as [string, ...string[]]).or(z.string()),
  position: xyPositionSchema,
  data: z.record(z.any()).default({}),
});

export const flowEdgeSchema = z.object({
  id: z.string().min(1),
  source: z.string().min(1),
  target: z.string().min(1),
  sourceHandle: z.string().nullish(),
  targetHandle: z.string().nullish(),
});

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
