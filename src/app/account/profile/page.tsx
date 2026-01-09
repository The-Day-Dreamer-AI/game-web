"use client";

import Link from "next/link";
import { Header } from "@/components/layout";
import { ChevronRight, Pencil, Lock, Smile } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";

const profileMenuItems = [
  {
    id: "username",
    labelKey: "profile.changeUsername",
    href: "/account/profile/username",
    icon: Pencil,
  },
  {
    id: "password",
    labelKey: "profile.changePassword",
    href: "/account/profile/password",
    icon: Lock,
  },
  {
    id: "avatar",
    labelKey: "profile.changeAvatar",
    href: "/account/profile/avatar",
    icon: Smile,
  },
];

export default function ProfilePage() {
  const { t } = useI18n();

  return (
    <div className="min-h-screen flex flex-col bg-zinc-100">
      {/* Header */}
      <Header variant="subpage" title={t("account.profile")} backHref="/account" />

      {/* Menu Items */}
      <main className="flex-1 px-4 py-4">
        <div className="space-y-3">
          {profileMenuItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="flex items-center gap-4 px-4 py-4 bg-primary/10 rounded-2xl hover:bg-primary/15 transition-colors"
            >
              {/* Icon */}
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center flex-shrink-0">
                <item.icon className="w-6 h-6 text-zinc-600" />
              </div>

              {/* Label */}
              <span className="flex-1 text-sm font-roboto-medium text-zinc-700">
                {t(item.labelKey)}
              </span>

              {/* Chevron */}
              <ChevronRight className="w-5 h-5 text-zinc-400" />
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
