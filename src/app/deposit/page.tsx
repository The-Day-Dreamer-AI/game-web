"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RequireAuth, RequireKyc } from "@/components/auth";
import { ChevronUp } from "lucide-react";
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
    icon: "/images/icon/bank_dark_icon.png",
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
    icon: "/images/icon/withdrawal_dark_icon.png",
  },
];

export default function DepositPage() {
  const [depositOpen, setDepositOpen] = useState(true);
  const [withdrawOpen, setWithdrawOpen] = useState(true);
  const { t } = useI18n();
  const queryClient = useQueryClient();

  // Fetch wallet info
  const { data: walletData, isRefetching } = useWalletInfo();

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-MY", { minimumFractionDigits: 2 });
  };

  const handleRefresh = () => {
    queryClient.invalidateQueries({ queryKey: depositKeys.walletInfo() });
  };

  return (
    <RequireAuth>
      <RequireKyc>
      <div className="min-h-screen flex flex-col">

        {/* Wallet Balance Section */}
        <div className="flex flex-col items-center gap-7 px-5 pb-5 pt-4 relative h-40 w-full">
          {/* Title with refresh */}
          <div className="flex items-center gap-2 z-10 w-full">
            <div className="text-white font-roboto-bold text-base">
              {t("wallet.balance")}
            </div>
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
                unoptimized
              />
            </button>
          </div>{" "}

          {/* Balance Cards */}
          <div className="z-10 w-full">
            <div className="grid grid-cols-2 gap-3">
              {/* Cash Balance */}
              <div className="pt-7 pb-4 rounded-2xl shadow-lg bg-white flex-1 flex flex-col items-center justify-center relative">
                <div
                  className="absolute -top-4 w-20 rounded-full p-[2px]"
                  style={{
                    background:
                      "linear-gradient(180deg, #07635A 0%, #0EC6B4 100%)",
                  }}
                >
                  <div
                    className="rounded-full px-2 py-1 text-white text-sm font-roboto-bold text-center whitespace-nowrap"
                    style={{
                      background:
                        "linear-gradient(180deg, #0EC6B4 0%, #07635A 100%)",
                    }}
                  >
                    {t("wallet.cash")}
                  </div>
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-[#28323C] text-xs">
                    {walletData?.Currency || "MYR"}
                  </span>
                  <span className="text-black text-xl font-roboto-bold">
                    {formatCurrency(walletData?.Cash ?? 0)}
                  </span>
                </div>
              </div>

              {/* Chips Balance */}
              <div className="pt-7 pb-4 rounded-2xl shadow-lg bg-white flex-1 flex flex-col items-center justify-center relative">
                <div
                  className="absolute -top-4 w-20 rounded-full p-[2px]"
                  style={{
                    background:
                      "linear-gradient(180deg, #07635A 0%, #0EC6B4 100%)",
                  }}
                >
                  <div
                    className="rounded-full px-2 py-1 text-white text-sm font-roboto-bold text-center whitespace-nowrap"
                    style={{
                      background:
                        "linear-gradient(180deg, #0EC6B4 0%, #07635A 100%)",
                    }}
                  >
                    {t("wallet.chips")}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Image
                    src="/images/icon/chip_dark.png"
                    alt="Chips"
                    width={20}
                    height={20}
                    className="object-contain"
                    unoptimized
                  />
                  <span className="text-black text-xl font-roboto-bold">
                    {formatCurrency(walletData?.Chip ?? 0)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Background */}
          <div className="absolute inset-0 z-0">
            <Image
              src="/images/background/account_background.png"
              alt="account banner"
              fill
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0" />
          </div>
        </div>

        {/* Main Content */}
        <main className="flex-1 px-5 py-4 mt-3">
          {/* Deposit Section */}
          <div className="bg-[#D4F1F0] rounded-3xl overflow-hidden shadow-sm cursor-pointer">
            {/* Deposit Header */}
            <button
              onClick={() => setDepositOpen(!depositOpen)}
              className="w-full flex items-center justify-between p-4 cursor-pointer"
            >
              <span className="font-roboto-bold text-[#28323C] text-sm">
                {t("wallet.deposit")}
              </span>
              <ChevronUp
                className={cn(
                  "w-6 h-6 text-[#5F7182] transition-transform duration-200",
                  !depositOpen && "rotate-180"
                )}
              />
            </button>
          </div>

          {/* Deposit Methods */}
          {depositOpen && (
            <div className="px-4 pb-4 mt-4">
              <div className="grid grid-cols-4 gap-7">
                {depositMethods.map((method) => (
                  <Link
                    key={method.id}
                    href={method.href}
                    className="flex flex-col items-center group"
                  >
                    <div className="w-full h-auto aspect-square rounded-xl flex items-center justify-center bg-white shadow-2xl border-zinc-200 border-[0.5px]">
                      <Image
                        src={method.icon}
                        alt={t(method.labelKey)}
                        width={45}
                        height={45}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <span className="text-sm text-[#28323C] mt-2 text-center font-roboto-regular">
                      {t(method.labelKey)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Withdraw Section */}
          <div
            className={`bg-[#FCEAC3] rounded-3xl overflow-hidden shadow-sm cursor-pointer ${
              depositOpen ? "mt-4" : "mt-7"
            }`}
          >
            {/* Withdraw Header */}
            <button
              onClick={() => setWithdrawOpen(!withdrawOpen)}
              className="w-full flex items-center justify-between p-4 cursor-pointer"
            >
              <span className="font-roboto-bold text-[#28323C] text-sm">
                {t("wallet.withdraw")}
              </span>
              <ChevronUp
                className={cn(
                  "w-6 h-6 text-[#5F7182] transition-transform duration-200",
                  !withdrawOpen && "rotate-180"
                )}
              />
            </button>
          </div>
          {/* Withdraw Methods */}
          {withdrawOpen && (
            <div className="px-4 pb-4 mt-4">
              <div className="grid grid-cols-4 gap-7">
                {withdrawMethods.map((method) => (
                  <Link
                    key={method.id}
                    href={`${method.href}?returnUrl=/deposit`}
                    className="flex flex-col items-center group"
                  >
                    <div className="shadow-2xl border-zinc-200 border-[0.5px] w-full h-auto aspect-square rounded-xl flex items-center justify-center bg-white">
                      <Image
                        src={method.icon}
                        alt={t(method.labelKey)}
                        width={45}
                        height={45}
                        className="object-contain"
                        unoptimized
                      />
                    </div>
                    <span className="text-sm text-[#28323C] mt-2 text-center font-roboto-regular">
                      {t(method.labelKey)}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </main>

      </div>
      </RequireKyc>
    </RequireAuth>
  );
}
