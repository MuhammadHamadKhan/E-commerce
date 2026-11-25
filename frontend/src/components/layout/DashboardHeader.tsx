"use client";

// DashboardHeader: top bar of the bakery dashboard.
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleMobileMenu } from "@/store/slices/uiSlice";

export default function DashboardHeader() {
  const { user } = useAuth();
  const dispatch = useAppDispatch();
  const isMobileMenuOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);
  const initials = user?.name
    ?.split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-50 h-16 border-b border-outline-variant bg-surface shadow-header">
      <div className="flex h-full items-center justify-between px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={() => dispatch(toggleMobileMenu())}
            aria-label={isMobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={isMobileMenuOpen}
            aria-controls="bakery-sidebar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-outline-variant text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary lg:hidden"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {isMobileMenuOpen ? (
                <>
                  <path d="M6 18L18 6" />
                  <path d="M6 6l12 12" />
                </>
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

          <Link
            href="/bakery/dashboard"
            className="flex shrink-0 items-center gap-2.5 rounded-md text-on-surface transition-opacity hover:opacity-80"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-white">
              <svg
                className="h-4 w-4"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M18 10h-1.26A8 8 0 1 0 9 20h9a5 5 0 0 0 0-10z" />
              </svg>
            </span>
            <span className="font-display text-lg font-bold tracking-tight">Last Bite</span>
          </Link>
          <span className="hidden h-6 w-px bg-outline-variant sm:block" />
          <span className="hidden truncate text-sm font-medium text-on-surface-variant sm:block">
            Bakery workspace
          </span>
        </div>

        <Link
          href="/bakery/profile"
          aria-label={`Open profile for ${user?.name || "bakery owner"}`}
          className="flex items-center gap-2.5 rounded-md p-1.5 transition-colors hover:bg-surface-container-low focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
        >
          <span className="hidden text-right sm:block">
            <span className="block max-w-40 truncate text-sm font-semibold text-on-surface">
              {user?.name || "Bakery owner"}
            </span>
            <span className="block text-xs text-on-surface-variant">Store account</span>
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-container-high text-xs font-semibold text-on-surface">
            {initials || "BO"}
          </span>
        </Link>
      </div>
    </header>
  );
}
