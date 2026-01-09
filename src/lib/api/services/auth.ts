import { apiClient } from "../client";
import { API_CONFIG } from "../config";
import type {
  GetUplineResponse,
  RegisterRequest,
  RegisterResponse,
  LoginResponse,
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
   * Generate upline/referral code using username
   * POST /api/mapiuser/Register_GetUpline
   * Called when user does NOT provide a referral code - generates one based on username
   */
  async getUpline(username: string): Promise<GetUplineResponse> {
    return apiClient.post<GetUplineResponse>("/api/mapiuser/Register_GetUpline", {
      Id: username,
    }, {
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
};
