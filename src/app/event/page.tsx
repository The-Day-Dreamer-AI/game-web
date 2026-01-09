"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import { Header, BottomNav } from "@/components/layout";
import { RequireAuth } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { EventDetailsModal } from "@/components/event";
import { cn } from "@/lib/utils";
import { useEvents, useClaimPromo } from "@/hooks/use-events";
import { useI18n } from "@/providers/i18n-provider";
import type { Event as ApiEvent } from "@/lib/api/types";

const categories = [
  { id: "all", label: "ALL" },
  { id: "slots", label: "SLOTS" },
  { id: "app-slots", label: "APP SLOTS" },
  { id: "live", label: "LIVE" },
  { id: "sports", label: "SPORTS" },
  { id: "lottery", label: "LOTTERY" },
  { id: "fishing", label: "FISHING" },
];

// Transform API event to component format
interface TransformedEvent {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string[];
  htmlContent: string;
  startDate?: string;
  endDate?: string;
}

function transformEvent(event: ApiEvent): TransformedEvent {
  return {
    id: event.Id,
    image: event.PromoImage,
    title: event.Name,
    description: event.Description,
    // API doesn't provide category info, so show in all
    category: ["all", "slots", "app-slots", "live", "sports", "lottery", "fishing"],
    // Use description as HTML content since API provides Description field
    htmlContent: `
      <h2>${event.Name}</h2>
      <p>${event.Description}</p>
      ${event.StartDate ? `<p><strong>Start Date:</strong> ${new Date(event.StartDate).toLocaleDateString()}</p>` : ""}
      ${event.EndDate ? `<p><strong>End Date:</strong> ${new Date(event.EndDate).toLocaleDateString()}</p>` : ""}
    `,
    startDate: event.StartDate,
    endDate: event.EndDate,
  };
}

export default function EventPage() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<TransformedEvent | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t } = useI18n();

  // Fetch events from API
  const { data: apiEvents, isLoading, error } = useEvents();
  const claimPromoMutation = useClaimPromo();

  // Transform API events
  const events = apiEvents?.map(transformEvent) || [];

  // Filter events by category (currently all events show in all categories since API doesn't provide category)
  const filteredEvents = events.filter((event) =>
    event.category.includes(activeCategory)
  );

  const handleClaimPromo = async (eventId: string) => {
    try {
      await claimPromoMutation.mutateAsync(eventId);
      // Show success message or update UI
    } catch {
      // Error is handled by the mutation
    }
  };

  return (
    <RequireAuth>
    <div className="relative min-h-screen flex flex-col bg-white">
      {/* Header */}
      <Header variant="logo" />

      {/* Horizontally Scrollable Categories */}
      <div
        ref={scrollRef}
        className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActiveCategory(category.id)}
            className={cn(
              "flex-shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-colors whitespace-nowrap",
              activeCategory === category.id
                ? "bg-primary text-white"
                : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Event Cards */}
      <div className="flex-1 px-4 pb-4 space-y-4 overflow-auto">
        {isLoading ? (
          // Loading skeleton
          [...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl border border-zinc-100 overflow-hidden shadow-sm"
            >
              <div className="h-40 bg-zinc-200 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-5 bg-zinc-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-zinc-200 rounded animate-pulse" />
                <div className="flex gap-3">
                  <div className="h-10 bg-zinc-200 rounded-full animate-pulse flex-1" />
                  <div className="h-10 bg-zinc-200 rounded-full animate-pulse flex-1" />
                </div>
              </div>
            </div>
          ))
        ) : error ? (
          <div className="text-center py-8 text-zinc-500 text-sm">
            {t("common.errorLoading")}
          </div>
        ) : filteredEvents.length === 0 ? (
          <div className="text-center py-8 text-zinc-500 text-sm">
            {t("common.noData")}
          </div>
        ) : (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white rounded-xl border border-zinc-100 overflow-hidden shadow-sm"
            >
              {/* Event Image */}
              <div className="relative h-40 bg-gradient-to-r from-zinc-700 to-zinc-500">
                <Image
                  src={event.image}
                  alt={event.title}
                  fill
                  className="object-cover"
                  onError={(e) => {
                    // Hide broken image, show gradient background
                    e.currentTarget.style.display = "none";
                  }}
                />
              </div>

              {/* Event Content */}
              <div className="p-4">
                <h3 className="text-base font-semibold text-zinc-800 mb-1">
                  {event.title}
                </h3>
                <p className="text-sm text-zinc-500 mb-4 line-clamp-2">
                  {event.description}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1 bg-dark hover:bg-dark/90 text-white rounded-full"
                    onClick={() => setSelectedEvent(event)}
                  >
                    INFO
                  </Button>
                  <Button
                    className="flex-1 bg-primary hover:bg-primary/90 text-white rounded-full"
                    onClick={() => handleClaimPromo(event.id)}
                    disabled={claimPromoMutation.isPending}
                  >
                    {claimPromoMutation.isPending ? "..." : "APPLY"}
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav />

      {/* Event Details Modal */}
      <EventDetailsModal
        isOpen={!!selectedEvent}
        onClose={() => setSelectedEvent(null)}
        event={selectedEvent}
      />
    </div>
    </RequireAuth>
  );
}
