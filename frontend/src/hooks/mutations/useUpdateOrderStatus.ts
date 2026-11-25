"use client";
// useUpdateOrderStatus: changes an order's status and refreshes the orders list.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyOrderStatus } from "@/lib/api/bakeryOrders";
import { queryKeys } from "@/lib/queryKeys";

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      status,
    }: {
      id: number | string;
      status: "pending" | "confirmed" | "picked_up" | "cancelled" | "expired";
    }) => updateMyOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bakery.orders.all });
    },
  });
}
