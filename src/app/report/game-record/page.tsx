"use client";

import { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { Header } from "@/components/layout";
import { cn } from "@/lib/utils";

// Mock game options
const gameOptions = ["PPSLOT", "PGSOFT", "JILI", "SPADEGAMING", "ALL"];

// Mock data
const mockGameRecords = [
  { date: "2025 Nov 24", time: "12:11", game: "PPSLOT", stake: 0.5, turnover: 0.5, profit: -0.5 },
  { date: "2025 Nov 24", time: "10:11", game: "PPSLOT", stake: 0.5, turnover: 0.5, profit: 0.5 },
  { date: "2025 Nov 23", time: "15:30", game: "PGSOFT", stake: 1.0, turnover: 1.0, profit: -0.2 },
  { date: "2025 Nov 23", time: "14:00", game: "JILI", stake: 2.0, turnover: 2.0, profit: 1.5 },
];

const mockSummary = {
  totalTurnover: 1.00,
  totalProfit: 0.00,
};

export default function GameRecordPage() {
  const [startDate, setStartDate] = useState("2025-11-24 23:59");
  const [endDate, setEndDate] = useState("2025-11-24 00:00");
  const [selectedGame, setSelectedGame] = useState("PPSLOT");
  const [showGameDropdown, setShowGameDropdown] = useState(false);

  const handleSearch = () => {
    // TODO: API call to fetch game records
    console.log("Searching:", { startDate, endDate, selectedGame });
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header variant="subpage" title="Game Record" backHref="/report" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Filters */}
        <div className="p-4 space-y-3">
          {/* Start Date */}
          <div className="flex items-center gap-3 px-4 py-3 border border-zinc-200 rounded-lg bg-white">
            <Calendar className="w-5 h-5 text-primary shrink-0" />
            <input
              type="text"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="Start date"
              className="flex-1 focus:outline-none text-zinc-800 text-sm"
            />
          </div>

          {/* End Date */}
          <div className="flex items-center gap-3 px-4 py-3 border border-zinc-200 rounded-lg bg-white">
            <Calendar className="w-5 h-5 text-primary shrink-0" />
            <input
              type="text"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              placeholder="End date"
              className="flex-1 focus:outline-none text-zinc-800 text-sm"
            />
          </div>

          {/* Game Dropdown and Search */}
          <div className="flex items-center gap-3">
            {/* Game Dropdown */}
            <div className="relative flex-1">
              <button
                onClick={() => setShowGameDropdown(!showGameDropdown)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 border border-zinc-200 rounded-lg bg-white"
              >
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center">
                    <span className="text-primary text-xs font-roboto-bold">G</span>
                  </div>
                  <span className="text-zinc-800 text-sm">{selectedGame}</span>
                </div>
                <ChevronDown className={cn("w-5 h-5 text-zinc-400 transition-transform", showGameDropdown && "rotate-180")} />
              </button>

              {showGameDropdown && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg z-10">
                  {gameOptions.map((game) => (
                    <button
                      key={game}
                      onClick={() => {
                        setSelectedGame(game);
                        setShowGameDropdown(false);
                      }}
                      className={cn(
                        "w-full px-4 py-2.5 text-left text-sm hover:bg-zinc-50 transition-colors",
                        selectedGame === game ? "text-primary font-roboto-medium" : "text-zinc-700"
                      )}
                    >
                      {game}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Button */}
            <button
              onClick={handleSearch}
              className="px-6 py-3 bg-primary text-white text-sm font-roboto-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              Search
            </button>
          </div>
        </div>

        {/* Summary Card */}
        <div className="mx-4 mb-4 bg-primary rounded-xl p-4">
          <div className="flex">
            <div className="flex-1 text-center">
              <p className="text-white/80 text-xs mb-1">Total Turnover</p>
              <p className="text-white font-roboto-bold">MYR {mockSummary.totalTurnover.toFixed(2)}</p>
            </div>
            <div className="flex-1 text-center">
              <p className="text-white/80 text-xs mb-1">Total Profit</p>
              <p className="text-white font-roboto-bold">MYR {mockSummary.totalProfit.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Table Header */}
        <div className="grid grid-cols-5 gap-2 px-4 py-3 bg-dark text-white text-xs font-roboto-medium">
          <div>Date</div>
          <div>Game</div>
          <div className="text-right">Stake</div>
          <div className="text-right">Turnover</div>
          <div className="text-right">Profit</div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-zinc-100">
          {mockGameRecords.map((record, index) => (
            <div key={index} className="grid grid-cols-5 gap-2 px-4 py-3 text-xs">
              <div className="text-zinc-600">
                <div>{record.date}</div>
                <div className="text-zinc-400">{record.time}</div>
              </div>
              <div className="text-zinc-800 flex items-center">{record.game}</div>
              <div className="text-zinc-800 text-right flex items-center justify-end">{record.stake.toFixed(1)}</div>
              <div className="text-zinc-800 text-right flex items-center justify-end">{record.turnover.toFixed(1)}</div>
              <div className={cn(
                "text-right flex items-center justify-end font-roboto-medium",
                record.profit >= 0 ? "text-primary" : "text-red-500"
              )}>
                {record.profit >= 0 ? record.profit.toFixed(1) : record.profit.toFixed(1)}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
