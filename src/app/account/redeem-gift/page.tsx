"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { ChevronRight, Loader2 } from "lucide-react";
import { Header } from "@/components/layout";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { useToast } from "@/providers/toast-provider";
import { useRewards, useClaimReward } from "@/hooks";

export default function RedeemGiftPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const { showError } = useToast();

  const [showInsufficientModal, setShowInsufficientModal] = useState(false);
  const [claimingId, setClaimingId] = useState<string | null>(null);

  // Fetch rewards
  const { data: rewardsData, isLoading } = useRewards({
    enabled: isAuthenticated,
  });

  // Claim mutation
  const claimReward = useClaimReward();

  const userPoints = rewardsData?.Point ?? 0;
  const pendingCount = rewardsData?.RewardPendingCount ?? 0;
  const rewards = rewardsData?.Rewards ?? [];

  const formatPoints = (points: number) => {
    return points.toLocaleString("en-US");
  };

  const handleClaim = async (rewardId: string, price: number) => {
    if (userPoints < price) {
      setShowInsufficientModal(true);
      return;
    }

    setClaimingId(rewardId);
    try {
      const response = await claimReward.mutateAsync({ Id: rewardId });
      if (response.Code === 0) {
        // Success - could show success modal or navigate to history
        router.push("/account/redeem-history");
      } else {
        showError(response.Message || t("redeemGift.claimFailed"));
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("redeemGift.claimFailed");
      showError(errorMessage);
    } finally {
      setClaimingId(null);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header variant="subpage" title={t("redeemGift.title")} />
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
        <Header variant="subpage" title={t("redeemGift.title")} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100">
      {/* Header */}
      <Header variant="subpage" title={t("redeemGift.title")} />

      {/* Banner */}
      <div className="relative w-full aspect-4/3">
        <Image
          src="/images/redeem_gift_banner.png"
          alt="Redeem Gift"
          fill
          className="object-cover object-right"
          priority
        />
      </div>

      {/* Points Balance Card */}
      <div className="mx-6 -mt-6 relative z-10">
        <div className="bg-white rounded-xl shadow-lg px-5 py-4 flex items-center justify-between">
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

      {/* Redeem History Button */}
      <div
        onClick={() => router.push("/account/redeem-history")}
        className="px-4 mt-5 text-center flex items-center gap-1 justify-center cursor-pointer"
      >
        <span className="text-[#5F7182] text-sm">{t("redeemGift.redeemHistory")}</span>
        <ChevronRight className="w-5 h-5 text-[#5F7182]" />
      </div>

      {/* Rewards Grid */}
      <div className="flex-1 p-5">
        <div className="grid grid-cols-2 gap-5">
          {rewards.map((reward) => (
            <div key={reward.Id} className="flex flex-col">
              <div className="bg-white rounded-t-xl overflow-hidden shadow-md flex-1 pb-1">
                {/* Reward Image */}
                <div className="relative aspect-square">
                  <Image
                    src={reward.Image}
                    alt={reward.Name}
                    fill
                    className="object-contain px-5"
                    unoptimized
                  />
                </div>

                {/* Reward Info */}
                <div className="text-center flex flex-col gap-1">
                  <div
                    className="px-4 text-sm font-roboto-bold text-[#28323C]"
                    style={{ lineHeight: 0.95 }}
                  >
                    {reward.Name}
                  </div>
                  <div className="px-4 flex items-center justify-center gap-1">
                    <Image
                      src="/images/icon/A1_point_icon.png"
                      alt="A-Point"
                      width={16}
                      height={16}
                      className="object-contain"
                    />
                    <div className="text-sm font-roboto-regular text-[#28323C]">
                      {formatPoints(reward.Price)}
                    </div>
                  </div>
                </div>
              </div>
              {/* Claim Button */}
              <button
                onClick={() => handleClaim(reward.Id, reward.Price)}
                disabled={claimingId === reward.Id}
                className="cursor-pointer w-full py-2 bg-[#0DC3B1] text-white text-sm font-roboto-bold rounded-b-lg flex items-center justify-center gap-2"
              >
                {claimingId === reward.Id ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  t("redeemGift.claim")
                )}
              </button>
            </div>
          ))}
        </div>

        {rewards.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
            <p>{t("redeemGift.noRewards")}</p>
          </div>
        )}
      </div>

      {/* Insufficient Points Modal */}
      {showInsufficientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowInsufficientModal(false)}
          />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-sm text-center">
            <h3 className="text-lg font-roboto-semibold text-zinc-800 mb-2">
              {t("redeemGift.insufficientTitle")}
            </h3>
            <p className="text-zinc-600 mb-6">
              {t("redeemGift.insufficientMessage")}
            </p>
            <button
              onClick={() => setShowInsufficientModal(false)}
              className="cursor-pointer w-full py-3 bg-primary text-white font-roboto-medium rounded-lg hover:bg-primary/90 transition-colors"
            >
              {t("common.ok")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
