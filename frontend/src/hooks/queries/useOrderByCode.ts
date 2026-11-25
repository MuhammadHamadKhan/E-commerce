"use client";
// useOrderByCode: looks up one order by its pickup code (public check).
// "enabled: !!code" waits until a code exists before asking the backend.
// Options.refetchInterval: live-poll in ms while the order is active
// (pending/confirmed); 0 (or false) stops polling once the order is finished.
import { useQuery } from "@tanstack/react-query";
import { getOrderByCode } from "@/lib/api/orders";
import { queryKeys } from "@/lib/queryKeys";

export interface UseOrderByCodeOptions {
  // Poll every N ms while the order is active. Pass a number (e.g. 30_000)
  // or false/0 to disable polling.
  refetchInterval?: number | false;
}

const ACTIVE_STATUSES = new Set(["pending", "confirmed"]);

export function useOrderByCode(code: string, options: UseOrderByCodeOptions = {}) {
  return useQuery({
    queryKey: queryKeys.orders.byCode(code),
    queryFn: () => getOrderByCode(code),
    enabled: Boolean(code), // do not fetch with an empty code
    refetchInterval: (query) => {
      const status = query.state.data?.order?.status;
      const active = ACTIVE_STATUSES.has(status || "");
      if (options.refetchInterval === false || options.refetchInterval === 0) {
        return 0;
      }
      if (typeof options.refetchInterval === "number" && active) {
        return options.refetchInterval;
      }
      return 0;
    },
  });
}
