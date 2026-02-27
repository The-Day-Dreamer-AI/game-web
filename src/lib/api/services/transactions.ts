import { apiClient } from "../client";
import type {
  TransactionsResponse,
  GameTransactionDetail,
  DepositTransactionDetail,
  WithdrawTransactionDetail,
  TransferTransactionDetail,
  PayoutTransactionDetail,
  TransactionDetail,
} from "../types";

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

  async getGameDetail(id: string): Promise<GameTransactionDetail> {
    return apiClient.get<GameTransactionDetail>("/api/mapiuser/getlaunchquitgamedetail", {
      params: { Id: id },
      authenticated: true,
    });
  },

  async getDepositDetail(id: string): Promise<DepositTransactionDetail> {
    return apiClient.get<DepositTransactionDetail>("/api/mapiuser/getdepositdetail", {
      params: { Id: id },
      authenticated: true,
    });
  },

  async getWithdrawDetail(id: string): Promise<WithdrawTransactionDetail> {
    return apiClient.get<WithdrawTransactionDetail>("/api/mapiuser/getwithdrawdetail", {
      params: { Id: id },
      authenticated: true,
    });
  },

  async getTransferDetail(id: string): Promise<TransferTransactionDetail> {
    return apiClient.get<TransferTransactionDetail>("/api/mapiuser/gettransferdetail", {
      params: { Id: id },
      authenticated: true,
    });
  },

  async getPayoutDetail(id: string): Promise<PayoutTransactionDetail> {
    return apiClient.get<PayoutTransactionDetail>("/api/mapiuser/getpayoutdetail", {
      params: { Id: id },
      authenticated: true,
    });
  },

  /**
   * Get transaction detail based on action type
   */
  async getTransactionDetail(id: string, action: string): Promise<TransactionDetail> {
    switch (action) {
      case "Launch Game":
      case "Quit Game":
      case "Auto Quit Game":
        return this.getGameDetail(id);
      case "Deposit":
        return this.getDepositDetail(id);
      case "Withdraw":
        return this.getWithdrawDetail(id);
      case "Transfer In":
      case "Transfer Out":
        return this.getTransferDetail(id);
      case "Payout":
      case "Payout Rollback":
        return this.getPayoutDetail(id);
      default:
        throw new Error(`Unsupported transaction type: ${action}`);
    }
  },
};
