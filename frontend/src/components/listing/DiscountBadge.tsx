// DiscountBadge: sticker-style tilted discount badge (-40%),
// placed over the product photo with an authentic paper sticker feel.
export default function DiscountBadge({ percent }: { percent: string | number }) {
  const discountVal = Math.round(Number(percent));
  return (
    <span className="inline-flex -rotate-2 items-center rounded-full bg-discount px-2.5 py-1 text-label-sm font-bold text-on-discount shadow-sticker ring-1 ring-white/20 transition-transform group-hover:scale-105">
      -{discountVal}% OFF
    </span>
  );
}
