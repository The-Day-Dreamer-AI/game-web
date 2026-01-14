import { apiClient } from "../client";
import type {
  WithdrawAccountsResponse,
  SubmitWithdrawRequest,
  SubmitWithdrawResponse,
} from "../types";

export const withdrawalApi = {
  /**
   * Get user's registered bank accounts for withdrawal
   * GET /api/mapibank/GetWithdrawAccs
   */
  async getWithdrawAccounts(): Promise<WithdrawAccountsResponse> {
    return apiClient.get<WithdrawAccountsResponse>("/api/mapibank/GetWithdrawAccs", {
      authenticated: true,
    });
  },

  /**
   * Submit a withdrawal request
   * POST /api/mapibank/SubmitWithdraw
   */
  async submitWithdraw(data: SubmitWithdrawRequest): Promise<SubmitWithdrawResponse> {
    return apiClient.post<SubmitWithdrawResponse>("/api/mapibank/SubmitWithdraw", data, {
      authenticated: true,
    });
  },
};
