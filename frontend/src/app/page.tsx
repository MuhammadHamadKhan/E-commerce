// HOME page: /  - browse active listings.
// The interactive parts live in HomeContent (client component);
// this wrapper keeps the page server-rendered so it can export
// SEO metadata, and streams the client part inside Suspense.
import type { Metadata } from "next";
import { Suspense } from "react";
import HomeContent from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "Last Bite - Fresh bakes, saved from waste",
  description:
    "Every evening, neighborhood artisan bakeries sell their unsold sourdoughs, viennoiseries, and tarts at 40-60% off. Rescue fresh bakes before closing time.",
};

export default function HomePage() {
  return (
    // Suspense: the content reads the web address (useSearchParams),
    // which needs a streaming boundary while the page is prerendered.
    <Suspense fallback={<HomePageSkeleton />}>
      <HomeContent />
    </Suspense>
  );
}

// Simple full-page skeleton shown while the streamed content loads.
function HomePageSkeleton() {
  return (
    <div className="py-lg" aria-hidden="true">
      <div className="h-80 animate-pulse rounded-xl bg-surface-container-low" />
      <div className="mt-lg h-10 w-2/3 animate-pulse rounded-full bg-surface-container-low" />
      <div className="mt-lg grid grid-cols-1 gap-md sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }, (_, index) => (
          <div key={index} className="h-72 animate-pulse rounded-xl bg-surface-container-low" />
        ))}
      </div>
    </div>
  );
}
