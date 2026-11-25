"use client";

// Bakery Listings page: list all discount listings + add/edit via modal.
import { useState } from "react";
import ListingsTable from "@/components/dashboard/ListingsTable";
import ListingForm from "@/components/dashboard/ListingForm";
import Button from "@/components/ui/Button";
import type { MyListing } from "@/lib/api/types";

export default function Page() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<MyListing | null>(null);

  return (
    <section className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-headline font-semibold text-on-surface">Listings</h1>
          <p className="text-body-sm text-on-surface-variant">
            Your active surplus deals shown to customers.
          </p>
        </div>
        <Button
          onClick={() => {
            setEditingListing(null);
            setFormOpen(true);
          }}
        >
          + Add Listing
        </Button>
      </div>

      <ListingsTable
        onEdit={(listing) => {
          setEditingListing(listing);
          setFormOpen(true);
        }}
      />

      <ListingForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={() => setFormOpen(false)}
        listingToEdit={
          editingListing
            ? {
                id: editingListing.id,
                product_id: editingListing.product_id,
                discounted_price: Number(editingListing.discounted_price) || 0,
                quantity_left: editingListing.quantity_left,
                available_from: editingListing.available_from ?? undefined,
                expires_at: editingListing.expires_at,
              }
            : undefined
        }
      />
    </section>
  );
}
