import * as React from "react";
import { cn } from "@/lib/utils";

export interface FormInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "prefix"> {
  /** Element to display at the start of the input (left side) */
  prefix?: React.ReactNode;
  /** Element to display at the end of the input (right side) */
  suffix?: React.ReactNode;
  /** Error message to display below the input */
  error?: string;
  /** Additional class name for the wrapper container */
  wrapperClassName?: string;
}

const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ className, prefix, suffix, error, wrapperClassName, type, ...props }, ref) => {
    const hasError = !!error;

    return (
      <div className={cn("w-full", wrapperClassName)}>
        <div
          className={cn(
            "form-input-wrapper relative flex items-center w-full rounded-lg border transition-all duration-200",
            // Default state
            "border-[#959595] bg-white",
            // Error state (takes precedence, no focus styling when error)
            hasError && "border-red-500"
          )}
        >
          {/* Prefix icon */}
          {prefix && (
            <div className="flex items-center justify-center pl-4 text-zinc-400">
              {prefix}
            </div>
          )}

          {/* Input element */}
          <input
            type={type}
            ref={ref}
            className={cn(
              "flex-1 w-full py-3.5 bg-transparent text-black placeholder:text-[#959595] font-roboto-regular text-sm focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
              prefix ? "pl-3" : "pl-4",
              suffix ? "pr-3" : "pr-4",
              className
            )}
            {...props}
          />

          {/* Suffix icon */}
          {suffix && (
            <div className="flex items-center justify-center pr-3 text-zinc-400">
              {suffix}
            </div>
          )}
        </div>

        {/* Error message */}
        {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

FormInput.displayName = "FormInput";

export { FormInput };
