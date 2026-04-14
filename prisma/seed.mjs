import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const raw = process.env.SUPER_ADMIN_SEED_JSON;
  if (!raw) {
    console.log("SUPER_ADMIN_SEED_JSON not provided. Skipping platform admin seed.");
    return;
  }

  const admins = JSON.parse(raw);

  for (const admin of admins) {
    const passwordHash = await bcrypt.hash(admin.password, 12);

    await prisma.platformAdmin.upsert({
      where: { email: admin.email.toLowerCase() },
      update: {
        name: admin.name,
        password_hash: passwordHash,
        is_active: true,
      },
      create: {
        email: admin.email.toLowerCase(),
        name: admin.name,
        password_hash: passwordHash,
      },
    });
  }

  console.log(`Seeded ${admins.length} platform admin accounts.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
