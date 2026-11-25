"use client";

// ListingForm: create or edit a discount listing for one of the bakery's products.
// Discounted price, quantity, and start/end times go here — the product itself
// (name, original price, image) lives in the Products route.
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useCreateListing } from "@/hooks/mutations/useCreateListing";
import { useUpdateListing } from "@/hooks/mutations/useUpdateListing";
import { useMyProducts } from "@/hooks/queries/useMyProducts";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import ErrorMessage from "@/components/ui/ErrorMessage";
import type { ListingInput } from "@/lib/api/bakeryListings";

type ListingFormProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  listingToEdit?: {
    id: number;
    product_id: number;
    discounted_price: number;
    quantity_left: number;
    available_from?: string | null;
    expires_at?: string | null;
  };
};

const INITIAL_FORM: ListingInput = {
  product_id: 0,
  discounted_price: 0,
  quantity_left: 0,
  expires_at: "",
};

export default function ListingForm({
  open,
  onClose,
  onSuccess,
  listingToEdit,
}: ListingFormProps) {
  const createListing = useCreateListing();
  const updateListing = useUpdateListing();
  const { data: products } = useMyProducts();

  const isEdit = !!listingToEdit;

  const [form, setForm] = useState<ListingInput>(() => {
    if (listingToEdit) {
      return {
        product_id: listingToEdit.product_id,
        discounted_price: Number(listingToEdit.discounted_price) || 0,
        quantity_left: listingToEdit.quantity_left,
        available_from: listingToEdit.available_from ?? undefined,
        expires_at: listingToEdit.expires_at ?? "",
      };
    }
    return { ...INITIAL_FORM };
  });

  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = event.currentTarget;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSubmitting(true);

    const payload: ListingInput = {
      product_id: Number(form.product_id),
      discounted_price: Number(form.discounted_price) || 0,
      quantity_left: Number(form.quantity_left) || 0,
      expires_at: form.expires_at,
      ...(form.available_from ? { available_from: form.available_from } : {}),
    };

    const promise = isEdit && listingToEdit
      ? updateListing.mutateAsync({ id: listingToEdit.id, data: payload })
      : createListing.mutateAsync(payload);

    promise
      .then(() => {
        setSubmitting(false);
        onClose();
        onSuccess?.();
      })
      .catch((err: Error) => {
        setSubmitting(false);
        setFormError(err.message || "Failed to save listing. Please try again.");
      });
  }

  if (!open) return null;

  const productOptions = (products?.products ?? []).map((p) => ({
    value: String(p.id),
    label: p.name,
  }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Edit listing" : "Add listing"}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Panel */}
      <div
        className="relative w-full max-w-full mx-4 lg:mx-0 lg:max-w-2xl bg-surface rounded-xl border border-outline-variant shadow-overlay p-4 lg:p-8 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-headline font-semibold text-on-surface">
            {isEdit ? "Edit Listing" : "Add New Listing"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-label font-medium" htmlFor="listing-product">
              Product
            </label>
            <Select
              id="listing-product"
              name="product_id"
              onChange={handleChange}
              required
              value={form.product_id ? String(form.product_id) : ""}
            >
              <option value="">Select a product</option>
              {productOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="mb-1.5 block text-label font-medium" htmlFor="listing-discounted-price">
              Discounted price (₹)
            </label>
            <Input
              id="listing-discounted-price"
              name="discounted_price"
              onChange={handleChange}
              placeholder="0"
              required
              type="number"
              value={form.discounted_price}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-label font-medium" htmlFor="listing-quantity">
              Quantity left
            </label>
            <Input
              id="listing-quantity"
              name="quantity_left"
              onChange={handleChange}
              placeholder="0"
              required
              type="number"
              value={form.quantity_left}
            />
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-label font-medium" htmlFor="listing-available-from">
                Available from
              </label>
              <Input
                id="listing-available-from"
                name="available_from"
                onChange={handleChange}
                type="datetime-local"
                value={form.available_from ?? ""}
              />
            </div>
            <div>
              <label className="mb-1.5 block text-label font-medium" htmlFor="listing-expires-at">
                Expires at
              </label>
              <Input
                id="listing-expires-at"
                name="expires_at"
                onChange={handleChange}
                required
                type="datetime-local"
                value={form.expires_at}
              />
            </div>
          </div>

          {formError && <ErrorMessage message={formError} />}

          <div className="flex items-center justify-between pt-4">
            <Button
              variant="outline"
              size="lg"
              type="button"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="lg"
              type="submit"
              loading={submitting}
              disabled={submitting}
            >
              {isEdit ? "Update Listing" : "Create Listing"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
