"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";

// ── Utility functions ──────────────────────────────────────────────

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

/** Returns 0=Mon, 1=Tue, …, 6=Sun for the first day of the given month */
function getFirstDayMondayBased(year: number, month: number): number {
  const day = new Date(year, month, 1).getDay(); // 0=Sun
  return (day + 6) % 7;
}

/** Parse "YYYY-MM-DD HH:mm" → Date */
function parseValue(value: string): Date {
  if (!value) return new Date();
  const [datePart, timePart] = value.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hours, minutes] = (timePart || "00:00").split(":").map(Number);
  return new Date(year, month - 1, day, hours, minutes);
}

/** Format Date → "YYYY-MM-DD HH:mm" */
function formatValue(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}`;
}

/** Format for input display: "DD/MM/YYYY, hh:mm AM/PM" */
function formatDisplay(value: string): string {
  if (!value) return "";
  const date = parseValue(value);
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  let h = date.getHours();
  const min = String(date.getMinutes()).padStart(2, "0");
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${d}/${m}/${y}, ${String(h).padStart(2, "0")}:${min} ${ampm}`;
}

// ── Calendar Grid ──────────────────────────────────────────────────

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const DAY_HEADERS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];

interface CalendarGridProps {
  year: number;
  month: number;
  selectedDate: Date;
  onSelectDay: (day: number) => void;
}

function CalendarGrid({ year, month, selectedDate, onSelectDay }: CalendarGridProps) {
  const daysInMonth = getDaysInMonth(year, month);
  const firstDay = getFirstDayMondayBased(year, month);
  const daysInPrevMonth = getDaysInMonth(year, month === 0 ? 11 : month - 1);

  const today = new Date();
  const isToday = (d: number) =>
    d === today.getDate() && month === today.getMonth() && year === today.getFullYear();
  const isSelected = (d: number) =>
    d === selectedDate.getDate() &&
    month === selectedDate.getMonth() &&
    year === selectedDate.getFullYear();

  const cells: React.ReactNode[] = [];

  // Previous month trailing days
  for (let i = 0; i < firstDay; i++) {
    const day = daysInPrevMonth - firstDay + 1 + i;
    cells.push(
      <div key={`prev-${i}`} className="flex items-center justify-center h-8 text-zinc-300 text-sm">
        {day}
      </div>
    );
  }

  // Current month days
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(
      <button
        key={d}
        type="button"
        onClick={() => onSelectDay(d)}
        className={cn(
          "flex items-center justify-center h-8 w-8 mx-auto text-sm rounded-full cursor-pointer transition-colors",
          isSelected(d) && "bg-primary text-white",
          isToday(d) && !isSelected(d) && "bg-primary/10 text-primary font-bold",
          !isSelected(d) && !isToday(d) && "hover:bg-zinc-100 text-zinc-800"
        )}
      >
        {d}
      </button>
    );
  }

  // Next month leading days (fill to 42 cells for 6 rows)
  const remaining = 42 - cells.length;
  for (let i = 1; i <= remaining; i++) {
    cells.push(
      <div key={`next-${i}`} className="flex items-center justify-center h-8 text-zinc-300 text-sm">
        {i}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-7 gap-0.5">
      {DAY_HEADERS.map((d) => (
        <div key={d} className="flex items-center justify-center h-7 text-xs text-zinc-400 font-medium">
          {d}
        </div>
      ))}
      {cells}
    </div>
  );
}

// ── DatePickerInput ────────────────────────────────────────────────

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

