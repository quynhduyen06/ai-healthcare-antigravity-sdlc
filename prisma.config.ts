// prisma.config.ts – Prisma 7 configuration
import "dotenv/config";
import { defineConfig } from "prisma/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

const dbPath = path.resolve(__dirname, "prisma", "dev.db");

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // URL required for migrate commands
  datasource: {
    url: `file:${dbPath}`,
  },
  // Adapter required for PrismaClient runtime
  adapter: () => new PrismaBetterSqlite3({ url: `file:${dbPath}` }),
});
