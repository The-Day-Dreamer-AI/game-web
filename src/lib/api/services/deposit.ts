import { apiClient } from "../client";
import type {
  WalletInfoResponse,
  PaygatesResponse,
  DepositAccountsResponse,
  SubmitDepositPgRequest,
  SubmitDepositPgResponse,
  SubmitDepositResponse,
} from "../types";

export const depositApi = {
  /**
   * Get wallet info (balance, user info)
   * GET /api/mapibank/getwalletinfo
   */
  async getWalletInfo(): Promise<WalletInfoResponse> {
    return apiClient.get<WalletInfoResponse>("/api/mapibank/getwalletinfo", {
      authenticated: true,
    });
  },

  /**
   * Get payment gateways for instant deposit
   * GET /api/mapibank/getpaygates
   */
  async getPaygates(): Promise<PaygatesResponse> {
    return apiClient.get<PaygatesResponse>("/api/mapibank/getpaygates", {
      authenticated: true,
    });
  },

  /**
   * Get payment gateways for e-wallet deposit
   * GET /api/mapibank/getpaygates?Type=E-Wallet
   */
  async getEWalletPaygates(): Promise<PaygatesResponse> {
    return apiClient.get<PaygatesResponse>("/api/mapibank/getpaygates", {
      params: { Type: "E-Wallet" },
      authenticated: true,
    });
  },

  /**
   * Get payment gateways for crypto deposit
   * GET /api/mapibank/getpaygates?Type=Crypto
   */
  async getCryptoPaygates(): Promise<PaygatesResponse> {
    return apiClient.get<PaygatesResponse>("/api/mapibank/getpaygates", {
      params: { Type: "Crypto" },
      authenticated: true,
    });
  },

  /**
   * Get deposit bank accounts (for bank transfer)
   * GET /api/mapibank/getdepositaccs
   */
  async getDepositAccounts(): Promise<DepositAccountsResponse> {
    return apiClient.get<DepositAccountsResponse>("/api/mapibank/getdepositaccs", {
      authenticated: true,
    });
  },

  /**
   * Submit instant deposit via payment gateway
   * POST /api/mapibank/submitdepositpg
   */
  async submitDepositPg(data: SubmitDepositPgRequest): Promise<SubmitDepositPgResponse> {
    return apiClient.post<SubmitDepositPgResponse>("/api/mapibank/submitdepositpg", data, {
      authenticated: true,
    });
  },

  /**
   * Submit bank transfer deposit with receipt upload
   * POST /api/mapibank/submitdeposit
   */
  async submitDeposit(data: {
    BankAccountId: string;
    Amount: number;
    PromoId: string;
    PromoCode: string;
    Receipt: File;
  }): Promise<SubmitDepositResponse> {
    const formData = new FormData();
    formData.append("BankAccountId", data.BankAccountId);
    formData.append("Amount", data.Amount.toString());
    formData.append("PromoId", data.PromoId);
    formData.append("PromoCode", data.PromoCode);
    formData.append("Receipt", data.Receipt);

    return apiClient.postFormData<SubmitDepositResponse>("/api/mapibank/submitdeposit", formData, {
      authenticated: true,
    });
  },
};
