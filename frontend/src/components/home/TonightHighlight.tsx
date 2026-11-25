"use client";
// Tonight highlight card: the featured bake shown in the hero image area.
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import CountdownTimer from "@/components/listing/CountdownTimer";
import { formatPrice } from "@/utils/formatPrice";
import type { Listing } from "@/lib/api/types";

export default function TonightHighlight({ listing }: { listing: Listing }) {
  const [imageSrc, setImageSrc] = useState(listing.image_url || "/images/placeholder-product.svg");

  return (
    <div className="relative h-full min-h-[14rem] w-full overflow-hidden bg-surface-container-high lg:min-h-0">
      <Image
        src={imageSrc}
        alt={listing.product_name}
        fill
        priority
        sizes="(max-width: 1024px) 100vw, 50vw"
        className="object-cover"
        onError={() => setImageSrc("/images/placeholder-product.svg")}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-black/20" />
      <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 p-4 sm:p-6">
        <span className="text-label font-semibold uppercase tracking-wider text-white">
          {Math.round(Number(listing.discount_percent))}% off tonight
        </span>
        <span className="rounded-full bg-black/55 px-3 py-1.5 text-label-sm font-semibold text-white">
          <CountdownTimer expiresAt={listing.expires_at} />
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-5 text-white sm:p-8">
        <div>
          <h2 className="font-display text-2xl font-semibold sm:text-3xl">
            {listing.product_name}
          </h2>
          <p className="mt-1 text-body-sm text-white/85">
            {listing.bakery_name} · {listing.city}
          </p>
        </div>
        <div className="flex items-end justify-between gap-4 border-t border-white/30 pt-3">
          <p className="text-body-sm">
            <span className="mr-2 text-xl font-semibold">{formatPrice(listing.discounted_price)}</span>
            <span className="text-white/70 line-through">{formatPrice(listing.original_price)}</span>
          </p>
          <Link
            href={`/listings/${listing.id}`}
            className="inline-flex min-h-[44px] items-center rounded-full bg-white px-5 text-label font-semibold text-on-surface transition-colors hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            View bake
          </Link>
        </div>
      </div>
    </div>
  );
}
