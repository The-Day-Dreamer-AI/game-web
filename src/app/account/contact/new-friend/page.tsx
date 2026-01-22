"use client";

import { useState } from "react";
import { Search, FolderOpen, Camera, Loader2 } from "lucide-react";
import { Header } from "@/components/layout";
import { FormInput } from "@/components/ui/form-input";
import {
  FriendRequestItem,
  SearchResultCard,
  FriendRequestConfirmModal,
} from "@/components/contact";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import {
  useContactRequests,
  useSearchContact,
  useAddContact,
  useApproveContact,
  useRejectContact,
  useCancelContact,
} from "@/hooks/use-contact";

type RequestTab = "incoming" | "outgoing";

export default function NewFriendPage() {
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [requestTab, setRequestTab] = useState<RequestTab>("incoming");

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "reject" | "cancel";
    requestId: string;
  }>({ isOpen: false, type: "reject", requestId: "" });

  // Fetch contact requests
  const { data: requestsData, isLoading: isLoadingRequests } =
    useContactRequests({
      enabled: isAuthenticated,
    });

  // Search for contacts - only when searchQuery is set (on Enter press)
  const { data: searchData, isLoading: isSearching } = useSearchContact(
    searchQuery,
    {
      enabled: isAuthenticated && searchQuery.length > 0,
    }
  );

  // Handle search on Enter key
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchQuery(searchInput);
    }
  };

  // Mutations
  const addContact = useAddContact();
  const approveContact = useApproveContact();
  const rejectContact = useRejectContact();
  const cancelContact = useCancelContact();

  // Get friend requests
  const friendRequests = requestsData?.FrRequests ?? [];
  const myRequests = requestsData?.MyRequests ?? [];

  // Get search results
  const searchResults = searchData?.Contacts ?? [];

  const handleApproveRequest = async (requestId: string) => {
    try {
      await approveContact.mutateAsync({ Id: requestId });
    } catch (error) {
      console.error("Failed to approve request:", error);
    }
  };

  const handleRejectRequest = (requestId: string) => {
    setConfirmModal({ isOpen: true, type: "reject", requestId });
  };

  const handleCancelRequest = (requestId: string) => {
    setConfirmModal({ isOpen: true, type: "cancel", requestId });
  };

  const handleConfirmAction = async () => {
    try {
      if (confirmModal.type === "cancel") {
        await cancelContact.mutateAsync({ Id: confirmModal.requestId });
      } else {
        await rejectContact.mutateAsync({ Id: confirmModal.requestId });
      }
      setConfirmModal({ isOpen: false, type: "reject", requestId: "" });
    } catch (error) {
      console.error("Failed to process request:", error);
    }
  };

  const handleCloseConfirmModal = () => {
    setConfirmModal({ isOpen: false, type: "reject", requestId: "" });
  };

  const handleAddFriend = async (userId: string) => {
    try {
      const response = await addContact.mutateAsync({ Id: userId });
      if (response.Code === 0) {
        // Clear search after successful request
        setSearchInput("");
        setSearchQuery("");
      }
    } catch (error) {
      console.error("Failed to add friend:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header
          variant="subpage"
          title={t("contact.addNewFriend")}
        />
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
      {/* Header */}
      <Header
        variant="subpage"
        title={t("contact.addNewFriend")}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Search Bar */}
        <div className="p-4">
          <FormInput
            type="text"
            placeholder={t("contact.searchUidEnter")}
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            prefix={<Search className="w-5 h-5 text-zinc-400 cursor-pointer" />}
            suffix={
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="text-zinc-400 hover:text-zinc-600"
                >
                  <FolderOpen className="w-5 h-5 cursor-pointer" />
                </button>
                <button
                  type="button"
                  className="text-zinc-400 hover:text-zinc-600"
                >
                  <Camera className="w-5 h-5 cursor-pointer" />
                </button>
              </div>
            }
          />
        </div>

        <div className="px-4">
          {/* Search Result */}
          {searchQuery && (
            <div className="mb-4">
              {isSearching ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((result) => {
                  const isRequested = myRequests.some(
                    (req) => req.Username === result.Username
                  );
                  return (
                    <SearchResultCard
                      key={result.Id}
                      username={result.Username}
                      avatar={result.Image}
                      onAdd={() => handleAddFriend(result.Id)}
                      isAdding={addContact.isPending}
                      isRequested={isRequested}
                    />
                  );
                })
              ) : searchData ? (
                <div className="py-4 text-center text-zinc-500">
                  {t("contact.noUsersFound")}
                </div>
              ) : null}
              {addContact.isSuccess && (
                <p className="text-sm text-primary text-center mt-2">
                  {t("contact.friendRequestSent")}
                </p>
              )}
            </div>
          )}

          {/* Request Section with Border */}
          <div className="shadow-xl rounded-4xl overflow-hidden bg-white">
            {/* Request Tabs */}
            <div className="flex bg-white">
              <button
                onClick={() => setRequestTab("incoming")}
                className={cn(
                  "flex-1 py-3 text-sm font-roboto-bold transition-colors cursor-pointer",
                  requestTab === "incoming"
                    ? "text-primary border-b-2 border-primary"
                    : "text-[#28323C]"
                )}
              >
                {t("contact.friendRequest")} ({friendRequests.length})
              </button>
              <button
                onClick={() => setRequestTab("outgoing")}
                className={cn(
                  "flex-1 py-3 text-sm font-roboto-bold transition-colors cursor-pointer",
                  requestTab === "outgoing"
                    ? "text-primary border-b-2 border-primary"
                    : "text-[#28323C]"
                )}
              >
                {t("contact.myRequest")} ({myRequests.length})
              </button>
            </div>

            {/* Request List */}
            <div>
              {isLoadingRequests ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 text-primary animate-spin" />
                </div>
              ) : requestTab === "incoming" ? (
                friendRequests.length > 0 ? (
                  friendRequests.map((request, index) => (
                    <div key={request.Id} className="flex flex-col">
                      <FriendRequestItem
                        username={request.Username}
                        avatar={request.Image}
                        type="incoming"
                        onApprove={() => handleApproveRequest(request.Id)}
                        onReject={() => handleRejectRequest(request.Id)}
                      />
                      {friendRequests.length - 1 !== index && (
                        <div className="w-full px-6">
                          <div className="h-px w-full bg-[#DBDBDB]"></div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-8 text-center text-zinc-500">
                    {t("contact.noFriendRequests")}
                  </div>
                )
              ) : myRequests.length > 0 ? (
                myRequests.map((request, index) => (
                  <div key={request.Id} className="flex flex-col">
                    <FriendRequestItem
                      key={request.Id}
                      username={request.Username}
                      avatar={request.Image}
                      type="outgoing"
                      onCancel={() => handleCancelRequest(request.Id)}
                    />
                    {myRequests.length - 1 !== index && (
                      <div className="w-full px-6">
                        <div className="h-px w-full bg-[#DBDBDB]"></div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="py-8 text-center text-zinc-500">
                  {t("contact.noPendingRequests")}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Confirmation Modal */}
      <FriendRequestConfirmModal
        isOpen={confirmModal.isOpen}
        type={confirmModal.type}
        onConfirm={handleConfirmAction}
        onClose={handleCloseConfirmModal}
        isLoading={rejectContact.isPending || cancelContact.isPending}
      />
    </div>
  );
}
