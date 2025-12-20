import 'dotenv/config'
import { defineConfig } from 'prisma/config'

// For prisma generate, we don't need a real DATABASE_URL
// Only migrations need it, and those run separately
// Use process.env directly to avoid PrismaConfigEnvError during build
const databaseUrl = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/db?sslmode=prefer'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: databaseUrl,
  },
})

