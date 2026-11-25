"use client";
// useMyProfile: reads the logged-in bakery's profile details.
import { useQuery } from "@tanstack/react-query";
import { getMyProfile } from "@/lib/api/bakeryProfile";
import { queryKeys } from "@/lib/queryKeys";
import { useAppSelector } from "@/store/hooks";

export function useMyProfile() {
  const isLoggedIn = useAppSelector((state) => state.auth.status === "loggedIn");

  return useQuery({
    queryKey: queryKeys.bakery.profile,
    queryFn: getMyProfile,
    enabled: isLoggedIn,
  });
}
