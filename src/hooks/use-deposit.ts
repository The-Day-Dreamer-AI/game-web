"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { depositApi } from "@/lib/api";
import type { SubmitDepositPgRequest } from "@/lib/api/types";

// Query keys
export const depositKeys = {
  all: ["deposit"] as const,
  walletInfo: () => [...depositKeys.all, "walletInfo"] as const,
  paygates: () => [...depositKeys.all, "paygates"] as const,
  ewalletPaygates: () => [...depositKeys.all, "ewalletPaygates"] as const,
  cryptoPaygates: () => [...depositKeys.all, "cryptoPaygates"] as const,
  depositAccounts: () => [...depositKeys.all, "depositAccounts"] as const,
};

/**
 * Hook to fetch wallet info (balance, user info)
 */
export function useWalletInfo(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: depositKeys.walletInfo(),
    queryFn: async () => {
      const response = await depositApi.getWalletInfo();
      return response;
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to fetch payment gateways for instant deposit
 */
export function usePaygates(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: depositKeys.paygates(),
    queryFn: async () => {
      const response = await depositApi.getPaygates();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to fetch payment gateways for e-wallet deposit
 */
export function useEWalletPaygates(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: depositKeys.ewalletPaygates(),
    queryFn: async () => {
      const response = await depositApi.getEWalletPaygates();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to fetch payment gateways for crypto deposit
 */
export function useCryptoPaygates(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: depositKeys.cryptoPaygates(),
    queryFn: async () => {
      const response = await depositApi.getCryptoPaygates();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to fetch deposit bank accounts (for bank transfer)
 */
export function useDepositAccounts(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: depositKeys.depositAccounts(),
    queryFn: async () => {
      const response = await depositApi.getDepositAccounts();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to submit instant deposit via payment gateway
 */
export function useSubmitDepositPg() {
  return useMutation({
    mutationFn: async (data: SubmitDepositPgRequest) => {
      const response = await depositApi.submitDepositPg(data);
      return response;
    },
  });
}

/**
 * Hook to submit bank transfer deposit with receipt
 */
export function useSubmitDeposit() {
  return useMutation({
    mutationFn: async (data: {
      BankAccountId: string;
      Amount: number;
      PromoId: string;
      PromoCode: string;
      Receipt: File;
    }) => {
      const response = await depositApi.submitDeposit(data);
      return response;
    },
  });
}
