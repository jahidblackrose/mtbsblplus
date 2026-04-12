import { Home, FolderOpen, GitBranch, BarChart3, Users, Sparkles, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import mtbLogo from "@/assets/mtb-logo-full.png";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
  match?: string[];
}

const mainNav: NavItem[] = [
  { label: "Dashboard", icon: <Home size={16} />, to: "/dashboard" },
  { label: "Applications", icon: <FolderOpen size={16} />, to: "/applications" },
  { label: "Workflow", icon: <GitBranch size={16} />, to: "/workflow/crm", match: ["/workflow"] },
  { label: "Reports", icon: <BarChart3 size={16} />, to: "/reports/pending", match: ["/reports"] },
];

const workspaceNav: NavItem[] = [
  { label: "Masters", icon: <Users size={16} />, to: "/masters/branches", match: ["/masters"] },
  { label: "Showcase", icon: <Sparkles size={16} />, to: "/showcase" },
  { label: "Settings", icon: <Settings size={16} />, to: "/settings", match: ["/settings", "/profile"] },
];

function NavSection({ title, items }: { title: string; items: NavItem[] }) {
  const location = useLocation();
  const { close } = useSidebarState();

  const isActive = (item: NavItem) => {
    if (location.pathname === item.to) return true;
    if (item.match) return item.match.some((m) => location.pathname.startsWith(m));
    return location.pathname.startsWith(item.to);
  };

  return (
    <div className="mb-5">
      <p className="px-4 mb-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-primary/50">
        {title}
      </p>
      <nav className="space-y-1 px-2.5">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            onClick={close}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg text-[14px] font-medium transition-all duration-150",
              isActive(item)
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-sidebar-foreground hover:bg-sidebar-accent"
            )}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}

export default function AppSidebar() {
  const { open, close } = useSidebarState();
  const user = useAuthStore((s) => s.user);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={close} />
      )}

      <aside
        className={cn(
          "fixed md:static z-50 top-0 left-0 h-full w-[var(--sidebar-width)] bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 transition-transform duration-200 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-4 py-4 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-primary/10 border border-primary/15 flex items-center justify-center overflow-hidden">
              <img src={mtbLogo} alt="MTB" className="h-6 object-contain" />
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-muted-foreground truncate">Mutual Trust Ba...</p>
              <p className="text-[14px] font-bold text-sidebar-foreground">SBL Portal</p>
            </div>
          </div>
          <button onClick={close} className="md:hidden w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted">
            <X size={14} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 pt-4 overflow-y-auto">
          <NavSection title="Main" items={mainNav} />
          <NavSection title="Workspace" items={workspaceNav} />
        </div>

        {/* User footer */}
        <div className="border-t border-sidebar-border p-3">
          <div className="flex items-center gap-2.5 px-1">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Users size={14} className="text-muted-foreground" />
            </div>
            <div className="leading-tight min-w-0 flex-1">
              <p className="text-[13px] font-medium text-sidebar-foreground truncate">
                {user?.displayName || "System Administr..."}
              </p>
              <p className="text-[11px] text-muted-foreground">{user?.role || "Admin"}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
