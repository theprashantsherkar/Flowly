import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { asyncHandler } from '../middleware/async-handler';
import { acceptInvite, previewInvite } from '../services/teams.service';

export const invitesRouter = Router();

invitesRouter.use(requireAuth);

/** Preview an invite before accepting (team name, role, validity). */
invitesRouter.get(
  '/:token',
  asyncHandler(async (req, res) => {
    res.json(await previewInvite(req.params.token));
  }),
);

/** Accept an invite and join the team (idempotent if already a member). */
invitesRouter.post(
  '/:token/accept',
  asyncHandler(async (req, res) => {
    res.json(await acceptInvite(req.user!.id, req.params.token));
  }),
);
