import { Menu, Search, Bell } from "lucide-react";
import { useSidebarState } from "@/hooks/use-sidebar-state";

export default function TopBar() {
  const { toggle } = useSidebarState();

  return (
    <header className="h-11 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      {/* Left */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={toggle}
          className="md:hidden w-7 h-7 rounded-md border border-border flex items-center justify-center hover:bg-muted transition-colors"
        >
          <Menu size={14} className="text-foreground" />
        </button>
        <div className="leading-tight">
          <p className="text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-muted-foreground">
            SBL Portal
          </p>
          <p className="text-[length:var(--font-size-md)] font-semibold text-foreground leading-none">
            Mutual Trust Bank
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-3">
        <div className="relative hidden sm:block">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            className="h-[var(--control-h-sm)] w-44 rounded-md border border-border bg-muted pl-7 pr-2.5 text-[length:var(--font-size-base)] outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
        </div>
        <button className="w-7 h-7 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
          <Bell size={13} className="text-foreground" />
        </button>
        <div className="hidden sm:flex items-center gap-2 border border-border rounded-md px-2.5 py-1">
          <div className="text-right leading-tight">
            <p className="text-[length:var(--font-size-base)] font-medium text-foreground">System Admin</p>
            <p className="text-[length:var(--font-size-xs)] text-muted-foreground">Head Office</p>
          </div>
          <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center text-[length:var(--font-size-xs)] font-semibold text-foreground">
            S
          </div>
        </div>
      </div>
    </header>
  );
}
