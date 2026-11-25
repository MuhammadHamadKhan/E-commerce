// TRACK ORDER PAGE: /track-order
// Server shell: exports SEO metadata (noIndex) and streams the client track
// order page. The interactive logic lives in TrackContent.jsx ("use client").
import { Suspense } from "react";
import TrackContent from "./TrackContent";

export const metadata = {
  title: "Track your order - Last Bite",
  noIndex: true, // private customer page
};

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<div className="py-xl">Loading&hellip;</div>}>
      <TrackContent />
    </Suspense>
  );
}
