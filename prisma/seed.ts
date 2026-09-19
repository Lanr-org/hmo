import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

// Sourced from the NHIA (National Health Insurance Authority) public
// register of accredited HMOs: https://www.nhia.gov.ng/hmo/
// Only company-level facts confirmed there are included. No plans,
// benefits, or ratings are seeded — those require per-HMO verification
// this pass didn't do, so they're left empty rather than invented.
const HMOS = [
  {
    name: "Hygeia HMO",
    slug: "hygeia-hmo",
    website: "https://hygeiahmo.com",
    email: "hycare@hygeiahmo.com",
    description:
      "Hygeia HMO is an NHIA-accredited Health Maintenance Organization operating in Nigeria, offering managed healthcare plans for individuals, families and corporate clients.",
  },
  {
    name: "AXA Mansard Health",
    slug: "axa-mansard-health",
    website: "https://axamansard.com",
    email: "healthcare@axamansard.com",
    description:
      "AXA Mansard Health is an NHIA-accredited Health Maintenance Organization operating in Nigeria, offering managed healthcare plans for individuals, families and corporate clients.",
  },
  {
    name: "Reliance HMO",
    slug: "reliance-hmo",
    website: "https://getreliancehealth.com",
    email: "hello@reliancehmo.com",
    description:
      "Reliance HMO is an NHIA-accredited Health Maintenance Organization operating in Nigeria, offering managed healthcare plans for individuals, families and corporate clients.",
  },
  {
    name: "Total Health Trust",
    slug: "total-health-trust",
    website: "https://libertyhealth.net",
    email: "thtabuja@totalhealthtrust.com",
    description:
      "Total Health Trust is an NHIA-accredited Health Maintenance Organization operating in Nigeria, offering managed healthcare plans for individuals, families and corporate clients.",
  },
  {
    name: "Avon Healthcare",
    slug: "avon-healthcare",
    website: "https://avonhealthcare.com",
    email: "info@avonhealthcare.com",
    description:
      "Avon Healthcare is an NHIA-accredited Health Maintenance Organization operating in Nigeria, offering managed healthcare plans for individuals, families and corporate clients.",
  },
  {
    name: "Leadway Health",
    slug: "leadway-health",
    website: "https://leadwayhealth.com",
    email: "healthcare@leadway.com",
    description:
      "Leadway Health is an NHIA-accredited Health Maintenance Organization operating in Nigeria, offering managed healthcare plans for individuals, families and corporate clients.",
  },
  {
    name: "Redcare Health Services",
    slug: "redcare-health-services",
    website: "https://redcarehmo.com",
    email: "info@redcarehmo.com",
    description:
      "Redcare Health Services is an NHIA-accredited Health Maintenance Organization operating in Nigeria, offering managed healthcare plans for individuals, families and corporate clients.",
  },
  {
    name: "Clearline International",
    slug: "clearline-international",
    website: "https://clearlinehmo.com",
    email: "info@clearlinehmo.net",
    description:
      "Clearline International is an NHIA-accredited Health Maintenance Organization operating in Nigeria, offering managed healthcare plans for individuals, families and corporate clients.",
  },
  {
    name: "Health Partners",
    slug: "health-partners",
    website: "https://healthpartnersng.org",
    email: "hmo@healthpartnersng.org",
    description:
      "Health Partners is an NHIA-accredited Health Maintenance Organization operating in Nigeria, offering managed healthcare plans for individuals, families and corporate clients.",
  },
  {
    name: "Princeton Health",
    slug: "princeton-health",
    website: "https://princetonhmo.net",
    email: "info@princetonhmo.net",
    description:
      "Princeton Health is an NHIA-accredited Health Maintenance Organization operating in Nigeria, offering managed healthcare plans for individuals, families and corporate clients.",
  },
];

async function main() {
  for (const hmo of HMOS) {
    await prisma.hmo.upsert({
      where: { slug: hmo.slug },
      update: hmo,
      create: hmo,
    });
  }
  console.log(`Seeded ${HMOS.length} HMOs.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
