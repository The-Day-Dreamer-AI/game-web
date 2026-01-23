"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Header } from "@/components/layout";
import { RequireAuth } from "@/components/auth";
import { useQuitGame } from "@/hooks/use-discover";

const DOUBLE_CLICK_THRESHOLD = 300; // ms for double click detection
const EXIT_WINDOW = 5000; // 5 seconds to confirm exit

export default function GamePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const gameUrl = searchParams.get("url");
  const gameName = searchParams.get("name") || "Game";
  const [isLoading, setIsLoading] = useState(true);
  const [showExitPrompt, setShowExitPrompt] = useState(false);
  const [iframeKey, setIframeKey] = useState(0);
  const quitGameMutation = useQuitGame();

  const lastClickTimeRef = useRef<number>(0);
  const exitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const exitWindowActiveRef = useRef(false);

  // Refresh the iframe
  const refreshGame = useCallback(() => {
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  }, []);

  // Exit to home
  const exitGame = useCallback(async () => {
    try {
      await quitGameMutation.mutateAsync();
    } catch (error) {
      console.error("Failed to quit game:", error);
    }
    router.push("/");
  }, [quitGameMutation, router]);

  // Handle back button click
  const handleBack = useCallback(() => {
    const now = Date.now();
    const timeSinceLastClick = now - lastClickTimeRef.current;

    // If exit window is active, exit the game
    if (exitWindowActiveRef.current) {
      exitGame();
      return;
    }

    // Check for double click
    if (timeSinceLastClick < DOUBLE_CLICK_THRESHOLD) {
      // Double click detected - show exit prompt
      setShowExitPrompt(true);
      exitWindowActiveRef.current = true;

      // Clear any existing timeout
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }

      // Set 5 second timeout to hide prompt and reset
      exitTimeoutRef.current = setTimeout(() => {
        setShowExitPrompt(false);
        exitWindowActiveRef.current = false;
      }, EXIT_WINDOW);
    } else {
      // Single click - refresh the game
      refreshGame();
    }

    lastClickTimeRef.current = now;
  }, [exitGame, refreshGame]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
      }
    };
  }, []);

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
        {/* Header with custom back handler */}
        <Header
          variant="subpage"
          title={gameName}
          onBack={handleBack}
        />

        {/* Game iframe container */}
        <div className="flex-1 relative">
          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black">
              <div className="flex flex-col items-center gap-4">
                <div className="relative w-16 h-16">
                  <div className="absolute inset-0 rounded-full border-4 border-white/20" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-primary animate-spin" />
                </div>
                <p className="text-white text-sm font-roboto-medium">Loading game...</p>
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

          {/* Exit prompt toast */}
          {showExitPrompt && (
            <div className="absolute bottom-20 left-4 right-4 flex justify-center text-sm font-roboto-medium text-center">
              <div className="bg-dark/90 text-white px-4 py-3 rounded-lg shadow-lg">
                  Click back again to return home
              </div>
            </div>
          )}
        </div>
      </div>
    </RequireAuth>
  );
}
