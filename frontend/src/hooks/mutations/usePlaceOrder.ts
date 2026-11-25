"use client";
// usePlaceOrder: sends the order to the backend. On success it clears
// the cart through Redux (client state) and refreshes the listings
// (server cache) so the remaining quantities update.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { placeOrder, type PlaceOrderInput } from "@/lib/api/orders";
import { queryKeys } from "@/lib/queryKeys";
import { useAppDispatch } from "@/store/hooks";
import { clearCart } from "@/store/slices/cartSlice";

export function usePlaceOrder() {
  const queryClient = useQueryClient();
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: (orderData: PlaceOrderInput) => placeOrder(orderData),
    onSuccess: () => {
      dispatch(clearCart()); // empty the cart after paying
      queryClient.invalidateQueries({ queryKey: queryKeys.listings.all }); // stock changed
    },
  });
}
