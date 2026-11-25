"use client";
// useDeleteProduct: removes one of my products and refreshes the list.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMyProduct } from "@/lib/api/bakeryProducts";
import { queryKeys } from "@/lib/queryKeys";

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteMyProduct(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bakery.products.all });
    },
  });
}
