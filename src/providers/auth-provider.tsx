"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { User, LoginCredentials, RegisterCredentials, AuthState } from "@/types/auth";
import { authApi } from "@/lib/api";
import { discoverKeys } from "@/hooks/use-discover";

const AUTH_STORAGE_KEY = "aone-auth";

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  register: (credentials: RegisterCredentials) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);
  const queryClient = useQueryClient();

  // Load auth state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        if (parsed.user) {
          setUser(parsed.user);
        }
      } catch {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    }
    setIsHydrated(true);
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);

    try {
      // Use the real /token API endpoint
      const response = await authApi.login(credentials.username, credentials.password);

      // Create user object from login response
      // Note: The /token endpoint only returns the token, not user info
      // User info would need to come from a separate profile endpoint
      const user: User = {
        id: credentials.username,
        email: "",
        name: credentials.username,
        createdAt: new Date(),
      };

      setUser(user);
      // Store token in both locations for compatibility
      localStorage.setItem("token", response.access_token);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        user,
        token: response.access_token,
        expiresIn: response.expires_in,
      }));

      // Refetch discover query with authenticated endpoint
      await queryClient.refetchQueries({ queryKey: discoverKeys.all });

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  const register = useCallback(async (credentials: RegisterCredentials) => {
    setIsLoading(true);

    try {
      // Use the real /api/mapiuser/Register API endpoint
      // Note: This legacy register flow doesn't support OTP - use the register page for full registration
      // If no referral code, use default "196B48"
      await authApi.register({
        Name: credentials.fullName || credentials.username,
        Password: credentials.password,
        Phone: credentials.phone,
        Tac: "", // Legacy form doesn't support OTP
        UplineReferralCode: credentials.referralCode || "196B48",
        Username: credentials.username,
      });

      // After successful registration, log the user in
      const loginResponse = await authApi.login(credentials.username, credentials.password);

      const user: User = {
        id: credentials.username,
        email: credentials.email || "",
        name: credentials.username,
        createdAt: new Date(),
      };

      setUser(user);
      // Store token in both locations for compatibility
      localStorage.setItem("token", loginResponse.access_token);
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
        user,
        token: loginResponse.access_token,
        expiresIn: loginResponse.expires_in,
      }));

      // Refetch discover query with authenticated endpoint
      await queryClient.refetchQueries({ queryKey: discoverKeys.all });

      return { success: true };
    } catch (error) {
      return { success: false, error: (error as Error).message };
    } finally {
      setIsLoading(false);
    }
  }, [queryClient]);

  const logout = useCallback(async () => {
    setIsLoading(true);

    try {
      await fetch("/api/auth/logout", { method: "POST" });
    } catch {
      // Ignore logout API errors
    } finally {
      setUser(null);
      // Remove token from both locations
      localStorage.removeItem("token");
      localStorage.removeItem(AUTH_STORAGE_KEY);
      // Refetch discover query with unauthenticated endpoint
      await queryClient.refetchQueries({ queryKey: discoverKeys.all });
      setIsLoading(false);
    }
  }, [queryClient]);

  // Prevent hydration mismatch
  if (!isHydrated) {
    return null;
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
