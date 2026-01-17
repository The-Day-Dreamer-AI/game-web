"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header, BottomNav } from "@/components/layout";
import { RequireAuth } from "@/components/auth";
import { ChevronUp, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { useWalletInfo, depositKeys } from "@/hooks/use-deposit";
import { useQueryClient } from "@tanstack/react-query";

// Deposit methods
const depositMethods = [
  {
    id: "instant",
    labelKey: "deposit.instantDeposit",
    href: "/deposit/instant",
    icon: "/images/icon/deposit_icon.png",
  },
  {
    id: "bank",
    labelKey: "deposit.bankTransfer",
    href: "/deposit/bank",
    icon: "/images/icon/bank_icon.png",
  },
  {
    id: "ewallet",
    labelKey: "deposit.eWallet",
    href: "/deposit/ewallet",
    icon: "/images/icon/wallet_dark_icon.png",
  },
  {
    id: "crypto",
    labelKey: "deposit.crypto",
    href: "/deposit/crypto",
    icon: "/images/icon/cryoto_dark_icon.png",
  },
];

// Withdraw methods
const withdrawMethods = [
  {
    id: "withdraw",
    labelKey: "wallet.withdraw",
    href: "/withdrawal",
    icon: "/images/icon/withdrawal_icon.png",
  },
];

export default function DepositPage() {
  const [depositOpen, setDepositOpen] = useState(true);
  const [withdrawOpen, setWithdrawOpen] = useState(true);
  const { t } = useI18n();
  const queryClient = useQueryClient();

  // Fetch wallet info
  const { data: walletData, isLoading, isRefetching } = useWalletInfo();

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-MY", { minimumFractionDigits: 2 });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: depositKeys.walletInfo() });
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
            <button
              onClick={handleRefresh}
              disabled={isRefetching}
              className="text-primary hover:text-primary/80 transition-colors disabled:opacity-50"
            >
              <Image
                src="/images/icon/refresh_icon.png"
                alt="Refresh"
                width={16}
                height={16}
                className={cn("object-contain", isRefetching && "animate-spin")}
              />
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
                <span className="text-zinc-400 text-xs">{walletData?.Currency || "MYR"}</span>
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                ) : (
                  <span className="text-zinc-800 text-xl font-roboto-bold">
                    {formatCurrency(walletData?.Cash ?? 0)}
                  </span>
                )}
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
                <Image
                  src="/images/icon/chip_dark.png"
                  alt="Chips"
                  width={20}
                  height={20}
                  className="object-contain"
                />
                {isLoading ? (
                  <Loader2 className="w-5 h-5 text-zinc-400 animate-spin" />
                ) : (
                  <span className="text-zinc-800 text-xl font-roboto-bold">
                    {formatCurrency(walletData?.Chip ?? 0)}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-4 py-4 space-y-4 -mt-4">
          {/* Deposit Section */}
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
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
                      <div className="w-16 h-16 rounded-xl border-2 border-zinc-200 flex items-center justify-center group-hover:border-primary transition-colors bg-white">
                        <Image
                          src={method.icon}
                          alt={t(method.labelKey)}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
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
          <div className="bg-white rounded-xl overflow-hidden shadow-sm">
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
                      <div className="w-16 h-16 rounded-xl border-2 border-zinc-200 flex items-center justify-center group-hover:border-primary transition-colors bg-white">
                        <Image
                          src={method.icon}
                          alt={t(method.labelKey)}
                          width={32}
                          height={32}
                          className="object-contain"
                        />
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
