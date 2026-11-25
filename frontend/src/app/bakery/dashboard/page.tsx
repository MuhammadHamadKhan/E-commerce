import Link from "next/link";

const QUICK_LINKS = [
  {
    href: "/bakery/products",
    title: "Manage products",
    description: "Keep your bakery's product catalogue up to date.",
    icon: (
      <>
        <path d="M4 7h16l-1.5 13h-13L4 7Z" />
        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
      </>
    ),
  },
  {
    href: "/bakery/listings",
    title: "Manage listings",
    description: "Publish and update your surplus offers.",
    icon: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18M9 9v11" />
      </>
    ),
  },
  {
    href: "/bakery/orders",
    title: "View orders",
    description: "Check customer orders and pickup details.",
    icon: (
      <>
        <path d="M6 3h12l2 4H4l2-4Z" />
        <path d="M4 7v13h16V7M9 12h6" />
      </>
    ),
  },
];

export default function Page() {
  return (
    <div className="space-y-8">
      <header className="flex flex-col gap-5 border-b border-outline-variant pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-label-sm text-on-surface-variant">YOUR BAKERY</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-on-surface">
            Bakery dashboard
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-on-surface-variant">
            Manage your products, daily listings, and customer orders from one place.
          </p>
        </div>
        <Link
          href="/bakery/listings/new"
          className="inline-flex min-h-10 items-center justify-center gap-2 self-start rounded-md bg-secondary px-4 text-sm font-semibold text-on-secondary transition-colors hover:bg-on-surface sm:self-auto"
        >
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            aria-hidden="true"
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          Create a listing
        </Link>
      </header>

      <section aria-labelledby="quick-links-heading">
        <div className="mb-4">
          <h2
            id="quick-links-heading"
            className="text-base font-semibold text-on-surface"
          >
            Manage your bakery
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">
            Jump straight to the tools you use most.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {QUICK_LINKS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group rounded-lg border border-outline-variant bg-surface p-5 transition-all hover:border-outline hover:shadow-card focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-surface-container-low text-on-surface-variant transition-colors group-hover:bg-surface-container group-hover:text-on-surface">
                <svg
                  className="h-5 w-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  {item.icon}
                </svg>
              </span>
              <h3 className="mt-4 text-sm font-semibold text-on-surface">
                {item.title}
              </h3>
              <p className="mt-1.5 text-sm leading-5 text-on-surface-variant">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
