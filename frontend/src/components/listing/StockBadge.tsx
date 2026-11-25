// StockBadge: shows quantity remaining ("3 left"), turning
// golden amber with an alert pulse when stock is running low.
export default function StockBadge({ quantityLeft }: { quantityLeft: number }) {
  const urgent = quantityLeft <= 3;
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-label-sm font-semibold shadow-sm backdrop-blur-xs transition-colors ${
        urgent
          ? "bg-amber-500/90 text-primary-container ring-1 ring-amber-400"
          : "bg-primary-container/85 text-on-primary ring-1 ring-white/10"
      }`}
    >
      {urgent ? (
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-900 opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-900" />
        </span>
      ) : (
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
      )}
      <span>
        {quantityLeft} {quantityLeft === 1 ? "left" : "left"}
      </span>
    </span>
  );
}
