import "dotenv/config";
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const globalForPrisma = global as unknown as { prisma: PrismaClient | undefined };

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.warn('⚠️  DATABASE_URL not set. Prisma Client will be created without adapter.');
    // During build, DATABASE_URL might not be available
    // This allows the build to complete, but runtime will need DATABASE_URL
    return new PrismaClient();
  }

  try {
    const adapter = new PrismaPg({ connectionString });
    return new PrismaClient({ adapter });
  } catch (error) {
    console.error('Failed to create Prisma Client with adapter:', error);
    // Fallback to default client if adapter fails
    return new PrismaClient();
  }
}

const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;