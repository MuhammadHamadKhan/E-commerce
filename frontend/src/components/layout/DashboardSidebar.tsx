"use client";

// DashboardSidebar: navigation for the bakery owner area.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { closeMobileMenu } from "@/store/slices/uiSlice";
import { useAuth } from "@/hooks/useAuth";

const NAV_LINKS = [
  { href: "/bakery/dashboard", label: "Overview" },
  { href: "/bakery/products", label: "Products" },
  { href: "/bakery/listings", label: "Listings" },
  { href: "/bakery/orders", label: "Orders" },
  { href: "/bakery/pickup", label: "Pickup Code" },
  { href: "/bakery/profile", label: "Profile" },
];

export default function DashboardSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { logout } = useAuth();
  const isMobileMenuOpen = useAppSelector((state) => state.ui.isMobileMenuOpen);

  return (
    <>
      {isMobileMenuOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => dispatch(closeMobileMenu())}
          className="fixed inset-x-0 bottom-0 top-16 z-30 bg-black/20 lg:hidden"
        />
      )}
      <aside
        id="bakery-sidebar"
        className={`fixed bottom-0 left-0 top-16 z-40 w-64 border-r border-outline-variant bg-surface transition-transform duration-200 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)] lg:translate-x-0 ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          <div className="px-5 pb-3 pt-6">
            <p className="text-label-sm text-on-surface-variant">WORKSPACE</p>
          </div>

          <nav className="flex-1 space-y-1 px-3" aria-label="Bakery workspace">
            {NAV_LINKS.map((link) => {
              const isActive =
                pathname === link.href ||
                (link.href !== "/bakery/dashboard" &&
                  pathname.startsWith(`${link.href}/`));

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={isActive ? "page" : undefined}
                  onClick={() => dispatch(closeMobileMenu())}
                  className={`flex items-center gap-3 rounded-md border-l-2 px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "border-secondary bg-surface-container-low font-semibold text-on-surface"
                      : "border-transparent text-on-surface-variant hover:bg-surface-container-low hover:text-on-surface"
                  }`}
                >
                  <svg
                    className="h-[18px] w-[18px] shrink-0"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    {link.label === "Overview" && (
                      <>
                        <rect x="3" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="3" width="7" height="7" rx="1" />
                        <rect x="14" y="14" width="7" height="7" rx="1" />
                        <rect x="3" y="14" width="7" height="7" rx="1" />
                      </>
                    )}
                    {link.label === "Products" && (
                      <>
                        <path d="M4 7h16l-1.5 13h-13L4 7Z" />
                        <path d="M9 9V6a3 3 0 0 1 6 0v3" />
                      </>
                    )}
                    {link.label === "Listings" && (
                      <>
                        <rect x="3" y="4" width="18" height="16" rx="2" />
                        <path d="M3 9h18M9 9v11" />
                      </>
                    )}
                    {link.label === "Orders" && (
                      <>
                        <path d="M6 3h12l2 4H4l2-4Z" />
                        <path d="M4 7v13h16V7M9 12h6" />
                      </>
                    )}
                    {link.label === "Pickup Code" && (
                      <>
                        <rect x="3" y="3" width="18" height="18" rx="2" />
                        <path d="M7 7h3v3H7zM14 7h3M14 10h3M7 14h3M7 17h3M14 14h3v3h-3z" />
                      </>
                    )}
                    {link.label === "Profile" && (
                      <>
                        <circle cx="12" cy="8" r="4" />
                        <path d="M4 21a8 8 0 0 1 16 0" />
                      </>
                    )}
                  </svg>
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-outline-variant p-3">
            <button
              type="button"
              onClick={logout}
              className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-sm text-on-surface-variant transition-colors hover:bg-surface-container-low hover:text-on-surface focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
            >
              <svg
                className="h-[18px] w-[18px]"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M10 17l5-5-5-5M15 12H3" />
                <path d="M12 3h6a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-6" />
              </svg>
              Sign out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
