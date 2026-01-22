"use client";

import Image from "next/image";
import { Header } from "@/components/layout";
import { useI18n } from "@/providers/i18n-provider";

export default function AboutPage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header variant="subpage" title={t("about.title")} />

      {/* Hero Banner */}
      <div className="relative w-full aspect-4/3 bg-dark overflow-hidden">
        {/* Background Image */}
        <Image
          src="/images/about_us_banner.png"
          alt="About AONE Background"
          fill
          className="object-cover opacity-50 scale-125"
          unoptimized
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-[#28323c3b]" />
        <div className="absolute inset-0 bg-[rgba(14,198,179,0.27)]" />
        <div className="absolute inset-0 bg-[rgba(0,0,0,0.21)]" />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1">
          {/* Logo */}
          <Image
            src="/images/title_white.png"
            alt="AONE"
            width={180}
            height={60}
            className="h-14 w-auto"
            unoptimized
          />

          {/* Tagline */}
          <p className="text-white text-xl italic font-roboto-bold tracking-wider">
            {t("about.tagline")}
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 px-4 pb-6 pt-4">
        <h2 className="text-sm font-roboto-bold text-[#28323C] text-center mb-4">
          {t("about.aboutTitle")}
        </h2>

        <div className="space-y-4 text-sm text-[#28323C] font-roboto-regular">
          <p>{t("about.paragraph1")}</p>
          <p>{t("about.paragraph2")}</p>
          <p>{t("about.paragraph3")}</p>
          <p>{t("about.paragraph4")}</p>
          <p>{t("about.paragraph5")}</p>
        </div>
      </main>
    </div>
  );
}
