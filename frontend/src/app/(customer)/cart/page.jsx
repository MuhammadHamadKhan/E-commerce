// CART PAGE: /cart
// Server shell: exports SEO metadata (noIndex) and streams the client cart.
// The interactive cart logic lives in CartContent.jsx ("use client").
import { Suspense } from "react";
import CartContent from "./CartContent";

export const metadata = {
  title: "Your cart - Last Bite",
  noIndex: true, // private customer page
};

export default function CartPage() {
  return (
    <Suspense fallback={<div className="py-xl">Loading your cart…</div>}>
      <CartContent />
    </Suspense>
  );
}
