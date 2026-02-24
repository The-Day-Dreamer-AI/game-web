import { apiClient, getAuthToken, ApiError } from "../client";
import { API_CONFIG, AUTH_STORAGE_KEY } from "../config";
import type {
  GetTacResponse,
  AddBankAccountRequest,
  AddBankAccountResponse,
  GetUserBanksResponse,
  GetUserBankAccountsResponse,
  ResetPinGetTacResponse,
  ResetPinRequest,
  ResetPinResponse,
  RedeemCodeRequest,
  RedeemCodeResponse,
  DeleteBankAccountRequest,
  DeleteBankAccountResponse,
} from "../types";

export const bankApi = {
  /**
   * Get available banks list for adding bank account
   * Also checks if user needs to set PIN first (Code: 1)
   * Note: This endpoint returns 400 Bad Request with Code: 1 when PIN is not set
   * GET /api/mapibank/getuserbanks
   */
  async getUserBanks(): Promise<GetUserBanksResponse> {
    const token = getAuthToken();
    const language = typeof window !== "undefined"
      ? localStorage.getItem("aone-language") || "en"
      : "en";

    const response = await fetch(`${API_CONFIG.baseUrl}/api/mapibank/getuserbanks`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Lang: language,
        ...(token ? { Authorization: `bearer ${token}` } : {}),
      },
    });

    if (response.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem(AUTH_STORAGE_KEY);
        window.location.href = "/";
      }
      throw new ApiError(401, "Authentication required.", 401);
    }

    const data = await response.json();

    // Return the data as-is for both success (200) and "PIN required" (400 with Code: 1)
    // This allows the component to handle the Code: 1 case for redirect
    if (!response.ok && data.Code !== 1) {
      throw new Error(data.Message || `Request failed: ${response.statusText}`);
    }

    return data;
  },

  /**
   * Get user's registered bank accounts
   * GET /api/mapibank/getuserbankaccounts
   */
  async getUserBankAccounts(): Promise<GetUserBankAccountsResponse> {
    return apiClient.get<GetUserBankAccountsResponse>("/api/mapibank/getuserbankaccounts", {
      authenticated: true,
    });
  },

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
   * POST /api/mapibank/addbankaccount
   */
  async addBankAccount(data: AddBankAccountRequest): Promise<AddBankAccountResponse> {
    return apiClient.post<AddBankAccountResponse>("/api/mapibank/addbankaccount", data, {
      authenticated: true,
    });
  },

  /**
   * Get TAC for resetting PIN
   * POST /api/mapiuser/ResetPin_GetTac
   */
  async getResetPinTac(channel: string): Promise<ResetPinGetTacResponse> {
    return apiClient.post<ResetPinGetTacResponse>("/api/mapiuser/ResetPin_GetTac", { Channel: channel }, {
      authenticated: true,
    });
  },

  /**
   * Reset PIN
   * POST /api/mapiuser/resetpin
   */
  async resetPin(data: ResetPinRequest): Promise<ResetPinResponse> {
    return apiClient.post<ResetPinResponse>("/api/mapiuser/resetpin", data, {
      authenticated: true,
    });
  },

  /**
   * Submit redeem code
   * POST /api/mapibank/RedeemCodeSubmit
   */
  async redeemCodeSubmit(data: RedeemCodeRequest): Promise<RedeemCodeResponse> {
    return apiClient.post<RedeemCodeResponse>("/api/mapibank/RedeemCodeSubmit", data, {
      authenticated: true,
    });
  },

  /**
   * Delete a bank account
   * POST /api/mapibank/deletebankaccount
   */
  async deleteBankAccount(data: DeleteBankAccountRequest): Promise<DeleteBankAccountResponse> {
    return apiClient.post<DeleteBankAccountResponse>("/api/mapibank/deletebankaccount", data, {
      authenticated: true,
    });
  },
};
