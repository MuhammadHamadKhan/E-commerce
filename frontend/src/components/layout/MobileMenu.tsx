"use client";
// MobileMenu: slide-down navigation drawer for mobile devices.
import Link from "next/link";
import { useAppDispatch } from "@/store/hooks";
import { toggleMobileMenu } from "@/store/slices/uiSlice";
import { useAuth } from "@/hooks/useAuth";
import Container from "@/components/ui/Container";

type NavLink = { href: string; label: string };

export default function MobileMenu({ open, links }: { open: boolean; links: NavLink[] }) {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAuth();
  const close = () => dispatch(toggleMobileMenu());

  if (!open) return null;

  return (
    <div id="mobile-menu" className="border-t border-outline-variant/60 bg-surface md:hidden">
      <Container as="nav" aria-label="Mobile Navigation" className="flex flex-col gap-1 py-4">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            onClick={close}
            className="flex min-h-[44px] items-center rounded-lg px-4 text-body font-medium text-on-surface hover:bg-surface-container-low"
          >
            {link.label}
          </Link>
        ))}

        <div className="my-2 border-t border-outline-variant/50" />

        {isLoggedIn ? (
          <Link
            href="/bakery/dashboard"
            onClick={close}
            className="flex min-h-[44px] items-center justify-center rounded-full bg-surface-container-low border border-outline-variant px-4 text-label font-semibold text-primary-container"
          >
            Bakery Dashboard
          </Link>
        ) : (
          <div className="flex flex-col gap-2">
            <Link
              href="/bakery/register"
              onClick={close}
              className="flex min-h-[44px] items-center justify-center rounded-full bg-secondary px-4 text-label font-bold text-white shadow-sm"
            >
              Are you a bakery? Sell with us
            </Link>
            <Link
              href="/bakery/login"
              onClick={close}
              className="flex min-h-[44px] items-center justify-center rounded-full border border-outline-variant px-4 text-label font-semibold text-on-surface"
            >
              Bakery Login
            </Link>
          </div>
        )}
      </Container>
    </div>
  );
}
