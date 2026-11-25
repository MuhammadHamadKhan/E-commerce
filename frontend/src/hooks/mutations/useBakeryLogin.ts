"use client";
// Store the owner returned by login and refresh the cookie-backed session.
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { loginBakery, type LoginBakeryInput } from "@/lib/api/bakeryAuth";
import { queryKeys } from "@/lib/queryKeys";
import { useAppDispatch } from "@/store/hooks";
import { setLoggedIn } from "@/store/slices/authSlice";

export function useBakeryLogin() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginBakeryInput) => loginBakery(data),
    onSuccess: async (data) => {
      dispatch(setLoggedIn({ user: data.user, bakery: data.bakery }));
      await queryClient.invalidateQueries({ queryKey: queryKeys.bakery.me });
    },
  });
}
