"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { ChevronDown, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { useGameRecordSelections, useGameRecords } from "@/hooks/use-report";
import { DatePickerInput } from "@/components/ui/date-picker-input";

// Helper function to format date for API (YYYY-MM-DD HH:mm)
function formatDateForApi(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

// Helper function to format date for display
function formatDateForDisplay(dateString: string): {
  date: string;
  time: string;
} {
  const date = new Date(dateString);
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  const year = date.getFullYear();
  const month = months[date.getMonth()];
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return {
    date: `${year} ${month} ${day}`,
    time: `${hours}:${minutes}`,
  };
}

// Default dates: today at 23:59 and 7 days ago at 00:00
function getDefaultDates() {
  const today = new Date();
  today.setHours(23, 59, 0, 0);

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  sevenDaysAgo.setHours(0, 0, 0, 0);

  return {
    startDate: formatDateForApi(sevenDaysAgo),
    endDate: formatDateForApi(today),
  };
}

export default function GameRecordPage() {
  const { t } = useI18n();
  const { isAuthenticated } = useAuth();

  const defaultDates = getDefaultDates();
  const [startDate, setStartDate] = useState(defaultDates.startDate);
  const [endDate, setEndDate] = useState(defaultDates.endDate);
  const [selectedGame, setSelectedGame] = useState<string | null>(null);
  const [showGameDropdown, setShowGameDropdown] = useState(false);
  const [searchParams, setSearchParams] = useState<{
    StartDt: string;
    EndDt: string;
    Game: string;
    PageNumber: number;
  } | null>(null);

  // Fetch game selections
  const { data: selectionsData, isLoading: isLoadingSelections } =
    useGameRecordSelections({
      enabled: isAuthenticated,
    });

  // Fetch game records when search is triggered
  const {
    data: recordsData,
    isLoading: isLoadingRecords,
    isFetching: isFetchingRecords,
  } = useGameRecords(
    searchParams ?? { StartDt: "", EndDt: "", Game: "", PageNumber: 1 },
    { enabled: !!searchParams && isAuthenticated }
  );

  // Compute initial selected game from fetched data
  const defaultGame = useMemo(() => {
    if (!selectionsData?.Rows || selectionsData.Rows.length === 0) return "ALL";
    const allOption = selectionsData.Rows.find(
      (s) => s.Game.toUpperCase() === "ALL"
    );
    return allOption ? allOption.Game : selectionsData.Rows[0].Game;
  }, [selectionsData]);

  // Use selected game or default
  const currentGame = selectedGame ?? defaultGame;

  const handleSearch = () => {
    setSearchParams({
      StartDt: startDate,
      EndDt: endDate,
      Game: currentGame,
      PageNumber: 1,
    });
  };

  const gameOptions = selectionsData?.Rows ?? [];
  const records = recordsData?.Rows ?? [];
  const hasRecords = records.length > 0;
  const isSearching = isFetchingRecords;

  // Get display text for selected game
  const selectedGameDisplay =
    gameOptions.find((g) => g.Game === currentGame)?.Text || currentGame;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-zinc-500 text-center">
            {t("common.loginRequired")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Filters */}
        <div className="p-4 space-y-3">
          {/* Start Date */}
          <DatePickerInput
            value={startDate}
            onChange={setStartDate}
            placeholder="Start date"
            prefix={
              <Image
                src="/images/icon/calender_start_icon.png"
                alt="calendar"
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
                unoptimized
              />
            }
          />

          {/* End Date */}
          <DatePickerInput
            value={endDate}
            onChange={setEndDate}
            placeholder="End date"
            prefix={
              <Image
                src="/images/icon/calender_end_icon.png"
                alt="calendar"
                width={20}
                height={20}
                className="w-5 h-5 object-contain"
                unoptimized
              />
            }
          />

          {/* Game Dropdown and Search */}
          <div className="flex items-center gap-3">
            {/* Game Dropdown */}
            <div className="relative flex-1">
              <button
                onClick={() => setShowGameDropdown(!showGameDropdown)}
                disabled={isLoadingSelections}
                className={cn(
                  "cursor-pointer form-input-wrapper w-full flex items-center justify-between rounded-lg border px-4 py-3 transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed",
                  showGameDropdown
                    ? "border-[#0DC3B1] bg-[rgba(0,214,198,0.1)] shadow-[0_0_20px_rgba(20,187,176,0.2)]"
                    : "border-[#959595] bg-white"
                )}
              >
                <span className="flex items-center gap-3">
                  <Image
                    src="/images/icon/game_record_options_icon.png"
                    alt="game"
                    width={20}
                    height={20}
                    className="w-5 h-5 object-contain"
                    unoptimized
                  />
                  <span className="text-sm font-roboto-regular text-zinc-900">
                    {isLoadingSelections ? "..." : selectedGameDisplay}
                  </span>
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-6 text-zinc-400 transition-transform",
                    showGameDropdown && "rotate-180"
                  )}
                />
              </button>

              {showGameDropdown && gameOptions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 rounded-lg border border-[#959595] bg-white shadow-lg z-20 py-2 flex flex-col gap-2 max-h-60 overflow-y-auto">
                  {gameOptions.map((game) => {
                    const isSelected = currentGame === game.Game;
                    return (
                      <button
                        key={game.Game}
                        onClick={() => {
                          setSelectedGame(game.Game);
                          setShowGameDropdown(false);
                        }}
                        className="w-full px-2 text-left group cursor-pointer"
                      >
                        <span
                          className={cn(
                            "block rounded-lg px-3 py-2 text-sm font-roboto-regular transition-colors",
                            isSelected
                              ? "border border-[#1ECAD3] bg-[#DDF7F7] text-[#008D92]"
                              : "text-zinc-900 group-hover:bg-zinc-100"
                          )}
                        >
                          {game.Text}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              disabled={isSearching || isLoadingSelections}
              className="px-6 py-3 bg-primary text-white text-sm font-roboto-medium rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              {isSearching && <Loader2 className="w-4 h-4 animate-spin" />}
              {t("common.search")}
            </button>
          </div>
        </div>

        {/* Results */}
        {isLoadingRecords ? (
          <div className="flex-1 flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : searchParams && hasRecords ? (
          <>
            {/* Summary Card */}
            <div className="mx-4 mb-4 bg-primary rounded-xl p-4">
              <div className="flex">
                <div className="flex-1 text-center border-r border-white/20">
                  <p className="text-white/80 text-xs mb-1">
                    {t("report.totalTurnover")}
                  </p>
                  <p className="text-white font-roboto-bold">
                    MYR {(recordsData?.TotalTurnover ?? 0).toFixed(2)}
                  </p>
                </div>
                <div className="flex-1 text-center">
                  <p className="text-white/80 text-xs mb-1">
                    {t("report.totalProfit")}
                  </p>
                  <p className="text-white font-roboto-bold">
                    MYR {(recordsData?.TotalProfit ?? 0).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {/* Table Header */}
            <div className="grid grid-cols-5 gap-2 px-4 py-3 bg-zinc-100 text-zinc-500 text-xs font-roboto-medium">
              <div>{t("report.date")}</div>
              <div>{t("report.game")}</div>
              <div className="text-right">{t("report.stake")}</div>
              <div className="text-right">{t("report.turnover")}</div>
              <div className="text-right">{t("report.profit")}</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-zinc-100">
              {records.map((record) => {
                const { date, time } = formatDateForDisplay(record.CreatedDate);
                return (
                  <div
                    key={record.Id}
                    className="grid grid-cols-5 gap-2 px-4 py-3 text-xs"
                  >
                    <div className="text-zinc-600">
                      <div>{date}</div>
                      <div className="text-zinc-400">{time}</div>
                    </div>
                    <div className="text-zinc-800 flex items-center text-[10px]">
                      {record.GameName}
                    </div>
                    <div className="text-zinc-800 text-right flex items-center justify-end">
                      {record.Stake.toFixed(2)}
                    </div>
                    <div className="text-zinc-800 text-right flex items-center justify-end">
                      {record.Turnover.toFixed(2)}
                    </div>
                    <div
                      className={cn(
                        "text-right flex items-center justify-end font-roboto-medium",
                        record.Profit >= 0 ? "text-primary" : "text-red-500"
                      )}
                    >
                      {record.Profit.toFixed(2)}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="flex-1 flex flex-col items-center justify-center py-20">
            <div className="relative mb-4">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-zinc-300"
              >
                {/* Clipboard shape */}
                <rect
                  x="15"
                  y="15"
                  width="50"
                  height="55"
                  rx="4"
                  fill="currentColor"
                />
                {/* Clipboard top */}
                <rect
                  x="25"
                  y="10"
                  width="30"
                  height="12"
                  rx="2"
                  fill="#9CA3AF"
                />
                {/* Lines on clipboard */}
                <rect
                  x="22"
                  y="35"
                  width="36"
                  height="4"
                  rx="1"
                  fill="#9CA3AF"
                />
                <rect
                  x="22"
                  y="45"
                  width="28"
                  height="4"
                  rx="1"
                  fill="#9CA3AF"
                />
                <rect
                  x="22"
                  y="55"
                  width="32"
                  height="4"
                  rx="1"
                  fill="#9CA3AF"
                />
                {/* X circle */}
                <circle cx="52" cy="52" r="16" fill="#6B7280" />
                <path
                  d="M46 46L58 58M58 46L46 58"
                  stroke="white"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <p className="text-sm text-zinc-400">{t("report.noHistory")}</p>
          </div>
        )}
      </main>
    </div>
  );
}
