"use client";
// useCreateProduct: adds a product (JSON or FormData with an "image"
// file for the upload) and refreshes the products list afterwards.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createMyProduct, type ProductInput } from "@/lib/api/bakeryProducts";
import { queryKeys } from "@/lib/queryKeys";

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProductInput | FormData) => createMyProduct(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bakery.products.all });
    },
  });
}
