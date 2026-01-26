"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { RequireAuth } from "@/components/auth";
import { Button } from "@/components/ui/button";
import { EventDetailsModal } from "@/components/event";
import { cn } from "@/lib/utils";
import { useEvents, useClaimPromo } from "@/hooks/use-events";
import { useI18n } from "@/providers/i18n-provider";
import type { Promo } from "@/lib/api/types";

const categories = [
  { id: "all", label: "ALL" },
  { id: "slots", label: "SLOTS" },
  { id: "app-slots", label: "APP SLOTS" },
  { id: "live", label: "LIVE" },
  { id: "sports", label: "SPORTS" },
  { id: "lottery", label: "LOTTERY" },
  { id: "fishing", label: "FISHING" },
];

// Transform API promo to component format
interface TransformedEvent {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string[];
  htmlContent: string;
  mode?: string;
  type?: string;
  freq?: string;
}

function transformPromo(promo: Promo, lang: string): TransformedEvent {
  // Get localized name based on language
  const getName = () => {
    if (lang === "zh" && promo.NameCn) return promo.NameCn;
    if (lang === "ms" && promo.NameMy) return promo.NameMy;
    return promo.Name;
  };

  // Get localized terms & conditions based on language
  const getTnc = () => {
    if (lang === "zh" && promo.TncCn) return promo.TncCn;
    if (lang === "ms" && promo.TncMy) return promo.TncMy;
    return promo.Tnc;
  };

  // Get localized image based on language
  const getImage = () => {
    if (lang === "zh" && promo.ImageCn) return promo.ImageCn;
    if (lang === "ms" && promo.ImageMy) return promo.ImageMy;
    return promo.Image;
  };

  const name = getName();
  const tnc = getTnc();

  return {
    id: promo.Id,
    image: getImage(),
    title: name,
    description: tnc,
    // Map Type to categories - show in all for now since API doesn't provide exact category mapping
    category: [
      "all",
      "slots",
      "app-slots",
      "live",
      "sports",
      "lottery",
      "fishing",
    ],
    htmlContent: `
      <h2>${name}</h2>
      <p>${tnc}</p>
      ${promo.Mode ? `<p><strong>Mode:</strong> ${promo.Mode}</p>` : ""}
      ${promo.Type ? `<p><strong>Type:</strong> ${promo.Type}</p>` : ""}
      ${promo.Freq ? `<p><strong>Frequency:</strong> ${promo.Freq}</p>` : ""}
      ${promo.Rate > 0 ? `<p><strong>Rate:</strong> ${promo.Rate}%</p>` : ""}
      ${
        promo.Amount > 0
          ? `<p><strong>Amount:</strong> ${promo.Amount}</p>`
          : ""
      }
    `,
    mode: promo.Mode,
    type: promo.Type,
    freq: promo.Freq,
  };
}

export default function EventPage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedEvent, setSelectedEvent] = useState<TransformedEvent | null>(
    null
  );
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    eventId: string;
    eventName: string;
  }>({ isOpen: false, eventId: "", eventName: "" });
  const scrollRef = useRef<HTMLDivElement>(null);
  const { t, locale } = useI18n();

  // Fetch events from API
  const { data: promos, isLoading, error } = useEvents();
  const claimPromoMutation = useClaimPromo();

  // Transform API promos
  const events = promos?.map((promo) => transformPromo(promo, locale)) || [];

  // Filter events by category (currently all events show in all categories since API doesn't provide category)
  const filteredEvents = events.filter((event) =>
    event.category.includes(activeCategory)
  );

  const handleApply = (event: TransformedEvent) => {
    if (event.mode === "Direct Claim" && event.id) {
      // Show confirmation modal for Direct Claim
      setConfirmModal({
        isOpen: true,
        eventId: event.id,
        eventName: event.title,
      });
    } else {
      // Navigate to instant deposit page with query params
      router.push(`/deposit/instant?fromEvent=true&promoName=${encodeURIComponent(event.title)}`);
    }
  };

  const handleConfirmClaim = async () => {
    try {
      await claimPromoMutation.mutateAsync(confirmModal.eventId);
      setConfirmModal({ isOpen: false, eventId: "", eventName: "" });
    } catch {
      // Error is handled by the mutation
    }
  };

  return (
    <RequireAuth>
      <div className="relative min-h-screen flex flex-col">

        {/* Horizontally Scrollable Categories */}
        <div
          ref={scrollRef}
          className="flex gap-1 px-4 py-3 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "shrink-0 px-3 py-2 rounded-lg text-[10px] font-roboto-bold whitespace-nowrap shadow-md cursor-pointer",
                activeCategory === category.id
                  ? "bg-primary text-white"
                  : "bg-linear-to-b from-white to-[#F2F4F9] text-[#28323C] border border-white"
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
            <div className="flex flex-col justify-center items-center py-26 text-[#A9ADB1] text-xs font-roboto-medium gap-9">
              <Image
                src="/images/icon/no_info_calender_icon.png"
                alt="AON1E"
                width={200}
                height={200}
                unoptimized
                className="h-36 w-auto object-contain"
              />
              {t("event.noEvents")}
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white rounded-xl border border-zinc-100 overflow-hidden shadow-sm"
              >
                {/* Event Image */}
                <div className="relative h-36 bg-primary">
                  <Image
                    src={event.image}
                    alt={event.title}
                    unoptimized
                    fill
                    className="object-cover"
                    onError={(e) => {
                      // Hide broken image, show gradient background
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>

                {/* Event Content */}
                <div className="p-3 flex flex-col gap-1">
                  <div className="text-base font-roboto-bold text-[#28323C]">
                    {event.title}
                  </div>
                  <p className="text-xs text-zinc-500 line-clamp-2 mb-1">
                    {event.description}
                  </p>
                  {event.freq && (
                    <p className="text-xs text-primary mb-1">{event.freq}</p>
                  )}

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="secondary"
                      className="flex-1 bg-dark hover:bg-dark text-white rounded-lg font-roboto-bold text-sm py-6"
                      onClick={() => setSelectedEvent(event)}
                    >
                      INFO
                    </Button>
                    <Button
                      className="flex-1 bg-primary hover:bg-primary text-white rounded-lg font-roboto-bold text-sm py-6"
                      onClick={() => handleApply(event)}
                      disabled={claimPromoMutation.isPending}
                    >
                      {claimPromoMutation.isPending ? "..." : t("event.apply")}
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Event Details Modal */}
        <EventDetailsModal
          isOpen={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          event={selectedEvent}
        />

        {/* Confirmation Modal for Direct Claim */}
        {confirmModal.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setConfirmModal({ isOpen: false, eventId: "", eventName: "" })}
            />
            <div className="relative bg-white rounded-xl p-6 w-full max-w-sm text-center">
              <h3 className="text-lg font-roboto-semibold text-zinc-800 mb-2">
                {t("event.confirmTitle")}
              </h3>
              <p className="text-zinc-600 mb-6">
                {t("event.confirmMessage")}
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setConfirmModal({ isOpen: false, eventId: "", eventName: "" })}
                  className="cursor-pointer flex-1 py-3 bg-zinc-200 text-zinc-700 font-roboto-medium rounded-lg hover:bg-zinc-300 transition-colors"
                >
                  {t("common.cancel")}
                </button>
                <button
                  onClick={handleConfirmClaim}
                  disabled={claimPromoMutation.isPending}
                  className="cursor-pointer flex-1 py-3 bg-primary text-white font-roboto-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
                >
                  {claimPromoMutation.isPending ? "..." : t("common.confirm")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </RequireAuth>
  );
}
