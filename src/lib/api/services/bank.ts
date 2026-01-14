import { apiClient } from "../client";
import type {
  GetTacResponse,
  AddBankAccountRequest,
  AddBankAccountResponse,
} from "../types";

export const bankApi = {
  /**
   * Get TAC (verification code) for adding bank account
   * GET /api/mapibank/AddBankAccount_GetTac
   */
  async getAddBankAccountTac(): Promise<GetTacResponse> {
    return apiClient.get<GetTacResponse>("/api/mapibank/AddBankAccount_GetTac", {
      authenticated: true,
    });
  },

  /**
   * Add a new bank account
   * POST /api/mapibank/AddBankAccount
   */
  async addBankAccount(data: AddBankAccountRequest): Promise<AddBankAccountResponse> {
    return apiClient.post<AddBankAccountResponse>("/api/mapibank/AddBankAccount", data, {
      authenticated: true,
    });
  },
};
