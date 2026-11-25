"use client";
// useMyProducts: reads the logged-in bakery's products (needs login).
import { useQuery } from "@tanstack/react-query";
import { getMyProducts } from "@/lib/api/bakeryProducts";
import { queryKeys } from "@/lib/queryKeys";
import { useAppSelector } from "@/store/hooks";

export function useMyProducts() {
  const isLoggedIn = useAppSelector((state) => state.auth.status === "loggedIn");

  return useQuery({
    queryKey: queryKeys.bakery.products.all,
    queryFn: getMyProducts,
    enabled: isLoggedIn,
  });
}
