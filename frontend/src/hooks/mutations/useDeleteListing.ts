"use client";
// useDeleteListing: removes one of my listings and refreshes the lists.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteMyListing } from "@/lib/api/bakeryListings";
import { queryKeys } from "@/lib/queryKeys";

export function useDeleteListing() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => deleteMyListing(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bakery.listings.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all });
    },
  });
}
