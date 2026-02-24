import { apiClient } from "../client";
import type { TransactionsResponse } from "../types";

export type TransactionAction =
  | ""
  | "Deposit"
  | "Withdraw"
  | "Transfer In"
  | "Transfer Out"
  | "Payout"
  | "Payout Rollback"
  | "Launch Game"
  | "Quit Game"
  | "Auto Quit Game"
  | "Game Refund"
  | "DailyCheckIn"
  | "FortuneWheel"
  | "Bonus";

export interface GetTransactionsParams {
  page?: number;
  month?: string; // Format: YYYY-MM
  action?: TransactionAction;
}

export const transactionsApi = {
  /**
   * Get transactions with pagination, month, and action filtering
   */
  async getTransactions(params?: GetTransactionsParams): Promise<TransactionsResponse> {
    return apiClient.get<TransactionsResponse>("/api/mapiuser/GetTrans", {
      params: {
        Page: params?.page || 1,
        Month: params?.month,
        Action: params?.action,
      },
      authenticated: true,
    });
  },
};
