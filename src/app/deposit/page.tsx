"use client";

import { useState } from "react";
import Link from "next/link";
import { Header, BottomNav } from "@/components/layout";
import { RequireAuth } from "@/components/auth";
import { ChevronUp, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";

// Mock user balance data
const walletData = {
  cashBalance: 126000.0,
  chipsBalance: 0.0,
};

// Deposit methods
const depositMethods = [
  {
    id: "instant",
    labelKey: "deposit.instantDeposit",
    href: "/deposit/instant",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
        <path d="M7 14h4" />
      </svg>
    ),
  },
  {
    id: "bank",
    labelKey: "deposit.bankTransfer",
    href: "/deposit/bank",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
      </svg>
    ),
  },
  {
    id: "ewallet",
    labelKey: "deposit.eWallet",
    href: "/deposit/ewallet",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="2" y="5" width="20" height="14" rx="2" />
        <path d="M2 10h20" />
        <circle cx="17" cy="15" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: "crypto",
    labelKey: "deposit.crypto",
    href: "/deposit/crypto",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <path d="M9.5 2v2M14.5 2v2M9.5 20v2M14.5 20v2M2 9.5h2M2 14.5h2M20 9.5h2M20 14.5h2" />
        <rect x="6" y="6" width="12" height="12" rx="1" />
        <path d="M9 12h1.5a1.5 1.5 0 000-3H9v6h1.5a1.5 1.5 0 100-3H9" />
        <path d="M14 9v6" />
      </svg>
    ),
  },
];

// Withdraw methods
const withdrawMethods = [
  {
    id: "withdraw",
    labelKey: "wallet.withdraw",
    href: "/withdrawal",
    icon: (
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth={1.5}>
        <rect x="3" y="6" width="18" height="12" rx="2" />
        <path d="M3 10h18" />
        <path d="M12 14v3M9 17l3-3 3 3" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function DepositPage() {
  const [depositOpen, setDepositOpen] = useState(true);
  const [withdrawOpen, setWithdrawOpen] = useState(true);
  const { t } = useI18n();

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-MY", { minimumFractionDigits: 2 });
  };

  return (
    <RequireAuth>
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header variant="subpage" title={t("wallet.title")} backHref="/" />

      {/* Wallet Balance Section */}
      <div className="bg-dark px-4 pt-4 pb-8">
        {/* Title with refresh */}
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-white font-roboto-medium">{t("wallet.balance")}</h2>
          <button className="text-primary hover:text-primary/80 transition-colors">
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Cards */}
        <div className="flex gap-3">
          {/* Cash Card */}
          <div className="flex-1 bg-white rounded-xl p-4">
            <div className="flex justify-center mb-3">
              <span className="px-6 py-1.5 rounded-full bg-primary text-white text-sm font-roboto-medium">
                {t("wallet.cash")}
              </span>
            </div>
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-zinc-400 text-xs">MYR</span>
              <span className="text-zinc-800 text-xl font-roboto-bold">
                {formatCurrency(walletData.cashBalance)}
              </span>
            </div>
          </div>

          {/* Chips Card */}
          <div className="flex-1 bg-white rounded-xl p-4">
            <div className="flex justify-center mb-3">
              <span className="px-6 py-1.5 rounded-full bg-primary text-white text-sm font-roboto-medium">
                {t("wallet.chips")}
              </span>
            </div>
            <div className="flex items-center justify-center gap-1">
              <svg className="w-5 h-5 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className="text-zinc-800 text-xl font-roboto-bold">
                {formatCurrency(walletData.chipsBalance)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 space-y-4 -mt-4">
        {/* Deposit Section */}
        <div className="bg-white rounded-xl overflow-hidden">
          {/* Deposit Header */}
          <button
            onClick={() => setDepositOpen(!depositOpen)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-50 transition-colors"
          >
            <span className="font-roboto-medium text-zinc-700">{t("wallet.deposit")}</span>
            <ChevronUp
              className={cn(
                "w-5 h-5 text-zinc-400 transition-transform duration-200",
                !depositOpen && "rotate-180"
              )}
            />
          </button>

          {/* Deposit Methods */}
          {depositOpen && (
            <div className="px-4 pb-4">
              <div className="flex gap-4">
                {depositMethods.map((method) => (
                  <Link
                    key={method.id}
                    href={method.href}
                    className="flex flex-col items-center group"
                  >
                    <div className="w-16 h-16 rounded-xl border-2 border-zinc-200 flex items-center justify-center text-primary group-hover:border-primary transition-colors">
                      {method.icon}
                    </div>
                    <span className="text-xs text-zinc-600 mt-2 text-center whitespace-nowrap">
                      {t(method.labelKey)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Withdraw Section */}
        <div className="bg-white rounded-xl overflow-hidden">
          {/* Withdraw Header */}
          <button
            onClick={() => setWithdrawOpen(!withdrawOpen)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-zinc-50 transition-colors"
          >
            <span className="font-roboto-medium text-zinc-700">{t("wallet.withdraw")}</span>
            <ChevronUp
              className={cn(
                "w-5 h-5 text-zinc-400 transition-transform duration-200",
                !withdrawOpen && "rotate-180"
              )}
            />
          </button>

          {/* Withdraw Methods */}
          {withdrawOpen && (
            <div className="px-4 pb-4">
              <div className="flex gap-4">
                {withdrawMethods.map((method) => (
                  <Link
                    key={method.id}
                    href={method.href}
                    className="flex flex-col items-center group"
                  >
                    <div className="w-16 h-16 rounded-xl border-2 border-zinc-200 flex items-center justify-center text-primary group-hover:border-primary transition-colors">
                      {method.icon}
                    </div>
                    <span className="text-xs text-zinc-600 mt-2 text-center">
                      {t(method.labelKey)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
    </RequireAuth>
  );
}
