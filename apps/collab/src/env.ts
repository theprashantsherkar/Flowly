import path from 'path';
import dotenv from 'dotenv';

// Shared secrets (DATABASE_URL, CLERK_SECRET_KEY) live in the API's .env for
// local dev so there's a single source. dotenv never overrides already-set
// vars, so real deployment env vars still win.
dotenv.config({ path: path.resolve(__dirname, '..', '..', 'api', '.env') });
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

export const env = {
  port: Number(process.env.COLLAB_PORT ?? 1234),
  clerkSecretKey: process.env.CLERK_SECRET_KEY ?? '',
  databaseUrl: process.env.DATABASE_URL ?? '',
};
