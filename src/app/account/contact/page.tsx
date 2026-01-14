"use client";

import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, FolderOpen, Camera } from "lucide-react";
import { Header } from "@/components/layout";
import {
  ContactListItem,
  AddFriendBanner,
  FriendRequestItem,
  SearchResultCard,
} from "@/components/contact";
import { cn } from "@/lib/utils";

// Mock data for contacts
const mockContacts = [
  { id: "1", username: "Aunsk02", avatar: "/aone/Avatar/Avatar1.webp", alias: "Leong Fei Fan" },
  { id: "2", username: "Ampaen12", avatar: "/aone/Avatar/Avatar2.webp", alias: "Amy Chen" },
  { id: "3", username: "Aulde38", avatar: "/aone/Avatar/Avatar3.webp", alias: "Alex Wong" },
  { id: "4", username: "Umksbjt34", avatar: "/aone/Avatar/Avatar4.webp", alias: "Uma Kumar" },
  { id: "5", username: "Upma90", avatar: "/aone/Avatar/Avatar5.webp", alias: "Upendra Patel" },
];

// Mock data for friend requests (incoming)
const mockFriendRequests = [
  { id: "r1", username: "majspo9", avatar: "/aone/Avatar/Avatar6.webp" },
  { id: "r2", username: "Pmpaenw2", avatar: "/aone/Avatar/Avatar7.webp" },
];

// Mock data for my requests (outgoing)
const mockMyRequests = [
  { id: "m1", username: "majspo9", avatar: "/aone/Avatar/Avatar6.webp" },
  { id: "m2", username: "Pmpaenw2", avatar: "/aone/Avatar/Avatar1.webp" },
  { id: "m3", username: "DHnsk", avatar: "/aone/Avatar/Avatar8.webp" },
];

// Mock search result
const mockSearchResult = {
  id: "s1",
  username: "FancyYo24",
  avatar: "/aone/Avatar/Avatar9.webp",
};

type ViewMode = "contacts" | "addFriend";
type RequestTab = "incoming" | "outgoing";
type PageMode = "contact" | "transfer";

export default function ContactPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Determine page mode from query param
  const pageMode: PageMode = searchParams.get("mode") === "transfer" ? "transfer" : "contact";
  const isTransferMode = pageMode === "transfer";

  const [viewMode, setViewMode] = useState<ViewMode>("contacts");
  const [searchQuery, setSearchQuery] = useState("");
  const [requestTab, setRequestTab] = useState<RequestTab>("incoming");
  const [friendRequests, setFriendRequests] = useState(mockFriendRequests);
  const [myRequests, setMyRequests] = useState(mockMyRequests);

  // Group contacts alphabetically
  const groupedContacts = useMemo(() => {
    const groups: Record<string, typeof mockContacts> = {};

    const filteredContacts = mockContacts.filter((contact) =>
      contact.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filteredContacts.forEach((contact) => {
      const firstLetter = contact.username.charAt(0).toUpperCase();
      if (!groups[firstLetter]) {
        groups[firstLetter] = [];
      }
      groups[firstLetter].push(contact);
    });

    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b));
  }, [searchQuery]);

  const handleContactClick = (contactId: string, username: string) => {
    if (isTransferMode) {
      // In transfer mode, go to transfer page with selected contact
      router.push(`/transfer?to=${username}`);
    } else {
      // In contact mode, go to contact detail page
      router.push(`/account/contact/${contactId}`);
    }
  };

  const handleApproveRequest = (requestId: string) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
    // TODO: API call to approve
  };

  const handleRejectRequest = (requestId: string) => {
    setFriendRequests((prev) => prev.filter((r) => r.id !== requestId));
    // TODO: API call to reject
  };

  const handleCancelRequest = (requestId: string) => {
    setMyRequests((prev) => prev.filter((r) => r.id !== requestId));
    // TODO: API call to cancel
  };

  const handleAddFriend = () => {
    // TODO: API call to add friend
    console.log("Adding friend:", searchQuery);
  };

  const totalPendingRequests = friendRequests.length + myRequests.length;

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header
        variant="subpage"
        title={isTransferMode ? "Transfer" : "My Contact"}
        backHref={isTransferMode ? "/account" : "/account"}
      />

      {/* Add New Friend Banner - only in contacts view and not in transfer mode */}
      {viewMode === "contacts" && !isTransferMode && (
        <AddFriendBanner
          requestCount={totalPendingRequests}
          onClick={() => setViewMode("addFriend")}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {/* Search Bar */}
        <div className="p-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-400" />
            <input
              type="text"
              placeholder="Search UID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 bg-white"
            />
            {viewMode === "addFriend" && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                <button className="text-zinc-400 hover:text-zinc-600">
                  <FolderOpen className="w-5 h-5" />
                </button>
                <button className="text-zinc-400 hover:text-zinc-600">
                  <Camera className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {viewMode === "contacts" ? (
          /* Contacts List View */
          <div>
            {groupedContacts.map(([letter, contacts]) => (
              <div key={letter}>
                {/* Letter Header */}
                <div className="px-4 py-2 bg-zinc-50 border-y border-zinc-200">
                  <span className="text-sm font-roboto-semibold text-zinc-600">{letter}</span>
                </div>
                {/* Contact Items */}
                {contacts.map((contact) => (
                  <ContactListItem
                    key={contact.id}
                    username={contact.username}
                    avatar={contact.avatar}
                    onClick={() => handleContactClick(contact.id, contact.username)}
                  />
                ))}
              </div>
            ))}

            {groupedContacts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-12 text-zinc-500">
                <p>No contacts found</p>
              </div>
            )}
          </div>
        ) : (
          /* Add Friend View */
          <div className="px-4">
            {/* Search Result */}
            {searchQuery && (
              <div className="mb-4">
                <SearchResultCard
                  username={searchQuery || mockSearchResult.username}
                  avatar={mockSearchResult.avatar}
                  onAdd={handleAddFriend}
                />
              </div>
            )}

            {/* Request Tabs */}
            <div className="flex border-b border-zinc-200 mb-4">
              <button
                onClick={() => setRequestTab("incoming")}
                className={cn(
                  "flex-1 py-3 text-sm font-roboto-medium transition-colors",
                  requestTab === "incoming"
                    ? "text-primary border-b-2 border-primary"
                    : "text-zinc-500"
                )}
              >
                Friend Request ({friendRequests.length})
              </button>
              <button
                onClick={() => setRequestTab("outgoing")}
                className={cn(
                  "flex-1 py-3 text-sm font-roboto-medium transition-colors",
                  requestTab === "outgoing"
                    ? "text-primary border-b-2 border-primary"
                    : "text-zinc-500"
                )}
              >
                My Request ({myRequests.length})
              </button>
            </div>

            {/* Request List */}
            <div>
              {requestTab === "incoming" ? (
                friendRequests.length > 0 ? (
                  friendRequests.map((request) => (
                    <FriendRequestItem
                      key={request.id}
                      username={request.username}
                      avatar={request.avatar}
                      type="incoming"
                      onApprove={() => handleApproveRequest(request.id)}
                      onReject={() => handleRejectRequest(request.id)}
                    />
                  ))
                ) : (
                  <div className="py-8 text-center text-zinc-500">
                    No friend requests
                  </div>
                )
              ) : myRequests.length > 0 ? (
                myRequests.map((request) => (
                  <FriendRequestItem
                    key={request.id}
                    username={request.username}
                    avatar={request.avatar}
                    type="outgoing"
                    onCancel={() => handleCancelRequest(request.id)}
                  />
                ))
              ) : (
                <div className="py-8 text-center text-zinc-500">
                  No pending requests
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
