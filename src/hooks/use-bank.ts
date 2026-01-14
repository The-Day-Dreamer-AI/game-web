"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { bankApi } from "@/lib/api";
import type { AddBankAccountRequest } from "@/lib/api/types";
import { withdrawalKeys } from "./use-withdrawal";
import { userKeys } from "./use-user";

// Query keys
export const bankKeys = {
  all: ["bank"] as const,
  tac: () => [...bankKeys.all, "tac"] as const,
};

/**
 * Hook to request TAC for adding bank account
 */
export function useRequestBankTac() {
  return useMutation({
    mutationFn: async () => {
      return bankApi.getAddBankAccountTac();
    },
  });
}

/**
 * Hook to add a new bank account
 */
export function useAddBankAccount() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddBankAccountRequest) => {
      return bankApi.addBankAccount(data);
    },
    onSuccess: () => {
      // Invalidate relevant queries after successful bank account addition
      queryClient.invalidateQueries({ queryKey: bankKeys.all });
      queryClient.invalidateQueries({ queryKey: withdrawalKeys.accounts() });
      queryClient.invalidateQueries({ queryKey: userKeys.haveBankAccount() });
    },
  });
}
