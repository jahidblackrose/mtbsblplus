import React from "react";
import { cn } from "@/lib/utils";

/* Page header - now minimal since TopBar shows the main title */
interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function PageHeader({ title, subtitle, children }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
      <div>
        <h1 className="text-[18px] font-bold text-foreground">{title}</h1>
        {subtitle && <p className="text-[13px] text-muted-foreground mt-0.5">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-2">{children}</div>}
    </div>
  );
}

/* Stat card */
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  note?: string;
  icon?: React.ReactNode;
  tone?: "primary" | "warning" | "success" | "accent";
}

const toneBg: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  warning: "bg-amber-50 text-amber-600",
  success: "bg-emerald-50 text-emerald-600",
  accent: "bg-sky-50 text-sky-600",
};

export function StatCard({ title, value, change, note, icon, tone = "primary" }: StatCardProps) {
  return (
    <div className="card-compact p-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[12px] font-medium text-muted-foreground uppercase tracking-wide">{title}</p>
          <p className="text-[22px] font-bold text-foreground mt-1">{value}</p>
          {change && <p className="text-[12px] text-muted-foreground mt-0.5">{change}</p>}
        </div>
        {icon && (
          <div className={cn("w-8 h-8 rounded-md flex items-center justify-center", toneBg[tone])}>
            {icon}
          </div>
        )}
      </div>
      {note && <p className="text-[12px] text-muted-foreground mt-2 border-t border-border pt-2">{note}</p>}
    </div>
  );
}

/* Page table */
interface Column<T> {
  label: string;
  key: string;
  align?: "left" | "right" | "center";
  render?: (row: T, i: number) => React.ReactNode;
}

interface PageTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
}

export function PageTable<T extends Record<string, any>>({ columns, data, emptyMessage = "No data." }: PageTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border text-[13px]">
        <thead className="bg-muted/50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  "px-3 py-2 font-semibold text-muted-foreground whitespace-nowrap",
                  col.align === "right" ? "text-right" : col.align === "center" ? "text-center" : "text-left"
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="px-3 py-8 text-center text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr key={i} className="hover:bg-muted/30 transition-colors">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-3 py-2 text-foreground whitespace-nowrap",
                      col.align === "right" ? "text-right" : "text-left"
                    )}
                  >
                    {col.render ? col.render(row, i) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

/* Badge */
interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "destructive" | "outline";
}

const badgeVariants: Record<string, string> = {
  default: "bg-primary/10 text-primary",
  success: "bg-emerald-50 text-emerald-700",
  warning: "bg-amber-50 text-amber-700",
  destructive: "bg-red-50 text-red-700",
  outline: "border border-border text-muted-foreground",
};

export function StatusBadge({ children, variant = "default" }: BadgeProps) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded text-[12px] font-medium", badgeVariants[variant])}>
      {children}
    </span>
  );
}

/* Filter bar */
export function FilterBar({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2 mb-3">
      {children}
    </div>
  );
}

/* Tab navigation */
interface TabItem { id: string; label: string; }
interface TabNavProps {
  tabs: TabItem[];
  active: string;
  onChange: (id: string) => void;
}
export function TabNav({ tabs, active, onChange }: TabNavProps) {
  return (
    <div className="flex gap-0.5 border-b border-border mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          onClick={() => onChange(tab.id)}
          className={cn(
            "px-3 py-1.5 text-[13px] font-medium transition-colors border-b-2 -mb-px",
            active === tab.id
              ? "border-primary text-primary"
              : "border-transparent text-muted-foreground hover:text-foreground"
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
