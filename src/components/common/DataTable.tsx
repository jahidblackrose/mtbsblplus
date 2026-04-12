import React from "react";
import { cn } from "@/lib/utils";

// Compact data table for record lists
interface DataTableProps {
  headers: { label: string; align?: "left" | "right" | "center"; colSpan?: number; rowSpan?: number }[];
  subHeaders?: { label: string; align?: "left" | "right" | "center" }[];
  children: React.ReactNode;
  className?: string;
}

export function DataTable({ headers, subHeaders, children, className }: DataTableProps) {
  return (
    <div className={cn("overflow-x-auto", className)}>
      <table className="min-w-full divide-y divide-border text-[length:var(--font-size-xs)]">
        <thead className="bg-muted/50">
          <tr>
            {headers.map((h, i) => (
              <th
                key={i}
                colSpan={h.colSpan}
                rowSpan={h.rowSpan}
                className={cn(
                  "px-2.5 py-1.5 font-semibold text-muted-foreground whitespace-nowrap",
                  h.align === "right" ? "text-right" : h.align === "center" ? "text-center" : "text-left"
                )}
              >
                {h.label}
              </th>
            ))}
          </tr>
          {subHeaders && (
            <tr>
              {subHeaders.map((h, i) => (
                <th
                  key={i}
                  className={cn(
                    "px-2.5 py-1.5 font-semibold text-muted-foreground whitespace-nowrap",
                    h.align === "right" ? "text-right" : "text-left"
                  )}
                >
                  {h.label}
                </th>
              ))}
            </tr>
          )}
        </thead>
        <tbody className="divide-y divide-border bg-card">
          {children}
        </tbody>
      </table>
    </div>
  );
}

export function Td({ children, align, className }: { children: React.ReactNode; align?: "left" | "right" | "center"; className?: string }) {
  return (
    <td className={cn("px-2.5 py-1.5 text-foreground whitespace-nowrap", align === "right" ? "text-right" : "text-left", className)}>
      {children}
    </td>
  );
}
