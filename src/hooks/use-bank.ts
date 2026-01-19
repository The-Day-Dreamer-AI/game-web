"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { bankApi } from "@/lib/api";
import type { AddBankAccountRequest, ResetPinRequest } from "@/lib/api/types";
import { withdrawalKeys } from "./use-withdrawal";
import { userKeys } from "./use-user";

// Query keys
export const bankKeys = {
  all: ["bank"] as const,
  userBanks: () => [...bankKeys.all, "userBanks"] as const,
  userBankAccounts: () => [...bankKeys.all, "userBankAccounts"] as const,
  tac: () => [...bankKeys.all, "tac"] as const,
};

/**
 * Hook to get available banks list
 * Also checks if user needs to set PIN first (Code: 1)
 */
export function useUserBanks(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: bankKeys.userBanks(),
    queryFn: async () => {
      return bankApi.getUserBanks();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to get user's registered bank accounts
 */
export function useUserBankAccounts(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: bankKeys.userBankAccounts(),
    queryFn: async () => {
      return bankApi.getUserBankAccounts();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled ?? true,
  });
}

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

/**
 * Hook to request TAC for resetting PIN
 */
export function useResetPinTac() {
  return useMutation({
    mutationFn: async () => {
      return bankApi.getResetPinTac();
    },
  });
}

/**
 * Hook to reset PIN
 */
export function useResetPin() {
  return useMutation({
    mutationFn: async (data: ResetPinRequest) => {
      return bankApi.resetPin(data);
    },
  });
}
