import { env } from './env';
import { Server } from '@hocuspocus/server';
import { Database } from '@hocuspocus/extension-database';
import { PrismaClient } from '@prisma/client';
import { verifyToken } from '@clerk/backend';

const prisma = new PrismaClient();

/**
 * Whether the given Clerk user may open a flow's room. Mirrors the API's flow
 * access rule: the owner, or a member of the flow's team.
 */
async function userCanAccessFlow(clerkId: string, flowId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: { id: true, memberships: { select: { teamId: true } } },
  });
  if (!user) return false;

  const flow = await prisma.flow.findUnique({
    where: { id: flowId },
    select: { ownerId: true, teamId: true },
  });
  if (!flow) return false;

  if (flow.ownerId === user.id) return true;
  return Boolean(flow.teamId && user.memberships.some((m) => m.teamId === flow.teamId));
}

const server = Server.configure({
  port: env.port,

  // documentName is the flow id. Reject the socket unless the token is valid
  // and the user has access — never trust the client.
  async onAuthenticate({ token, documentName }) {
    if (!token) throw new Error('Missing token');
    const payload = await verifyToken(token, { secretKey: env.clerkSecretKey });
    const clerkId = payload.sub;
    if (!clerkId || !(await userCanAccessFlow(clerkId, documentName))) {
      throw new Error('Forbidden');
    }
    return { clerkId };
  },

  extensions: [
    new Database({
      fetch: async ({ documentName }) => {
        const flow = await prisma.flow.findUnique({
          where: { id: documentName },
          select: { yDocState: true },
        });
        return flow?.yDocState ? new Uint8Array(flow.yDocState) : null;
      },
      store: async ({ documentName, state }) => {
        await prisma.flow
          .update({ where: { id: documentName }, data: { yDocState: Buffer.from(state) } })
          .catch(() => {
            // Flow may have been deleted; ignore.
          });
      },
    }),
  ],
});

server.listen().then(() => {
  // eslint-disable-next-line no-console
  console.log(`Flowly collab server on ws://localhost:${env.port}`);
});
