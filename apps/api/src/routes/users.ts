import { Router } from 'express';
import { requireAuth } from '../middleware/auth';

export const usersRouter = Router();

usersRouter.use(requireAuth);

/** The authenticated user's profile (created on first call). */
usersRouter.get('/me', (req, res) => {
  const u = req.user!;
  res.json({ id: u.id, email: u.email, name: u.name, avatarUrl: u.avatarUrl, createdAt: u.createdAt });
});
