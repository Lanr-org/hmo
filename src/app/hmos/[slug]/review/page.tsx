import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { SiteNav } from "@/components/site-nav";
import { prisma } from "@/lib/prisma";

import { submitReview } from "./actions";
import { EXPERIENCE_TYPES } from "./constants";

function RatingGroup({ name, label }: { name: string; label: string }) {
  return (
    <fieldset>
      <legend className="text-sm font-semibold text-ink-700">{label}</legend>
      <div className="mt-2 flex gap-2">
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer">
            <input type="radio" name={name} value={n} required className="peer sr-only" />
            <span className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-sm font-semibold text-ink-500 transition-colors peer-checked:border-brand-green peer-checked:bg-brand-green peer-checked:text-ink-900">
              {n}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default async function WriteReviewPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const session = await auth();
  if (!session?.user) {
    redirect(`/auth/signin?callbackUrl=/hmos/${slug}/review`);
  }

  const hmo = await prisma.hmo.findUnique({ where: { slug }, select: { name: true, slug: true } });
  if (!hmo) notFound();

  const action = submitReview.bind(null, hmo.slug);

  return (
    <main className="flex flex-1 flex-col">
      <div className="px-2 pt-2 sm:px-3 sm:pt-3">
        <SiteNav variant="solid" />
      </div>

      <section className="mx-auto w-full max-w-2xl px-4 py-12 sm:px-6">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">
          Share your experience
        </h1>
        <p className="mt-2 text-base text-ink-500">
          Tell members what it&apos;s really like with {hmo.name}. Your review
          is checked by our team before it goes live.
        </p>

        <form action={action} className="mt-8 flex flex-col gap-8">
          <RatingGroup name="rating" label="Overall experience" />

          <fieldset>
            <legend className="text-sm font-semibold text-ink-700">
              What was your experience about?
            </legend>
            <div className="mt-2 flex flex-wrap gap-2">
              {EXPERIENCE_TYPES.map((type) => (
                <label key={type} className="cursor-pointer">
                  <input
                    type="radio"
                    name="experienceType"
                    value={type}
                    required
                    className="peer sr-only"
                  />
                  <span className="inline-flex rounded-pill border border-border px-4 py-2 text-sm font-semibold text-ink-700 transition-colors peer-checked:border-brand-green peer-checked:bg-brand-green peer-checked:text-ink-900">
                    {type}
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <RatingGroup name="customerServiceRating" label="Customer service" />
            <RatingGroup name="approvalRating" label="Approval" />
            <RatingGroup name="hospitalRating" label="Hospital access" />
            <RatingGroup name="medicationRating" label="Medication" />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="title" className="text-sm font-semibold text-ink-700">
              Title
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              minLength={3}
              maxLength={120}
              placeholder="Approval took too long"
              className="h-12 rounded-pill border border-border bg-surface px-5 text-base text-ink-900 placeholder:text-ink-400 focus:border-secondary-green focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="body" className="text-sm font-semibold text-ink-700">
              Tell us what happened
            </label>
            <textarea
              id="body"
              name="body"
              required
              minLength={10}
              maxLength={2000}
              rows={6}
              placeholder="Share your experience, not accusations."
              className="rounded-card border border-border bg-surface px-5 py-4 text-base text-ink-900 placeholder:text-ink-400 focus:border-secondary-green focus:outline-none"
            />
            <p className="text-xs text-ink-400">
              Please avoid sharing phone numbers, addresses, or other people&apos;s
              personal information.
            </p>
          </div>

          <button
            type="submit"
            className="inline-flex h-12 items-center justify-center rounded-pill bg-brand-green px-6 text-sm font-semibold text-ink-900 transition-colors hover:bg-brand-green-hover"
          >
            Submit review
          </button>
        </form>
      </section>
    </main>
  );
}
