import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

/**
 * Local-only demo/placeholder content for previewing the design against
 * populated data. NOT for production seeding — plan prices are invented
 * and reviews are clearly labelled "Demo experience" per mvp.md Step 15,
 * never presented as real member submissions.
 */

const PLAN_TIERS = [
  { name: "Example — Basic", description: "Outpatient care and emergency cover for individuals. (Example plan for design preview — not official pricing.)", price: 45000 },
  { name: "Example — Standard", description: "Adds maternity, dental and optical cover for individuals and families. (Example plan for design preview — not official pricing.)", price: 95000 },
  { name: "Example — Premium", description: "Full coverage including specialist consultations and international referral. (Example plan for design preview — not official pricing.)", price: 210000 },
];

const BENEFIT_CATEGORIES = ["Outpatient Care", "Maternity", "Dental", "Optical", "Emergency"];

async function seedPlansAndBenefits(slug: string) {
  const hmo = await prisma.hmo.findUnique({ where: { slug } });
  if (!hmo) return;

  for (const tier of PLAN_TIERS) {
    await prisma.plan.upsert({
      where: { id: `${hmo.id}-${tier.name}` },
      update: {},
      create: {
        id: `${hmo.id}-${tier.name}`,
        hmoId: hmo.id,
        name: tier.name,
        description: tier.description,
        price: tier.price,
      },
    });
  }

  for (const category of BENEFIT_CATEGORIES) {
    await prisma.benefit.upsert({
      where: { id: `${hmo.id}-${category}` },
      update: {},
      create: {
        id: `${hmo.id}-${category}`,
        hmoId: hmo.id,
        name: category,
        category,
      },
    });
  }
}

async function main() {
  const demoUser = await prisma.user.upsert({
    where: { email: "demo.member@example.com" },
    update: {},
    create: { email: "demo.member@example.com", name: "Demo Member" },
  });

  const demoHmoAdmin = await prisma.user.upsert({
    where: { email: "demo.hmo-rep@example.com" },
    update: {},
    create: { email: "demo.hmo-rep@example.com", name: "Demo HMO Rep", role: "HMO_ADMIN" },
  });

  for (const slug of ["hygeia-hmo", "reliance-hmo", "avon-healthcare"]) {
    await seedPlansAndBenefits(slug);
  }

  const hygeia = await prisma.hmo.findUnique({ where: { slug: "hygeia-hmo" } });
  const reliance = await prisma.hmo.findUnique({ where: { slug: "reliance-hmo" } });

  if (hygeia) {
    const review1 = await prisma.review.upsert({
      where: { id: `${hygeia.id}-demo-review-1` },
      update: {},
      create: {
        id: `${hygeia.id}-demo-review-1`,
        hmoId: hygeia.id,
        userId: demoUser.id,
        rating: 4,
        title: "Demo experience: Approval took a few days but came through",
        body: "This is a placeholder review used to preview the design — not a real member submission. Getting my hospital visit approved took about three working days, but the customer service team followed up well throughout.",
        experienceType: "Hospital",
        customerServiceRating: 4,
        approvalRating: 3,
        hospitalRating: 4,
        medicationRating: 4,
        status: "APPROVED",
      },
    });

    await prisma.review.upsert({
      where: { id: `${hygeia.id}-demo-review-2` },
      update: {},
      create: {
        id: `${hygeia.id}-demo-review-2`,
        hmoId: hygeia.id,
        userId: demoUser.id,
        rating: 5,
        title: "Demo experience: Smooth maternity coverage",
        body: "This is a placeholder review used to preview the design — not a real member submission. Antenatal visits were covered without issues and the process was straightforward.",
        experienceType: "Maternity",
        customerServiceRating: 5,
        approvalRating: 5,
        hospitalRating: 5,
        medicationRating: 4,
        status: "APPROVED",
      },
    });

    await prisma.hmoResponse.upsert({
      where: { id: `${hygeia.id}-demo-response-1` },
      update: {},
      create: {
        id: `${hygeia.id}-demo-response-1`,
        reviewId: review1.id,
        userId: demoHmoAdmin.id,
        body: "This is a placeholder HMO response used to preview the design — not a real reply. Thank you for the feedback; we're working on reducing approval turnaround times.",
      },
    });
  }

  if (reliance) {
    await prisma.review.upsert({
      where: { id: `${reliance.id}-demo-review-1` },
      update: {},
      create: {
        id: `${reliance.id}-demo-review-1`,
        hmoId: reliance.id,
        userId: demoUser.id,
        rating: 4,
        title: "Demo experience: Quick claims process",
        body: "This is a placeholder review used to preview the design — not a real member submission. Claims were processed within a week with minimal back-and-forth.",
        experienceType: "Claims",
        customerServiceRating: 4,
        approvalRating: 4,
        hospitalRating: 3,
        medicationRating: 4,
        status: "APPROVED",
      },
    });
  }

  console.log("Seeded demo plans, benefits, and reviews.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
