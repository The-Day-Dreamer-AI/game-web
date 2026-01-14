"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/layout";
import { Check } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";
import { cn } from "@/lib/utils";

// Mock avatar options
const avatarOptions = [
  { id: "avatar1", src: "/avatars/avatar-1.png", alt: "Avatar 1" },
  { id: "avatar2", src: "/avatars/avatar-2.png", alt: "Avatar 2" },
  { id: "avatar3", src: "/avatars/avatar-3.png", alt: "Avatar 3" },
  { id: "avatar4", src: "/avatars/avatar-4.png", alt: "Avatar 4" },
  { id: "avatar5", src: "/avatars/avatar-5.png", alt: "Avatar 5" },
  { id: "avatar6", src: "/avatars/avatar-6.png", alt: "Avatar 6" },
  { id: "avatar7", src: "/avatars/avatar-7.png", alt: "Avatar 7" },
  { id: "avatar8", src: "/avatars/avatar-8.png", alt: "Avatar 8" },
  { id: "avatar9", src: "/avatars/avatar-9.png", alt: "Avatar 9" },
];

export default function ChangeAvatarPage() {
  const [selectedAvatar, setSelectedAvatar] = useState<string>("avatar3");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submit - in real app would call API
    console.log("Changing avatar to:", selectedAvatar);
  };

  const handleImageError = (avatarId: string) => {
    setImageErrors((prev) => ({ ...prev, [avatarId]: true }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header
        variant="subpage"
        title={t("profile.changeAvatar")}
        backHref="/account/profile"
      />

      {/* Avatar Grid */}
      <main className="flex-1 px-4 py-4">
        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Avatar Selection Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 px-2 sm:px-6">
            {avatarOptions.map((avatar) => (
              <button
                key={avatar.id}
                type="button"
                onClick={() => setSelectedAvatar(avatar.id)}
                className="relative aspect-square"
              >
                {/* Avatar Image */}
                <div
                  className={cn(
                    "w-full h-full rounded-full overflow-hidden border-2 transition-colors",
                    selectedAvatar === avatar.id
                      ? "border-primary"
                      : "border-primary/20"
                  )}
                >
                  {!imageErrors[avatar.id] ? (
                    <Image
                      src={avatar.src}
                      alt={avatar.alt}
                      width={120}
                      height={120}
                      unoptimized
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(avatar.id)}
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400">
                      <span className="text-2xl font-roboto-bold">
                        {avatar.id.slice(-1)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Selection Indicator */}
                {selectedAvatar === avatar.id && (
                  <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                    <Check className="w-5 h-5 text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Submit Button */}
          <button
            type="submit"
            className="uppercase w-full py-3.5 bg-primary text-white font-roboto-bold rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t("common.confirm")}
          </button>
        </form>
      </main>
    </div>
  );
}
