"use client";

import { useQuery } from "@tanstack/react-query";
import { userApi } from "@/lib/api";

// Query keys
export const userKeys = {
  all: ["user"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
  qrCode: () => [...userKeys.all, "qrCode"] as const,
  aboutUs: () => [...userKeys.all, "aboutUs"] as const,
  haveBankAccount: () => [...userKeys.all, "haveBankAccount"] as const,
};

/**
 * Hook to fetch user profile information
 */
export function useProfile(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: userKeys.profile(),
    queryFn: async () => {
      const response = await userApi.getProfile();
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - profile can change
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to fetch user's QR code for referral
 */
export function useQrCode() {
  return useQuery({
    queryKey: userKeys.qrCode(),
    queryFn: async () => {
      const response = await userApi.getQrCode();
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - QR code doesn't change often
  });
}

/**
 * Hook to fetch about us content
 */
export function useAboutUs() {
  return useQuery({
    queryKey: userKeys.aboutUs(),
    queryFn: async () => {
      const response = await userApi.getAboutUs();
      return response;
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - static content
  });
}

/**
 * Hook to check if user has bank account
 */
export function useHaveBankAccount(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: userKeys.haveBankAccount(),
    queryFn: async () => {
      const response = await userApi.getHaveBankAccount();
      return response;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled ?? true,
  });
}
