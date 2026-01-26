"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { contactApi } from "@/lib/api";
import type {
  DeleteContactRequest,
  AddContactRequest,
  ApproveContactRequest,
  RejectContactRequest,
  CancelContactRequest,
  PostTransferRequest,
  UpdateContactAliasRequest,
} from "@/lib/api/types";

// Query keys
export const contactKeys = {
  all: ["contact"] as const,
  contacts: () => [...contactKeys.all, "list"] as const,
  requests: () => [...contactKeys.all, "requests"] as const,
  detail: (id: string) => [...contactKeys.all, "detail", id] as const,
  search: (text: string) => [...contactKeys.all, "search", text] as const,
  transfer: (id: string) => [...contactKeys.all, "transfer", id] as const,
};

/**
 * Hook to get user's contacts list
 */
export function useContacts(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: contactKeys.contacts(),
    queryFn: async () => {
      return contactApi.getContacts();
    },
    staleTime: 1 * 60 * 1000, // 1 minute
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to get contact requests (incoming and outgoing)
 */
export function useContactRequests(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: contactKeys.requests(),
    queryFn: async () => {
      return contactApi.getContactRequests();
    },
    staleTime: 30 * 1000, // 30 seconds - requests change frequently
    enabled: options?.enabled ?? true,
  });
}

/**
 * Hook to get contact detail by ID
 */
export function useContactDetail(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: contactKeys.detail(id),
    queryFn: async () => {
      return contactApi.getContact(id);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    enabled: !!id && (options?.enabled ?? true),
  });
}

/**
 * Hook to search for contacts
 */
export function useSearchContact(text: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: contactKeys.search(text),
    queryFn: async () => {
      return contactApi.searchContact(text);
    },
    staleTime: 30 * 1000, // 30 seconds
    enabled: !!text && text.length > 0 && (options?.enabled ?? true),
  });
}

/**
 * Hook to delete a contact
 */
export function useDeleteContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DeleteContactRequest) => {
      return contactApi.deleteContact(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.contacts() });
    },
  });
}

/**
 * Hook to add a contact (send friend request)
 */
export function useAddContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddContactRequest) => {
      return contactApi.addContact(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.requests() });
    },
  });
}

/**
 * Hook to approve a friend request
 */
export function useApproveContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ApproveContactRequest) => {
      return contactApi.approveContact(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.contacts() });
      queryClient.invalidateQueries({ queryKey: contactKeys.requests() });
    },
  });
}

/**
 * Hook to reject a friend request
 */
export function useRejectContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: RejectContactRequest) => {
      return contactApi.rejectContact(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.requests() });
    },
  });
}

/**
 * Hook to cancel a sent friend request
 */
export function useCancelContact() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CancelContactRequest) => {
      return contactApi.cancelContact(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactKeys.requests() });
    },
  });
}

/**
 * Hook to get transfer info for a contact
 */
export function useTransferInfo(id: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: contactKeys.transfer(id),
    queryFn: async () => {
      return contactApi.getTransferInfo(id);
    },
    staleTime: 30 * 1000, // 30 seconds - balance changes
    enabled: !!id && (options?.enabled ?? true),
  });
}

/**
 * Hook to transfer money to a contact
 */
export function usePostTransfer() {
  return useMutation({
    mutationFn: async (data: PostTransferRequest) => {
      return contactApi.postTransfer(data);
    },
  });
}

/**
 * Hook to update contact alias
 */
export function useUpdateContactAlias() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: UpdateContactAliasRequest) => {
      return contactApi.updateContactAlias(data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.detail(variables.Id) });
      queryClient.invalidateQueries({ queryKey: contactKeys.contacts() });
    },
  });
}
