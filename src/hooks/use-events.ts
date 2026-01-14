"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { eventsApi } from "@/lib/api";

// Query keys
export const eventsKeys = {
  all: ["events"] as const,
  list: () => [...eventsKeys.all, "list"] as const,
};

/**
 * Hook to fetch events/promotions
 */
export function useEvents() {
  return useQuery({
    queryKey: eventsKeys.list(),
    queryFn: async () => {
      const response = await eventsApi.getEvents();
      return response.Promos || [];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to claim a promotion
 */
export function useClaimPromo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (promoId: string) => eventsApi.claimPromo(promoId),
    onSuccess: () => {
      // Invalidate events to refresh the list
      queryClient.invalidateQueries({ queryKey: eventsKeys.all });
    },
  });
}
