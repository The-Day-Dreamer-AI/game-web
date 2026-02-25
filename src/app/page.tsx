"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  BannerSlider,
  WelcomeCard,
  GuestWelcomeCard,
  GameCategories,
  GameProviderGrid,
  AnnouncementModal,
} from "@/components/home";
import { Marquee } from "@/components/ui/marquee";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useLoadingOverlay } from "@/providers/loading-overlay-provider";
import { useLoginModal } from "@/providers/login-modal-provider";
import { useDiscover, useLaunchGame } from "@/hooks/use-discover";
import { ApiError } from "@/lib/api";
import { systemApi } from "@/lib/api/services/system";
import type { Game, AnnouncementResponse } from "@/lib/api/types";

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
    isHot: game.IsHot,
  };
}

export default function HomePage() {
  const router = useRouter();
  const [activeCategory, setActiveCategory] = useState("slots");
  const [visualActiveCategory, setVisualActiveCategory] = useState("slots");
  const [slideDirection, setSlideDirection] = useState<"left" | "right">("right");
  const [animationDuration, setAnimationDuration] = useState(0.25);
  const [launchingGameId, setLaunchingGameId] = useState<string | null>(null);
  const previousCategoryRef = useRef(activeCategory);
  const steppingTimersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const { t, locale } = useI18n();
  const { isAuthenticated, user } = useAuth();
  const { showLoading, hideLoading } = useLoadingOverlay();
  const { openLoginModal } = useLoginModal();

  // Announcement modal state
  const [announcementData, setAnnouncementData] =
    useState<AnnouncementResponse | null>(null);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  // Fetch discover data from API
  const { data: discoverData, isLoading, error } = useDiscover();

  // Fetch announcement for guest users
  useEffect(() => {
    if (isAuthenticated) return;

    systemApi
      .getAnnouncement()
      .then((data) => {
        if (data.HasAnnouncement) {
          setAnnouncementData(data);
          setShowAnnouncement(true);
        }
      })
      .catch(() => {
        // Silently ignore announcement fetch errors
      });
  }, [isAuthenticated]);

  // Clean up stepping timers on unmount
  useEffect(() => {
    return () => {
      steppingTimersRef.current.forEach(clearTimeout);
    };
  }, []);

  // Handle category change: for multi-step jumps, carousel through each intermediate category
  const handleCategoryChange = useCallback((newCategory: string) => {
    // Use ref to avoid stale closure during animation chains
    if (newCategory === previousCategoryRef.current) return;

    // Clear any in-progress stepping timers
    steppingTimersRef.current.forEach(clearTimeout);
    steppingTimersRef.current = [];

    if (discoverData?.GameCategories) {
      const categories = discoverData.GameCategories;
      const prevIndex = categories.findIndex(
        (cat) => cat.Name.toLowerCase() === previousCategoryRef.current
      );
      const currentIndex = categories.findIndex(
        (cat) => cat.Name.toLowerCase() === newCategory
      );

      const distance = Math.abs(currentIndex - prevIndex);
      setSlideDirection(currentIndex > prevIndex ? "right" : "left");

      if (distance <= 1) {
        // Single step: standard slide
        setAnimationDuration(0.15);
        setVisualActiveCategory(newCategory);
        previousCategoryRef.current = newCategory;
        setActiveCategory(newCategory);
      } else {
        // Multi-step: carousel through each intermediate category
        const step = currentIndex > prevIndex ? 1 : -1;
        const perStepDuration = 0.06; // fast per-step slide
        setAnimationDuration(perStepDuration);
        const stepDelayMs = perStepDuration * 1000;

        // First step fires immediately
        const firstCatName = categories[prevIndex + step]?.Name.toLowerCase();
        if (firstCatName) {
          setVisualActiveCategory(firstCatName);
          previousCategoryRef.current = firstCatName;
          setActiveCategory(firstCatName);
        }

        // Remaining steps on timers
        for (let i = 2; i <= distance; i++) {
          const idx = prevIndex + step * i;
          const isLast = i === distance;
          const timer = setTimeout(() => {
            const catName = categories[idx]?.Name.toLowerCase();
            if (catName) {
              // Final step gets a slightly slower, settling duration
              if (isLast) setAnimationDuration(0.12);
              setVisualActiveCategory(catName);
              previousCategoryRef.current = catName;
              setActiveCategory(catName);
            }
            if (isLast) {
              steppingTimersRef.current = [];
            }
          }, stepDelayMs * (i - 1));
          steppingTimersRef.current.push(timer);
        }
      }
    } else {
      setVisualActiveCategory(newCategory);
      previousCategoryRef.current = newCategory;
      setActiveCategory(newCategory);
    }
  }, [discoverData?.GameCategories]);

  const launchGameMutation = useLaunchGame();

  const handleLaunchGame = async (game: { id: string; name: string }) => {
    // Check if user is authenticated before launching game
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }

    try {
      setLaunchingGameId(game.id);
      showLoading("Launching game...");
      const result = await launchGameMutation.mutateAsync(game.id);

      if (result.LaunchType === "Browser" && result.Url) {
        // Browser type opens in new tab, hide loading
        hideLoading();
        window.open(result.Url, "_blank");
      } else if (result.Url) {
        // Webview/App types - navigate to game page with iframe
        hideLoading();
        const params = new URLSearchParams({
          url: result.Url,
          name: game.name,
        });
        router.push(`/game?${params.toString()}`);
      } else {
        // No URL returned, hide loading
        hideLoading();
      }
    } catch (err) {
      hideLoading();
      const errorMessage =
        err instanceof ApiError
          ? err.message || "Failed to launch game."
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
      .join(" ");
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
  // Use Avatar from Discover API response since auth context doesn't populate avatar
  const authenticatedUserData = user
    ? {
        username: discoverData?.Name ?? user.name,
        avatar: discoverData?.Avatar,
        isVerified: true,
        cashBalance: discoverData?.Cash ?? 128000.0,
        chipsBalance: discoverData?.Chip ?? 0.0,
        aPoints: discoverData?.Point ?? 900,
      }
    : userData;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Announcement Modal for guest users */}
      <AnnouncementModal
        isOpen={showAnnouncement}
        onClose={() => setShowAnnouncement(false)}
        announcement={announcementData}
      />

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
        <div className="flex items-center gap-2 py-1.5 px-3 bg-[#D4F1F0] border border-primary">
          <Image
            src="/images/marquee/sound_icon.png"
            alt="AON1E sound"
            width={24}
            height={24}
            unoptimized
            className="h-4 w-auto object-contain"
          />
          <Marquee speed={0.15} className="flex-1">
            <span className="text-[11px] font-roboto-medium text-dark whitespace-nowrap px-4">
              {runningMessage}
            </span>
          </Marquee>
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
            categories={discoverData?.GameCategories || []}
            activeCategory={visualActiveCategory}
            onCategoryChange={handleCategoryChange}
            isLoading={!discoverData?.GameCategories}
          />
        </div>

        {/* Game Providers Grid with slide animation */}
        <div className="px-4 mt-4">
          {isLoading ? (
            <div className="grid max-[380px]:grid-cols-3 grid-cols-4 gap-1">
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
          ) : (
            <div className="relative overflow-hidden">
              <AnimatePresence initial={false} custom={slideDirection}>
                <motion.div
                  key={activeCategory}
                  custom={slideDirection}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  variants={{
                    enter: (dir: "left" | "right") => ({
                      x: dir === "right" ? "100%" : "-100%",
                      position: "absolute" as const,
                      top: 0,
                      left: 0,
                      right: 0,
                    }),
                    center: {
                      x: 0,
                      position: "relative" as const,
                    },
                    exit: (dir: "left" | "right") => ({
                      x: dir === "right" ? "-100%" : "100%",
                      position: "absolute" as const,
                      top: 0,
                      left: 0,
                      right: 0,
                    }),
                  }}
                  transition={{
                    type: "tween",
                    duration: animationDuration,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  style={{
                    willChange: "transform",
                    backfaceVisibility: "hidden",
                    WebkitBackfaceVisibility: "hidden",
                  }}
                >
                  {currentProviders.length > 0 ? (
                    <GameProviderGrid
                      providers={currentProviders}
                      onSelect={handleLaunchGame}
                      loadingId={launchingGameId}
                    />
                  ) : (
                    <div className="flex items-center justify-center min-h-[200px] h-full text-zinc-500 text-sm">
                      {t("common.noData")}
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
