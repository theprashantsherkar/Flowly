import path from 'path';
import dotenv from 'dotenv';

// Capture the host-injected PORT (Render/Railway set this) BEFORE loading any
// local .env, so the API's local PORT=4000 can never leak into the collab port.
const platformPort = process.env.PORT;

// Shared secrets (DATABASE_URL, CLERK_SECRET_KEY) live in the API's .env for
// local dev so there's a single source. dotenv never overrides already-set
// vars, so real deployment env vars still win.
dotenv.config({ path: path.resolve(__dirname, '..', '.env') });
dotenv.config({ path: path.resolve(__dirname, '..', '..', 'api', '.env') });

export const env = {
  // Local: COLLAB_PORT or the 1234 default. Production: the host's PORT.
  port: Number(process.env.COLLAB_PORT ?? platformPort ?? 1234),
  clerkSecretKey: process.env.CLERK_SECRET_KEY ?? '',
  databaseUrl: process.env.DATABASE_URL ?? '',
};
