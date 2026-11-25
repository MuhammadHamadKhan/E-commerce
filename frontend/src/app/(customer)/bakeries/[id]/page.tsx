"use client";
// Bakery Details page: one bakery plus its active listings.
import { useParams } from "next/navigation";
import { useBakery } from "@/hooks/queries/useBakery";
import ListingGrid from "@/components/listing/ListingGrid";
import type { Bakery } from "@/lib/api/types";
import Container from "@/components/ui/Container";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Link from "next/link";

export default function BakeryDetailsPage() {
  const params = useParams();
  const id = Number(params.id);
  const { data, isPending, isError, error } = useBakery(id);

  const bakery: Bakery | undefined = data?.bakery;
  const activeListings = data?.active_listings ?? [];

  if (isPending && !bakery) {
    return (
      <Container className="py-lg">
        <div className="py-xl text-center">
          <p className="text-body-sm text-on-surface-variant">Loading bakery…</p>
        </div>
      </Container>
    );
  }

  if (isError || !bakery) {
    return (
      <Container className="py-lg">
        <ErrorMessage message={error ? String(error) : "Bakery not found"} />
      </Container>
    );
  }

  return (
    <Container className="py-lg">
      <Link
        href="/bakeries"
        className="inline-flex items-center gap-1 text-body-sm text-on-surface-variant hover:text-secondary mb-4"
      >
        ← All bakeries
      </Link>

      <section className="rounded-card border border-outline-variant/60 bg-surface-container-lowest shadow-card overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-outline-variant/40">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h1 className="font-display font-semibold text-on-surface text-2xl sm:text-3xl">
                {bakery.name}
              </h1>
              <p className="text-body-sm text-on-surface-variant mt-1">
                {bakery.city} · {bakery.address}
              </p>
              <p className="text-body-sm text-on-surface mt-2">
                {bakery.phone || "No phone listed"}
              </p>
            </div>
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <h2 className="font-display font-semibold text-on-surface text-lg sm:text-xl mb-4">
            Available now ({activeListings.length})
          </h2>
          {activeListings.length > 0 ? (
            <ListingGrid
              listings={activeListings}
              action="reserve"
              loading={false}
              skeletonCount={0}
            />
          ) : (
            <div className="rounded-card border border-outline-variant/50 bg-surface-container-low p-6 text-center">
              <p className="text-body-sm text-on-surface-variant">
                No active deals right now. Check back later.
              </p>
            </div>
          )}
        </div>
      </section>
    </Container>
  );
}
