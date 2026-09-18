import Image from "next/image";
import Link from "next/link";

import { SiteNav } from "@/components/site-nav";

const QUICK_FILTERS = ["Maternity", "Dental", "International", "Family", "Individual"];

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <section className="relative m-2 min-h-screen overflow-hidden rounded-large sm:m-3">
        <Image
          src="/images/hero.png"
          alt="A woman smiling in warm afternoon light"
          fill
          priority
          className="object-cover object-[70%_25%]"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(16,16,16,0.7) 0%, rgba(16,16,16,0.25) 42%, rgba(16,16,16,0) 68%)",
          }}
        />

        <div className="relative z-10 flex min-h-screen flex-col px-4 py-4 sm:px-6 sm:py-6">
          <header>
            <SiteNav variant="overlay" />
          </header>

          <div className="mx-auto mt-auto flex w-full max-w-5xl flex-col gap-8 pb-10 pt-10 sm:pb-16">
            <div className="max-w-2xl">
              <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-6xl lg:text-7xl">
                Find an HMO you actually understand.
              </h1>
              <p className="mt-5 max-w-lg text-lg text-white/85 sm:text-xl">
                Compare coverage, explore plans and hear directly from people
                who use them.
              </p>
            </div>

            <div className="flex flex-col gap-4 rounded-card border border-white/80 bg-white/72 p-3 shadow-[0_8px_30px_rgba(16,16,16,.06)] backdrop-blur-xl sm:flex-row sm:items-center sm:p-3">
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
                  placeholder="Search HMOs, plans or hospitals..."
                  className="w-full bg-transparent text-base text-ink-900 placeholder:text-ink-400 focus:outline-none"
                />
              </div>
              <button
                type="button"
                className="inline-flex h-12 items-center justify-center rounded-pill bg-ink-900 px-6 text-sm font-semibold text-white transition-colors hover:bg-ink-700"
              >
                Search
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {QUICK_FILTERS.map((filter) => (
                <span
                  key={filter}
                  className="rounded-pill bg-white/72 px-4 py-2 text-sm font-semibold text-secondary-green backdrop-blur-xl"
                >
                  {filter}
                </span>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <a
                href="#"
                className="inline-flex h-12 items-center rounded-pill border border-ink-900/15 bg-white px-6 text-sm font-semibold text-ink-900 transition-colors hover:bg-white/80"
              >
                Browse HMOs
              </a>
              <p className="text-sm font-medium text-white/85">
                50+ HMOs · Member experiences · Official coverage information
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
