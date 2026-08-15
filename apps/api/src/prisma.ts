import { PrismaClient } from '@prisma/client';
import './env'; // guarantees DATABASE_URL is loaded before the client constructs

export const prisma = new PrismaClient();
