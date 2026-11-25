"use client";
// useUpdateProduct: edits one of my products and refreshes the list.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyProduct, type ProductInput } from "@/lib/api/bakeryProducts";
import { queryKeys } from "@/lib/queryKeys";

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: ProductInput | FormData }) =>
      updateMyProduct(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bakery.products.all });
    },
  });
}
