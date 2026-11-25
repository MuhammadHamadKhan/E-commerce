"use client";
// CartIcon: navbar cart button with a live item count. Clicking always
// opens/closes the slide-over cart drawer, whether the cart is empty or not.
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setCartDrawer } from "@/store/slices/uiSlice";
import { selectCartItemCount } from "@/store/slices/cartSlice";
import CartDrawer from "./CartDrawer";

export default function CartIcon() {
  const dispatch = useAppDispatch();
  const itemCount = useAppSelector(selectCartItemCount);
  const isDrawerOpen = useAppSelector((state) => state.ui.isCartDrawerOpen);

  // Always toggle the drawer — even when the cart is empty so the
  // customer sees the empty-state message inside the drawer.
  const toggleDrawer = () => {
    dispatch(setCartDrawer(!isDrawerOpen));
  };

  return (
    <>
      <button
        type="button"
        onClick={toggleDrawer}
        aria-label={`Cart, ${itemCount} ${itemCount === 1 ? "item" : "items"}`}
        aria-expanded={isDrawerOpen}
        className="relative flex h-11 w-11 items-center justify-center rounded-full bg-primary-container text-on-primary transition-colors hover:bg-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary active:scale-95"
      >
        <svg
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
          />
        </svg>
        {itemCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-secondary px-1 text-[11px] font-bold tabular-nums text-white ring-2 ring-surface">
            {itemCount > 99 ? "99+" : itemCount}
          </span>
        )}
      </button>
      {isDrawerOpen && <CartDrawer onClose={() => dispatch(setCartDrawer(false))} />}
    </>
  );
}
