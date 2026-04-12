import React from "react";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  required?: boolean;
  helperText?: string;
  className?: string;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export function FormField({ label, required, helperText, className, fullWidth, children }: FormFieldProps) {
  return (
    <div className={cn("form-field min-w-0", fullWidth && "col-span-full", className)}>
      <label className="text-[length:var(--font-size-sm)] font-medium text-foreground/80 leading-none">
        {label}
        {required && <span className="ml-0.5 text-destructive">*</span>}
      </label>
      {children}
      {helperText && (
        <p className="text-[length:var(--font-size-xs)] text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
}

// Compact input matching design system
interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, required, helperText, fullWidth, className, ...props }, ref) => (
    <FormField label={label} required={required} helperText={helperText} fullWidth={fullWidth}>
      <input
        ref={ref}
        className={cn(
          "h-[var(--control-h)] w-full rounded-md border border-input bg-background px-2.5 py-1 text-[length:var(--font-size-base)] text-foreground placeholder:text-muted-foreground transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-muted",
          className
        )}
        {...props}
      />
    </FormField>
  )
);
FormInput.displayName = "FormInput";

// Non-editable standard select
interface SelectOption {
  value: string;
  label: string;
}

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
}

export function FormSelect({
  label, name, options, placeholder = "Select...", required, disabled, helperText, value, onChange, fullWidth
}: FormSelectProps) {
  return (
    <FormField label={label} required={required} helperText={helperText} fullWidth={fullWidth}>
      <select
        name={name}
        value={value}
        required={required}
        disabled={disabled}
        onChange={onChange}
        className="h-[var(--control-h)] w-full rounded-md border border-input bg-background px-2.5 py-1 text-[length:var(--font-size-base)] text-foreground transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-muted appearance-none bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2212%22%20height%3D%2212%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpath%20d%3D%22m2%204%204%204%204-4%22%2F%3E%3C%2Fsvg%3E')] bg-[length:12px] bg-[position:right_8px_center] bg-no-repeat pr-7"
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
    </FormField>
  );
}

// Compact textarea
interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  required?: boolean;
  helperText?: string;
  fullWidth?: boolean;
}

export const FormTextarea = React.forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  ({ label, required, helperText, fullWidth = true, className, ...props }, ref) => (
    <FormField label={label} required={required} helperText={helperText} fullWidth={fullWidth}>
      <textarea
        ref={ref}
        className={cn(
          "w-full rounded-md border border-input bg-background px-2.5 py-1.5 text-[length:var(--font-size-base)] text-foreground placeholder:text-muted-foreground transition focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-60 disabled:bg-muted min-h-[52px]",
          className
        )}
        rows={2}
        {...props}
      />
    </FormField>
  )
);
FormTextarea.displayName = "FormTextarea";
