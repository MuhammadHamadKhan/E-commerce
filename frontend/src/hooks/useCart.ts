"use client";
// Thin helper over the Redux cart. Gives pages simple values and
// functions (items, itemCount, total, savings, addItem, ...).
// addItem returns "replaced_bakery" signal handling is up to the
// caller: when the cart belongs to another bakery it returns false and
// the caller can ask "Replace your cart?" and use replaceWith().
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  addItem,
  removeItem,
  setQuantity,
  setListingQuantity,
  addListingAtQuantity,
  clearCart,
  replaceCartWith,
  selectCartItems,
  selectCartItemCount,
  selectCartTotal,
  selectCartSavings,
  selectCartIsHydrated,
} from "@/store/slices/cartSlice";
import type { Listing } from "@/lib/api/types";

export function useCart() {
  const dispatch = useAppDispatch();
  const items = useAppSelector(selectCartItems);
  const itemCount = useAppSelector(selectCartItemCount);
  const total = useAppSelector(selectCartTotal);
  const savings = useAppSelector(selectCartSavings);
  const isHydrated = useAppSelector(selectCartIsHydrated);
  const { bakeryId, bakeryName } = useAppSelector((state) => state.cart);

  // Add a listing. Returns false if the cart belongs to a DIFFERENT
  // bakery (cart unchanged) so the interface can ask "Replace your cart?".
  const add = (listing: Listing, newBakeryId: number, newBakeryName: string): boolean => {
    if (items.length > 0 && bakeryId !== null && bakeryId !== newBakeryId) return false;
    dispatch(addItem({ listing, bakeryId: newBakeryId, bakeryName: newBakeryName }));
    return true;
  };

  return {
    items,
    itemCount,
    total,
    savings,
    isHydrated,
    bakeryId,
    bakeryName,
    add,
    addAtQuantity: (
      listing: Listing,
      newBakeryId: number,
      newBakeryName: string,
      quantity: number
    ): boolean => {
      if (items.length > 0 && bakeryId !== null && bakeryId !== newBakeryId) return false;
      dispatch(
        addListingAtQuantity({
          listing,
          bakeryId: newBakeryId,
          bakeryName: newBakeryName,
          quantity,
        })
      );
      return true;
    },
    replaceWith: (
      listing: Listing,
      newBakeryId: number,
      newBakeryName: string,
      quantity = 1
    ) =>
      dispatch(
        replaceCartWith({
          listing,
          bakeryId: newBakeryId,
          bakeryName: newBakeryName,
          quantity,
        })
      ),
    remove: (listingId: number) => dispatch(removeItem(listingId)),
    setQty: (listingId: number, quantity: number) => dispatch(setQuantity({ listingId, quantity })),
    setListingQty: (
      listing: Listing,
      newBakeryId: number,
      newBakeryName: string,
      quantity: number
    ) =>
      dispatch(
        setListingQuantity({
          listing,
          bakeryId: newBakeryId,
          bakeryName: newBakeryName,
          quantity,
        })
      ),
    clear: () => dispatch(clearCart()),
  };
}
