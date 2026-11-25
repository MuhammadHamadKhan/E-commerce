"use client";
// Read the cookie-backed auth state and keep logout in one place.
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout as logoutAction } from "@/store/slices/authSlice";
import { useBakeryMe } from "@/hooks/queries/useBakeryMe";
import { logoutBakery } from "@/lib/api/bakeryAuth";
import { useQueryClient } from "@tanstack/react-query";

export function useAuth() {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { status, user, bakery } = useAppSelector((state) => state.auth);

  // The shared query checks the session once when the app starts.
  useBakeryMe();

  async function logout() {
    await logoutBakery();
    dispatch(logoutAction());
    queryClient.clear();
  }

  return {
    isLoggedIn: status === "loggedIn",
    status,
    user,
    bakery,
    logout,
  };
}
