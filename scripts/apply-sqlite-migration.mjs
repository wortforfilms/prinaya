import { existsSync, statSync } from "node:fs";
import { spawnSync } from "node:child_process";

const dbPath = new URL("../prisma/dev.db", import.meta.url);
const migrationPath = "prisma/migrations/20260609053000_init/migration.sql";

if (existsSync(dbPath) && statSync(dbPath).size > 0) {
  console.log("db:migrate skipped: prisma/dev.db already exists.");
  process.exit(0);
}

const result = spawnSync(
  "npx",
  ["prisma", "db", "execute", "--file", migrationPath, "--schema", "prisma/schema.prisma"],
  {
    stdio: "inherit"
  }
);

process.exit(result.status ?? 1);
