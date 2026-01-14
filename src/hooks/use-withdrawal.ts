"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { withdrawalApi } from "@/lib/api";
import type { SubmitWithdrawRequest } from "@/lib/api/types";

// Query keys
export const withdrawalKeys = {
  all: ["withdrawal"] as const,
  accounts: () => [...withdrawalKeys.all, "accounts"] as const,
};

/**
 * Hook to fetch user's bank accounts for withdrawal
 */
export function useWithdrawAccounts(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: withdrawalKeys.accounts(),
    queryFn: async () => {
      const response = await withdrawalApi.getWithdrawAccounts();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to submit a withdrawal request
 */
export function useSubmitWithdraw() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: SubmitWithdrawRequest) => {
      return withdrawalApi.submitWithdraw(data);
    },
    onSuccess: () => {
      // Invalidate relevant queries after successful withdrawal
      queryClient.invalidateQueries({ queryKey: withdrawalKeys.all });
      // Also invalidate transactions to show new pending withdrawal
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
    },
  });
}
