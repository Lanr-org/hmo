import { SiteNav } from "@/components/site-nav";

export default function VerifyRequestPage() {
  return (
    <main className="flex flex-1 flex-col">
      <div className="px-2 pt-2 sm:px-3 sm:pt-3">
        <SiteNav variant="solid" />
      </div>

      <section className="mx-auto flex w-full max-w-md flex-1 flex-col items-center justify-center px-4 py-16 text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-ink-900">
          Check your email
        </h1>
        <p className="mt-3 text-base text-ink-500">
          We&apos;ve sent you a sign-in link. Click it to continue — you can
          close this tab.
        </p>
      </section>
    </main>
  );
}

export async function generateMetadata() {
  return { title: "Check your email — HMO" };
}
