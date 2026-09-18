import Link from "next/link";
import type { ReactNode } from "react";

export function ArrowPillLink({
  href,
  children,
  tone = "green",
}: {
  href: string;
  children: ReactNode;
  tone?: "green" | "dark";
}) {
  return (
    <Link
      href={href}
      className={
        tone === "green"
          ? "inline-flex h-11 items-center gap-3 rounded-pill bg-brand-green py-1 pl-5 pr-1 text-sm font-semibold text-ink-900 transition-colors hover:bg-brand-green-hover"
          : "inline-flex h-11 items-center gap-3 rounded-pill bg-ink-900 py-1 pl-5 pr-1 text-sm font-semibold text-white transition-colors hover:bg-ink-700"
      }
    >
      {children}
      <span
        className={
          tone === "green"
            ? "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink-900"
            : "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white"
        }
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className={tone === "green" ? "h-4 w-4 text-white" : "h-4 w-4 text-ink-900"}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
    </Link>
  );
}
