"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Header } from "@/components/layout";
import Image from "next/image";

const reportOptions = [
  {
    id: "game-record",
    label: "Game Record",
    icon: "/images/icon/game_record_options_icon.png",
    href: "/report/game-record",
  },
  {
    id: "turnover",
    label: "Turnover Report",
    icon: "/images/icon/turnover_report_option_icon.png",
    href: "/report/turnover",
  },
];

export default function ReportPage() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 space-y-3">
        {reportOptions.map((option) => (
          <Link
            key={option.id}
            href={option.href}
            className="flex items-center justify-between p-4 bg-[#D4F1F0] rounded-2xl"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center">
                <Image
                  src={option.icon}
                  alt="calendar"
                  width={20}
                  height={20}
                  className="w-6 h-6 object-contain"
                  unoptimized
                />
              </div>
              <span className="text-sm font-roboto-medium text-zinc-800">
                {option.label}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </Link>
        ))}
      </main>
    </div>
  );
}
