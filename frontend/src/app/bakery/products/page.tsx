"use client";

// Bakery Products page: list all products + add/edit via modal.
import { useState } from "react";
import ProductsTable from "@/components/dashboard/ProductsTable";
import ProductForm from "@/components/dashboard/ProductForm";
import Button from "@/components/ui/Button";
import type { Product } from "@/lib/api/types";

export default function Page() {
  const [formOpen, setFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  return (
    <section className="space-y-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-headline font-semibold text-on-surface">Products</h1>
          <p className="text-body-sm text-on-surface-variant">
            Manage your bakery’s product catalog.
          </p>
        </div>
        <Button onClick={() => { setEditingProduct(null); setFormOpen(true); }}>+ Add Product</Button>
      </div>

      <ProductsTable
        onEdit={(product) => {
          setEditingProduct(product);
          setFormOpen(true);
        }}
      />

      <ProductForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSuccess={() => setFormOpen(false)}
        productToEdit={
          editingProduct
            ? {
                id: editingProduct.id,
                name: editingProduct.name,
                description: editingProduct.description ?? undefined,
                original_price: Number(editingProduct.original_price) || 0,
                image_url: editingProduct.image_url ?? undefined,
              }
            : undefined
        }
      />
    </section>
  );
}
