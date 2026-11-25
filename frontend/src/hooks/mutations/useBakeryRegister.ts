"use client";
// Store the owner returned by registration and refresh the session.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { registerBakery, type RegisterBakeryInput } from "@/lib/api/bakeryAuth";
import { queryKeys } from "@/lib/queryKeys";
import { useAppDispatch } from "@/store/hooks";
import { setLoggedIn } from "@/store/slices/authSlice";

export function useBakeryRegister() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: RegisterBakeryInput) => registerBakery(data),
    onSuccess: async (data) => {
      dispatch(setLoggedIn({ user: data.user, bakery: data.bakery }));
      await queryClient.invalidateQueries({ queryKey: queryKeys.bakery.me });
    },
  });
}
