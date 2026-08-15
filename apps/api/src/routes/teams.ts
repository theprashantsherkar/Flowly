import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { validateBody } from '../middleware/validate';
import { asyncHandler } from '../middleware/async-handler';
import { changeRoleSchema, createInviteSchema, createTeamSchema } from './teams.schemas';
import {
  changeMemberRole,
  createInvite,
  createTeam,
  getTeamMembers,
  listMyTeams,
  removeMember,
} from '../services/teams.service';

export const teamsRouter = Router();

teamsRouter.use(requireAuth);

teamsRouter.get(
  '/',
  asyncHandler(async (req, res) => {
    res.json(await listMyTeams(req.user!.id));
  }),
);

teamsRouter.post(
  '/',
  validateBody(createTeamSchema),
  asyncHandler(async (req, res) => {
    res.status(201).json(await createTeam(req.user!.id, req.body.name));
  }),
);

teamsRouter.get(
  '/:id/members',
  asyncHandler(async (req, res) => {
    res.json(await getTeamMembers(req.user!.id, req.params.id));
  }),
);

teamsRouter.post(
  '/:id/invites',
  validateBody(createInviteSchema),
  asyncHandler(async (req, res) => {
    const invite = await createInvite(req.user!.id, req.params.id, req.body);
    res.status(201).json({ token: invite.token, role: invite.role, expiresAt: invite.expiresAt });
  }),
);

teamsRouter.patch(
  '/:id/members/:userId',
  validateBody(changeRoleSchema),
  asyncHandler(async (req, res) => {
    res.json(await changeMemberRole(req.user!.id, req.params.id, req.params.userId, req.body.role));
  }),
);

teamsRouter.delete(
  '/:id/members/:userId',
  asyncHandler(async (req, res) => {
    res.json(await removeMember(req.user!.id, req.params.id, req.params.userId));
  }),
);
