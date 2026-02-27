"use client";

import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { transactionsApi, type GetTransactionsParams } from "@/lib/api/services/transactions";

// Query keys
export const transactionsKeys = {
  all: ["transactions"] as const,
  list: (params?: GetTransactionsParams) => [...transactionsKeys.all, "list", params] as const,
  infinite: (params?: Omit<GetTransactionsParams, "page">) =>
    [...transactionsKeys.all, "infinite", params] as const,
  detail: (id: string, action: string) => [...transactionsKeys.all, "detail", id, action] as const,
};

/**
 * Hook to fetch transactions (single page)
 */
export function useTransactions(params?: GetTransactionsParams) {
  return useQuery({
    queryKey: transactionsKeys.list(params),
    queryFn: () => transactionsApi.getTransactions(params),
    staleTime: 1 * 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch a single transaction's detail
 */
export function useTransactionDetail(id: string, action: string, options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: transactionsKeys.detail(id, action),
    queryFn: () => transactionsApi.getTransactionDetail(id, action),
    enabled: options?.enabled !== false && !!id && !!action,
    staleTime: 1 * 60 * 1000,
  });
}

/**
 * Hook to fetch transactions with infinite scrolling
 */
export function useInfiniteTransactions(params?: Omit<GetTransactionsParams, "page">) {
  return useInfiniteQuery({
    queryKey: transactionsKeys.infinite(params),
    queryFn: ({ pageParam = 1 }) =>
      transactionsApi.getTransactions({ ...params, page: pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (lastPage.End) return undefined;
      return lastPage.Page + 1;
    },
    staleTime: 1 * 60 * 1000,
  });
}
