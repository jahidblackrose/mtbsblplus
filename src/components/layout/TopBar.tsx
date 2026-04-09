import { ChevronLeft, Search, Bell } from "lucide-react";

export default function TopBar() {
  return (
    <header className="h-16 border-b border-border bg-card flex items-center justify-between px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
          <ChevronLeft size={16} className="text-foreground" />
        </button>
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Workflow</p>
          <p className="text-base font-semibold text-foreground">Crm</p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search"
            className="h-9 w-52 rounded-lg border border-border bg-muted pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
          />
        </div>
        <button className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
          <Bell size={16} className="text-foreground" />
        </button>
        <div className="flex items-center gap-2 border border-border rounded-lg px-3 py-1.5">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium text-foreground">System Administrator</p>
            <p className="text-xs text-muted-foreground">Head Office</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-semibold text-foreground">
            S
          </div>
        </div>
      </div>
    </header>
  );
}
