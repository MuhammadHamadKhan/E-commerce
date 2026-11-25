"use client";

// ListingsTable: responsive list of the bakery's discount listings.
// Tablet+ shows a data table; mobile shows stacked listing cards.
// Includes a status filter and per-listing delete/edit actions.
import { useState } from "react";
import { useMyListings } from "@/hooks/queries/useMyListings";
import { useDeleteListing } from "@/hooks/mutations/useDeleteListing";
import Button from "@/components/ui/Button";
import Select from "@/components/ui/Select";
import Spinner from "@/components/ui/Spinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import type { MyListing } from "@/lib/api/types";

type ListingsTableProps = {
  onEdit?: (listing: MyListing) => void;
};

export default function ListingsTable({ onEdit }: ListingsTableProps = {}) {
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "expired" | "soldout">("all");
  const deleteListing = useDeleteListing();

  const { data, isPending, isFetching, error } = useMyListings(
    statusFilter === "all" ? undefined : statusFilter
  );

  const listings: MyListing[] = data?.listings ?? [];

  const handleDelete = (id: number) => {
    if (!window.confirm("Delete this listing?")) return;
    deleteListing.mutate(id);
  };

  if (isPending || isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Spinner size="lg" />
        <p className="mt-3 text-body-sm text-on-surface-variant">Loading listings…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <ErrorMessage message={error.message || "Failed to load listings."} />
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-body text-on-surface-variant">
          No listings{statusFilter !== "all" ? ` with status “${statusFilter}”` : ""} yet.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-headline font-semibold text-on-surface">Listings</h1>
          <p className="text-body-sm text-on-surface-variant">
            Your active surplus deals shown to customers.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-label font-medium text-on-surface-variant">
              Filter by status
            </label>
            <Select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.currentTarget.value as "all" | "active" | "expired" | "soldout")
              }
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="expired">Expired</option>
              <option value="soldout">Sold out</option>
            </Select>
          </div>
        </div>
      </div>

      {/* Desktop: data table */}
      <div className="hidden lg:block">
        <div className="rounded-xl border border-outline-variant bg-surface shadow-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-label font-medium text-on-surface-variant">
                  Listing
                </th>
                <th className="px-6 py-4 text-label font-medium text-on-surface-variant">
                  Product
                </th>
                <th className="px-6 py-4 text-label font-medium text-on-surface-variant text-right w-24">
                  Original
                </th>
                <th className="px-6 py-4 text-label font-medium text-on-surface-variant text-right w-24">
                  Discounted
                </th>
                <th className="px-6 py-4 text-label font-medium text-on-surface-variant text-right w-20">
                  Left
                </th>
                <th className="px-6 py-4 text-label font-medium text-on-surface-variant text-center w-20">
                  Status
                </th>
                <th className="px-6 py-4 text-label font-medium text-on-surface-variant text-right w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {listings.map((listing) => (
                <tr
                  key={listing.id}
                  className="hover:bg-surface-container-low transition-colors"
                >
                  <td className="px-6 py-4 text-body text-on-surface">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-on-surface">#{listing.id}</span>
                    </div>
                    <p className="mt-1 text-body-sm text-on-surface-variant">
                      {listing.available_from} → {listing.expires_at}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-body text-on-surface">
                    {listing.product_name}
                  </td>
                  <td className="px-6 py-4 text-body font-medium text-on-surface text-right">
                    ₹{listing.original_price}
                  </td>
                  <td className="px-6 py-4 text-body font-medium text-on-surface text-right">
                    ₹{listing.discounted_price}
                  </td>
                  <td className="px-6 py-4 text-body font-medium text-on-surface text-right">
                    {listing.quantity_left}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-label-sm font-semibold ${
                        getStatusBadgeClass(listing)
                      }`}
                    >
                      {listing.quantity_left === 0 ? "Sold out" : "Active"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(listing)}
                          className="text-secondary hover:text-on-surface"
                        >
                          Edit
                        </Button>
                      ) : null}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(listing.id)}
                        className="text-error-container hover:bg-error-container/50 hover:text-error"
                        disabled={deleteListing.isPending}
                      >
                        Delete
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile: stacked listing cards */}
      <div className="lg:hidden space-y-4">
        {listings.map((listing) => (
          <div
            key={listing.id}
            className="rounded-xl border border-outline-variant bg-surface p-4 shadow-card"
          >
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-body font-medium text-on-surface leading-tight">
                  #{listing.id} — {listing.product_name}
                </p>
                <span className="text-body-sm text-on-surface-variant">
                  {listing.available_from} → {listing.expires_at}
                </span>
              </div>
              <span
                className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-label-sm font-semibold ${
                  getStatusBadgeClass(listing)
                }`}
              >
                {listing.quantity_left === 0 ? "Sold out" : "Active"}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-surface-container-low rounded-lg p-3">
                <p className="text-label text-on-surface-variant">Original price</p>
                <p className="text-body font-medium text-on-surface">
                  ₹{listing.original_price}
                </p>
              </div>
              <div className="bg-surface-container-low rounded-lg p-3">
                <p className="text-label text-on-surface-variant">Discounted price</p>
                <p className="text-body font-medium text-on-surface">
                  ₹{listing.discounted_price}
                </p>
              </div>
              <div className="bg-surface-container-low rounded-lg p-3">
                <p className="text-label text-on-surface-variant">Discount</p>
                <p className="text-body font-medium text-on-surface">
                  {listing.discount_percent}%
                </p>
              </div>
              <div className="bg-surface-container-low rounded-lg p-3">
                <p className="text-label text-on-surface-variant">Quantity left</p>
                <p className="text-body font-medium text-on-surface">
                  {listing.quantity_left}
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2">
              {onEdit ? (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(listing)}
                  className="text-secondary hover:text-on-surface flex-1"
                >
                  Edit
                </Button>
              ) : null}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleDelete(listing.id)}
                className="text-error-container hover:bg-error-container/50 hover:text-error flex-1"
                disabled={deleteListing.isPending}
              >
                Delete
              </Button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function getStatusBadgeClass(listing: MyListing): string {
  if (listing.quantity_left === 0) {
    return "bg-surface-container-low text-on-surface border border-outline-variant";
  }
  return "bg-success text-on-success";
}
