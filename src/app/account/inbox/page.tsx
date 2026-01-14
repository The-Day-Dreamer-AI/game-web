"use client";

import { useState } from "react";
import Image from "next/image";
import { Header } from "@/components/layout";
import { Clock, Trash2, Mail, MailOpen, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/providers/i18n-provider";

// Message type
interface Message {
  id: string;
  title: string;
  preview: string;
  content: string;
  date: string;
  isRead: boolean;
  selected: boolean;
}

// Mock inbox data
const initialSystemMessages: Message[] = [
  {
    id: "sys1",
    title: "New App Update Available",
    preview: "We've improved stability and added new features. Update now for a smoother...",
    content: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip.</p><p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>",
    date: "2025 Nov 11 00:33",
    isRead: false,
    selected: false,
  },
  {
    id: "sys2",
    title: "New Game Provider Added",
    preview: "Explore games from XXXX now added in the lobby!",
    content: "<p>We are excited to announce that <strong>XXXX</strong> game provider has been added to our platform!</p><p>Explore a wide variety of new games including slots, table games, and live casino options. Visit the lobby now to check out the latest additions and enjoy <em>exclusive bonuses</em> on selected games.</p>",
    date: "2025 Nov 1 01:08",
    isRead: false,
    selected: false,
  },
  {
    id: "sys3",
    title: "Top Up Free MYR 5",
    preview: "Your daily reward is ready! Get FREE MYR 5 when you top up today. One claim per day.",
    content: "<p>Your daily reward is ready! Get <strong>FREE MYR 5</strong> when you top up today. One claim per day.</p><p><strong>Terms and Conditions:</strong></p><ol><li>Minimum deposit of MYR 50 required</li><li>Bonus must be claimed within 24 hours</li><li>Wagering requirement: 3x bonus amount</li><li>Maximum withdrawal: MYR 100</li><li>One claim per user per day</li></ol>",
    date: "2025 Oct 17 12:33",
    isRead: false,
    selected: false,
  },
];

const initialPersonalMessages: Message[] = [
  {
    id: "per1",
    title: "Welcome to AONE!",
    preview: "Thank you for joining us. Your account has been successfully created...",
    content: "<p>Welcome to <strong>AONE</strong>! Thank you for joining us. Your account has been successfully created and you're ready to start playing.</p><p><strong>Here's what you can do next:</strong></p><ul><li>Complete your profile verification</li><li>Make your first deposit and claim welcome bonus</li><li>Explore our game lobby</li><li>Contact support if you need any help</li></ul>",
    date: "2025 Oct 10 09:00",
    isRead: true,
    selected: false,
  },
  {
    id: "per2",
    title: "KYC Verification Approved",
    preview: "Congratulations! Your KYC verification has been approved successfully.",
    content: "<p>Congratulations! Your KYC verification has been <strong>approved successfully</strong>. You now have full access to all features including:</p><ul><li>Unlimited deposits</li><li>Higher withdrawal limits</li><li>Access to VIP programs</li><li>Exclusive promotions</li></ul>",
    date: "2025 Oct 12 14:22",
    isRead: true,
    selected: false,
  },
  {
    id: "per3",
    title: "Withdrawal Successful",
    preview: "Your withdrawal request of MYR 500.00 has been processed successfully.",
    content: "<p>Your withdrawal request has been processed successfully.</p><p><strong>Transaction Details:</strong></p><table><tr><td>Amount:</td><td>MYR 500.00</td></tr><tr><td>Bank:</td><td>Maybank</td></tr><tr><td>Account:</td><td>****1234</td></tr><tr><td>Reference:</td><td>WD202510150001</td></tr></table><p>The funds should arrive in your bank account within 1-3 business days.</p>",
    date: "2025 Oct 15 16:45",
    isRead: false,
    selected: false,
  },
];

type TabType = "system" | "personal";

export default function InboxPage() {
  const [activeTab, setActiveTab] = useState<TabType>("system");
  const [systemMessages, setSystemMessages] = useState<Message[]>(initialSystemMessages);
  const [personalMessages, setPersonalMessages] = useState<Message[]>(initialPersonalMessages);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [selectAll, setSelectAll] = useState(false);
  const { t } = useI18n();

  const messages = activeTab === "system" ? systemMessages : personalMessages;
  const setMessages = activeTab === "system" ? setSystemMessages : setPersonalMessages;

  const unreadPersonalCount = personalMessages.filter((m) => !m.isRead).length;

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    setMessages(messages.map((m) => ({ ...m, selected: newSelectAll })));
  };

  const handleSelectMessage = (id: string) => {
    setMessages(messages.map((m) => (m.id === id ? { ...m, selected: !m.selected } : m)));
    setSelectAll(false);
  };

  const handleOpenMessage = (message: Message) => {
    // Mark as read
    setMessages(messages.map((m) => (m.id === message.id ? { ...m, isRead: true } : m)));
    setSelectedMessage(message);
  };

  const handleCloseModal = () => {
    setSelectedMessage(null);
  };

  const handleDeleteMessage = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setMessages(messages.filter((m) => m.id !== id));
  };

  const handleMarkSelectedAsRead = () => {
    setMessages(messages.map((m) => (m.selected ? { ...m, isRead: true, selected: false } : m)));
    setSelectAll(false);
  };

  const handleDeleteSelected = () => {
    setMessages(messages.filter((m) => !m.selected));
    setSelectAll(false);
  };

  const hasSelected = messages.some((m) => m.selected);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <Header variant="subpage" title={t("inbox.title")} backHref="/account" />

      {/* Tabs */}
      <div className="bg-white border-b border-zinc-200">
        <div className="flex">
          <button
            onClick={() => {
              setActiveTab("system");
              setSelectAll(false);
            }}
            className={cn(
              "flex-1 py-3 text-sm font-roboto-medium border-b-2 transition-colors",
              activeTab === "system"
                ? "text-primary border-primary"
                : "text-zinc-500 border-transparent hover:text-zinc-700"
            )}
          >
            {t("inbox.system")}
          </button>
          <button
            onClick={() => {
              setActiveTab("personal");
              setSelectAll(false);
            }}
            className={cn(
              "flex-1 py-3 text-sm font-roboto-medium border-b-2 transition-colors",
              activeTab === "personal"
                ? "text-primary border-primary"
                : "text-zinc-500 border-transparent hover:text-zinc-700"
            )}
          >
            {t("inbox.personal")} {unreadPersonalCount > 0 && `(${unreadPersonalCount})`}
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="bg-white px-4 py-3 flex items-center justify-between border-b border-zinc-200">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={selectAll}
            onChange={handleSelectAll}
            className="w-5 h-5 rounded border-zinc-300 text-primary focus:ring-primary"
          />
          <span className="text-sm text-zinc-600">{t("common.selectAll")}</span>
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={handleMarkSelectedAsRead}
            disabled={!hasSelected}
            className={cn(
              "p-2 rounded-lg transition-colors",
              hasSelected ? "text-primary hover:bg-primary/10" : "text-zinc-300"
            )}
          >
            <MailOpen className="w-5 h-5" />
          </button>
          <button
            onClick={handleDeleteSelected}
            disabled={!hasSelected}
            className={cn(
              "p-2 rounded-lg transition-colors",
              hasSelected ? "text-primary hover:bg-primary/10" : "text-zinc-300"
            )}
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Message List */}
      <main className="flex-1 overflow-auto">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-zinc-400">
            <Mail className="w-12 h-12 mb-3" />
            <p className="text-sm">{t("inbox.noMessages")}</p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-200">
            {messages.map((message) => (
              <div
                key={message.id}
                onClick={() => handleOpenMessage(message)}
                className={cn(
                  "px-4 py-3 flex items-start gap-3 cursor-pointer transition-colors",
                  !message.isRead ? "bg-primary/5" : "bg-white"
                )}
              >
                {/* Checkbox */}
                <input
                  type="checkbox"
                  checked={message.selected}
                  onChange={() => handleSelectMessage(message.id)}
                  onClick={(e) => e.stopPropagation()}
                  className="w-5 h-5 rounded border-zinc-300 text-primary focus:ring-primary mt-1 flex-shrink-0"
                />

                {/* Message Content */}
                <div className="flex-1 min-w-0">
                  {/* Date */}
                  <div className="flex items-center gap-1 text-xs text-zinc-400 mb-1">
                    <Clock className="w-3 h-3" />
                    <span>{message.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className={cn(
                    "text-sm mb-1 truncate",
                    !message.isRead ? "font-roboto-semibold text-zinc-800" : "font-roboto-medium text-zinc-700"
                  )}>
                    {message.title}
                  </h3>

                  {/* Preview - max 2 lines */}
                  <p className="text-sm text-zinc-500 line-clamp-2">
                    {message.preview}
                  </p>
                </div>

                {/* Delete Button */}
                <button
                  onClick={(e) => handleDeleteMessage(message.id, e)}
                  className="p-2 text-zinc-400 hover:text-red-500 transition-colors flex-shrink-0"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Message Detail Modal */}
      {selectedMessage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50"
            onClick={handleCloseModal}
          />

          {/* Modal Content */}
          <div className="relative w-full max-w-[400px] bg-white rounded-2xl max-h-[70vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-dark rounded-t-2xl px-4 py-4 flex items-center justify-between">
              <Image
                src="/logo.png"
                alt="AONE"
                width={80}
                height={24}
                className="h-6 w-auto"
                unoptimized
              />
              <button
                onClick={handleCloseModal}
                className="text-white hover:text-zinc-300 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-auto p-4">
              {/* Title */}
              <h2 className="text-lg font-roboto-semibold text-zinc-800 mb-2">
                {selectedMessage.title}
              </h2>

              {/* Date */}
              <div className="flex items-center gap-1 text-xs text-zinc-400 mb-4">
                <Clock className="w-3 h-3" />
                <span>{selectedMessage.date}</span>
              </div>

              {/* Content - Render HTML */}
              <div
                className="text-sm text-zinc-600 prose prose-sm prose-zinc max-w-none [&_p]:mb-3 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-3 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-3 [&_li]:mb-1 [&_strong]:font-roboto-semibold [&_strong]:text-zinc-700 [&_em]:italic [&_table]:w-full [&_table]:mb-3 [&_td]:py-1 [&_td]:pr-4"
                dangerouslySetInnerHTML={{ __html: selectedMessage.content }}
              />
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
