"use client";

import { useState } from "react";
import Image from "next/image";
import { Volume2 } from "lucide-react";
import { BottomNav, Header, AppDownloadBanner } from "@/components/layout";
import {
  BannerSlider,
  WelcomeCard,
  GuestWelcomeCard,
  GameCategories,
  GameProviderGrid,
} from "@/components/home";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useDiscover, useLaunchGame } from "@/hooks/use-discover";
import { ApiError } from "@/lib/api";
import type { Game } from "@/lib/api/types";

// Mock user data (TODO: Replace with user profile API when available)
const userData = {
  username: "design111",
  avatar: "/avatar.png",
  isVerified: true,
  cashBalance: 128000.0,
  chipsBalance: 0.0,
  aPoints: 900,
};

// Fallback banner data (used if API returns no banners)
const fallbackBanners = [
  {
    id: "1",
    image: "/banners/banner-1.png",
    alt: "AONE x ADVANTPLAY - Exclusive Campaign",
  },
  {
    id: "2",
    image: "/banners/banner-2.png",
    alt: "Welcome Bonus",
  },
  {
    id: "3",
    image: "/banners/banner-3.png",
    alt: "Daily Rewards",
  },
];

// Map API category names to our internal category IDs
const categoryNameMapping: Record<string, string> = {
  slots: "slots",
  slots2: "appSlot", // API uses "Slots2" for App Slots
  live: "live",
  sports: "sports",
  lottery: "lottery",
  fishing: "fishing",
};

// Transform API game to component format
function transformGame(game: Game) {
  return {
    id: game.Id,
    name: game.Name,
    image: game.Image || "/placeholder-game.png",
    href: `/games/${game.Id}`,
    isHot: game.IsHot,
  };
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("slots");
  const [launchingGameId, setLaunchingGameId] = useState<string | null>(null);
  const { t, locale } = useI18n();
  const { isAuthenticated, user } = useAuth();

  // Fetch discover data from API
  const { data: discoverData, isLoading, error } = useDiscover();
  const launchGameMutation = useLaunchGame();

  const handleLaunchGame = async (game: ReturnType<typeof transformGame>) => {
    try {
      setLaunchingGameId(game.id);
      const result = await launchGameMutation.mutateAsync(game.id);

      if (result.LaunchType !== "Browser" && result.Url) {
        // Launch in current tab for Webview/App types
        window.location.href = result.Url;
      }
    } catch (err) {
      const errorMessage =
        err instanceof ApiError
          ? err.code === 401
            ? "Please sign in to play this game."
            : err.message || "Failed to launch game."
          : "Failed to launch game. Please try again.";

      alert(errorMessage);
    } finally {
      setLaunchingGameId(null);
    }
  };

  // Transform banners from API
  const banners = (() => {
    if (!discoverData?.Banners?.length) return fallbackBanners;

    return discoverData.Banners.map((banner) => {
      // Select image based on locale
      let image = banner.Image;
      if (locale === "zh" && banner.ImageCn) {
        image = banner.ImageCn;
      } else if (locale === "ms" && banner.ImageMy) {
        image = banner.ImageMy;
      }

      return {
        id: banner.Id,
        image: image,
        alt: `Banner ${banner.Id}`,
      };
    });
  })();

  // Get running message for marquee
  const runningMessage = (() => {
    if (!discoverData?.RunningMessages?.length) return t("home.announcement");

    const messages = discoverData.RunningMessages;
    // Combine all messages, selecting based on locale
    return messages
      .map((msg) => {
        if (locale === "zh" && msg.MessageCn) return msg.MessageCn;
        if (locale === "ms" && msg.MessageMy) return msg.MessageMy;
        return msg.Message;
      })
      .filter(Boolean)
      .join(" | ");
  })();

  // Group games by category
  const gamesByCategory = (() => {
    if (!discoverData?.Games) return {};

    const result: Record<string, ReturnType<typeof transformGame>[]> = {};

    // Only include active games (Status = "A")
    const activeGames = discoverData.Games.filter(
      (game) => game.Status === "A"
    );

    activeGames.forEach((game) => {
      if (!game.GameCategory) return; // Skip games without a category

      // Normalize the category name to our internal ID
      const normalizedCategory =
        categoryNameMapping[game.GameCategory.toLowerCase()] ||
        game.GameCategory.toLowerCase();

      if (!result[normalizedCategory]) {
        result[normalizedCategory] = [];
      }

      result[normalizedCategory].push(transformGame(game));
    });

    return result;
  })();

  // Get current providers for selected category
  const currentProviders = gamesByCategory[activeCategory] || [];

  // Build user data from auth context when authenticated
  const authenticatedUserData = user
    ? {
        username: user.name,
        avatar: user.avatar,
        isVerified: true,
        cashBalance: discoverData?.Cash ?? 128000.0,
        chipsBalance: discoverData?.Chip ?? 0.0,
        aPoints: discoverData?.Point ?? 900,
      }
    : userData;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* App Download Banner */}
      <AppDownloadBanner />

      {/* Header */}
      <Header variant="logo" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-7">
        {/* Banner Slider - Full width, no padding, no dots, no border radius */}
        <BannerSlider
          banners={banners}
          autoPlayInterval={4000}
          showDots={false}
          rounded={false}
        />

        {/* Announcement Bar - Full width, no border radius */}
        <div className="flex items-center gap-2 py-0.5 px-3 bg-[#D4F1F0]">
          <Image
            src="/aone/Icon_Annoucment.webp"
            alt="AON1E sound"
            width={24}
            height={24}
            className="h-7 w-auto object-contain"
          />
          <div className="overflow-hidden flex-1">
            <p className="text-[11px] font-roboto-medium text-dark whitespace-nowrap animate-marquee">
              {runningMessage}
            </p>
          </div>
        </div>

        {/* Welcome Card / Guest Login */}
        <div className="px-4 mt-4">
          {isAuthenticated ? (
            <WelcomeCard user={authenticatedUserData} />
          ) : (
            <GuestWelcomeCard />
          )}
        </div>

        {/* Game Categories */}
        <div className="px-4 mt-4">
          <GameCategories
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Game Providers Grid */}
        <div className="px-4 mt-4">
          {isLoading ? (
            <div className="grid grid-cols-4 gap-1">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-xl bg-zinc-200 animate-pulse"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-8 text-zinc-500 text-sm">
              {t("common.errorLoading")}
            </div>
          ) : currentProviders.length > 0 ? (
            <GameProviderGrid
              providers={currentProviders}
              columns={4}
              onSelect={handleLaunchGame}
              loadingId={launchingGameId}
            />
          ) : (
            <div className="text-center py-8 text-zinc-500 text-sm">
              {t("common.noData")}
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
