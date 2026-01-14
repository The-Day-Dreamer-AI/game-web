"use client";

import Link from "next/link";
import { Header } from "@/components/layout";
import { ChevronRight } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";
import Image from "next/image";

const profileMenuItems = [
  {
    id: "username",
    labelKey: "profile.changeUsername",
    href: "/account/profile/username",
    icon: "/images/icon/username_icon.png",
  },
  {
    id: "password",
    labelKey: "profile.changePassword",
    href: "/account/profile/password",
    icon: "/images/icon/lock_icon.png",
  },
  {
    id: "avatar",
    labelKey: "profile.changeAvatar",
    href: "/account/profile/avatar",
    icon: "/images/icon/avatar_icon.png",
  },
];

export default function ProfilePage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header
        variant="subpage"
        title={t("account.profile")}
        backHref="/account"
      />

      {/* Menu Items */}
      <main className="flex-1 px-4 py-4">
        <div className="space-y-3">
          {profileMenuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-4 px-4 py-4 bg-primary/25 rounded-2xl"
            >
              {/* Icon */}
              <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shrink-0">
                <Image
                  src={item.icon}
                  alt="AON1E profile"
                  width={24}
                  height={24}
                  unoptimized
                  className="h-6 w-auto object-contain"
                />
              </div>

              {/* Label */}
              <span className="flex-1 text-sm font-roboto-bold text-[#28323C]">
                {t(item.labelKey)}
              </span>

              {/* Chevron */}
              <ChevronRight className="w-7 h-7 text-[#28323C]" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
