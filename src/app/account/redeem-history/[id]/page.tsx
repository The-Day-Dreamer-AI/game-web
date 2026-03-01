"use client";

import { use } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { useMyRewards } from "@/hooks";

export default function RedeemHistoryDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();

  const { data: myRewardsData, isLoading } = useMyRewards({
    enabled: isAuthenticated,
  });

  const reward = myRewardsData?.Rewards?.find((r) => r.Id === id);

  const formatPoints = (points: number) => {
    return points.toLocaleString("en-US");
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    const normalized = dateString.includes("/")
      ? dateString.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")
      : dateString;
    const date = new Date(normalized);
    if (isNaN(date.getTime())) return dateString;
    const year = date.getFullYear();
    const month = date.toLocaleString("en-US", { month: "short" });
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year} ${month} ${day} ${hours}:${minutes}`;
  };

  const getStatusLabel = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return t("redeemGift.statusNew");
      case "success":
      case "completed":
      case "approved":
        return t("redeemGift.statusSuccess");
      case "progress":
      case "pending":
      case "processing":
        return t("redeemGift.statusProgress");
      case "failed":
        return t("redeemGift.statusFailed");
      case "rejected":
        return t("redeemGift.statusRejected");
      default:
        return status;
    }
  };

  const getStatusHeaderBg = (status: string) => {
    switch (status.toLowerCase()) {
      case "new":
        return "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)";
      case "success":
      case "completed":
      case "approved":
        return "#0DC3B1";
      case "progress":
      case "pending":
      case "processing":
        return "linear-gradient(135deg, #E5A820 0%, #FFC036 100%)";
      case "failed":
      case "rejected":
        return "linear-gradient(135deg, #991b1b 0%, #ef4444 100%)";
      default:
        return "#0DC3B1";
    }
  };

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

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (!reward) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-zinc-500 text-center">
            {t("redeemGift.noHistory")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F2F4F9]">
      {/* Status Header */}
      <div className="h-28 bg-primary flex items-start p-4 relative overflow-hidden bg-"
              style={{ background: getStatusHeaderBg(reward.Status) }}>
        <div className="absolute inset-0">
            <Image
              src="/images/icon/A1_logo_white.png"
              alt="AON1E"
              width={200}
              height={200}
              unoptimized
              className="h-24 w-auto object-contain absolute right-0 top-2"
            />
        </div>
        <p className="text-white text-xl italic font-roboto-semibold">
        {getStatusLabel(reward.Status)}
        </p>
      </div>

      {/* White Detail Card - overlapping header */}
      <div className="relative z-10 px-4 -mt-10">
        <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4">
          {/* Selected Reward Card */}
          <div className="bg-white grid grid-cols-[3fr_7fr] items-center gap-4">
            <div className="w-full h-full aspect-square relative shrink-0">
              <Image
                src={reward.Image}
                alt={reward.Name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-[#5F7182] font-roboto-regular">
                  {t("redeemGift.product")}
                </span>
                <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                  {reward.Name}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-[#5F7182] font-roboto-regular">
                  {t("redeemGift.aPoint")}
                </span>
                <div className="flex items-center gap-1">
                  <Image
                    src="/images/icon/A1_point_icon.png"
                    alt="A-Point"
                    width={16}
                    height={16}
                    className="object-contain"
                    unoptimized
                  />
                  <span className="text-sm font-roboto-bold text-[#28323C]">
                    {formatPoints(reward.Price)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#d4f1f0] h-px"></div>

          {/* Redemption Details */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.redeemId")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                {reward.Id}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.date")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                {formatDate(reward.Datetime)}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.recipientName")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                -
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.phoneNumber")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                -
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.address")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C] text-right max-w-[200px]">
                -
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.state")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                -
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.postcode")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                -
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.selectCountry")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                -
              </span>
            </div>
          </div>

          <div className="bg-[#d4f1f0] h-px"></div>

          {/* Order Summary */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.items")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C]">
                -
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.weight")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C]">
                -
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.shippingMethod")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C]">
                -
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.shippingFee")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C]">
                -
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
