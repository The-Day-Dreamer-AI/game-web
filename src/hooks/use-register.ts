"use client";

import { useMutation } from "@tanstack/react-query";
import { authApi } from "@/lib/api";
import type { RegisterRequest } from "@/lib/api/types";

// Query keys (for future use)
export const registerKeys = {
  all: ["register"] as const,
};

/**
 * Hook to register a new user
 */
export function useRegister() {
  return useMutation({
    mutationFn: async (data: RegisterRequest) => {
      const response = await authApi.register(data);
      return response;
    },
  });
}
