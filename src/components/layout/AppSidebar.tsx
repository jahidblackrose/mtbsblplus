import { Home, FolderOpen, GitBranch, BarChart3, Users, Sparkles, Settings, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { useLocation } from "react-router-dom";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to: string;
  match?: string[];
}

const mainNav: NavItem[] = [
  { label: "Dashboard", icon: <Home size={15} />, to: "/dashboard" },
  { label: "Applications", icon: <FolderOpen size={15} />, to: "/applications" },
  { label: "Workflow", icon: <GitBranch size={15} />, to: "/workflow/crm", match: ["/workflow"] },
  { label: "Reports", icon: <BarChart3 size={15} />, to: "/reports/pending", match: ["/reports"] },
];

const workspaceNav: NavItem[] = [
  { label: "Masters", icon: <Users size={15} />, to: "/masters/branches", match: ["/masters"] },
  { label: "Showcase", icon: <Sparkles size={15} />, to: "/showcase" },
  { label: "Settings", icon: <Settings size={15} />, to: "/settings", match: ["/settings", "/profile"] },
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
    <div className="mb-4">
      <p className="px-3 mb-1 text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
        {title}
      </p>
      <nav className="space-y-0.5 px-1.5">
        {items.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            onClick={close}
            className={cn(
              "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[length:var(--font-size-base)] font-medium transition-colors",
              isActive(item)
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
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

  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={close} />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed md:static z-50 top-0 left-0 h-full w-[var(--sidebar-width)] bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 transition-transform duration-200 ease-in-out",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo + mobile close */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-[length:var(--font-size-xs)]">🏛</span>
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-[length:var(--font-size-xs)] font-semibold text-muted-foreground uppercase tracking-wide truncate">
                Mutual Trust Bank
              </p>
              <p className="text-[length:var(--font-size-base)] font-semibold text-sidebar-foreground">SBL Portal</p>
            </div>
          </div>
          <button onClick={close} className="md:hidden w-6 h-6 flex items-center justify-center rounded hover:bg-muted">
            <X size={14} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 pt-3 overflow-y-auto">
          <NavSection title="Main" items={mainNav} />
          <NavSection title="Workspace" items={workspaceNav} />
        </div>

        {/* User */}
        <div className="border-t border-sidebar-border p-3 flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center">
            <Users size={14} className="text-muted-foreground" />
          </div>
          <div className="leading-tight min-w-0">
            <p className="text-[length:var(--font-size-base)] font-medium text-sidebar-foreground truncate">System Admin</p>
            <p className="text-[length:var(--font-size-xs)] text-muted-foreground">Admin</p>
          </div>
        </div>
      </aside>
    </>
  );
}
