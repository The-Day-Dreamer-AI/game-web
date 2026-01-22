"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { useRebates } from "@/hooks";

type GameCategory = "SLOT" | "FISH" | "LIVE" | "SPORTS" | "LOTTERY" | "OTHER";

// Categorize games based on their Code or Name patterns
function getGameCategory(code: string, name: string): GameCategory {
  const upperCode = code.toUpperCase();
  const upperName = name.toUpperCase();

  // Fish games - check code first
  if (upperCode.includes("FISH")) return "FISH";

  // Live/Casino games
  if (
    upperCode.includes("LIVE") ||
    upperCode === "EVOLUTIONGAMING" ||
    upperCode === "BG" ||
    upperCode === "AG" ||
    upperCode === "SEXYGAMING" ||
    upperCode === "DG" ||
    upperCode === "KING855" ||
    upperCode === "SAGAMING" ||
    upperCode === "YEEBET" ||
    upperCode === "WCASINO" ||
    upperCode === "MT" ||
    upperCode === "VIVO" ||
    upperName.includes("LIVE") ||
    upperName.includes("CASINO")
  ) {
    return "LIVE";
  }

  // Sports games
  if (
    upperCode === "IBC" ||
    upperCode === "OBET" ||
    upperCode === "AFB" ||
    upperName.includes("SPORT") ||
    upperName.includes("BET")
  ) {
    return "SPORTS";
  }

  // Lottery games
  if (
    upperCode === "EKOR" ||
    upperCode === "VBOSS" ||
    upperCode === "VBOSSGD" ||
    upperCode === "ABS" ||
    upperCode === "BT28WIN" ||
    upperCode === "RCB" ||
    upperCode === "SUPERLOTTO" ||
    upperCode === "WIN28" ||
    upperName.includes("LOTTERY") ||
    upperName.includes("LOTTO")
  ) {
    return "LOTTERY";
  }

  // Default to SLOT for all other games (slots are the most common)
  return "SLOT";
}

export default function RebateListPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();

  // Fetch rebates
  const { data: rebatesData, isLoading } = useRebates({
    enabled: isAuthenticated,
  });

  const games = rebatesData?.Games ?? [];

  // Category display names using translations
  const categoryNames: Record<GameCategory, string> = {
    SLOT: t("games.slots"),
    FISH: t("games.fishing"),
    LIVE: t("games.live"),
    SPORTS: t("games.sports"),
    LOTTERY: t("games.lottery"),
    OTHER: t("rebate.other"),
  };

  // Group games by category
  const groupedGames = useMemo(() => {
    const groups: Record<GameCategory, typeof games> = {
      SLOT: [],
      FISH: [],
      LIVE: [],
      SPORTS: [],
      LOTTERY: [],
      OTHER: [],
    };

    games.forEach((game) => {
      const category = getGameCategory(game.Code, game.Name);
      groups[category].push(game);
    });

    // Return only non-empty categories in order
    const orderedCategories: GameCategory[] = [
      "SLOT",
      "FISH",
      "LIVE",
      "SPORTS",
      "LOTTERY",
      "OTHER",
    ];
    return orderedCategories
      .filter((cat) => groups[cat].length > 0)
      .map((cat) => ({ category: cat, games: groups[cat] }));
  }, [games]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header variant="subpage" title={t("account.rebateList")} />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-zinc-500 text-center">
            {t("common.loginRequired")}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header variant="subpage" title={t("account.rebateList")} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image - constrained to max-w-[430px] */}
      <div className="absolute inset-0 z-0 max-w-[430px] mx-auto left-0 right-0">
        <Image
          src="/images/background/rebate_list_background.png"
          alt=""
          fill
          className="object-cover object-top"
          priority
        />
      </div>

      {/* Header */}
      <div className="relative z-10">
        <Header variant="subpage" title={t("account.rebateList")} />
      </div>

      {/* Banner */}
      <div className="px-4 pt-4 relative rounded-lg mt-6 flex justify-center">
        <Image
          src="/images/title_white.png"
          alt="AON1E"
          width={80}
          height={32}
          className="h-12 w-auto object-contain shadow-2xl"
          unoptimized
        />
      </div>

      {/* Table Header */}
      <div className="relative z-10 mx-4 mt-4">
        <div className="grid grid-cols-4 bg-[#28323C] text-white text-sm font-roboto-bold rounded-t-lg overflow-hidden">
          <div className="p-2 text-center">{t("rebate.game")}</div>
          <div className="p-2 text-center">{t("rebate.playerPercent")}</div>
          <div className="p-2 text-center">{t("rebate.uplineL1Percent")}</div>
          <div className="p-2 text-center">{t("rebate.uplineL2Percent")}</div>
        </div>
      </div>

      {/* Table Content */}
      <div className="relative z-10 flex-1 mx-4 mb-4 bg-white rounded-b-lg overflow-hidden">
        <div className="overflow-auto">
          {groupedGames.map(({ category, games: categoryGames }) => (
            <div key={category}>
              {/* Category Header */}
              <div className="bg-primary text-white text-base font-roboto-bold py-2 px-4 text-center sticky top-0 italic">
                {categoryNames[category]}
              </div>

              {/* Games in Category */}
              {categoryGames.map((game) => (
                <div
                  key={game.Id}
                  className="grid grid-cols-4 text-sm bg-white border-b border-zinc-200"
                >
                  <div className="p-2 text-center text-[#5F7182] font-roboto-regular truncate border-r border-zinc-200">
                    {game.Name}
                  </div>
                  <div className="p-2 text-center text-[#5F7182] font-roboto-bold border-r border-zinc-200">
                    {game.PlayerCommRate.toFixed(1)}
                  </div>
                  <div className="p-2 text-center text-[#5F7182] font-roboto-bold border-r border-zinc-200">
                    {game.PlayerL1CommRate.toFixed(1)}
                  </div>
                  <div className="p-2 text-center text-[#5F7182] font-roboto-bold">
                    {game.PlayerL2CommRate.toFixed(1)}
                  </div>
                </div>
              ))}
            </div>
          ))}

          {games.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
              <p>{t("rebate.noData")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
