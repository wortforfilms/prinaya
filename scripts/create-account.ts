/**
 * Create (or update) an organization account with an owner.
 *
 *   npm run account:create
 *   ACCOUNT_ORG="Spark Planners" ACCOUNT_OWNER="Sanjeeta Khaira" \
 *     ACCOUNT_EMAIL="sanjeeta@sparkplanners.in" npm run account:create
 *
 * Idempotent (upserts by org slug / user email / role). This seeds a database
 * account record only — there is NO live auth/login or password in this
 * controlled preview (the auth provider is a preserved blocker). Requires
 * DATABASE_URL set and migrations applied (npx prisma migrate dev).
 */
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const ORG_NAME = process.env.ACCOUNT_ORG ?? "Spark Planners";
const OWNER_NAME = process.env.ACCOUNT_OWNER ?? "Sanjeeta Khaira";
const OWNER_EMAIL = process.env.ACCOUNT_EMAIL ?? "sanjeeta.khaira@sparkplanners.in";

const slug = ORG_NAME.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  const organization = await prisma.organization.upsert({
    where: { slug },
    update: { name: ORG_NAME },
    create: { name: ORG_NAME, slug }
  });

  const ownerRole = await prisma.role.upsert({
    where: { organizationId_name: { organizationId: organization.id, name: "Owner" } },
    update: { description: "Organization owner — full preview access." },
    create: { organizationId: organization.id, name: "Owner", description: "Organization owner — full preview access." }
  });

  const owner = await prisma.user.upsert({
    where: { email: OWNER_EMAIL },
    update: { name: OWNER_NAME, organizationId: organization.id },
    create: { name: OWNER_NAME, email: OWNER_EMAIL, organizationId: organization.id }
  });

  await prisma.userRole.upsert({
    where: { userId_roleId: { userId: owner.id, roleId: ownerRole.id } },
    update: {},
    create: { userId: owner.id, roleId: ownerRole.id }
  });

  console.log("Account ready (controlled preview — no live login):");
  console.log(`  Organization: ${organization.name} (slug: ${organization.slug}, id: ${organization.id})`);
  console.log(`  Owner: ${owner.name} <${owner.email}> (id: ${owner.id})`);
  console.log(`  Role: ${ownerRole.name}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
