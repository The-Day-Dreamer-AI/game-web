"use client";

import { useState } from "react";
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

// Mock user data
const userData = {
  username: "design111",
  avatar: "/avatar.png",
  isVerified: true,
  cashBalance: 128000.0,
  chipsBalance: 0.0,
  aPoints: 900,
};

// Mock banner data
const banners = [
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

// Game provider type
interface GameProvider {
  id: string;
  name: string;
  image: string;
  href: string;
  isHot?: boolean;
  isNew?: boolean;
  badge?: string;
}

// Mock game providers data - organized by category
const gameProvidersByCategory: Record<string, GameProvider[]> = {
  slots: [
    {
      id: "advantplay",
      name: "ADVANTPLAY",
      image: "/providers/advantplay.png",
      href: "/games/advantplay",
      isHot: true,
    },
    {
      id: "pragmatic",
      name: "PRAGMATIC PLAY",
      image: "/providers/pragmatic.png",
      href: "/games/pragmatic",
      isHot: true,
    },
    {
      id: "lucky365",
      name: "Lucky365",
      image: "/providers/lucky365.png",
      href: "/games/lucky365",
      isHot: true,
    },
    {
      id: "bng",
      name: "BNG",
      image: "/providers/bng.png",
      href: "/games/bng",
      isHot: true,
    },
    {
      id: "mega888",
      name: "MEGA888",
      image: "/providers/mega888.png",
      href: "/games/mega888",
      isHot: true,
    },
    {
      id: "afb777",
      name: "AFB777",
      image: "/providers/afb777.png",
      href: "/games/afb777",
      isHot: true,
    },
    {
      id: "relax",
      name: "RELAX GAMING",
      image: "/providers/relax.png",
      href: "/games/relax",
      isHot: true,
    },
    {
      id: "nextspin",
      name: "NEXTSPIN",
      image: "/providers/nextspin.png",
      href: "/games/nextspin",
      isHot: true,
    },
    {
      id: "918kiss",
      name: "918Kiss",
      image: "/providers/918kiss.png",
      href: "/games/918kiss",
      badge: "H5",
    },
    {
      id: "mega888-2",
      name: "MEGA888",
      image: "/providers/mega888-2.png",
      href: "/games/mega888-h5",
      badge: "H5",
    },
    {
      id: "ace333",
      name: "ACE333",
      image: "/providers/ace333.png",
      href: "/games/ace333",
    },
    {
      id: "jili",
      name: "JILI",
      image: "/providers/jili.png",
      href: "/games/jili",
    },
  ],
  appSlot: [
    {
      id: "918kiss-app",
      name: "918Kiss",
      image: "/providers/918kiss.png",
      href: "/games/918kiss",
    },
    {
      id: "mega888-app",
      name: "MEGA888",
      image: "/providers/mega888.png",
      href: "/games/mega888",
    },
    {
      id: "pussy888",
      name: "Pussy888",
      image: "/providers/pussy888.png",
      href: "/games/pussy888",
    },
  ],
  live: [
    {
      id: "evolution",
      name: "Evolution",
      image: "/providers/evolution.png",
      href: "/games/evolution",
      isHot: true,
    },
    {
      id: "ae-sexy",
      name: "AE Sexy",
      image: "/providers/ae-sexy.png",
      href: "/games/ae-sexy",
      isHot: true,
    },
    {
      id: "sa-gaming",
      name: "SA Gaming",
      image: "/providers/sa-gaming.png",
      href: "/games/sa-gaming",
    },
  ],
  sports: [
    {
      id: "sbobet",
      name: "SBOBET",
      image: "/providers/sbobet.png",
      href: "/games/sbobet",
      isHot: true,
    },
    {
      id: "cmd368",
      name: "CMD368",
      image: "/providers/cmd368.png",
      href: "/games/cmd368",
    },
    {
      id: "im-sports",
      name: "IM Sports",
      image: "/providers/im-sports.png",
      href: "/games/im-sports",
    },
  ],
  lottery: [
    {
      id: "gd-lotto",
      name: "GD Lotto",
      image: "/providers/gd-lotto.png",
      href: "/games/gd-lotto",
    },
    {
      id: "magnum",
      name: "Magnum 4D",
      image: "/providers/magnum.png",
      href: "/games/magnum",
    },
  ],
  fishing: [
    {
      id: "jili-fishing",
      name: "JILI Fishing",
      image: "/providers/jili-fishing.png",
      href: "/games/jili-fishing",
      isHot: true,
    },
    {
      id: "spadegaming",
      name: "Spadegaming",
      image: "/providers/spadegaming.png",
      href: "/games/spadegaming",
    },
  ],
};

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("slots");
  const { t } = useI18n();
  const { isAuthenticated, user } = useAuth();

  const currentProviders =
    gameProvidersByCategory[activeCategory] || gameProvidersByCategory.slots;

  // Build user data from auth context when authenticated
  const authenticatedUserData = user
    ? {
        username: user.name,
        avatar: user.avatar,
        isVerified: true,
        cashBalance: 128000.0, // TODO: Fetch from API
        chipsBalance: 0.0,
        aPoints: 900,
      }
    : userData;

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* App Download Banner */}
      <AppDownloadBanner />

      {/* Header */}
      <Header variant="logo" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-2">
        {/* Banner Slider - Full width, no padding, no dots, no border radius */}
        <BannerSlider
          banners={banners}
          autoPlayInterval={4000}
          showDots={false}
          rounded={false}
        />

        {/* Announcement Bar - Full width, no border radius */}
        <div className="flex items-center gap-2 px-3 py-2 bg-zinc-100">
          <Volume2 className="w-4 h-4 text-primary flex-shrink-0" />
          <div className="overflow-hidden flex-1">
            <p className="text-xs text-zinc-600 whitespace-nowrap animate-marquee">
              {t("home.announcement")}
            </p>
          </div>
        </div>

        {/* Welcome Card / Guest Login */}
        <div className="px-2 mt-3">
          {isAuthenticated ? (
            <WelcomeCard user={authenticatedUserData} />
          ) : (
            <GuestWelcomeCard />
          )}
        </div>

        {/* Game Categories */}
        <div className="px-2 mt-4">
          <GameCategories
            activeCategory={activeCategory}
            onCategoryChange={setActiveCategory}
          />
        </div>

        {/* Game Providers Grid */}
        <div className="px-2 mt-3">
          <GameProviderGrid providers={currentProviders} columns={4} />
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
