import Link from "next/link";

import { HmoCard } from "@/components/hmo-card";
import { SiteNav } from "@/components/site-nav";
import { prisma } from "@/lib/prisma";

const QUICK_FILTERS = ["Maternity", "Dental", "International", "Family", "Individual"];

function buildHref(q: string, benefit: string) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (benefit) params.set("benefit", benefit);
  const query = params.toString();
  return query ? `/hmos?${query}` : "/hmos";
}

function FilterPill({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={
        active
          ? "rounded-pill bg-brand-green px-4 py-2 text-sm font-semibold text-ink-900"
          : "rounded-pill border border-border bg-surface px-4 py-2 text-sm font-semibold text-secondary-green transition-colors hover:border-secondary-green"
      }
    >
      {label}
    </Link>
  );
}

export default async function HmosPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const q = typeof params.q === "string" ? params.q : "";
  const benefit = typeof params.benefit === "string" ? params.benefit : "";

  const hmos = await prisma.hmo.findMany({
    where: {
      AND: [
        q ? { name: { contains: q, mode: "insensitive" } } : {},
        benefit
          ? { benefits: { some: { category: { equals: benefit, mode: "insensitive" } } } }
          : {},
      ],
    },
    include: {
      benefits: true,
      reviews: { where: { status: "APPROVED" }, select: { rating: true } },
    },
    orderBy: { name: "asc" },
  });

  const results = hmos.map((hmo) => {
    const reviewCount = hmo.reviews.length;
    const averageRating = reviewCount
      ? hmo.reviews.reduce((sum, review) => sum + review.rating, 0) / reviewCount
      : null;
    const benefitCategories = Array.from(new Set(hmo.benefits.map((b) => b.category))).slice(0, 3);

    return {
      slug: hmo.slug,
      name: hmo.name,
      logo: hmo.logo,
      verified: hmo.verificationStatus === "VERIFIED",
      benefitCategories,
      averageRating,
      reviewCount,
    };
  });

  const hasFilters = Boolean(q || benefit);

  return (
    <main className="flex flex-1 flex-col">
      <div className="px-2 pt-2 sm:px-3 sm:pt-3">
        <SiteNav variant="solid" />
      </div>

      <section className="mx-auto w-full max-w-5xl px-4 pb-8 pt-10 sm:px-6 sm:pt-14">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 sm:text-4xl">
          Find your HMO
        </h1>
        <p className="mt-2 max-w-lg text-base text-ink-500">
          Compare coverage, explore plans and hear directly from people who
          use them.
        </p>

        <form
          action="/hmos"
          className="mt-6 flex flex-col gap-4 rounded-card border border-border bg-surface p-3 shadow-[0_8px_30px_rgba(16,16,16,.06)] sm:flex-row sm:items-center sm:p-3"
        >
          {benefit && <input type="hidden" name="benefit" value={benefit} />}
          <div className="flex flex-1 items-center gap-3 px-3 py-2">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              className="h-5 w-5 shrink-0 text-ink-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" strokeLinecap="round" />
            </svg>
            <input
              type="text"
              name="q"
              defaultValue={q}
              placeholder="Search HMOs, plans or hospitals..."
              className="w-full bg-transparent text-base text-ink-900 placeholder:text-ink-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-pill bg-ink-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-ink-700"
          >
            Search
          </button>
        </form>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <FilterPill label="All" href={buildHref(q, "")} active={!benefit} />
          {QUICK_FILTERS.map((filter) => (
            <FilterPill
              key={filter}
              label={filter}
              href={buildHref(q, filter)}
              active={benefit.toLowerCase() === filter.toLowerCase()}
            />
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-5xl px-4 pb-16 sm:px-6">
        {results.length === 0 ? (
          <div className="flex flex-col items-center gap-2 rounded-card border border-dashed border-border bg-surface py-20 text-center">
            <p className="text-lg font-semibold text-ink-900">
              {hasFilters ? "No HMOs match your search." : "No HMOs yet."}
            </p>
            <p className="max-w-sm text-sm text-ink-500">
              {hasFilters
                ? "Try a different name or clear your filters to see the full directory."
                : "Check back soon — we're onboarding HMOs."}
            </p>
            {hasFilters && (
              <Link
                href="/hmos"
                className="mt-2 text-sm font-semibold text-secondary-green hover:text-ink-900"
              >
                Clear filters
              </Link>
            )}
          </div>
        ) : (
          <>
            <p className="mb-6 text-sm font-medium text-ink-500">
              {results.length} HMO{results.length === 1 ? "" : "s"} found
            </p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((hmo) => (
                <HmoCard key={hmo.slug} {...hmo} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
