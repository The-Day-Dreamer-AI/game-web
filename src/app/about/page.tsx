"use client";

import Image from "next/image";
import { Header } from "@/components/layout";
import { useI18n } from "@/providers/i18n-provider";
import { useAboutUs } from "@/hooks/use-user";
import { Loader2 } from "lucide-react";

export default function AboutPage() {
  const { t } = useI18n();
  const { data: aboutData, isLoading, error } = useAboutUs();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header variant="subpage" title={t("about.title")} backHref="/account" />

      {/* Hero Banner */}
      <div className="relative h-[280px] bg-dark">
        {/* Background Image */}
        <Image
          src="/about-bg.jpg"
          alt="About AONE Background"
          fill
          className="object-cover opacity-50"
          unoptimized
        />

        {/* Overlay Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          {/* Logo */}
          <div className="mb-2">
            <Image
              src="/logo.png"
              alt="AONE"
              width={180}
              height={60}
              className="h-14 w-auto"
              unoptimized
            />
          </div>

          {/* Tagline */}
          <p className="text-white/90 text-sm italic font-roboto-light tracking-wide">
            {t("about.tagline")}
          </p>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 bg-white px-4 py-6">
        <h2 className="text-lg font-roboto-semibold text-zinc-800 text-center mb-6">
          {t("about.aboutTitle")}
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
          </div>
        ) : error ? (
          // Fallback to i18n content if API fails
          <div className="space-y-4 text-sm text-zinc-600 leading-relaxed">
            <p>{t("about.paragraph1")}</p>
            <p>{t("about.paragraph2")}</p>
            <p>{t("about.paragraph3")}</p>
            <p>{t("about.paragraph4")}</p>
            <p>{t("about.paragraph5")}</p>
          </div>
        ) : aboutData?.Content ? (
          // Render API content (HTML)
          <div
            className="prose prose-sm prose-zinc max-w-none text-zinc-600 leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0"
            dangerouslySetInnerHTML={{ __html: aboutData.Content }}
          />
        ) : (
          // Fallback to i18n content if no API data
          <div className="space-y-4 text-sm text-zinc-600 leading-relaxed">
            <p>{t("about.paragraph1")}</p>
            <p>{t("about.paragraph2")}</p>
            <p>{t("about.paragraph3")}</p>
            <p>{t("about.paragraph4")}</p>
            <p>{t("about.paragraph5")}</p>
          </div>
        )}
      </main>
    </div>
  );
}
