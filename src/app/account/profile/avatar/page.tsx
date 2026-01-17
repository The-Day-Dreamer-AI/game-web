"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout";
import { Check, Loader2 } from "lucide-react";
import { useI18n } from "@/providers/i18n-provider";
import { cn } from "@/lib/utils";
import { useAvatars, useChangeAvatar } from "@/hooks";

export default function ChangeAvatarPage() {
  const router = useRouter();
  const { t } = useI18n();
  const [selectedAvatar, setSelectedAvatar] = useState<string>("");
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [error, setError] = useState("");

  // Fetch available avatars
  const { data: avatarsData, isLoading: isLoadingAvatars } = useAvatars();
  const changeAvatarMutation = useChangeAvatar();

  // Pre-select current avatar when data loads
  useEffect(() => {
    if (avatarsData?.AvatarId) {
      setSelectedAvatar(avatarsData.AvatarId);
    }
  }, [avatarsData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!selectedAvatar) {
      setError(t("profile.selectAvatar"));
      return;
    }

    try {
      await changeAvatarMutation.mutateAsync({ Id: selectedAvatar });
      // Navigate back on success
      router.push("/account/profile");
    } catch (err) {
      setError(err instanceof Error ? err.message : t("common.error"));
    }
  };

  const handleImageError = (avatarId: string) => {
    setImageErrors((prev) => ({ ...prev, [avatarId]: true }));
  };

  // Loading state while fetching avatars
  if (isLoadingAvatars) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          variant="subpage"
          title={t("profile.changeAvatar")}
          backHref="/account/profile"
        />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  const avatars = avatarsData?.Avatars || [];

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
          {/* Error Message */}
          {error && (
            <p className="text-sm text-red-500 text-center mb-4">{error}</p>
          )}

          {/* Avatar Selection Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 px-2 sm:px-6">
            {avatars.map((avatar, index) => (
              <button
                key={avatar.Id}
                type="button"
                onClick={() => setSelectedAvatar(avatar.Id)}
                className="relative aspect-square cursor-pointer"
              >
                {/* Avatar Image */}
                <div
                  className={cn(
                    "w-full h-full rounded-full overflow-hidden border-2 transition-colors",
                    selectedAvatar === avatar.Id
                      ? "border-primary"
                      : "border-primary/20"
                  )}
                >
                  {!imageErrors[avatar.Id] ? (
                    <Image
                      src={avatar.Image}
                      alt={`Avatar ${index + 1}`}
                      width={120}
                      height={120}
                      unoptimized
                      className="w-full h-full object-cover"
                      onError={() => handleImageError(avatar.Id)}
                    />
                  ) : (
                    <div className="w-full h-full bg-zinc-200 flex items-center justify-center text-zinc-400">
                      <span className="text-2xl font-roboto-bold">
                        {index + 1}
                      </span>
                    </div>
                  )}
                </div>

                {/* Selection Indicator */}
                {selectedAvatar === avatar.Id && (
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
            disabled={changeAvatarMutation.isPending}
            className="cursor-pointer uppercase w-full py-3.5 bg-primary text-white font-roboto-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {changeAvatarMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                {t("common.loading")}
              </>
            ) : (
              t("common.confirm")
            )}
          </button>
        </form>
      </main>
    </div>
  );
}
