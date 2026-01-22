"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  ToastProvider as RadixToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastIcon,
} from "@/components/ui/toast";
import { useI18n } from "@/providers/i18n-provider";

type ToastVariant = "success" | "warning" | "error";

interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
  open: boolean;
}

interface ToastContextType {
  /**
   * Show a toast with full customization
   */
  showToast: (options: {
    title: string;
    description?: string;
    variant?: ToastVariant;
    duration?: number;
  }) => void;
  /**
   * Show a success toast with translated "Success" title
   * @param description - The message to display
   */
  showSuccess: (description: string) => void;
  /**
   * Show a warning toast with translated "Warning" title
   * @param description - The message to display
   */
  showWarning: (description: string) => void;
  /**
   * Show an error toast with translated "Error" title
   * @param description - The message to display
   */
  showError: (description: string) => void;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
  /** Default duration in milliseconds before toast auto-dismisses. Set to 0 for no auto-dismiss. */
  defaultDuration?: number;
  /** Maximum number of toasts to show at once */
  maxToasts?: number;
}

export function ToastProvider({
  children,
  defaultDuration = 3000,
  maxToasts = 3,
}: ToastProviderProps) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const { t } = useI18n();

  const hideToast = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((toast) =>
        toast.id === id ? { ...toast, open: false } : toast
      )
    );
    // Remove from DOM after animation
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 100);
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts((prev) => prev.map((toast) => ({ ...toast, open: false })));
    setTimeout(() => {
      setToasts([]);
    }, 100);
  }, []);

  const showToast = useCallback(
    ({
      title,
      description,
      variant = "success",
      duration = defaultDuration,
    }: {
      title: string;
      description?: string;
      variant?: ToastVariant;
      duration?: number;
    }) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

      setToasts((prev) => {
        const newToasts = [...prev, { id, title, description, variant, open: true }];
        // Limit to maxToasts, removing oldest first
        if (newToasts.length > maxToasts) {
          return newToasts.slice(-maxToasts);
        }
        return newToasts;
      });

      // Auto-dismiss after duration
      if (duration > 0) {
        setTimeout(() => {
          hideToast(id);
        }, duration);
      }

      return id;
    },
    [defaultDuration, maxToasts, hideToast]
  );

  const showSuccess = useCallback(
    (description: string) => {
      showToast({
        title: t("toast.success"),
        description,
        variant: "success",
      });
    },
    [showToast, t]
  );

  const showWarning = useCallback(
    (description: string) => {
      showToast({
        title: t("toast.warning"),
        description,
        variant: "warning",
      });
    },
    [showToast, t]
  );

  const showError = useCallback(
    (description: string) => {
      showToast({
        title: t("toast.error"),
        description,
        variant: "error",
      });
    },
    [showToast, t]
  );

  return (
    <ToastContext.Provider
      value={{
        showToast,
        showSuccess,
        showWarning,
        showError,
        hideToast,
        hideAllToasts,
      }}
    >
      <RadixToastProvider swipeDirection="up">
        {children}
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            variant={toast.variant}
            open={toast.open}
            onOpenChange={(open) => {
              if (!open) hideToast(toast.id);
            }}
          >
            <ToastIcon variant={toast.variant} />
            <div className="flex flex-col gap-0.5 flex-1 min-w-0">
              <ToastTitle>{toast.title}</ToastTitle>
              {toast.description && (
                <ToastDescription>{toast.description}</ToastDescription>
              )}
            </div>
            <ToastClose />
          </Toast>
        ))}
        <ToastViewport />
      </RadixToastProvider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
