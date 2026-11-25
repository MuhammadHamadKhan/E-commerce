"use client";
// Skeleton: grey placeholder block shown while content loads.
// Pass extra classes for width/height, e.g. <Skeleton className="h-4 w-40" />.
export default function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-md bg-surface-container-high ${className}`}
    />
  );
}
