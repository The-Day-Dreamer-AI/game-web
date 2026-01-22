"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { userApi } from "@/lib/api";
import type { ChangeNameRequest, ChangeAvatarRequest, ChangePasswordRequest } from "@/lib/api/types";

// Query keys
export const userKeys = {
  all: ["user"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
  qrCode: () => [...userKeys.all, "qrCode"] as const,
  haveBankAccount: () => [...userKeys.all, "haveBankAccount"] as const,
  name: () => [...userKeys.all, "name"] as const,
  avatars: () => [...userKeys.all, "avatars"] as const,
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

/**
 * Hook to fetch current username/name
 */
export function useName() {
  return useQuery({
    queryKey: userKeys.name(),
    queryFn: async () => {
      const response = await userApi.getName();
      return response;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
}

/**
 * Hook to change username/name
 */
export function useChangeName() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ChangeNameRequest) => {
      const response = await userApi.changeName(data);
      return response;
    },
    onSuccess: () => {
      // Invalidate name and profile queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: userKeys.name() });
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
}

/**
 * Hook to fetch available avatars
 */
export function useAvatars() {
  return useQuery({
    queryKey: userKeys.avatars(),
    queryFn: async () => {
      const response = await userApi.getAvatars();
      return response;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - avatars don't change often
  });
}

/**
 * Hook to change user avatar
 */
export function useChangeAvatar() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ChangeAvatarRequest) => {
      const response = await userApi.changeAvatar(data);
      return response;
    },
    onSuccess: () => {
      // Invalidate avatars and profile queries to refetch fresh data
      queryClient.invalidateQueries({ queryKey: userKeys.avatars() });
      queryClient.invalidateQueries({ queryKey: userKeys.profile() });
    },
  });
}

/**
 * Hook to request TAC/OTP for password change
 */
export function useChangePasswordGetTac() {
  return useMutation({
    mutationFn: async () => {
      const response = await userApi.changePasswordGetTac();
      return response;
    },
  });
}

/**
 * Hook to change user password
 */
export function useChangePassword() {
  return useMutation({
    mutationFn: async (data: ChangePasswordRequest) => {
      const response = await userApi.changePassword(data);
      return response;
    },
  });
}
