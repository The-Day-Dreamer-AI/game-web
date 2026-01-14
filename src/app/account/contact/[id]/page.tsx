"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import { Pencil } from "lucide-react";
import { Header } from "@/components/layout";

// Mock data - in real app this would come from API
const mockContactDetails: Record<string, { username: string; alias: string; avatar: string }> = {
  "1": { username: "Aunsk02", alias: "Leong Fei Fan", avatar: "/aone/Avatar/Avatar1.webp" },
  "2": { username: "Ampaen12", alias: "Amy Chen", avatar: "/aone/Avatar/Avatar2.webp" },
  "3": { username: "Aulde38", alias: "Alex Wong", avatar: "/aone/Avatar/Avatar3.webp" },
  "4": { username: "Umksbjt34", alias: "Uma Kumar", avatar: "/aone/Avatar/Avatar4.webp" },
  "5": { username: "Upma90", alias: "Upendra Patel", avatar: "/aone/Avatar/Avatar5.webp" },
};

export default function ContactDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [imgError, setImgError] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const contactId = params.id as string;
  const contact = mockContactDetails[contactId] || {
    username: "Unknown",
    alias: "Unknown User",
    avatar: "/aone/Avatar/Avatar1.webp",
  };

  const [alias, setAlias] = useState(contact.alias);

  const handleTransfer = () => {
    // Navigate to transfer page with contact pre-selected
    router.push(`/transfer?to=${contact.username}`);
  };

  const handleDelete = () => {
    // TODO: API call to delete contact
    console.log("Deleting contact:", contactId);
    router.push("/account/contact");
  };

  const handleSaveAlias = () => {
    // TODO: API call to update alias
    console.log("Saving alias:", alias);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header variant="subpage" title="Friend Detail" backHref="/account/contact" />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Avatar */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-200 mb-4">
            {!imgError ? (
              <Image
                src={contact.avatar}
                alt={contact.alias}
                unoptimized
                width={96}
                height={96}
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500 font-roboto-bold text-2xl">
                {contact.alias.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* Alias with Edit */}
          <div className="flex items-center gap-2 mb-1">
            {isEditing ? (
              <input
                type="text"
                value={alias}
                onChange={(e) => setAlias(e.target.value)}
                onBlur={handleSaveAlias}
                onKeyDown={(e) => e.key === "Enter" && handleSaveAlias()}
                autoFocus
                className="text-xl font-roboto-semibold text-zinc-800 text-center border-b-2 border-primary focus:outline-none bg-transparent"
              />
            ) : (
              <>
                <span className="text-xl font-roboto-semibold text-zinc-800">{alias}</span>
                <button
                  onClick={() => setIsEditing(true)}
                  className="text-zinc-400 hover:text-zinc-600"
                >
                  <Pencil className="w-4 h-4" />
                </button>
              </>
            )}
          </div>

          {/* UID */}
          <span className="text-sm text-zinc-500">UID: {contact.username}</span>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={handleTransfer}
            className="w-full py-4 bg-primary text-white font-roboto-bold text-base rounded-lg hover:bg-primary/90 transition-colors"
          >
            TRANSFER
          </button>

          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="w-full py-4 bg-red-500 text-white font-roboto-bold text-base rounded-lg hover:bg-red-600 transition-colors"
          >
            DELETE
          </button>
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowDeleteConfirm(false)}
          />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="text-lg font-roboto-semibold text-zinc-800 mb-2">Delete Contact</h3>
            <p className="text-zinc-600 mb-6">
              Are you sure you want to delete {alias} from your contacts?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-3 border border-zinc-300 text-zinc-700 font-roboto-medium rounded-lg hover:bg-zinc-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-3 bg-red-500 text-white font-roboto-medium rounded-lg hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
