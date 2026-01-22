import { apiClient } from "../client";
import type {
  QrCodeResponse,
  HaveBankAccountResponse,
  UserProfileResponse,
  GetNameResponse,
  ChangeNameRequest,
  ChangeNameResponse,
  GetAvatarsResponse,
  ChangeAvatarRequest,
  ChangeAvatarResponse,
  ChangePasswordGetTacResponse,
  ChangePasswordRequest,
  ChangePasswordResponse,
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
   * Get current username/name
   */
  async getName(): Promise<GetNameResponse> {
    return apiClient.get<GetNameResponse>("/api/mapiuser/changename", {
      authenticated: true,
    });
  },

  /**
   * Change username/name
   */
  async changeName(data: ChangeNameRequest): Promise<ChangeNameResponse> {
    return apiClient.post<ChangeNameResponse>("/api/mapiuser/changename", data, {
      authenticated: true,
    });
  },

  /**
   * Get available avatars and current avatar selection
   */
  async getAvatars(): Promise<GetAvatarsResponse> {
    return apiClient.get<GetAvatarsResponse>("/api/mapiuser/changeavatar", {
      authenticated: true,
    });
  },

  /**
   * Change user avatar
   */
  async changeAvatar(data: ChangeAvatarRequest): Promise<ChangeAvatarResponse> {
    return apiClient.post<ChangeAvatarResponse>("/api/mapiuser/changeavatar", data, {
      authenticated: true,
    });
  },

  /**
   * Request TAC/OTP for password change
   */
  async changePasswordGetTac(): Promise<ChangePasswordGetTacResponse> {
    return apiClient.post<ChangePasswordGetTacResponse>("/api/mapiuser/changepassword_gettac", {}, {
      authenticated: true,
    });
  },

  /**
   * Change user password
   */
  async changePassword(data: ChangePasswordRequest): Promise<ChangePasswordResponse> {
    return apiClient.post<ChangePasswordResponse>("/api/mapiuser/changepassword", data, {
      authenticated: true,
    });
  },
};
