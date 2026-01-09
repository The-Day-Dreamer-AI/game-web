"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, RotateCcw, Wallet } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { ProtectedLink } from "@/components/auth";

interface UserData {
  username: string;
  avatar?: string;
  isVerified?: boolean;
  cashBalance: number;
  chipsBalance: number;
  aPoints: number;
}

interface WelcomeCardProps {
  user: UserData;
  className?: string;
}

export function WelcomeCard({ user, className }: WelcomeCardProps) {
  const [imgError, setImgError] = useState(false);
  const { t } = useI18n();

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-MY", { minimumFractionDigits: 2 });
  };

  const formatPoints = (amount: number) => {
    return amount.toLocaleString("en-MY");
  };

  return (
    <div className={cn("bg-dark rounded-2xl p-4", className)}>
      {/* Top Row - Welcome + Avatar */}
      <div className="flex items-center gap-3 mb-4">
        {/* Avatar */}
        <div className="w-12 h-12 rounded-full overflow-hidden bg-zinc-600 flex-shrink-0">
          {!imgError && user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.username}
              width={48}
              height={48}
              className="object-cover w-full h-full"
              onError={() => setImgError(true)}
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-zinc-400 text-lg font-roboto-bold">
              {user.username.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* Welcome Text */}
        <div className="flex-1">
          <p className="text-zinc-400 text-sm">{t("common.welcome")},</p>
          <div className="flex items-center gap-2">
            <span className="text-white font-roboto-semibold text-lg">{user.username}</span>
            {user.isVerified && (
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <Check className="w-3 h-3 text-white" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Balance Section */}
      <div className="flex items-stretch gap-3">
        {/* Balance Info */}
        <div className="flex-1 space-y-2">
          {/* Cash Balance */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs font-roboto-medium">
              {t("wallet.cash")}
            </span>
            <span className="text-white font-roboto-medium">
              MYR {formatCurrency(user.cashBalance)}
            </span>
          </div>

          {/* Chips Balance */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs font-roboto-medium">
              {t("wallet.chips")}
            </span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className="text-white font-roboto-medium">{formatCurrency(user.chipsBalance)}</span>
            </div>
          </div>

          {/* A-Point */}
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full bg-primary text-white text-xs font-roboto-medium">
              {t("wallet.aPoint")}
            </span>
            <div className="flex items-center gap-1">
              <svg className="w-4 h-4 text-primary" viewBox="0 0 24 24" fill="currentColor">
                <circle cx="12" cy="12" r="10" />
              </svg>
              <span className="text-white font-roboto-medium">{formatPoints(user.aPoints)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <ProtectedLink
            href="/restore"
            className="flex flex-col items-center justify-center w-16 bg-zinc-700/50 rounded-xl hover:bg-zinc-700 transition-colors"
          >
            <RotateCcw className="w-6 h-6 text-zinc-300" />
            <span className="text-xs text-zinc-400 mt-1">{t("common.restore")}</span>
          </ProtectedLink>
          <ProtectedLink
            href="/deposit"
            className="flex flex-col items-center justify-center w-16 bg-zinc-700/50 rounded-xl hover:bg-zinc-700 transition-colors"
          >
            <Wallet className="w-6 h-6 text-zinc-300" />
            <span className="text-xs text-zinc-400 mt-1">{t("wallet.deposit")}</span>
          </ProtectedLink>
        </div>
      </div>
    </div>
  );
}
