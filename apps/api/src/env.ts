import dotenv from 'dotenv';

// Load .env before anything reads process.env (Prisma/Clerk construct at import).
dotenv.config();

export const env = {
  port: Number(process.env.PORT ?? 4000),
  databaseUrl: process.env.DATABASE_URL ?? '',
  clerkSecretKey: process.env.CLERK_SECRET_KEY ?? '',
  // Split on commas, trim, and strip any trailing slashes — a browser's Origin
  // header never has a trailing slash, so "https://site.app/" must match "https://site.app".
  webOrigin: (process.env.WEB_ORIGIN ?? 'http://localhost:3000')
    .split(',')
    .map((o) => o.trim().replace(/\/+$/, ''))
    .filter(Boolean),
};

export const clerkConfigured =
  Boolean(env.clerkSecretKey) && !env.clerkSecretKey.includes('placeholder');
