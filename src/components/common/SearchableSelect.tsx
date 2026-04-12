import React, { useState, useMemo, useRef, useEffect } from "react";
import { Search, ChevronDown } from "lucide-react";
import { FormField } from "./FormControls";

interface ComboboxOption {
  value: string;
  label: string;
  subtitle?: string;
}

interface SearchableSelectProps {
  label: string;
  name: string;
  options: ComboboxOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  fullWidth?: boolean;
}

export function SearchableSelect({
  label, name, options, placeholder = "Search...", required, disabled, helperText, defaultValue, onValueChange, fullWidth
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<ComboboxOption | null>(() => {
    if (!defaultValue) return null;
    return options.find((o) => o.value === defaultValue || o.label === defaultValue) || null;
  });
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter(
      (o) => o.label.toLowerCase().includes(q) || o.subtitle?.toLowerCase().includes(q)
    );
  }, [query, options]);

  const displayValue = open ? query : selected?.label || "";

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <FormField label={label} required={required} helperText={helperText} fullWidth={fullWidth}>
      <div className="relative" ref={containerRef}>
        <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="text"
          name={name}
          className="h-[var(--control-h)] w-full rounded-md border border-input bg-background pl-7 pr-7 py-1 text-[length:var(--font-size-base)] text-foreground placeholder:text-muted-foreground transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-muted"
          value={displayValue}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          onFocus={() => {
            if (disabled) return;
            setOpen(true);
            setQuery(selected?.label || "");
          }}
          onChange={(e) => {
            if (disabled) return;
            setOpen(true);
            setQuery(e.target.value);
            setSelected(null);
            onValueChange?.(e.target.value);
          }}
        />
        <ChevronDown size={13} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />

        {open && !disabled && (
          <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-md border border-border bg-popover shadow-md">
            <div className="max-h-48 overflow-y-auto py-1">
              {filtered.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSelected(opt);
                    setQuery(opt.label);
                    setOpen(false);
                    onValueChange?.(opt.value);
                  }}
                  className="flex w-full items-start px-2.5 py-1.5 text-left transition hover:bg-accent text-[length:var(--font-size-base)]"
                >
                  <div>
                    <p className="font-medium text-foreground">{opt.label}</p>
                    {opt.subtitle && (
                      <p className="text-[length:var(--font-size-xs)] text-muted-foreground">{opt.subtitle}</p>
                    )}
                  </div>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="px-2.5 py-2 text-[length:var(--font-size-sm)] text-muted-foreground">
                  No results found.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </FormField>
  );
}
