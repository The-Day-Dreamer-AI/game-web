"use client";

import Link from "next/link";
import { ChevronRight, Gamepad2, FileText } from "lucide-react";
import { Header } from "@/components/layout";

const reportOptions = [
  {
    id: "game-record",
    label: "Game Record",
    icon: Gamepad2,
    href: "/report/game-record",
  },
  {
    id: "turnover",
    label: "Turnover Report",
    icon: FileText,
    href: "/report/turnover",
  },
];

export default function ReportPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header variant="subpage" title="Report" backHref="/account" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-4 space-y-3">
        {reportOptions.map((option) => (
          <Link
            key={option.id}
            href={option.href}
            className="flex items-center justify-between p-4 bg-white border border-zinc-200 rounded-xl hover:bg-zinc-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <option.icon className="w-5 h-5 text-primary" />
              </div>
              <span className="text-sm font-roboto-medium text-zinc-800">{option.label}</span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </Link>
        ))}
      </main>
    </div>
  );
}
