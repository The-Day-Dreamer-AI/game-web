import { apiClient } from "../client";
import type {
  EventsResponse,
  ClaimPromoRequest,
  ClaimPromoResponse,
} from "../types";

export const eventsApi = {
  /**
   * Get all events/promotions
   */
  async getEvents(): Promise<EventsResponse> {
    return apiClient.get<EventsResponse>("/api/mapievent/GetEvents", {
      authenticated: true,
    });
  },

  /**
   * Claim a promotion
   */
  async claimPromo(id: string): Promise<ClaimPromoResponse> {
    const body: ClaimPromoRequest = { Id: id };
    return apiClient.post<ClaimPromoResponse>("/api/mapievent/ClaimPromo", body, {
      authenticated: true,
    });
  },

  /**
   * Mute all carousels for a device
   */
  async muteAllCarousels(deviceId: string): Promise<ClaimPromoResponse> {
    return apiClient.post<ClaimPromoResponse>(
      "/api/MapiEvent/MuteAllCarousels",
      { DeviceId: deviceId },
      { authenticated: true }
    );
  },
};
