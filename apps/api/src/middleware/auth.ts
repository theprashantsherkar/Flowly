import type { NextFunction, Request, Response } from 'express';
import { verifySessionToken } from '../clerk';
import { resolveByClerkId } from '../services/users.service';
import { HttpError } from './error';

/**
 * Verifies the Clerk session token on the Authorization header, resolves the
 * local user, and attaches it as req.user. Runs on every protected route — the
 * client's identity/role is never trusted.
 */
export async function requireAuth(req: Request, _res: Response, next: NextFunction) {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      throw new HttpError(401, 'Missing bearer token');
    }

    const token = header.slice('Bearer '.length).trim();

    let clerkId: string | undefined;
    try {
      const payload = await verifySessionToken(token);
      clerkId = payload.sub;
    } catch {
      throw new HttpError(401, 'Invalid or expired session token');
    }

    if (!clerkId) {
      throw new HttpError(401, 'Token is missing a subject');
    }

    req.user = await resolveByClerkId(clerkId);
    next();
  } catch (err) {
    next(err);
  }
}
