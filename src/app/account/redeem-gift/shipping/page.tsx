"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { User, Phone, MapPin, ChevronDown } from "lucide-react";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { useRewards } from "@/hooks";
import { FormInput } from "@/components/ui/form-input";
import { cn } from "@/lib/utils";

const COUNTRIES = [
  { value: "malaysia", label: "Malaysia" },
  { value: "singapore", label: "Singapore" },
  { value: "thailand", label: "Thailand" },
  { value: "indonesia", label: "Indonesia" },
  { value: "philippines", label: "Philippines" },
  { value: "vietnam", label: "Vietnam" },
];

const EMPTY_FORM = { recipientName: "", phoneNumber: "", address: "", state: "", postcode: "", country: "" };

export default function ShippingInfoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();

  const rewardId = searchParams.get("rewardId");

  // Form state - initialized from sessionStorage if coming back from confirm page
  const [formData, setFormData] = useState(() => {
    if (typeof window === "undefined") return EMPTY_FORM;

    // Check URL directly for from=confirm since searchParams may not be ready yet
    const urlParams = new URLSearchParams(window.location.search);
    const isFromConfirm = urlParams.get("from") === "confirm";
    if (!isFromConfirm) return EMPTY_FORM;

    const storedInfo = sessionStorage.getItem("redeemShippingInfo");
    if (storedInfo) {
      try {
        const info = JSON.parse(storedInfo);
        const countryOption = COUNTRIES.find((c) => c.label === info.country);
        return {
          recipientName: info.recipientName || "",
          phoneNumber: info.phoneNumber || "",
          address: info.address || "",
          state: info.state || "",
          postcode: info.postcode || "",
          country: countryOption?.value || "",
        };
      } catch {
        // Invalid data, ignore
      }
    }
    return EMPTY_FORM;
  });
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsCountryOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Destructure for easy access
  const { recipientName, phoneNumber, address, state, postcode, country } = formData;

  // Update form field helper
  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Fetch rewards to get user points and reward info
  const { data: rewardsData } = useRewards({
    enabled: isAuthenticated,
  });

  const userPoints = rewardsData?.Point ?? 0;
  const rewards = rewardsData?.Rewards ?? [];
  const selectedReward = rewards.find((r) => r.Id === rewardId);

  const formatPoints = (points: number) => {
    return points.toLocaleString("en-US");
  };

  const isFormValid =
    recipientName.trim() &&
    phoneNumber.trim() &&
    address.trim() &&
    state.trim() &&
    postcode.trim() &&
    country;

  const handleNext = () => {
    if (!isFormValid || !rewardId) return;

    // Store shipping info in sessionStorage and navigate to confirm page
    const shippingInfo = {
      recipientName,
      phoneNumber,
      address,
      state,
      postcode,
      country: COUNTRIES.find((c) => c.value === country)?.label || country,
    };
    sessionStorage.setItem("redeemShippingInfo", JSON.stringify(shippingInfo));
    router.push(`/account/redeem-gift/confirm?rewardId=${rewardId}`);
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

  if (!rewardId || !selectedReward) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-zinc-500 text-center">
            {t("redeemGift.noRewardSelected")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 px-4">
        {/* Points Balance Card */}
        <div className="mt-4">
          <div className="bg-white rounded-xl shadow-sm px-5 py-4 flex items-center justify-between">
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

          {/* Selected Reward Card */}
          <div className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4">
            <div className="w-20 h-20 relative shrink-0">
              <Image
                src={selectedReward.Image}
                alt={selectedReward.Name}
                fill
                className="object-contain"
                unoptimized
              />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm text-[#5F7182]">
                  {t("redeemGift.product")}
                </span>
                <span className="text-sm font-roboto-medium text-[#28323C]">
                  {selectedReward.Name}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#5F7182]">
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
                  <span className="text-sm font-roboto-medium text-[#28323C]">
                    {formatPoints(selectedReward.Price)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Info Shipping Form */}
        <div className="mt-5">
          <h2 className="text-base font-roboto-bold text-[#28323C] mb-3 flex gap-1">
            {t("redeemGift.infoShipping")}
            <span className="text-primary">*</span>
          </h2>

          <div className="space-y-3">
            {/* Recipient Name */}
            <FormInput
              prefix={<User className="w-5 h-5 text-[#959595]" />}
              placeholder={t("redeemGift.recipientName")}
              value={recipientName}
              onChange={(e) => updateField("recipientName", e.target.value)}
            />

            {/* Phone Number */}
            <FormInput
              prefix={<Phone className="w-5 h-5 text-[#959595]" />}
              placeholder={t("redeemGift.phoneNumber")}
              value={phoneNumber}
              onChange={(e) => updateField("phoneNumber", e.target.value)}
              type="tel"
            />

            {/* Address */}
            <FormInput
              prefix={<MapPin className="w-5 h-5 text-[#959595]" />}
              placeholder={t("redeemGift.address")}
              value={address}
              onChange={(e) => updateField("address", e.target.value)}
            />

            {/* State */}
            <FormInput
              prefix={<MapPin className="w-5 h-5 text-[#959595]" />}
              placeholder={t("redeemGift.state")}
              value={state}
              onChange={(e) => updateField("state", e.target.value)}
            />

            {/* Postcode */}
            <FormInput
              prefix={<MapPin className="w-5 h-5 text-[#959595]" />}
              placeholder={t("redeemGift.postcode")}
              value={postcode}
              onChange={(e) => updateField("postcode", e.target.value)}
            />

            {/* Country Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsCountryOpen(!isCountryOpen)}
                className="w-full flex items-center rounded-lg border border-[#959595] bg-white transition-all duration-200"
              >
                <div className="flex items-center justify-center pl-4 text-[#959595]">
                  <MapPin className="w-5 h-5" />
                </div>
                <span
                  className={cn(
                    "flex-1 py-3.5 pl-3 pr-3 text-left text-sm font-roboto-regular",
                    country ? "text-black" : "text-[#959595]"
                  )}
                >
                  {country
                    ? COUNTRIES.find((c) => c.value === country)?.label
                    : t("redeemGift.selectCountry")}
                </span>
                <div className="pr-4">
                  <ChevronDown
                    className={cn(
                      "w-5 h-5 text-[#959595] transition-transform",
                      isCountryOpen && "rotate-180"
                    )}
                  />
                </div>
              </button>

              {isCountryOpen && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-zinc-200 rounded-lg shadow-lg z-10 overflow-hidden max-h-60 overflow-y-auto">
                  {COUNTRIES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => {
                        updateField("country", c.value);
                        setIsCountryOpen(false);
                      }}
                      className={cn(
                        "w-full px-4 py-3 text-left text-sm hover:bg-zinc-50",
                        country === c.value
                          ? "text-primary bg-zinc-50"
                          : "text-zinc-700"
                      )}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Bottom Button */}
      <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-primary">
        <button
          onClick={handleNext}
          disabled={!isFormValid}
          className={cn(
            "w-full py-4 rounded-xl text-base font-roboto-bold uppercase transition-colors",
            isFormValid
              ? "bg-primary text-white cursor-pointer"
              : "bg-zinc-300 text-zinc-500 cursor-not-allowed"
          )}
        >
          {t("common.next")}
        </button>
      </div>
    </div>
  );
}
