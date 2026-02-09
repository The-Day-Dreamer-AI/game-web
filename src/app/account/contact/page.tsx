"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2 } from "lucide-react";
import { FormInput } from "@/components/ui/form-input";
import { ContactListItem, AddFriendBanner } from "@/components/contact";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { useToast } from "@/providers/toast-provider";
import { useKyc } from "@/providers/kyc-provider";
import { useContacts, useContactRequests } from "@/hooks/use-contact";
import { contactApi } from "@/lib/api";

type PageMode = "contact" | "transfer";

export default function ContactPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const { navigateWithKycCheck } = useKyc();
  const { showError } = useToast();

  // Determine page mode from query param
  const pageMode: PageMode = searchParams.get("mode") === "transfer" ? "transfer" : "contact";
  const isTransferMode = pageMode === "transfer";

  const [searchInput, setSearchInput] = useState("");
  const [isLoadingTransfer, setIsLoadingTransfer] = useState(false);

  // Fetch contacts
  const { data: contactsData, isLoading: isLoadingContacts } = useContacts({
    enabled: isAuthenticated,
  });

  // Fetch contact requests (to show count in banner)
  const { data: requestsData } = useContactRequests({
    enabled: isAuthenticated && !isTransferMode,
  });

  // Get contacts and filter by search
  const filteredContacts = useMemo(() => {
    const contacts = contactsData?.Contacts ?? [];
    if (!searchInput) return contacts;
    return contacts.filter((contact) =>
      contact.Alias.toLowerCase().includes(searchInput.toLowerCase())
    );
  }, [contactsData?.Contacts, searchInput]);

  // Group contacts alphabetically by Letter field
  const groupedContacts = useMemo(() => {
    const groups: Record<string, typeof filteredContacts> = {};

    filteredContacts.forEach((contact) => {
      const letter = contact.Letter.toUpperCase();
      if (!groups[letter]) {
        groups[letter] = [];
      }
      groups[letter].push(contact);
    });

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [filteredContacts]);

  // Get friend requests count
  const friendRequests = requestsData?.FrRequests ?? [];
  const myRequests = requestsData?.MyRequests ?? [];
  const totalPendingRequests = friendRequests.length + myRequests.length;

  const handleContactClick = async (contactId: string) => {
    if (isTransferMode) {
      // In transfer mode, first fetch contact detail to get TargetId
      setIsLoadingTransfer(true);
      try {
        const contactDetail = await contactApi.getContact(contactId);
        if (contactDetail.Code === 0 && contactDetail.TargetId) {
          // Navigate to transfer page with targetId for API and id for back navigation
          router.push(`/transfer?targetId=${contactDetail.TargetId}&id=${contactId}&from=transfer-list`);
        } else {
          showError(contactDetail.Message || t("contact.loadFailed"));
        }
      } catch (error) {
        showError(error instanceof Error ? error.message : t("contact.loadFailed"));
      } finally {
        setIsLoadingTransfer(false);
      }
    } else {
      // In contact mode, go to contact detail page
      router.push(`/account/contact/${contactId}`);
    }
  };

  const handleAddNewFriend = () => {
    navigateWithKycCheck("/account/contact/new-friend");
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex-1 flex items-center justify-center px-4">
          <p className="text-sm text-zinc-500 text-center">
            {t("common.loginRequired")}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Add New Friend Banner - only when not in transfer mode */}
      {!isTransferMode && (
        <AddFriendBanner
          requestCount={totalPendingRequests}
          onClick={handleAddNewFriend}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Search Bar */}
        <div className="p-4">
          <FormInput
            type="text"
            placeholder={t("contact.searchUid")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            prefix={<Search className="w-5 h-5 text-zinc-400" />}
          />
        </div>

        {/* Contacts List */}
        <div>
          {isLoadingContacts ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
          ) : groupedContacts.length > 0 ? (
            groupedContacts.map(([letter, letterContacts]) => (
              <div key={letter}>
                {/* Letter Header */}
                <div className="px-4 py-2 bg-[#D4F1F0]">
                  <span className="text-sm font-roboto-bold text-[#5F7182]">{letter}</span>
                </div>
                {/* Contact Items */}
                {letterContacts.map((contact) => (
                  <ContactListItem
                    key={contact.Id}
                    username={contact.Alias}
                    avatar={contact.Image}
                    onClick={() => handleContactClick(contact.Id)}
                    disabled={isLoadingTransfer}
                  />
                ))}
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
              <p>{t("contact.noContactsFound")}</p>
            </div>
          )}
        </div>
      </main>

      {/* Loading overlay for transfer mode */}
      {isLoadingTransfer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      )}
    </div>
  );
}
