import dotenv from 'dotenv';

// Load .env before anything reads process.env (Prisma/Clerk construct at import).
dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  clerkSecretKey: process.env.CLERK_SECRET_KEY ?? '',
  webOrigin: (process.env.WEB_ORIGIN ?? 'http://localhost:3000').split(','),
};

export const clerkConfigured =
  Boolean(env.clerkSecretKey) && !env.clerkSecretKey.includes('placeholder');
