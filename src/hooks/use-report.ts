"use client";

import { useQuery } from "@tanstack/react-query";
import { reportApi } from "@/lib/api";
import type { GetGameRecordsParams, GetTurnoverParams } from "@/lib/api/services/report";

// Query keys
export const reportKeys = {
  all: ["report"] as const,
  gameRecordSelections: () => [...reportKeys.all, "gameRecordSelections"] as const,
  gameRecords: (params: GetGameRecordsParams) => [...reportKeys.all, "gameRecords", params] as const,
  turnoverSelections: () => [...reportKeys.all, "turnoverSelections"] as const,
  turnover: (params: GetTurnoverParams) => [...reportKeys.all, "turnover", params] as const,
};

/**
 * Hook to get game selections for game record filter
 */
export function useGameRecordSelections(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: reportKeys.gameRecordSelections(),
    queryFn: async () => {
      return reportApi.getGameRecordSelections();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - selections rarely change
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to get game records with filters
 */
export function useGameRecords(
  params: GetGameRecordsParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: reportKeys.gameRecords(params),
    queryFn: async () => {
      return reportApi.getGameRecords(params);
    },
    staleTime: 0,
    gcTime: 0,
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to get game selections for turnover report filter
 */
export function useTurnoverGameSelections(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: reportKeys.turnoverSelections(),
    queryFn: async () => {
      return reportApi.getTurnoverGameSelections();
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - selections rarely change
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to get turnover records with filters
 */
export function useTurnover(
  params: GetTurnoverParams,
  options?: { enabled?: boolean }
) {
  return useQuery({
    queryKey: reportKeys.turnover(params),
    queryFn: async () => {
      return reportApi.getTurnover(params);
    },
    staleTime: 0,
    gcTime: 0,
    enabled: options?.enabled ?? true,
  });
}
