"use client";
// CountdownTimer: live "Ends in 1h 20m" counter using useCountdown.
// Displays an SVG clock and shifts to urgent amber/tomato styling when under 1 hour remains.
import { useCountdown } from "@/hooks/useCountdown";
import { formatTimeLeft } from "@/utils/formatDate";

export default function CountdownTimer({
  expiresAt,
  showIcon = true,
}: {
  expiresAt: string;
  showIcon?: boolean;
}) {
  const { msLeft, ended } = useCountdown(expiresAt);
  const urgent = !ended && msLeft < 3_600_000; // under 1 hour

  if (ended) {
    return (
      <span className="inline-flex items-center gap-1 text-label-sm font-semibold text-on-surface-variant">
        Ended tonight
      </span>
    );
  }

  const timeLeft = formatTimeLeft(msLeft);

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-label-sm font-semibold transition-colors ${
        urgent ? "text-discount font-bold" : "text-on-surface-variant"
      }`}
    >
      {showIcon && (
        <svg
          className={`h-3.5 w-3.5 shrink-0 ${urgent ? "text-discount animate-pulse" : "text-on-surface-variant/80"}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2.2"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      )}
      <span>{urgent ? `Ends in ${timeLeft}` : `Ends in ${timeLeft}`}</span>
    </span>
  );
}
