// CHECKOUT PAGE: /checkout
// Server shell: exports SEO metadata (noIndex) and streams the client checkout.
// The interactive checkout logic lives in CheckoutContent.jsx ("use client").
import { Suspense } from "react";
import CheckoutContent from "./CheckoutContent";

export const metadata = {
  title: "Checkout - Last Bite",
  noIndex: true, // private customer page
};

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="py-xl">Loading checkout…</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
