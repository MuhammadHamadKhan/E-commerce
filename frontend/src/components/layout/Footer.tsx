// Footer: tidy bakery market footer with local Peshawar identity
// and clear "Are you a bakery? Sell with us" call to action.
import Link from "next/link";
import Container from "@/components/ui/Container";

const COLUMNS = [
  {
    title: "Discover Deals",
    links: [
      { href: "/listings", label: "All Active Deals" },
      { href: "/bakeries", label: "Peshawar Bakeries" },
      { href: "/track-order", label: "Track Your Pickup" },
    ],
  },
  {
    title: "Bakery Partners",
    links: [
      { href: "/bakery/register", label: "Register Your Bakery" },
      { href: "/bakery/login", label: "Bakery Portal Login" },
      { href: "/#how-it-works", label: "How Surplus Works" },
    ],
  },
  {
    title: "Neighborhoods",
    links: [
      { href: "/listings?search=University+Town", label: "University Town" },
      { href: "/listings?search=Saddar", label: "Saddar & Cantt" },
      { href: "/listings?search=Hayatabad", label: "Hayatabad" },
      { href: "/listings?search=Warsak+Road", label: "Warsak Road" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="mt-xl border-t border-outline-variant/60 bg-surface-container-low">
      <Container className="py-xl">
        {/* Bakery partner banner call-to-action */}
        <div className="mb-xl flex flex-col items-start justify-between gap-4 rounded-xl border border-secondary/20 bg-secondary-container p-6 sm:flex-row sm:items-center">
          <div>
            <span className="text-label uppercase tracking-wider text-secondary font-bold">
              Bakery Owners in Peshawar
            </span>
            <h3 className="font-display text-xl font-bold text-on-surface sm:text-2xl">
              Turn your end-of-day surplus into recovered revenue.
            </h3>
            <p className="mt-1 text-body-sm text-on-surface-variant">
              Zero upfront fees. Control what and how much you sell each afternoon.
            </p>
          </div>
          <Link
            href="/bakery/register"
            className="inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full bg-secondary px-6 text-label font-bold text-white shadow-sm transition-transform hover:scale-105 active:scale-95"
          >
            Sell with us →
          </Link>
        </div>

        <div className="grid gap-lg sm:grid-cols-2 lg:grid-cols-5">
          {/* Brand info */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 font-display text-xl font-bold text-primary-container">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-white">
                <svg
                  className="h-4 w-4"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
                </svg>
              </span>
              Last Bite
            </Link>
            <p className="mt-3 max-w-[24rem] text-body-sm text-on-surface-variant">
              Every evening, Peshawar&apos;s neighborhood bakeries list their unsold
              craft breads, cakes, and pastries at 40% to 60% off. You reserve, pick
              up at the counter, and prevent good food from going to waste.
            </p>
            <p className="mt-4 text-label text-secondary font-semibold">
              Proudly supporting local bakes in Peshawar, Pakistan
            </p>
          </div>

          {/* Link columns */}
          {COLUMNS.map((column) => (
            <div key={column.title}>
              <p className="text-label uppercase tracking-wider text-on-surface font-bold">{column.title}</p>
              <ul className="mt-3 space-y-2">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-body-sm text-on-surface-variant transition-colors hover:text-secondary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom copyright line */}
        <div className="mt-xl flex flex-col gap-2 border-t border-outline-variant/50 pt-md text-body-sm text-on-surface-variant sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Last Bite Peshawar. Fresh taste, less food waste.</p>
          <p className="text-xs">Collect &amp; pay directly at local bakeries.</p>
        </div>
      </Container>
    </footer>
  );
}
