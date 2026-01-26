"use client";

import { useState, useRef, useCallback, useEffect, ChangeEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { Search, Loader2 } from "lucide-react";
import QrScanner from "qr-scanner";
import { FormInput } from "@/components/ui/form-input";
import {
  FriendRequestItem,
  SearchResultCard,
  FriendRequestConfirmModal,
} from "@/components/contact";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import { useI18n } from "@/providers/i18n-provider";
import { useToast } from "@/providers/toast-provider";
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { t } = useI18n();
  const { showError } = useToast();

  // Get initial UID from URL params (from QR scanner)
  const initialUid = searchParams.get("uid") ?? "";

  const [searchInput, setSearchInput] = useState(initialUid);
  const [searchQuery, setSearchQuery] = useState(initialUid);
  const [requestTab, setRequestTab] = useState<RequestTab>("incoming");

  // QR file input ref
  const qrFileInputRef = useRef<HTMLInputElement>(null);

  // Confirmation modal state
  const [confirmModal, setConfirmModal] = useState<{
    isOpen: boolean;
    type: "reject" | "cancel";
    requestId: string;
  }>({ isOpen: false, type: "reject", requestId: "" });

  // Extract UID from QR data URL
  const extractUidFromQr = useCallback((data: string): string | null => {
    try {
      const url = new URL(data);
      // Check for UID parameters
      const uid =
        url.searchParams.get("uid") ||
        url.searchParams.get("Id") ||
        url.searchParams.get("id") ||
        url.searchParams.get("UserId") ||
        url.searchParams.get("userId");
      if (uid) {
        return uid;
      }
      // Check if the path contains a UID pattern (e.g., /profile/ABC123)
      const pathParts = url.pathname.split("/").filter(Boolean);
      const lastPart = pathParts[pathParts.length - 1];
      if (lastPart && /^[A-Za-z0-9_-]{3,32}$/.test(lastPart)) {
        return lastPart;
      }
      return null;
    } catch {
      // If not a valid URL, check if it's a plain UID
      const trimmed = data.trim();
      if (/^[A-Za-z0-9_-]{3,32}$/.test(trimmed)) {
        return trimmed;
      }
      return null;
    }
  }, []);

  // Handle QR image file upload
  const handleQrImageUpload = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      try {
        const result = await QrScanner.scanImage(file, {
          returnDetailedScanResult: true,
        });
        const uid = extractUidFromQr(result.data);

        if (uid) {
          setSearchInput(uid);
          setSearchQuery(uid);
        } else {
          showError(t("scanner.invalidQr"));
        }
      } catch {
        showError(t("scanner.qrScanFailed"));
      }

      // Reset the input so the same file can be selected again
      if (qrFileInputRef.current) {
        qrFileInputRef.current.value = "";
      }
    },
    [extractUidFromQr, showError, t]
  );

  // Handle camera button click - navigate to scan-qr page
  const handleCameraClick = useCallback(() => {
    router.push(
      "/account/contact/new-friend/scan-qr?returnTo=/account/contact/new-friend"
    );
  }, [router]);

  // Fetch contact requests
  const {
    data: requestsData,
    isLoading: isLoadingRequests,
    isError: isContactRequestsError,
  } = useContactRequests({
    enabled: isAuthenticated,
  });

  // Handle contact requests API error - redirect to home
  useEffect(() => {
    if (isContactRequestsError) {
      showError(t("contact.loadRequestsFailed"));
      router.push("/home");
    }
  }, [isContactRequestsError, showError, t, router]);

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

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Search Bar */}
        <div className="p-4">
          {/* Hidden file input for QR image upload */}
          <input
            ref={qrFileInputRef}
            type="file"
            accept="image/*"
            onChange={handleQrImageUpload}
            className="hidden"
          />
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
                  onClick={() => qrFileInputRef.current?.click()}
                  className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  <Image
                    src="/images/icon/folder_icon.png"
                    alt="Upload QR"
                    width={20}
                    height={20}
                    unoptimized
                    className="h-5 w-auto object-contain"
                  />
                </button>
                <button
                  type="button"
                  onClick={handleCameraClick}
                  className="text-zinc-400 hover:text-zinc-600 cursor-pointer"
                >
                  <Image
                    src="/images/icon/camera_icon.png"
                    alt="Scan QR"
                    width={20}
                    height={20}
                    unoptimized
                    className="h-5 w-auto object-contain"
                  />
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
