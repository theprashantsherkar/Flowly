import type { User } from '@prisma/client';

// Attach the authenticated DB user to the Express request (set by requireAuth).
declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
