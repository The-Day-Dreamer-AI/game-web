"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { useToast } from "@/providers/toast-provider";
import { useContactDetail, useUpdateContactAlias } from "@/hooks/use-contact";

export default function ChangeAliasPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const { showSuccess, showError } = useToast();

  const contactId = params.id as string;
  const [alias, setAlias] = useState<string | null>(null);

  // Fetch contact detail
  const {
    data: contact,
    isLoading,
    isError,
  } = useContactDetail(contactId, {
    enabled: isAuthenticated && !!contactId,
  });

  // Update alias mutation
  const updateAliasMutation = useUpdateContactAlias();

  // Handle contact detail API error - redirect to account page
  useEffect(() => {
    if (isError) {
      showError(t("contact.loadFailed"));
      router.push("/account");
    }
  }, [isError, showError, t, router]);

  // Derive current value: user input takes priority, otherwise use API data
  const currentAlias = alias ?? contact?.Alias ?? contact?.Name ?? "";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentAlias.trim()) {
      showError(t("contact.aliasRequired"));
      return;
    }

    try {
      const result = await updateAliasMutation.mutateAsync({
        Id: contactId,
        Alias: currentAlias.trim(),
      });

      if (result.Code === 0) {
        showSuccess(t("contact.aliasUpdated"));
        router.push(`/account/contact/${contactId}`);
      } else {
        showError(result.Message || t("contact.aliasUpdateFailed"));
      }
    } catch (err) {
      showError(err instanceof Error ? err.message : t("contact.aliasUpdateFailed"));
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-zinc-500 text-center">
            {t("contact.loginRequired")}
          </p>
        </div>
      </div>
    );
  }

  // Loading state while fetching contact
  if (isLoading || isError || !contact) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Form */}
      <main className="flex-1 px-4 py-4">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Alias Input */}
          <FormInput
            type="text"
            value={currentAlias}
            onChange={(e) => setAlias(e.target.value)}
            placeholder={t("contact.alias")}
            prefix={
              <Image
                src="/images/icon/user_icon.png"
                alt="Alias"
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
            disabled={updateAliasMutation.isPending}
            className="cursor-pointer uppercase w-full py-3.5 bg-primary text-white font-roboto-bold rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {updateAliasMutation.isPending ? (
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
