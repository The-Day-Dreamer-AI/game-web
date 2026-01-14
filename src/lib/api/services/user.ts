import { apiClient } from "../client";
import type {
  QrCodeResponse,
  HaveBankAccountResponse,
  AboutUsResponse,
  UserProfileResponse,
} from "../types";

export const userApi = {
  /**
   * Get user profile information
   */
  async getProfile(): Promise<UserProfileResponse> {
    return apiClient.get<UserProfileResponse>("/api/mapiuser/getprofile", {
      authenticated: true,
    });
  },

  /**
   * Get user's QR code
   */
  async getQrCode(): Promise<QrCodeResponse> {
    return apiClient.get<QrCodeResponse>("/api/mapiuser/GetQr", {
      authenticated: true,
    });
  },

  /**
   * Check if user has a bank account
   */
  async getHaveBankAccount(): Promise<HaveBankAccountResponse> {
    return apiClient.get<HaveBankAccountResponse>("/api/mapibank/GetHaveBankAccount", {
      authenticated: true,
    });
  },

  /**
   * Get about us content
   */
  async getAboutUs(): Promise<AboutUsResponse> {
    return apiClient.get<AboutUsResponse>("/api/MapiDiscover/AboutUs", {
      authenticated: false,
    });
  },
};
