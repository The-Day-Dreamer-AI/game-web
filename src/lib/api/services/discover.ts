import { apiClient } from "../client";
import { API_CONFIG } from "../config";
import type {
  DiscoverResponse,
  LaunchGameResponse,
  RefreshGameResponse,
  QuitGameResponse,
} from "../types";

export const discoverApi = {
  /**
   * Get discover games (authenticated)
   */
  async getDiscover(): Promise<DiscoverResponse> {
    return apiClient.get<DiscoverResponse>("/api/mapidiscover/Discover", {
      params: { Platform: API_CONFIG.platform },
      authenticated: true,
    });
  },

  /**
   * Get discover games (unauthenticated / guest)
   */
  async getDiscoverWithoutToken(): Promise<DiscoverResponse> {
    return apiClient.get<DiscoverResponse>("/api/mapidiscover/DiscoverWOToken", {
      params: { Platform: API_CONFIG.platform },
      authenticated: false,
    });
  },

  /**
   * Launch a game
   */
  async launchGame(gameId: string): Promise<LaunchGameResponse> {
    return apiClient.get<LaunchGameResponse>("/api/mapidiscover/LaunchGame", {
      params: {
        Id: gameId,
        Platform: API_CONFIG.platform,
      },
      authenticated: true,
    });
  },

  /**
   * Refresh game URL
   */
  async refreshGame(gameId: string): Promise<RefreshGameResponse> {
    return apiClient.get<RefreshGameResponse>("/api/mapidiscover/RefreshGame", {
      params: { Id: gameId },
      authenticated: true,
    });
  },

  /**
   * Quit game session
   */
  async quitGame(): Promise<QuitGameResponse> {
    return apiClient.get<QuitGameResponse>("/api/mapidiscover/QuitGame", {
      params: { Platform: API_CONFIG.platform },
      authenticated: true,
    });
  },
};
