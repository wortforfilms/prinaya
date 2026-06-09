import { readFileSync } from "node:fs";
import { modelNames } from "../src/lib/schemas";

const schema = readFileSync(new URL("../prisma/schema.prisma", import.meta.url), "utf8");
const zod = readFileSync(new URL("../src/lib/schemas.ts", import.meta.url), "utf8");

const missingPrisma = modelNames.filter((name) => !schema.includes(`model ${name} `));
const missingZod = modelNames.filter((name) => !zod.includes(`export const ${name}Schema`));
const missingTypes = modelNames.filter((name) => !zod.includes(`export type ${name}`));

if (modelNames.length !== 31) {
  throw new Error(`Expected 31 required model names, found ${modelNames.length}`);
}

if (missingPrisma.length || missingZod.length || missingTypes.length) {
  throw new Error(
    [
      missingPrisma.length ? `Missing Prisma models: ${missingPrisma.join(", ")}` : "",
      missingZod.length ? `Missing Zod schemas: ${missingZod.join(", ")}` : "",
      missingTypes.length ? `Missing TS types: ${missingTypes.join(", ")}` : ""
    ]
      .filter(Boolean)
      .join("\n")
  );
}

console.log(`verify:schema passed (${modelNames.length} required Prisma models with Zod schemas and TS types)`);
