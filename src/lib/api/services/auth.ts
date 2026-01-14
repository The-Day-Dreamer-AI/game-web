import { apiClient } from "../client";
import { API_CONFIG } from "../config";
import type {
  GetUplineResponse,
  RegisterGetTacRequest,
  RegisterGetTacResponse,
  RegisterRequest,
  RegisterResponse,
  LoginResponse,
  ForgotPasswordGetTacRequest,
  ForgotPasswordGetTacResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
} from "../types";

export const authApi = {
  /**
   * Login user and get access token
   * POST /token (form-urlencoded)
   */
  async login(
    username: string,
    password: string,
    options?: {
      fcmToken?: string;
      deviceId?: string;
    }
  ): Promise<LoginResponse> {
    return apiClient.postForm<LoginResponse>("/token", {
      username,
      password,
      grant_type: "password",
      fcm_token: options?.fcmToken || "",
      fcm_platform: API_CONFIG.platform,
      fcm_deviceid: options?.deviceId || "",
    }, {
      authenticated: false,
    });
  },

  /**
   * Verify a referral code (upline)
   * POST /api/mapiuser/Register_GetUpline
   * Called when user provides a referral code to verify its validity
   */
  async getUpline(referralCode: string): Promise<GetUplineResponse> {
    return apiClient.post<GetUplineResponse>("/api/mapiuser/Register_GetUpline", {
      Id: referralCode,
    }, {
      authenticated: false,
    });
  },

  /**
   * Request OTP for registration
   * POST /api/mapiuser/register_gettac
   */
  async registerGetTac(data: RegisterGetTacRequest): Promise<RegisterGetTacResponse> {
    return apiClient.post<RegisterGetTacResponse>("/api/mapiuser/register_gettac", data, {
      authenticated: false,
    });
  },

  /**
   * Register a new user
   * POST /api/mapiuser/Register
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    return apiClient.post<RegisterResponse>("/api/mapiuser/Register", data, {
      authenticated: false,
    });
  },

  /**
   * Request OTP for forgot password
   * POST /api/mapiuser/forgotpassword_gettac
   */
  async forgotPasswordGetTac(data: ForgotPasswordGetTacRequest): Promise<ForgotPasswordGetTacResponse> {
    return apiClient.post<ForgotPasswordGetTacResponse>("/api/mapiuser/forgotpassword_gettac", data, {
      authenticated: false,
    });
  },

  /**
   * Reset password with OTP
   * POST /api/mapiuser/forgotpassword
   */
  async forgotPassword(data: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
    return apiClient.post<ForgotPasswordResponse>("/api/mapiuser/forgotpassword", data, {
      authenticated: false,
    });
  },
};
