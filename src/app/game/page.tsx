"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout";
import { RequireAuth } from "@/components/auth";
import { useQuitGame } from "@/hooks/use-discover";

export default function GamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameUrl = searchParams.get("url");
  const gameName = searchParams.get("name") || "Game";
  const [isLoading, setIsLoading] = useState(true);
  const [isExiting, setIsExiting] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const quitGameMutation = useQuitGame();

  // Refresh the iframe
  const refreshGame = useCallback(() => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  }, []);

  // Exit to home
  const exitGame = useCallback(async () => {
    setIsExiting(true);
    try {
      await quitGameMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to quit game:", error);
    }
    router.push("/home");
  }, [quitGameMutation, router]);

  // Prevent body scroll when game is active
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  // If no URL provided, redirect to home
  useEffect(() => {
    if (!gameUrl) {
      router.push("/");
    }
  }, [gameUrl, router]);

  if (!gameUrl) {
    return null;
  }

  return (
    <RequireAuth>
      <div className="h-screen flex flex-col bg-black">
        {/* Header with back (refresh) and home button */}
        <Header
          variant="subpage"
          title={gameName}
          onBack={refreshGame}
          showHomeButton
          onHomeClick={exitGame}
        />

        {/* Game iframe container */}
        <div className="flex-1 relative">
          {/* Loading / Exiting overlay */}
          {(isLoading || isExiting) && (
            <div className="absolute inset-0 flex items-center justify-center bg-black z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-white/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                </div>
                <p className="text-white text-sm font-roboto-medium">
                  {isExiting ? "Returning home..." : "Loading game..."}
                </p>
              </div>
            </div>
          )}

          {/* Game iframe */}
          <iframe
            key={iframeKey}
            src={gameUrl}
            className="w-full h-full border-0"
            allow="autoplay; fullscreen; clipboard-write"
            allowFullScreen
            onLoad={() => setIsLoading(false)}
          />

        </div>
      </div>
    </RequireAuth>
  );
}
