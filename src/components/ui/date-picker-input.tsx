import * as React from "react";
import { cn } from "@/lib/utils";

export interface DatePickerInputProps {
  /** Current value in "YYYY-MM-DD HH:mm" format */
  value: string;
  /** Callback when value changes, receives "YYYY-MM-DD HH:mm" format */
  onChange: (value: string) => void;
  /** Element to display at the start of the input (left side) */
  prefix?: React.ReactNode;
  /** Placeholder text */
  placeholder?: string;
  /** Additional class name for the wrapper container */
  wrapperClassName?: string;
}

/**
 * Converts "YYYY-MM-DD HH:mm" to "YYYY-MM-DDTHH:mm" for datetime-local input
 */
function toDatetimeLocalValue(value: string): string {
  if (!value) return "";
  // Replace space separator with T for datetime-local format
  return value.replace(" ", "T");
}

/**
 * Converts "YYYY-MM-DDTHH:mm" from datetime-local input to "YYYY-MM-DD HH:mm"
 */
function fromDatetimeLocalValue(value: string): string {
  if (!value) return "";
  return value.replace("T", " ");
}

const DatePickerInput = React.forwardRef<HTMLInputElement, DatePickerInputProps>(
  ({ value, onChange, prefix, placeholder, wrapperClassName }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    // Merge forwarded ref with internal ref
    React.useImperativeHandle(ref, () => inputRef.current as HTMLInputElement);

    const handleWrapperClick = () => {
      // Trigger the native date picker by calling showPicker()
      if (inputRef.current) {
        try {
          inputRef.current.showPicker();
        } catch {
          // Fallback: focus the input (some browsers don't support showPicker)
          inputRef.current.focus();
        }
      }
    };

    return (
      <div className={cn("w-full", wrapperClassName)}>
        <div
          className="form-input-wrapper relative flex items-center w-full rounded-lg border border-[#959595] bg-white transition-all duration-200 cursor-pointer"
          onClick={handleWrapperClick}
        >
          {/* Prefix icon */}
          {prefix && (
            <div className="flex items-center justify-center pl-4 text-zinc-400">
              {prefix}
            </div>
          )}

          {/* datetime-local input with hidden native icons */}
          <input
            ref={inputRef}
            type="datetime-local"
            value={toDatetimeLocalValue(value)}
            onChange={(e) => onChange(fromDatetimeLocalValue(e.target.value))}
            placeholder={placeholder}
            className={cn(
              "date-picker-no-suffix flex-1 w-full py-3.5 bg-transparent text-black placeholder:text-[#959595] font-roboto-regular text-sm focus:outline-none",
              prefix ? "pl-3" : "pl-4",
              "pr-4"
            )}
            style={{
              WebkitBoxShadow: "0 0 0 1000px transparent inset",
              boxShadow: "0 0 0 1000px transparent inset",
            }}
          />
        </div>
      </div>
    );
  }
);

DatePickerInput.displayName = "DatePickerInput";

export { DatePickerInput };
