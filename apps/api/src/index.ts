import { env, clerkConfigured } from './env';
import express from 'express';
import cors from 'cors';
import { usersRouter } from './routes/users';
import { flowsRouter } from './routes/flows';
import { errorHandler, notFound } from './middleware/error';

const app = express();

app.use(cors({ origin: env.webOrigin, credentials: true }));
app.use(express.json({ limit: '5mb' }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'flowly-api', clerkConfigured });
});

app.use('/api/users', usersRouter);
app.use('/api/flows', flowsRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(env.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Flowly API listening on http://localhost:${env.port}/api`);
  if (!clerkConfigured) {
    // eslint-disable-next-line no-console
    console.warn('CLERK_SECRET_KEY not set — protected routes will reject requests until you add it.');
  }
});
