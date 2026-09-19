import Image from "next/image";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";

import { ArrowPillLink } from "@/components/arrow-pill-link";
import { GlobeIcon, ShieldIcon, StarIcon } from "@/components/icons";
import { SiteNav } from "@/components/site-nav";
import { initials } from "@/lib/format";
import { prisma } from "@/lib/prisma";

async function getHmo(slug: string) {
  return prisma.hmo.findUnique({
    where: { slug },
    include: {
      plans: true,
      benefits: true,
      reviews: {
        where: { status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        include: {
          user: { select: { name: true } },
          responses: { orderBy: { createdAt: "asc" } },
        },
      },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const hmo = await prisma.hmo.findUnique({ where: { slug }, select: { name: true } });
  if (!hmo) return {};
  return { title: `${hmo.name} — HMO`, description: `Compare coverage and read member experiences for ${hmo.name}.` };
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto w-full max-w-4xl border-t border-border px-4 py-10 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-ink-900">{title}</h2>
        {action}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-card border border-dashed border-border bg-surface p-6 text-sm text-ink-500">
      {children}
    </p>
  );
}

const RATING_ROWS: { key: "rating" | "customerServiceRating" | "approvalRating" | "hospitalRating" | "medicationRating"; label: string }[] = [
  { key: "rating", label: "Overall" },
  { key: "customerServiceRating", label: "Customer service" },
  { key: "approvalRating", label: "Approval" },
  { key: "hospitalRating", label: "Hospital access" },
  { key: "medicationRating", label: "Medication" },
];

export default async function HmoProfilePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const { submitted } = await searchParams;
  const hmo = await getHmo(slug);

  if (!hmo) notFound();

  const reviewCount = hmo.reviews.length;
  const averages = RATING_ROWS.map((row) => ({
    label: row.label,
    value: reviewCount
      ? hmo.reviews.reduce((sum, review) => sum + review[row.key], 0) / reviewCount
      : null,
  }));
  const overallAverage = averages[0].value;
  const isVerified = hmo.verificationStatus === "VERIFIED";

  const benefitsByCategory = hmo.benefits.reduce<Record<string, string[]>>((acc, benefit) => {
    acc[benefit.category] = acc[benefit.category] ?? [];
    acc[benefit.category].push(benefit.name);
    return acc;
  }, {});

  return (
    <main className="flex flex-1 flex-col">
      <div className="px-2 pt-2 sm:px-3 sm:pt-3">
        <SiteNav variant="solid" />
      </div>

      <section className="relative mx-2 mt-2 h-72 overflow-hidden rounded-large sm:mx-3 sm:h-80">
        <Image
          src="/images/hmo-profile-header.png"
          alt=""
          fill
          priority
          className="object-cover object-[30%_35%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to right, rgba(16,16,16,0.82) 0%, rgba(16,16,16,0.55) 45%, rgba(16,16,16,0.15) 75%)",
          }}
        />

        <div className="relative z-10 mx-auto flex h-full w-full max-w-4xl flex-col justify-end gap-8 px-6 py-8 sm:flex-row sm:items-end sm:justify-between sm:px-10 sm:py-10">
          <div className="flex items-start gap-5">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-medium bg-surface text-xl font-bold text-secondary-green shadow-[0_8px_30px_rgba(16,16,16,.06)] sm:h-20 sm:w-20 sm:text-2xl">
              {initials(hmo.name)}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
                  {hmo.name}
                </h1>
                {isVerified && (
                  <span className="inline-flex items-center gap-1 rounded-pill bg-supporting-green/20 px-3 py-1 text-xs font-semibold text-supporting-green">
                    <ShieldIcon className="h-3.5 w-3.5" />
                    Verified
                  </span>
                )}
              </div>
              <p className="mt-1 text-sm font-medium text-white/70">
                Health Maintenance Organization
              </p>

              <div className="mt-4 flex items-center gap-3">
                {overallAverage !== null ? (
                  <>
                    <span className="text-3xl font-extrabold text-white">
                      {overallAverage.toFixed(1)}
                    </span>
                    <StarIcon className="h-5 w-5 text-star" />
                    <span className="text-sm text-white/70">
                      Based on {reviewCount} member{" "}
                      {reviewCount === 1 ? "experience" : "experiences"}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-medium text-white/70">
                    No member experiences yet
                  </span>
                )}
              </div>
            </div>
          </div>

          <ArrowPillLink href={`/hmos/${hmo.slug}/claim`}>Claim this profile</ArrowPillLink>
        </div>
      </section>

      {submitted === "1" && (
        <div className="mx-auto mt-6 w-full max-w-4xl px-4 sm:px-6">
          <p className="rounded-card bg-supporting-green/40 px-5 py-4 text-sm font-semibold text-secondary-green">
            Thanks — your review has been submitted and is pending approval.
          </p>
        </div>
      )}

      <Section title="About">
        <div className="rounded-card border border-border bg-surface p-6">
          {!isVerified && (
            <p className="mb-3 text-xs font-semibold text-ink-400">
              Not yet verified by this HMO
            </p>
          )}
          <p className="text-base leading-relaxed text-ink-700">{hmo.description}</p>
          <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-500">
            <a
              href={hmo.website}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-secondary-green hover:text-ink-900"
            >
              <GlobeIcon className="h-4 w-4" />
              {hmo.website.replace(/^https?:\/\//, "")}
            </a>
            {hmo.email && <span>{hmo.email}</span>}
            {hmo.phone && <span>{hmo.phone}</span>}
          </div>
        </div>
      </Section>

      <Section title="Plans">
        {hmo.plans.length === 0 ? (
          <EmptyNote>Plans haven&apos;t been added yet.</EmptyNote>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {hmo.plans.map((plan) => (
              <div key={plan.id} className="rounded-card border border-border bg-surface p-5">
                <h3 className="font-bold text-ink-900">{plan.name}</h3>
                <p className="mt-1 text-sm text-ink-500">{plan.description}</p>
                {plan.price && (
                  <p className="mt-3 text-lg font-bold text-ink-900">
                    ₦{plan.price.toString()}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Benefits">
        {Object.keys(benefitsByCategory).length === 0 ? (
          <EmptyNote>Benefits haven&apos;t been added yet.</EmptyNote>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {Object.entries(benefitsByCategory).map(([category, names]) => (
              <div key={category} className="rounded-card border border-border bg-surface p-5">
                <h3 className="font-bold text-ink-900">{category}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {names.map((name) => (
                    <span
                      key={name}
                      className="rounded-pill bg-[#E8FBEF] px-3 py-1 text-xs font-semibold text-secondary-green"
                    >
                      {name}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section title="Hospitals">
        <EmptyNote>Hospital network hasn&apos;t been added yet.</EmptyNote>
      </Section>

      <Section title="Member Experience">
        {reviewCount === 0 ? (
          <EmptyNote>No member experiences yet.</EmptyNote>
        ) : (
          <div className="grid grid-cols-1 gap-4 rounded-card border border-border bg-surface p-6 sm:grid-cols-2">
            {averages.map((row) => (
              <div key={row.label} className="flex items-center justify-between gap-4">
                <span className="text-sm font-medium text-ink-500">{row.label}</span>
                <span className="inline-flex items-center gap-1 text-sm font-bold text-ink-900">
                  {row.value?.toFixed(1)}
                  <StarIcon className="h-3.5 w-3.5 text-star" />
                </span>
              </div>
            ))}
          </div>
        )}
      </Section>

      <Section
        title="Reviews"
        action={
          <ArrowPillLink href={`/hmos/${hmo.slug}/review`} tone="dark">
            Write a review
          </ArrowPillLink>
        }
      >
        {hmo.reviews.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-border bg-surface py-16 text-center">
            <p className="font-semibold text-ink-900">No member experiences yet.</p>
            <p className="text-sm text-ink-500">Be the first to share yours.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {hmo.reviews.map((review) => (
              <div key={review.id} className="rounded-card border border-border bg-surface p-6">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <StarIcon key={i} className="h-3.5 w-3.5 text-star" />
                    ))}
                  </div>
                  <span className="font-bold text-ink-900">{review.rating.toFixed(1)}</span>
                </div>
                <h3 className="mt-3 text-lg font-bold text-ink-900">{review.title}</h3>
                <p className="mt-2 text-base text-ink-700">{review.body}</p>
                <p className="mt-3 text-xs font-medium text-ink-400">
                  {review.experienceType} · {review.createdAt.toLocaleDateString("en-NG", {
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                {review.responses.length > 0 && (
                  <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
                    {review.responses.map((response) => (
                      <div key={response.id} className="flex items-start gap-3">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-green text-[10px] font-bold text-ink-900">
                          {initials(hmo.name)}
                        </div>
                        <div className="max-w-[85%] pt-1">
                          <p className="text-xs font-bold text-secondary-green">{hmo.name}</p>
                          <p className="mt-1 text-sm text-ink-700">{response.body}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Section>
    </main>
  );
}
