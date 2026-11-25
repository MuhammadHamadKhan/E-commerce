"use client";

// ProductsTable: responsive list of the bakery's products.
// Tablet+ shows a data table; mobile shows stacked product cards.
import { useState } from "react";
import { useMyProducts } from "@/hooks/queries/useMyProducts";
import { useDeleteProduct } from "@/hooks/mutations/useDeleteProduct";
import Button from "@/components/ui/Button";
import Spinner from "@/components/ui/Spinner";
import ErrorMessage from "@/components/ui/ErrorMessage";
import Toast from "@/components/ui/Toast";
import type { Product } from "@/lib/api/types";

type ProductsTableProps = {
  onEdit?: (product: Product) => void;
};

export default function ProductsTable({ onEdit }: ProductsTableProps = {}) {
  const { data, isPending, isFetching, error } = useMyProducts();
  const deleteProduct = useDeleteProduct();
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deleteToast, setDeleteToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const products: Product[] = data?.products ?? [];

  const handleDelete = async (id: number) => {
    setDeleteError(null);
    try {
      await deleteProduct.mutateAsync(id);
      setDeleteToast({ message: "Product deleted.", type: "success" });
      setTimeout(() => setDeleteToast(null), 3000);
    } catch {
      setDeleteError("Failed to delete product. Please try again.");
    }
  };

  if (isPending || isFetching) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Spinner size="lg" />
        <p className="mt-3 text-body-sm text-on-surface-variant">Loading products…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-20 text-center">
        <ErrorMessage message={error.message || "Failed to load products."} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-body text-on-surface-variant">
          No products yet. Add your first product to get started.
        </p>
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {deleteToast && (
        <Toast message={deleteToast.message} type={deleteToast.type} onDone={() => setDeleteToast(null)} />
      )}

      {deleteError && (
        <ErrorMessage message={deleteError} />
      )}

      {/* Desktop: data table */}
      <div className="hidden lg:block">
        <div className="rounded-xl border border-outline-variant bg-surface shadow-card overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-6 py-4 text-label font-medium text-on-surface-variant w-24">
                  Image
                </th>
                <th className="px-6 py-4 text-label font-medium text-on-surface-variant">
                  Name
                </th>
                <th className="px-6 py-4 text-label font-medium text-on-surface-variant text-right w-24">
                  Price
                </th>
                <th className="px-6 py-4 text-label font-medium text-on-surface-variant text-right w-32">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-surface-container-low transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      {product.image_url ? (
                        <img
                          src={product.image_url}
                          alt={product.name}
                          className="h-12 w-12 rounded-md object-cover border border-outline-variant"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded-md border border-dashed border-outline-variant bg-surface-container-low flex items-center justify-center">
                          <span className="text-body-sm text-on-surface-variant">📦</span>
                        </div>
                      )}
                      <span className="text-body text-on-surface">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-body text-on-surface">
                    {product.description || (
                      <span className="text-on-surface-variant">No description</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-body font-medium text-on-surface text-right">
                    ₹{product.original_price}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {onEdit ? (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(product)}
                          className="text-secondary hover:text-on-surface"
                        >
                          Edit
                        </Button>
                      ) : null}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.id)}
                        className="text-error-container hover:bg-error-container/50 hover:text-error"
                        disabled={deleteProduct.isPending}
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

      {/* Mobile: stacked product cards */}
      <div className="lg:hidden space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-xl border border-outline-variant bg-surface p-4 shadow-card"
          >
            <div className="flex items-center gap-3 mb-3">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="h-14 w-14 rounded-md object-cover border border-outline-variant"
                />
              ) : (
                <div className="h-14 w-14 rounded-md border border-dashed border-outline-variant bg-surface-container-low flex items-center justify-center">
                  <span className="text-body-sm">📦</span>
                </div>
              )}
              <div>
                <p className="text-body font-medium text-on-surface leading-tight">
                  {product.name}
                </p>
                <p className="text-body-sm text-on-surface-variant">
                  {product.description || "No description"}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-body font-medium text-on-surface">
                ₹{product.original_price}
              </span>
              <div className="flex items-center gap-2">
                {onEdit ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(product)}
                    className="text-secondary hover:text-on-surface"
                  >
                    Edit
                  </Button>
                ) : null}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  className="text-error-container hover:bg-error-container/50 hover:text-error"
                  disabled={deleteProduct.isPending}
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
