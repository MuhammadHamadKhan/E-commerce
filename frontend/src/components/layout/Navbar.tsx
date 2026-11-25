"use client";
// Navbar: sticky artisanal top bar with brand badge, location pill,
// clean SVG icons, desktop navigation, and a live Redux cart badge.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleMobileMenu } from "@/store/slices/uiSlice";
import { useAuth } from "@/hooks/useAuth";
import MobileMenu from "./MobileMenu";
import CartIcon from "@/components/cart/CartIcon";
import Container from "@/components/ui/Container";

const NAV_LINKS = [
  { href: "/", label: "Ending Soon" },
  { href: "/browse", label: "Browse" },
  { href: "/listings", label: "All Deals" },
  { href: "/bakeries", label: "Peshawar Bakeries" },
  { href: "/track-order", label: "Track Order" },
  { href: "/#how-it-works", label: "How It Works" },
];

export default function Navbar() {
  const dispatch = useAppDispatch();
  const isMobileMenuOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);
  const { isLoggedIn } = useAuth();
  const pathname = usePathname();

  // Don't render the customer-facing navbar inside the bakery owner area.
  if (pathname.startsWith("/bakery")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-outline-variant/50 bg-surface/90 backdrop-blur-md supports-[backdrop-filter]:bg-surface/80">
      <Container>
        <nav aria-label="Main" className="flex h-16 w-full items-center gap-3 lg:h-18 lg:gap-6">
        {/* Brand: icon + name on one line, nothing tiny or uppercase */}
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5 rounded-lg font-display text-xl font-bold tracking-tight text-primary-container transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-secondary"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-white">
            <svg
              className="h-5 w-5"
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
          <span className="leading-none">Last Bite</span>
        </Link>

        {/* Desktop links: centered, active page gets an underline instead of a filled pill */}
        <div className="hidden min-w-0 flex-1 items-center justify-center gap-1 md:flex">
          {NAV_LINKS.map((link) => {
            const isActive =
              pathname === link.href ||
              (link.href !== "/" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isActive ? "page" : undefined}
                className={`relative inline-flex min-h-[44px] items-center whitespace-nowrap rounded-lg px-3 text-label font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary lg:px-4 ${
                  isActive
                    ? "text-on-surface"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                {link.label}
                <span
                  aria-hidden="true"
                  className={`absolute inset-x-3 bottom-1.5 h-0.5 rounded-full bg-secondary transition-opacity lg:inset-x-4 ${
                    isActive ? "opacity-100" : "opacity-0"
                  }`}
                />
              </Link>
            );
          })}
        </div>

        {/* Right side: pushed to the end on phones, where the links are hidden */}
        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {isLoggedIn ? (
            <Link
              href="/bakery/dashboard"
              className="hidden min-h-[44px] items-center whitespace-nowrap rounded-full border border-outline-variant px-4 text-label font-semibold text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary md:inline-flex"
            >
              Bakery dashboard
            </Link>
          ) : (
            <Link
              href="/bakery/register"
              className="hidden min-h-[44px] items-center whitespace-nowrap rounded-full border border-outline-variant px-4 text-label font-semibold text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary md:inline-flex"
            >
              Sell with us
            </Link>
          )}

          {/* Cart: live item count + slide-over drawer when there are items */}
          <CartIcon />

          {/* Mobile menu button */}
          <button
            type="button"
            onClick={() => dispatch(toggleMobileMenu())}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-menu"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-outline-variant text-on-surface transition-colors hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary md:hidden"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </nav>
      </Container>

      <MobileMenu open={isMobileMenuOpen} links={NAV_LINKS} />
    </header>
  );
}