const DatePickerInput = React.forwardRef<HTMLDivElement, DatePickerInputProps>(
  ({ value, onChange, prefix, placeholder, wrapperClassName }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const selectedDate = React.useMemo(() => parseValue(value), [value]);
    const [viewMonth, setViewMonth] = React.useState(selectedDate.getMonth());
    const [viewYear, setViewYear] = React.useState(selectedDate.getFullYear());

    // Derived time values
    const hours24 = selectedDate.getHours();
    const minuteVal = selectedDate.getMinutes();
    const isPM = hours24 >= 12;
    const hours12 = hours24 % 12 || 12;

    // Click outside → close
    React.useEffect(() => {
      if (!isOpen) return;
      const handler = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
          setIsOpen(false);
        }
      };
      document.addEventListener("mousedown", handler);
      return () => document.removeEventListener("mousedown", handler);
    }, [isOpen]);

    // Sync calendar view when value changes while closed
    React.useEffect(() => {
      if (!isOpen) {
        setViewMonth(selectedDate.getMonth());
        setViewYear(selectedDate.getFullYear());
      }
    }, [selectedDate, isOpen]);

    // ── Navigation ────────────────────────
    const handlePrevMonth = () => {
      setViewMonth((m) => {
        if (m === 0) {
          setViewYear((y) => y - 1);
          return 11;
        }
        return m - 1;
      });
    };

    const handleNextMonth = () => {
      setViewMonth((m) => {
        if (m === 11) {
          setViewYear((y) => y + 1);
          return 0;
        }
        return m + 1;
      });
    };

    // ── Day selection → close picker ──────
    const handleSelectDay = (day: number) => {
      const newDate = new Date(viewYear, viewMonth, day, hours24, minuteVal);
      onChange(formatValue(newDate));
      setIsOpen(false);
    };

    // ── Time changes → stay open ──────────
    const handleHourChange = (newHour12: number) => {
      let h24: number;
      if (isPM) {
        h24 = newHour12 === 12 ? 12 : newHour12 + 12;
      } else {
        h24 = newHour12 === 12 ? 0 : newHour12;
      }
      const d = new Date(selectedDate);
      d.setHours(h24);
      onChange(formatValue(d));
    };

    const handleMinuteChange = (newMinute: number) => {
      const d = new Date(selectedDate);
      d.setMinutes(newMinute);
      onChange(formatValue(d));
    };

    const handleAmPmToggle = () => {
      const d = new Date(selectedDate);
      d.setHours(isPM ? hours24 - 12 : hours24 + 12);
      onChange(formatValue(d));
    };

    const handleToday = () => {
      const now = new Date();
      setViewMonth(now.getMonth());
      setViewYear(now.getFullYear());
    };

    const handleClear = () => {
      const d = new Date(selectedDate);
      d.setHours(0, 0, 0, 0);
      onChange(formatValue(d));
    };

    return (
      <div className={cn("w-full relative", wrapperClassName)} ref={containerRef}>
        {/* Input trigger */}
        <div
          ref={ref}
          onClick={() => setIsOpen((o) => !o)}
          className={cn(
            "form-input-wrapper relative flex items-center w-full rounded-lg border bg-white transition-all duration-200 cursor-pointer",
            isOpen
              ? "border-primary shadow-[0_0_0_1px_rgba(13,195,177,0.3)]"
              : "border-[#959595]"
          )}
        >
          {prefix && (
            <div className="flex items-center justify-center pl-4 text-zinc-400">
              {prefix}
            </div>
          )}
          <div
            className={cn(
              "flex-1 w-full py-3.5 text-sm font-roboto-regular select-none",
              prefix ? "pl-3" : "pl-4",
              "pr-4",
              value ? "text-black" : "text-[#959595]"
            )}
          >
            {value ? formatDisplay(value) : placeholder}
          </div>
        </div>

        {/* Dropdown picker */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl border border-zinc-200 shadow-xl z-50 p-4">
            {/* Month / Year header */}
            <div className="flex items-center justify-between mb-3">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="p-1.5 hover:bg-zinc-100 rounded-lg cursor-pointer transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-zinc-600" />
              </button>
              <span className="text-sm font-roboto-medium text-zinc-800">
                {MONTH_NAMES[viewMonth]} {viewYear}
              </span>
              <button
                type="button"
                onClick={handleNextMonth}
                className="p-1.5 hover:bg-zinc-100 rounded-lg cursor-pointer transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-zinc-600" />
              </button>
            </div>

            {/* Calendar */}
            <CalendarGrid
              year={viewYear}
              month={viewMonth}
              selectedDate={selectedDate}
              onSelectDay={handleSelectDay}
            />

            {/* Time picker */}
            <div className="flex items-center justify-center gap-2 mt-3 pt-3 border-t border-zinc-100">
              <select
                value={hours12}
                onChange={(e) => handleHourChange(Number(e.target.value))}
                className="border border-zinc-200 rounded-lg px-2 py-1.5 text-sm bg-white cursor-pointer focus:outline-none focus:border-primary"
              >
                {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                  <option key={h} value={h}>
                    {String(h).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <span className="text-sm font-medium text-zinc-400">:</span>
              <select
                value={minuteVal}
                onChange={(e) => handleMinuteChange(Number(e.target.value))}
                className="border border-zinc-200 rounded-lg px-2 py-1.5 text-sm bg-white cursor-pointer focus:outline-none focus:border-primary"
              >
                {Array.from({ length: 60 }, (_, i) => i).map((m) => (
                  <option key={m} value={m}>
                    {String(m).padStart(2, "0")}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleAmPmToggle}
                className="rounded-lg px-3 py-1.5 text-sm font-roboto-medium bg-primary text-white cursor-pointer transition-colors hover:bg-primary/90"
              >
                {isPM ? "PM" : "AM"}
              </button>
            </div>

            {/* Footer */}
            <div className="flex justify-between mt-3 pt-3 border-t border-zinc-100">
              <button
                type="button"
                onClick={handleClear}
                className="text-xs text-zinc-400 hover:text-zinc-600 cursor-pointer transition-colors"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleToday}
                className="text-xs text-primary hover:text-primary/80 cursor-pointer transition-colors"
              >
                Today
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
);

DatePickerInput.displayName = "DatePickerInput";

export { DatePickerInput };
