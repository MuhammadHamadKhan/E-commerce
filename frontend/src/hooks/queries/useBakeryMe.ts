"use client";
// Check the cookie-backed session once when auth is loading.
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { getBakeryMe } from "@/lib/api/bakeryAuth";
import { queryKeys } from "@/lib/queryKeys";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout, setLoggedIn } from "@/store/slices/authSlice";

export function useBakeryMe() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);

  const query = useQuery({
    queryKey: queryKeys.bakery.me,
    queryFn: getBakeryMe,
    enabled: status !== "loggedOut",
    retry: false,
  });

  useEffect(() => {
    if (query.data?.success) {
      dispatch(setLoggedIn({ user: query.data.user, bakery: query.data.bakery }));
    } else if (query.isError && status === "loading") {
      dispatch(logout());
    }
  }, [query.data, query.isError, status, dispatch]);

  return query;
}
