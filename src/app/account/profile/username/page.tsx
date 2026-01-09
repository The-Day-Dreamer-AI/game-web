"use client";

import { useState } from "react";
import { Header } from "@/components/layout";
import { User } from "lucide-react";
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
    <div className="min-h-screen flex flex-col bg-zinc-100">
      {/* Header */}
      <Header
        variant="subpage"
        title={t("profile.changeUsername")}
        backHref="/account/profile"
      />

      {/* Form */}
      <main className="flex-1 px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username Input */}
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400">
              <User className="w-5 h-5" />
            </div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t("auth.username")}
              className="w-full pl-12 pr-4 py-3.5 bg-white border border-zinc-200 rounded-xl text-sm text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 bg-primary text-white font-roboto-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            {t("common.confirm")}
          </button>
        </form>
      </main>
    </div>
  );
}
