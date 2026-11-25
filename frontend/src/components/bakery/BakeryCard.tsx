"use client";
// BakeryCard: one bakery preview card shown on the /bakeries listing page.
import Link from "next/link";
import type { Bakery } from "@/lib/api/types";

type BakeryCardProps = {
  bakery: Bakery;
};

export default function BakeryCard({ bakery }: BakeryCardProps) {
  return (
    <section
      className="rounded-card border border-outline-variant/50 bg-surface-container-lowest p-5"
    >
      <Link
        href={`/bakeries/${bakery.id}`}
        className="font-display font-semibold text-on-surface text-lg hover:text-secondary transition-colors mb-1 block"
      >
        {bakery.name}
      </Link>
      <p className="text-body-sm text-on-surface-variant mb-2">
        {bakery.city} · {bakery.address}
      </p>
      <p className="text-body-sm text-on-surface mb-3">
        {bakery.phone || "No phone listed"}
      </p>
      <Link
        href={`/bakeries/${bakery.id}`}
        className="min-h-[40px] items-center justify-center rounded-full border border-outline-variant bg-transparent px-4 py-1.5 text-body-sm font-semibold text-on-surface hover:bg-secondary hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary transition-colors inline-flex gap-1"
      >
        View bakery
      </Link>
    </section>
  );
}
