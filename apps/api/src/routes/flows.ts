import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { asyncHandler } from '../middleware/async-handler';
import { createFlowSchema, updateFlowSchema } from './flows.schemas';
import { createFlow, deleteFlow, getFlow, listFlows, updateFlow } from '../services/flows.service';

export const flowsRouter = Router();

flowsRouter.use(requireAuth);

flowsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await listFlows(req.user!.id));
  }),
);

flowsRouter.post(
  '/',
  validateBody(createFlowSchema),
  asyncHandler(async (req, res) => {
    res.status(201).json(await createFlow(req.user!.id, req.body));
  }),
);

flowsRouter.get(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json(await getFlow(req.user!.id, req.params.id));
  }),
);

flowsRouter.patch(
  '/:id',
  validateBody(updateFlowSchema),
  asyncHandler(async (req, res) => {
    res.json(await updateFlow(req.user!.id, req.params.id, req.body));
  }),
);

flowsRouter.delete(
  '/:id',
  asyncHandler(async (req, res) => {
    res.json(await deleteFlow(req.user!.id, req.params.id));
  }),
);
