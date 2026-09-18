import Link from "next/link";

import { ShieldIcon, StarIcon } from "@/components/icons";
import { initials } from "@/lib/format";

type HmoCardProps = {
  slug: string;
  name: string;
  logo: string | null;
  verified: boolean;
  benefitCategories: string[];
  averageRating: number | null;
  reviewCount: number;
};

export function HmoCard({
  slug,
  name,
  logo,
  verified,
  benefitCategories,
  averageRating,
  reviewCount,
}: HmoCardProps) {
  return (
    <div className="flex flex-col rounded-card border border-border bg-surface p-6 shadow-[0_8px_30px_rgba(16,16,16,.06)]">
      <div className="flex items-start justify-between gap-3">
        {logo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={logo} alt={name} className="h-12 w-12 rounded-medium object-cover" />
        ) : (
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-medium bg-supporting-green text-sm font-bold text-secondary-green">
            {initials(name)}
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center gap-2">
        <h3 className="text-lg font-bold text-ink-900">{name}</h3>
        {verified && (
          <span className="inline-flex items-center gap-1 text-xs font-semibold text-secondary-green">
            <ShieldIcon className="h-3.5 w-3.5" />
            Verified
          </span>
        )}
      </div>

      <div className="mt-2 flex items-center gap-2 text-sm text-ink-500">
        {averageRating !== null ? (
          <>
            <span className="inline-flex items-center gap-1 font-semibold text-ink-900">
              {averageRating.toFixed(1)}
              <StarIcon className="h-3.5 w-3.5 text-star" />
            </span>
            <span>
              {reviewCount} member {reviewCount === 1 ? "review" : "reviews"}
            </span>
          </>
        ) : (
          <span>No reviews yet</span>
        )}
      </div>

      {benefitCategories.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2 border-t border-border pt-4">
          {benefitCategories.map((category) => (
            <span
              key={category}
              className="rounded-pill bg-[#E8FBEF] px-3 py-1 text-xs font-semibold text-secondary-green"
            >
              {category}
            </span>
          ))}
        </div>
      )}

      <Link
        href={`/hmos/${slug}`}
        className="mt-6 inline-flex h-11 items-center justify-center rounded-pill bg-ink-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-ink-700"
      >
        View HMO →
      </Link>
    </div>
  );
}
