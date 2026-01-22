"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Loader2 } from "lucide-react";
import { Header } from "@/components/layout";
import { FormInput } from "@/components/ui/form-input";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { useToast } from "@/providers/toast-provider";
import { useContactDetail, useDeleteContact } from "@/hooks/use-contact";

export default function ContactDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const { showSuccess, showError } = useToast();

  const contactId = params.id as string;

  const [imgError, setImgError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [alias, setAlias] = useState("");

  // Fetch contact detail
  const {
    data: contact,
    isLoading,
    error,
  } = useContactDetail(contactId, {
    enabled: isAuthenticated && !!contactId,
  });

  // Delete mutation
  const deleteContact = useDeleteContact();

  // Update alias when contact loads
  if (contact?.Alias && !alias && !isEditing) {
    setAlias(contact.Alias);
  }

  const handleTransfer = () => {
    if (contact?.TargetId) {
      // Navigate to transfer page with target ID
      router.push(`/transfer?id=${contact.TargetId}`);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteContact.mutateAsync({ Id: contactId });
      showSuccess(t("contact.deleteSuccess") || "Contact deleted successfully");
      router.push("/account/contact");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("contact.deleteFailed") || "Failed to delete contact";
      showError(errorMessage);
      setShowDeleteConfirm(false);
    }
  };

  const handleSaveAlias = () => {
    // TODO: API call to update alias (if API supports it)
    console.log("Saving alias:", alias);
    setIsEditing(false);
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          variant="subpage"
          title={t("contact.friendDetail")}
          backHref="/account/contact"
        />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-zinc-500 text-center">
            {t("contact.loginRequired")}
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          variant="subpage"
          title={t("contact.friendDetail")}
          backHref="/account/contact"
        />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !contact) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          variant="subpage"
          title={t("contact.friendDetail")}
          backHref="/account/contact"
        />
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-red-500 text-center">
            {t("contact.loadFailed")}
          </p>
        </div>
      </div>
    );
  }

  const displayAlias = alias || contact.Alias || contact.Name;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header
        variant="subpage"
        title={t("contact.friendDetail")}
        backHref="/account/contact"
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto px-6 pt-12">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-200 mb-4">
            {!imgError && contact.Image ? (
              <Image
                src={contact.Image}
                alt={displayAlias}
                unoptimized
                width={96}
                height={96}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500 font-roboto-bold text-2xl">
                {displayAlias.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Alias with Edit */}
          <div className="flex items-center gap-2 mb-1">
            {isEditing ? (
              <FormInput
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                onBlur={handleSaveAlias}
                onKeyDown={(e) => e.key === "Enter" && handleSaveAlias()}
                autoFocus
                className="text-center"
                wrapperClassName="max-w-[200px]"
              />
            ) : (
              <>
                <span className="text-xl font-roboto-bold text-[#28323C]">
                  {displayAlias}
                </span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  <Image
                    src="/images/icon/username_icon.png"
                    alt="AON1E edit"
                    width={24}
                    height={24}
                    unoptimized
                    className="h-6 w-auto object-contain"
                  />
                </button>
              </>
            )}
          </div>

          {/* UID */}
          <span className="text-sm text-[#28323C]">
            UID: {contact.Username}
          </span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <button
            onClick={handleTransfer}
            className="cursor-pointer w-full py-4 bg-primary text-white font-roboto-bold text-base rounded-lg hover:bg-primary/90 transition-colors"
          >
            {t("contact.transferButton")}
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="cursor-pointer w-full py-4 bg-red-500 text-white font-roboto-bold text-base rounded-lg hover:bg-red-600 transition-colors"
          >
            {t("contact.deleteButton")}
          </button>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
          onClick={() => setShowDeleteConfirm(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-sm"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-center text-lg font-roboto-bold text-[#28323C] mb-2">
              {t("contact.deleteTitle")}
            </h3>
            <p className="text-center text-[#5F7182] text-sm mb-6">
              {t("contact.deleteMessage")}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                disabled={deleteContact.isPending}
                className="flex-1 py-3 bg-[#28323C] text-white font-roboto-bold text-sm rounded-lg cursor-pointer disabled:opacity-50"
              >
                {t("contact.cancelUpper")}
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteContact.isPending}
                className="flex-1 py-3 bg-red-500 text-white font-roboto-bold text-sm rounded-lg cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {deleteContact.isPending && (
                  <Loader2 className="w-4 h-4 animate-spin" />
                )}
                {t("contact.deleteButton")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
