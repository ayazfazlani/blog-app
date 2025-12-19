import { PrismaClient } from "@/src/generated/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Use PostgreSQL for production (Vercel), SQLite for local dev
// Make sure DATABASE_URL is set in Vercel environment variables
const prisma = globalForPrisma.prisma ?? new PrismaClient({} as any);

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export default prisma;
