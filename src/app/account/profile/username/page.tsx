"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/layout";
import { FormInput } from "@/components/ui/form-input";
import { useI18n } from "@/providers/i18n-provider";

export default function ChangeUsernamePage() {
  const [username, setUsername] = useState("");
  const { t } = useI18n();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock submit - in real app would call API
    console.log("Changing username to:", username);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header
        variant="subpage"
        title={t("profile.changeUsername")}
        backHref="/account/profile"
      />

      {/* Form */}
      <main className="flex-1 px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Username Input */}
          <FormInput
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder={t("auth.username")}
            prefix={
              <Image
                src="/images/icon/user_icon.png"
                alt="Username"
                width={24}
                height={24}
                unoptimized
                className="h-6 w-auto object-contain"
              />
            }
          />

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
