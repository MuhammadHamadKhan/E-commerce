"use client";
// useUpdateProfile: saves bakery profile changes and refreshes the
// profile query (and "me", which also holds the bakery).
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateMyProfile, type ProfileInput } from "@/lib/api/bakeryProfile";
import { queryKeys } from "@/lib/queryKeys";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProfileInput) => updateMyProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.bakery.profile });
      queryClient.invalidateQueries({ queryKey: queryKeys.bakery.me });
    },
  });
}
