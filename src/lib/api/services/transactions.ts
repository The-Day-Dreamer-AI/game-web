import { apiClient } from "../client";
import type { TransactionsResponse } from "../types";

export interface GetTransactionsParams {
  page?: number;
  dateFrom?: string;
  dateTo?: string;
}

export const transactionsApi = {
  /**
   * Get transactions with pagination and date filtering
   */
  async getTransactions(params?: GetTransactionsParams): Promise<TransactionsResponse> {
    return apiClient.get<TransactionsResponse>("/api/mapiuser/GetTrans", {
      params: {
        Page: params?.page || 1,
        DateFrom: params?.dateFrom,
        DateTo: params?.dateTo,
      },
      authenticated: true,
    });
  },
};
