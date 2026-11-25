"use client";
// useMyOrders: reads orders that contain the bakery's items.
import { useQuery } from "@tanstack/react-query";
import { getMyOrders } from "@/lib/api/bakeryOrders";
import { queryKeys } from "@/lib/queryKeys";
import { useAppSelector } from "@/store/hooks";

export function useMyOrders(filters: { status?: "pending" | "confirmed" | "picked_up" | "cancelled" | "expired" } = {}) {
  const isLoggedIn = useAppSelector((state) => state.auth.status === "loggedIn");

  return useQuery({
    queryKey: queryKeys.bakery.orders.list(filters),
    queryFn: () => getMyOrders(filters),
    enabled: isLoggedIn,
  });
}
