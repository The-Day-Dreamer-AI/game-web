"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { discoverApi, getAuthToken } from "@/lib/api";
import type { DiscoverResponse } from "@/lib/api/types";

// Query keys
export const discoverKeys = {
  all: ["discover"] as const,
  data: () => [...discoverKeys.all, "data"] as const,
};

/**
 * Hook to fetch discover data (banners, games, categories, running messages)
 * Uses authenticated endpoint only if user has a valid external API token
 * Otherwise falls back to public endpoint
 */
export function useDiscover() {
  return useQuery({
    queryKey: discoverKeys.data(),
    queryFn: async (): Promise<DiscoverResponse | null> => {
      const hasValidToken = !!getAuthToken();

      console.log("triggered", hasValidToken);
      // Try authenticated endpoint if we have a valid token
      if (hasValidToken) {
        try {
          const response = await discoverApi.getDiscover();
          return response;
        } catch (error) {
          // If auth fails, fall back to unauthenticated endpoint
          console.warn("Authenticated discover failed, falling back to public endpoint");
        }
      }

      // Use public endpoint (no token required)
      const response = await discoverApi.getDiscoverWithoutToken();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to launch a game
 */
export function useLaunchGame() {
  return useMutation({
    mutationFn: (gameId: string) => discoverApi.launchGame(gameId),
  });
}

/**
 * Hook to quit a game session
 */
export function useQuitGame() {
  return useMutation({
    mutationFn: () => discoverApi.quitGame(),
  });
}

/**
 * Hook to restore/refresh - quits any active game and refreshes discover data
 */
export function useRestore() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      // First call quitGame API
      await discoverApi.quitGame();
      // Then call discover API to refresh data
      const discoverData = await discoverApi.getDiscover();
      return discoverData;
    },
    onSuccess: (data) => {
      // Update the discover cache with fresh data
      queryClient.setQueryData(discoverKeys.data(), data);
    },
  });
}
