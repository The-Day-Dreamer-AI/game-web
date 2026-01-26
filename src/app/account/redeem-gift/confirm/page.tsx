"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { useToast } from "@/providers/toast-provider";
import { useRewards, useClaimReward } from "@/hooks";

interface ShippingInfo {
  recipientName: string;
  phoneNumber: string;
  address: string;
  state: string;
  postcode: string;
  country: string;
}

export default function ConfirmRedeemPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const { showError } = useToast();

  const rewardId = searchParams.get("rewardId");
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo | null>(null);
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Fetch rewards to get user points and reward info
  const { data: rewardsData } = useRewards({
    enabled: isAuthenticated,
  });

  // Claim mutation
  const claimReward = useClaimReward();

  const userPoints = rewardsData?.Point ?? 0;
  const rewards = rewardsData?.Rewards ?? [];
  const selectedReward = rewards.find((r) => r.Id === rewardId);

  const formatPoints = (points: number) => {
    return points.toLocaleString("en-US");
  };

  // Load shipping info from sessionStorage
  useEffect(() => {
    const storedInfo = sessionStorage.getItem("redeemShippingInfo");
    if (storedInfo) {
      try {
        setShippingInfo(JSON.parse(storedInfo));
      } catch {
        // Invalid data, redirect back
        router.push("/account/redeem-gift");
      }
    } else {
      // No shipping info, redirect back
      router.push("/account/redeem-gift");
    }
  }, [router]);

  const handleRedeem = async () => {
    if (!rewardId || !selectedReward || isRedeeming) return;

    setIsRedeeming(true);
    try {
      const response = await claimReward.mutateAsync({ Id: rewardId });
      if (response.Code === 0) {
        // Clear shipping info from sessionStorage
        sessionStorage.removeItem("redeemShippingInfo");
        // Success - navigate to history
        router.push("/account/redeem-history");
      } else {
        showError(response.Message || t("redeemGift.claimFailed"));
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : t("redeemGift.claimFailed");
      showError(errorMessage);
    } finally {
      setIsRedeeming(false);
    }
  };

  // Calculate remaining points after redemption
  const remainingPoints = selectedReward
    ? userPoints - selectedReward.Price
    : userPoints;

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

  if (!rewardId || !selectedReward || !shippingInfo) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 px-4">
        {/* Points Balance Card */}
        <div className="mt-4">
          <div className="bg-white rounded-xl shadow-md px-5 py-4 flex items-center justify-between">
            <span className="text-[#28323C] font-roboto-regular text-sm">
              {t("redeemGift.pointBalance")}
            </span>
            <div className="flex items-center gap-2">
              <Image
                src="/images/icon/A1_point_icon.png"
                alt="A-Point"
                width={24}
                height={24}
                className="object-contain"
              />
              <span className="text-base font-roboto-bold text-[#28323C]">
                {formatPoints(userPoints)}
              </span>
            </div>
          </div>
        </div>

        {/* Gift Redeem Section */}
        <div className="mt-5">
          <h2 className="text-base font-roboto-bold text-[#28323C] mb-3">
            {t("redeemGift.giftRedeem")}
          </h2>
        </div>

        {/* Shipping Details */}
        <div className="mt-5 bg-white rounded-xl shadow-lg p-4 flex flex-col gap-4">
          {/* Selected Reward Card */}
          <div className="bg-white grid grid-cols-[3fr_7fr] items-center gap-4">
            <div className="w-full h-full aspect-square relative shrink-0">
              <Image
                src={selectedReward.Image}
                alt={selectedReward.Name}
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
                <span className="text-sm font-roboto-medium text-[#28323C]">
                  {selectedReward.Name}
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
                  />
                  <span className="text-sm font-roboto-bold text-[#28323C]">
                    {formatPoints(selectedReward.Price)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[#d4f1f0] h-px"></div>
          {/* Order Shipping Info */}
          <div className="flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.recipientName")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                {shippingInfo.recipientName}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.phoneNumber")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                {shippingInfo.phoneNumber}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.address")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C] text-right max-w-[200px]">
                {shippingInfo.address}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.state")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                {shippingInfo.state}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.postcode")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                {shippingInfo.postcode}
              </span>
            </div>
            <div className="flex justify-between items-start">
              <span className="text-sm text-[#5F7182] font-roboto-regular">
                {t("redeemGift.selectCountry")}
              </span>
              <span className="text-sm font-roboto-medium text-[#28323C] text-right">
                {shippingInfo.country}
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
                1
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

      {/* Sticky Bottom Section */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-primary">
        {/* Total Section */}
        <div className="grid grid-cols-[6fr_4fr] items-center justify-between">
          <div>
            <p className="text-xs text-[#28323C] font-roboto-medium">{t("redeemGift.total")}</p>
            <p className="text-xl font-roboto-bold text-primary">
              {formatPoints(selectedReward.Price)}
            </p>
            <p className="text-xs text-[#5F7182]">
              {t("redeemGift.pointBalanceAfter")}:{" "}
              {formatPoints(remainingPoints)}
            </p>
          </div>
          <button
            onClick={handleRedeem}
            disabled={isRedeeming}
            className="shadow-lg bg-primary text-white px-10 py-3 rounded-lg text-base font-roboto-bold uppercase cursor-pointer disabled:opacity-50 flex justify-center items-center gap-2"
          >
            {isRedeeming ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            {t("redeemGift.redeem")}
          </button>
        </div>
      </div>
    </div>
  );
}
