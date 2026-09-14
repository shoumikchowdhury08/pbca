import dotenv from "dotenv";
dotenv.config({ override: true });
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const galleries = [
  ["home", "PBCA home gallery", "Highlights from PBCA celebrations."],
  ["about-us", "About PBCA gallery", "The people and traditions behind PBCA."],
  [
    "events",
    "Events gallery",
    "Moments from PBCA events and cultural evenings.",
  ],
  ["membership", "Membership gallery", "A year of belonging at PBCA."],
  [
    "awards-and-recognition",
    "Awards and recognition gallery",
    "Milestones worth celebrating.",
  ],
] as const;

async function main() {
  const email = (process.env.PBCA_ADMIN_EMAIL ?? "admin@pbca.in").toLowerCase();
  const password = process.env.PBCA_ADMIN_PASSWORD;

  if (!password || password.length < 12) {
    throw new Error(
      "PBCA_ADMIN_PASSWORD must be set and contain at least 12 characters.",
    );
  }

  await prisma.adminUser.upsert({
    where: { email },
    update: { name: "PBCA Administrator", active: true },
    create: {
      email,
      name: "PBCA Administrator",
      passwordHash: await bcrypt.hash(password, 12),
      role: "ADMIN",
    },
  });

  for (const [pageSlug, title, description] of galleries) {
    await prisma.gallery.upsert({
      where: { pageSlug },
      update: { title, description },
      create: { pageSlug, title, description },
    });
  }

  await prisma.homeCountdown.upsert({
    where: { id: "home" },
    update: {},
    create: {
      id: "home",
      targetAt: new Date("2026-10-17T00:00:00+05:30"),
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
