"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";

const localeFlagIcons: Record<string, string> = {
  en: "/images/icon/english_icon.png",
  zh: "/images/icon/chinese_icon.png",
  ms: "/images/icon/malay_icon.png",
};

export default function TermsPage() {
  const [openSection, setOpenSection] = useState<number | null>(2);
  const { t, locale } = useI18n();

  const secondaryMenuItems = [
    {
      id: "about",
      labelKey: "sidebar.aboutUs",
      href: "/about?returnUrl=/terms",
      icon: "/images/sidebar/sidebar_aboutus_icon.png",
    },
    {
      id: "terms",
      labelKey: "sidebar.termsConditions",
      href: "/terms",
      icon: "/images/sidebar/sidebar_tnc_icon.png",
    },
    {
      id: "language",
      labelKey: "sidebar.language",
      href: "/account/language?returnUrl=/terms",
      icon: localeFlagIcons[locale] || localeFlagIcons.en,
    },
  ];

  // Terms sections data
  const termsSections = [
    {
      id: 1,
      titleKey: "terms.eligibility",
      contentKey: "terms.eligibilityContent",
    },
    {
      id: 2,
      titleKey: "terms.userAccounts",
      contentKey: "terms.userAccountsContent",
    },
    {
      id: 3,
      titleKey: "terms.depositsWithdrawals",
      contentKey: "terms.depositsWithdrawalsContent",
    },
    {
      id: 4,
      titleKey: "terms.wagering",
      contentKey: "terms.wageringContent",
    },
    {
      id: 5,
      titleKey: "terms.bonusesRewards",
      contentKey: "terms.bonusesRewardsContent",
    },
    {
      id: 6,
      titleKey: "terms.prohibitedConduct",
      contentKey: "terms.prohibitedConductContent",
    },
    {
      id: 7,
      titleKey: "terms.termination",
      contentKey: "terms.terminationContent",
    },
    {
      id: 8,
      titleKey: "terms.changesToTerms",
      contentKey: "terms.changesToTermsContent",
    },
  ];

  const toggleSection = (id: number) => {
    setOpenSection(openSection === id ? null : id);
  };

  return (
    <div className="min-h-screen flex flex-col">

      {/* Logo Section */}
      <div className="py-16 flex justify-center">
        <Image
          src="/images/title.png"
          alt="AONE"
          width={160}
          height={50}
          className="h-12 w-auto"
          unoptimized
        />
      </div>

      {/* Intro Text */}
      <div className="px-4 pb-6">
        <p className="text-sm text-zinc-600 text-center leading-relaxed">
          {t("terms.intro")}
        </p>
      </div>

      {/* Collapsible Sections */}
      <main className="flex-1 px-4 py-4 space-y-3">
        {termsSections.map((section) => {
          const isOpen = openSection === section.id;
          return (
            <div
              key={section.id}
              className="overflow-hidden"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(section.id)}
                className={cn(
                  "cursor-pointer w-full flex items-center justify-between px-4 py-4 transition-colors bg-white",
                  isOpen
                    ? "bg-[#D4F1F0] text-zinc-800 rounded-t-xl"
                    : "text-zinc-700 hover:bg-zinc-50 rounded-xl"
                )}
              >
                <span className="font-roboto-medium text-sm">
                  {section.id}. {t(section.titleKey)}
                </span>
                <ChevronDown
                  className={cn(
                    "w-5 h-5 text-zinc-400 transition-transform duration-200",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Section Content */}
              {isOpen && (
                <div className="px-4 py-4 bg-zinc-50 rounded-b-xl">
                  <p className="text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                    {t(section.contentKey)}
                  </p>

                  {/* Secondary Menu inside User Accounts section */}
                  {section.id === 2 && (
                    <div className="mt-4">
                        {secondaryMenuItems.map((item, index) => (
                          <div key={item.id}>
                            <Link
                              href={item.href}
                              className="flex items-center gap-5 px-4 py-3"
                            >
                              <Image
                                src={item.icon}
                                alt={item.id}
                                width={24}
                                height={24}
                                unoptimized
                                className="w-6 h-6 object-contain"
                              />
                              <span className="flex-1 text-xs font-roboto-bold text-[#28323C]">
                                {t(item.labelKey)}
                              </span>
                            </Link>
                            {index !== secondaryMenuItems.length - 1 && (
                              <div className="bg-[#d4f1f0] h-px"></div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </main>
    </div>
  );
}
