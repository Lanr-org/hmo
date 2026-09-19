import { SiteNav } from "@/components/site-nav";
import { signIn } from "@/auth";

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const callbackUrl = typeof params.callbackUrl === "string" ? params.callbackUrl : "/hmos";

  return (
    <main className="flex flex-1 flex-col">
      <div className="px-2 pt-2 sm:px-3 sm:pt-3">
        <SiteNav variant="solid" />
      </div>

      <section className="mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-4 py-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">Sign in</h1>
        <p className="mt-2 text-sm text-ink-500">
          We&apos;ll email you a link to sign in — no password needed.
        </p>

        <form
          action={async (formData) => {
            "use server";
            await signIn("nodemailer", {
              email: formData.get("email"),
              redirectTo: callbackUrl,
            });
          }}
          className="mt-8 flex flex-col gap-3"
        >
          <label htmlFor="email" className="text-sm font-semibold text-ink-700">
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="you@example.com"
            className="h-12 rounded-pill border border-border bg-surface px-5 text-base text-ink-900 placeholder:text-ink-400 focus:border-secondary-green focus:outline-none"
          />
          <button
            type="submit"
            className="mt-2 inline-flex h-12 items-center justify-center rounded-pill bg-brand-green text-sm font-semibold text-ink-900 transition-colors hover:bg-brand-green-hover"
          >
            Send magic link
          </button>
        </form>
      </section>
    </main>
  );
}

export async function generateMetadata() {
  return { title: "Sign in — HMO" };
}
