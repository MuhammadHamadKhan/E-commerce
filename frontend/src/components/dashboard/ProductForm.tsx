"use client";

// ProductForm: create or edit a bakery product.
// Supports JSON body or FormData with an "image" file for upload.
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useCreateProduct } from "@/hooks/mutations/useCreateProduct";
import { useUpdateProduct } from "@/hooks/mutations/useUpdateProduct";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import ErrorMessage from "@/components/ui/ErrorMessage";
import type { ProductInput } from "@/lib/api/bakeryProducts";

type ProductFormProps = {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  productToEdit?: {
    id: number;
    name: string;
    description?: string | null;
    original_price: number;
    image_url?: string | null;
  };
};

const INITIAL_FORM: ProductInput = {
  name: "",
  description: "",
  original_price: 0,
  image_url: "",
};

export default function ProductForm({ open, onClose, onSuccess, productToEdit }: ProductFormProps) {
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();

  const isEdit = !!productToEdit;

  const [form, setForm] = useState<ProductInput>(() => {
    if (productToEdit) {
      return {
        name: productToEdit.name,
        description: productToEdit.description ?? "",
        original_price: productToEdit.original_price,
        image_url: productToEdit.image_url ?? "",
      };
    }
    return { ...INITIAL_FORM };
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    productToEdit?.image_url ?? null
  );
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  function handleChange(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const target = event.currentTarget;
    if (!target) return;
    const { name, value } = target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function handlePriceChange(event: ChangeEvent<HTMLInputElement>) {
    const target = event.currentTarget;
    if (!target) return;
    setForm((current) => ({ ...current, original_price: Number(target.value) || 0 }));
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    const target = event.currentTarget;
    if (!target) return;
    const file = target.files?.[0] ?? null;
    setImageFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
      setForm((current) => ({ ...current, image_url: "" }));
    } else {
      setImagePreview(null);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setSubmitting(true);

    const payload: ProductInput | FormData = imageFile
      ? (() => {
          const fd = new FormData();
          fd.append("name", form.name);
          if (form.description) fd.append("description", form.description);
          fd.append("original_price", String(form.original_price));
          fd.append("image", imageFile);
          return fd;
        })()
      : {
          name: form.name,
          description: form.description || undefined,
          original_price: form.original_price,
          image_url: form.image_url || undefined,
        };

    const promise = isEdit && productToEdit
      ? updateProduct.mutateAsync({ id: productToEdit.id, data: payload })
      : createProduct.mutateAsync(payload);

    promise
      .then(() => {
        setSubmitting(false);
        onClose();
        onSuccess?.();
      })
      .catch((err: Error) => {
        setSubmitting(false);
        setFormError(err.message || "Failed to save product. Please try again.");
      });
  }

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="dialog"
      aria-modal="true"
      aria-label={isEdit ? "Edit product" : "Add product"}
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
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ✕
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-1.5 block text-label font-medium" htmlFor="product-name">
              Product name
            </label>
            <Input
              id="product-name"
              name="name"
              onChange={handleChange}
              placeholder="e.g. Croissant"
              required
              value={form.name}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-label font-medium" htmlFor="product-description">
              Description
            </label>
            <textarea
              id="product-description"
              name="description"
              onChange={handleChange}
              placeholder="Describe your product"
              rows={3}
              className="w-full rounded-md border border-outline-soft bg-surface-container-lowest px-md py-sm text-body text-on-surface placeholder:text-outline focus:border-secondary focus:outline-none focus:ring-[3px] focus:ring-secondary/10 transition-all"
              value={form.description}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-label font-medium" htmlFor="product-price">
              Original price (₹)
            </label>
            <Input
              id="product-price"
              name="original_price"
              onChange={handlePriceChange}
              placeholder="0"
              required
              type="number"
              value={form.original_price}
            />
          </div>

          <div>
            <label className="mb-1.5 block text-label font-medium" htmlFor="product-image">
              Product image
            </label>
            <div className="space-y-3">
              <Input
                id="product-image"
                onChange={handleImageChange}
                type="file"
                accept="image/*"
              />
              <Input
                id="product-image-url"
                name="image_url"
                onChange={handleChange}
                placeholder="Or paste image URL"
                value={form.image_url}
              />
              {imagePreview && (
                <div className="mt-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="h-32 w-32 rounded-md object-cover border border-outline-variant"
                  />
                </div>
              )}
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
              {isEdit ? "Update Product" : "Create Product"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
