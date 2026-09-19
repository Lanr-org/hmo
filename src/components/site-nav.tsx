import Link from "next/link";

import { ArrowPillLink } from "@/components/arrow-pill-link";
import { auth, signOut } from "@/auth";

const NAV_LINKS = [
  { label: "Explore HMOs", href: "/hmos" },
  { label: "Compare", href: "/compare" },
  { label: "Reviews", href: "/hmos" },
  { label: "For HMOs", href: "/hmo/dashboard" },
];

export async function SiteNav({ variant = "solid" }: { variant?: "solid" | "overlay" }) {
  const session = await auth();

  return (
    <div
      className={
        variant === "overlay"
          ? "mx-auto flex max-w-5xl items-center justify-between rounded-pill border border-white/80 bg-white/72 px-4 py-3 shadow-[0_8px_30px_rgba(16,16,16,.06)] backdrop-blur-xl sm:px-6"
          : "mx-auto flex max-w-5xl items-center justify-between rounded-pill border border-border bg-surface px-4 py-3 shadow-[0_8px_30px_rgba(16,16,16,.06)] sm:px-6"
      }
    >
      <Link href="/" className="text-lg font-extrabold tracking-tight text-ink-900">
        HMO
      </Link>

      <nav className="hidden items-center gap-8 text-sm font-semibold text-ink-700 md:flex">
        {NAV_LINKS.map((link) => (
          <Link key={link.label} href={link.href} className="transition-colors hover:text-ink-900">
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        {session?.user ? (
          <form
            action={async () => {
              "use server";
              await signOut({ redirectTo: "/" });
            }}
            className="hidden sm:block"
          >
            <button
              type="submit"
              className="text-sm font-semibold text-ink-700 hover:text-ink-900"
            >
              Sign out ({session.user.email?.split("@")[0]})
            </button>
          </form>
        ) : (
          <Link
            href="/auth/signin"
            className="hidden text-sm font-semibold text-ink-700 hover:text-ink-900 sm:inline"
          >
            Sign in
          </Link>
        )}
        <ArrowPillLink href="/hmos">Find an HMO</ArrowPillLink>
      </div>
    </div>
  );
}
