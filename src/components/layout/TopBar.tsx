import { ChevronLeft, Search, Bell, LogOut } from "lucide-react";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { useNavigate } from "react-router-dom";

const routeTitles: Record<string, { title: string; subtitle: string }> = {
  "/dashboard": { title: "Dashboard", subtitle: "Operational Workspace" },
  "/applications": { title: "Applications", subtitle: "Application Management" },
  "/applications/new": { title: "New Application", subtitle: "Application Management" },
  "/workflow": { title: "Workflow", subtitle: "Process Management" },
  "/reports": { title: "Reports", subtitle: "Analytics & Reports" },
  "/masters": { title: "Masters", subtitle: "Master Data" },
  "/showcase": { title: "Showcase", subtitle: "Feature Showcase" },
  "/settings": { title: "Settings", subtitle: "System Configuration" },
};

function getPageInfo(pathname: string) {
  // Exact match first
  if (routeTitles[pathname]) return routeTitles[pathname];
  // Prefix match
  for (const key of Object.keys(routeTitles)) {
    if (pathname.startsWith(key)) return routeTitles[key];
  }
  return { title: "Page", subtitle: "" };
}

export default function TopBar() {
  const { toggle } = useSidebarState();
  const location = useLocation();
  const pageInfo = getPageInfo(location.pathname);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
      {/* Left: toggle + page header */}
      <div className="flex items-center gap-3">
        <button
          onClick={toggle}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors"
          aria-label="Toggle sidebar"
        >
          <ChevronLeft size={16} className="text-foreground" />
        </button>
        <div className="leading-tight">
          {pageInfo.subtitle && (
            <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-primary">
              {pageInfo.subtitle}
            </p>
          )}
          <p className="text-[17px] font-bold text-foreground leading-tight">
            {pageInfo.title}
          </p>
        </div>
      </div>

      {/* Center: Search */}
      <div className="relative hidden sm:block flex-1 max-w-md mx-6">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search"
          className="h-9 w-full rounded-lg border border-border bg-muted/50 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground"
        />
      </div>

      {/* Right: bell, user, logout */}
      <div className="flex items-center gap-3">
        <button className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors">
          <Bell size={14} className="text-foreground" />
        </button>
        <div className="hidden sm:flex items-center gap-2.5 border border-border rounded-lg px-3 py-1.5">
          <div className="text-right leading-tight">
            <p className="text-sm font-medium text-foreground">{user?.displayName || "System Administrator"}</p>
            <p className="text-[11px] text-muted-foreground">{user?.branch || "Head Office"}</p>
          </div>
          <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-xs font-bold text-primary">
            {(user?.displayName || "S")[0]}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-destructive/10 hover:text-destructive transition-colors"
          aria-label="Sign out"
        >
          <LogOut size={14} />
        </button>
      </div>
    </header>
  );
}
