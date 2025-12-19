import { PrismaClient } from "../src/generated/client"; // Adjust path based on your output (use alias @/ if tsconfig paths set)
// Use your existing DATABASE_URL or hardcode for dev
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
const connectionString = process.env.DATABASE_URL || "file:./dev.db";

const adapter = new PrismaBetterSqlite3({ url: connectionString });

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
