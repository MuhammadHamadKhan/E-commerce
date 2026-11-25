// LISTING DETAIL PAGE: /listings/[id]
// Server shell: fetches the listing once for SEO metadata, then streams the
// interactive client page. Bake details are publicly viewable (no login).
import { Suspense } from "react";
import ListingContent from "./ListingContent";
import { getListing } from "@/lib/api/listings";

export const generateMetadata = async ({ params }) => {
  const { id } = await params;
  try {
    const res = await getListing(id);
    const listing = res.listing;
    return {
      title: `${listing.product_name} - ${listing.bakery_name} | Last Bite`,
      description: `${
        listing.description || "Fresh bake from "
      }${listing.bakery_name}. ${formatPrice(listing.discounted_price)}${
        listing.original_price ? ` (was ${formatPrice(listing.original_price)})` : ""
      }. Collect at the bakery.`,
    };
  } catch {
    return {
      title: "Bake Details - Last Bite",
    };
  }
};

export default async function ListingPage({ params }) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="py-xl">Loading bake details…</div>}>
      <ListingContent id={id} />
    </Suspense>
  );
}

function formatPrice(amount) {
  const n = Number(amount);
  return Number.isFinite(n) ? `Rs. ${n.toFixed(2)}` : "";
}
