import React from "react";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface FormFieldProps {
  label: string;
  required?: boolean;
  helperText?: string;
  className?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
  tooltip?: string;
  readOnly?: boolean;
}

export function FormField({ label, required, helperText, className, fullWidth, children, tooltip }: FormFieldProps) {
  return (
    <div className={cn("form-field min-w-0", fullWidth && "col-span-full", className)}>
      <label className="flex items-center gap-1 text-[12px] font-medium text-muted-foreground leading-none mb-0.5">
        {label}
        {required && (
          <span className="inline-flex items-center px-1.5 py-[1px] rounded-full bg-destructive/10 text-destructive text-[9px] font-semibold uppercase tracking-wide">
            required
          </span>
        )}
        {tooltip && (
          <TooltipProvider delayDuration={200}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Info size={12} className="text-muted-foreground/60 cursor-help shrink-0" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[240px] text-[11px]">
                {tooltip}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </label>
      {children}
      {helperText && (
        <p className="text-[11px] text-muted-foreground/70 italic">{helperText}</p>
      )}
    </div>
  );
}

// Input with Bootstrap form-control-sm style
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  tooltip?: string;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, required, helperText, fullWidth, className, tooltip, disabled, ...props }, ref) => (
    <FormField label={label} required={required} helperText={helperText} fullWidth={fullWidth} tooltip={tooltip}>
      <input
        ref={ref}
        disabled={disabled}
        className={cn(
          "h-[var(--control-h)] w-full rounded border px-2 text-[14px] text-foreground placeholder:text-muted-foreground transition focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring",
          disabled
            ? "bg-muted/60 border-transparent cursor-not-allowed text-foreground/70"
            : "bg-background border-input",
          className
        )}
        {...props}
      />
    </FormField>
  )
);
FormInput.displayName = "FormInput";

// Select
interface SelectOption { value: string; label: string; }

interface FormSelectProps {
  label: string;
  name: string;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  helperText?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  fullWidth?: boolean;
  tooltip?: string;
}

export function FormSelect({
  label, name, options, placeholder = "Select...", required, disabled, helperText, value, onChange, fullWidth, tooltip
}: FormSelectProps) {
  return (
    <FormField label={label} required={required} helperText={helperText} fullWidth={fullWidth} tooltip={tooltip}>
      <select
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        onChange={onChange}
        className={cn(
          "h-[var(--control-h)] w-full rounded border px-2 text-[14px] text-foreground transition focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m2%204%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[position:right_6px_center] bg-no-repeat pr-6",
          disabled
            ? "bg-muted/60 border-transparent cursor-not-allowed text-foreground/70"
            : "bg-background border-input"
        )}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </FormField>
  );
}

// Textarea
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  helperText?: string;
  fullWidth?: boolean;
  tooltip?: string;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, required, helperText, fullWidth = true, className, tooltip, disabled, ...props }, ref) => (
    <FormField label={label} required={required} helperText={helperText} fullWidth={fullWidth} tooltip={tooltip}>
      <textarea
        ref={ref}
        disabled={disabled}
        className={cn(
          "w-full rounded border px-2 py-1.5 text-[14px] text-foreground placeholder:text-muted-foreground transition focus:outline-none focus:ring-1 focus:ring-ring focus:border-ring min-h-[48px]",
          disabled
            ? "bg-muted/60 border-transparent cursor-not-allowed text-foreground/70"
            : "bg-background border-input",
          className
        )}
        rows={2}
        {...props}
      />
    </FormField>
  )
);
FormTextarea.displayName = "FormTextarea";
