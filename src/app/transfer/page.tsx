"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import { CreditCard, KeyRound } from "lucide-react";
import { Header } from "@/components/layout";

// Mock data - same as contact page (in real app would come from API)
const mockContacts: Record<string, { username: string; alias: string; avatar: string }> = {
  "Aunsk02": { username: "Aunsk02", alias: "Leong Fei Fan", avatar: "/aone/Avatar/Avatar1.webp" },
  "Ampaen12": { username: "Ampaen12", alias: "Amy Chen", avatar: "/aone/Avatar/Avatar2.webp" },
  "Aulde38": { username: "Aulde38", alias: "Alex Wong", avatar: "/aone/Avatar/Avatar3.webp" },
  "Umksbjt34": { username: "Umksbjt34", alias: "Uma Kumar", avatar: "/aone/Avatar/Avatar4.webp" },
  "Upma90": { username: "Upma90", alias: "Upendra Patel", avatar: "/aone/Avatar/Avatar5.webp" },
};

// Mock balance
const mockBalance = 126000.00;

export default function TransferPage() {
  const searchParams = useSearchParams();
  const recipientUsername = searchParams.get("to") || "";

  const [amount, setAmount] = useState("");
  const [pin, setPin] = useState("");
  const [imgError, setImgError] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // Get contact info
  const contact = mockContacts[recipientUsername] || {
    username: recipientUsername,
    alias: recipientUsername,
    avatar: "/aone/Avatar/Avatar1.webp",
  };

  const handleTransfer = () => {
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    // TODO: API call to process transfer
    console.log("Transferring", amount, "to", contact.username, "with PIN", pin);
    setShowConfirm(false);
  };

  const formattedAmount = amount ? parseFloat(amount).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header variant="subpage" title="Transfer" backHref={`/account/contact`} />

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-6">
        {/* Contact Avatar & Info */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-zinc-200 mb-4">
            {!imgError ? (
              <Image
                src={contact.avatar}
                alt={contact.alias}
                width={96}
                height={96}
                unoptimized
                className="w-full h-full object-cover"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-500 font-roboto-bold text-2xl">
                {contact.alias.charAt(0).toUpperCase()}
              </div>
            )}
          </div>
          <h2 className="text-xl font-roboto-semibold text-zinc-800 mb-1">{contact.alias}</h2>
          <span className="text-sm text-zinc-500">UID: {contact.username}</span>
        </div>

        {/* Amount Field */}
        <div className="mb-2">
          <div className="flex items-center gap-3 px-4 py-3 border border-zinc-300 rounded-lg bg-white">
            <CreditCard className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              type="number"
              placeholder="Min. MYR 10/ Max. MYR 30,000"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1 focus:outline-none text-zinc-800 placeholder:text-zinc-400"
            />
          </div>
          <p className="mt-2 text-sm text-zinc-500">
            Available Balance: <span className="text-primary font-roboto-medium">MYR {mockBalance.toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
          </p>
        </div>

        {/* PIN Field */}
        <div className="mb-6">
          <div className="flex items-center gap-3 px-4 py-3 border border-zinc-300 rounded-lg bg-white">
            <KeyRound className="w-5 h-5 text-zinc-400 shrink-0" />
            <input
              type="password"
              placeholder="PIN"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              maxLength={6}
              className="flex-1 focus:outline-none text-zinc-800 placeholder:text-zinc-400"
            />
          </div>
        </div>

        {/* Transfer Button */}
        <button
          onClick={handleTransfer}
          disabled={!amount || !pin}
          className="w-full py-4 bg-primary text-white font-roboto-bold text-base rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          TRANSFER
        </button>
      </main>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setShowConfirm(false)}
          />
          <div className="relative bg-white rounded-xl p-6 w-full max-w-sm">
            <p className="text-center text-zinc-800 mb-6">
              Confirm transfer <span className="text-primary font-roboto-medium">MYR {formattedAmount}</span> to your friend <span className="text-primary font-roboto-medium">{contact.alias}</span>?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-3 bg-dark text-white font-roboto-medium rounded-lg hover:bg-dark/90 transition-colors"
              >
                CANCEL
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 py-3 bg-primary text-white font-roboto-medium rounded-lg hover:bg-primary/90 transition-colors"
              >
                CONFIRM
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
