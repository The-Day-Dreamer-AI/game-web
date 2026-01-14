"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Header, BottomNav } from "@/components/layout";
import { RequireAuth } from "@/components/auth";
import { ChevronRight, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";
import { useAuth } from "@/providers/auth-provider";
import { KycVerificationModal } from "@/components/account/kyc-verification-modal";
import { useProfile } from "@/hooks";

export default function AccountPage() {
  const [imgError, setImgError] = useState(false);
  const [isKycModalOpen, setIsKycModalOpen] = useState(false);
  const { t } = useI18n();
  const { logout } = useAuth();

  // Fetch user profile data
  const { data: profile, isLoading, isError } = useProfile();

  const quickActions = [
    {
      id: "deposit",
      labelKey: "wallet.deposit",
      icon: "/images/icon/deposit_icon.png",
      href: "/deposit",
    },
    {
      id: "withdrawal",
      labelKey: "withdrawal.title",
      icon: "/images/icon/withdrawal_icon.png",
      href: "/withdrawal",
    },
    {
      id: "transfer",
      labelKey: "wallet.transfer",
      icon: "/images/icon/transfer_icon.png",
      href: "/account/contact?mode=transfer",
    },
    {
      id: "report",
      labelKey: "account.report",
      icon: "/images/icon/report_icon.png",
      href: "/report",
    },
  ];

  const menuItems = [
    {
      icon: "/images/icon/user_icon.png",
      labelKey: "account.profile",
      href: "/account/profile",
      isLink: true,
    },
    {
      icon: "/images/icon/bank_icon.png",
      labelKey: "account.bankAccount",
      href: "/account/bank",
      isLink: true,
    },
    {
      icon: "/images/icon/kyc_icon.png",
      labelKey: "account.kyc",
      onClick: () => setIsKycModalOpen(true),
      isLink: false,
    },
    {
      icon: "/images/icon/reset_pin_icon.png",
      labelKey: "account.resetPin",
      href: "/account/reset-pin",
      isLink: true,
    },
    {
      icon: "/images/icon/contact_icon.png",
      labelKey: "account.myContact",
      href: "/account/contact",
      isLink: true,
    },
    {
      icon: "/images/icon/inbox_icon.png",
      labelKey: "account.inbox",
      href: "/account/inbox",
      badge: profile?.InboxCount,
      isLink: true,
    },
    {
      icon: "/images/icon/check_icon.png",
      labelKey: "account.checkIn",
      href: "/account/check-in",
      isLink: true,
    },
    {
      icon: "/images/icon/redeem_gift_icon.png",
      labelKey: "account.redeemGift",
      href: "/account/redeem-gift",
      isLink: true,
    },
    {
      icon: "/images/icon/rebate_icon.png",
      labelKey: "account.rebateList",
      href: "/account/rebate",
      isLink: true,
    },
    {
      icon: "/images/icon/redeem_code_icon.png",
      labelKey: "account.redeemCode",
      href: "/account/redeem-code",
      isLink: true,
    },
  ];

  const handleLogout = async () => {
    await logout();
  };

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("en-MY", { minimumFractionDigits: 2 });
  };

  const formatOverviewDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <RequireAuth>
        <div className="min-h-screen flex flex-col">
          <Header variant="logo" />
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
          <BottomNav />
        </div>
      </RequireAuth>
    );
  }

  // Error state
  if (isError || !profile) {
    return (
      <RequireAuth>
        <div className="min-h-screen flex flex-col">
          <Header variant="logo" />
          <div className="flex-1 flex items-center justify-center px-4">
            <div className="text-center">
              <p className="text-zinc-600 mb-4">{t("common.error")}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-primary text-white rounded-lg"
              >
                {t("common.retry")}
              </button>
            </div>
          </div>
          <BottomNav />
        </div>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col bg-zinc-100">
        {/* Header */}
        <Header variant="logo" />

        {/* Profile Section */}
        <div className="flex items-center gap-4 pt-5 pb-10 px-9 relative h-40">
          {/* Avatar */}
          <div className="z-10 w-16 h-16 rounded-full overflow-hidden bg-zinc-600 shrink-0 border-2 border-white/30">
            {!imgError && profile.Avatar ? (
              <Image
                src={profile.Avatar}
                alt={profile.Username}
                unoptimized
                width={64}
                height={64}
                className="object-cover w-full h-full"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xl font-roboto-bold">
                {profile.Username.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="z-10 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-white text-xl font-roboto-bold">
                {profile.Username}
              </h2>
              <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                <svg
                  className="w-3 h-3 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="px-2 py-0.5 rounded-full text-xs font-roboto-medium bg-primary/20 text-primary border border-primary">
                {t("common.verified")}
              </span>
            </div>
            <p className="text-white text-xs">UID: {profile.Id}</p>
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

        {/* Balance Display - Cash & Chips Side by Side */}
        <div className="-mt-10 px-4 py-4">
          <div className="grid grid-cols-2 gap-2">
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
                  {profile.Currency}
                </span>
                <span className="text-black text-xl font-roboto-bold">
                  {formatCurrency(profile.Cash)}
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
                />
                <span className="text-black text-xl font-roboto-bold">
                  {formatCurrency(profile.Chip)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Section - Card Style similar to welcome-card */}
        <div className="relative rounded-2xl p-4 overflow-hidden border shadow-lg mx-4">
          {/* Background Image with rounded corners */}
          <div className="absolute inset-[2px] z-0 overflow-hidden rounded-3xl">
            <Image
              src="/images/background/profile_background.png"
              alt=""
              fill
              className="object-fill"
              priority
            />
          </div>

          {/* Content */}
          <div className="relative z-10 p-4">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-sm font-roboto-medium text-zinc-700">
                {t("account.overview")}
              </span>
              <span className="text-sm text-primary">
                ({formatOverviewDate(profile.OverviewDate)})
              </span>
            </div>
            <div className="flex items-center divide-x divide-zinc-300">
              <div className="flex-1 text-center">
                <p className="text-xl font-roboto-bold text-primary">
                  {profile.RegisteredDownline}
                </p>
                <p className="text-xs text-zinc-500">
                  {t("account.registered")}
                </p>
              </div>
              <div className="flex-1 text-center">
                <p className="text-xl font-roboto-bold text-primary">
                  {profile.ActiveDownline}
                </p>
                <p className="text-xs text-zinc-500">
                  {t("account.activePlayer")}
                </p>
              </div>
              <div className="flex-1 text-center">
                <p className="text-xl font-roboto-bold text-primary">
                  {formatCurrency(profile.Turnover)}
                </p>
                <p className="text-xs text-zinc-500">{t("account.turnover")}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        <div className="mx-4 mt-4 flex-1 bg-white p-4 rounded-2xl shadow-lg px-2.5 flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-5 px-3 pt-2">
            {quickActions.map((action) => (
              <Link
                key={action.id}
                href={action.href}
                prefetch={false}
                className="flex flex-col items-center gap-2 group"
              >
                <div className="w-full aspect-square rounded-xl bg-[#E8F8F6] flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Image
                    src={action.icon}
                    alt={t(action.labelKey)}
                    width={32}
                    height={32}
                    className="object-contain w-full h-full p-3.5"
                  />
                </div>
                <span className="text-xs text-zinc-600 font-roboto-medium">
                  {t(action.labelKey)}
                </span>
              </Link>
            ))}
          </div>
          <div className="h-0.5 w-full bg-[#D4F1F0]"></div>
          <div className="bg-white overflow-hidden">
            {menuItems.map((item, index) => {
              const content = (
                <>
                  <div className="flex items-center gap-3">
                    <Image
                      src={item.icon}
                      alt=""
                      width={20}
                      height={20}
                      className="object-contain"
                    />
                    <span className="text-sm text-zinc-700 font-roboto-medium">
                      {t(item.labelKey)}
                    </span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="px-2 py-0.5 text-xs bg-red-500 text-white rounded-full">
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="w-5 h-5 text-zinc-400" />
                </>
              );

              const className = cn(
                "flex items-center justify-between px-4 py-3.5 hover:bg-zinc-50 transition-colors w-full",
                index !== menuItems.length - 1 && "border-b border-zinc-100"
              );

              return item.isLink ? (
                <Link key={item.href} href={item.href!} prefetch={false} className={className}>
                  {content}
                </Link>
              ) : (
                <button
                  key={item.labelKey}
                  onClick={item.onClick}
                  className={className}
                >
                  {content}
                </button>
              );
            })}
          </div>
        </div>

        {/* Logout Section */}
        <div className="bg-white rounded-2xl overflow-hidden mt-2 mb-8 mx-4 shadow-lg">
          <button
            onClick={handleLogout}
            className="flex items-center justify-between px-4 py-3.5 hover:bg-zinc-200 transition-colors w-full"
          >
            <div className="flex items-center gap-3 px-4">
              <Image
                src="/images/icon/logout_icon.png"
                alt=""
                width={20}
                height={20}
                className="object-contain"
              />
              <span className="text-sm text-zinc-700 font-roboto-medium">
                {t("account.logout")}
              </span>
            </div>
            <ChevronRight className="w-5 h-5 text-zinc-400" />
          </button>
        </div>

        {/* Bottom Navigation */}
        <BottomNav />

        {/* KYC Verification Modal */}
        <KycVerificationModal
          isOpen={isKycModalOpen}
          onClose={() => setIsKycModalOpen(false)}
        />
      </div>
    </RequireAuth>
  );
}
