import { apiClient } from "../client";
import { API_CONFIG } from "../config";
import type { AnnouncementResponse } from "../types";

export const systemApi = {
  async getAnnouncement(): Promise<AnnouncementResponse> {
    return apiClient.get<AnnouncementResponse>(
      "/api/mapisystem/getannouncement",
      {
        params: { Platform: API_CONFIG.platform },
        authenticated: false,
      }
    );
  },
};
