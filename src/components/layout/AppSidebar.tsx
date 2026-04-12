import { useState } from "react";
import {
  Home, FolderOpen, GitBranch, BarChart3, Users, Sparkles, Settings, X,
  ChevronDown, FileText, Clock, TrendingUp, Timer,
  Building2, UserCog, Shield, Package,
  LayoutGrid, MessageSquare, Landmark, HelpCircle,
  UserCircle
} from "lucide-react";
import { cn } from "@/lib/utils";
import { NavLink } from "@/components/NavLink";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import mtbLogo from "@/assets/mtb-logo-full.png";

interface SubItem {
  label: string;
  to: string;
  icon?: React.ReactNode;
}

interface NavItem {
  label: string;
  icon: React.ReactNode;
  to?: string;
  match?: string[];
  children?: SubItem[];
}

const mainNav: NavItem[] = [
  { label: "Dashboard", icon: <Home size={15} />, to: "/dashboard" },
  {
    label: "Applications",
    icon: <FolderOpen size={15} />,
    match: ["/applications"],
    children: [
      { label: "All Applications", to: "/applications", icon: <LayoutGrid size={14} /> },
      { label: "New Application", to: "/applications/new", icon: <FileText size={14} /> },
    ],
  },
  {
    label: "Workflow",
    icon: <GitBranch size={15} />,
    match: ["/workflow"],
    children: [
      { label: "CRM", to: "/workflow/crm", icon: <MessageSquare size={14} /> },
      { label: "CIB", to: "/workflow/cib", icon: <Landmark size={14} /> },
      { label: "CAD", to: "/workflow/cad", icon: <Shield size={14} /> },
      { label: "Queries", to: "/workflow/queries", icon: <HelpCircle size={14} /> },
    ],
  },
  {
    label: "Reports",
    icon: <BarChart3 size={15} />,
    match: ["/reports"],
    children: [
      { label: "Pending", to: "/reports/pending", icon: <Clock size={14} /> },
      { label: "Outstanding", to: "/reports/outstanding", icon: <TrendingUp size={14} /> },
      { label: "Disbursement", to: "/reports/disbursement", icon: <FileText size={14} /> },
      { label: "TAT", to: "/reports/tat", icon: <Timer size={14} /> },
    ],
  },
];

const workspaceNav: NavItem[] = [
  {
    label: "Masters",
    icon: <Users size={15} />,
    match: ["/masters"],
    children: [
      { label: "Branches", to: "/masters/branches", icon: <Building2 size={14} /> },
      { label: "Users", to: "/masters/users", icon: <UserCog size={14} /> },
      { label: "Roles", to: "/masters/roles", icon: <Shield size={14} /> },
      { label: "Products", to: "/masters/products", icon: <Package size={14} /> },
    ],
  },
  { label: "Showcase", icon: <Sparkles size={15} />, to: "/showcase" },
  {
    label: "Settings",
    icon: <Settings size={15} />,
    match: ["/settings", "/profile"],
    children: [
      { label: "General", to: "/settings", icon: <Settings size={14} /> },
      { label: "Profile", to: "/profile", icon: <UserCircle size={14} /> },
    ],
  },
];

function NavSection({ title, items }: { title: string; items: NavItem[] }) {
  const location = useLocation();
  const { close } = useSidebarState();

  const isItemActive = (item: NavItem) => {
    if (item.to && location.pathname === item.to) return true;
    if (item.match) return item.match.some((m) => location.pathname.startsWith(m));
    if (item.to) return location.pathname.startsWith(item.to);
    return false;
  };

  const isSubActive = (sub: SubItem) => location.pathname === sub.to;

  // Track which menus are expanded
  const [expanded, setExpanded] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    items.forEach((item) => {
      if (item.children && isItemActive(item)) {
        init[item.label] = true;
      }
    });
    return init;
  });

  const toggle = (label: string) => {
    setExpanded((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
    <div className="mb-4">
      <p className="px-4 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground/60">
        {title}
      </p>
      <nav className="space-y-0.5 px-2">
        {items.map((item) => {
          const active = isItemActive(item);
          const hasChildren = !!item.children;
          const isOpen = expanded[item.label] || false;

          if (!hasChildren && item.to) {
            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={close}
                className={cn(
                  "flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] font-medium transition-all duration-150",
                  active
                    ? "bg-primary text-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                {item.icon}
                {item.label}
              </NavLink>
            );
          }

          return (
            <div key={item.label}>
              {/* Parent menu button */}
              <button
                onClick={() => toggle(item.label)}
                className={cn(
                  "w-full flex items-center gap-2.5 px-2.5 py-[7px] rounded-md text-[13px] font-medium transition-all duration-150",
                  active
                    ? "text-primary bg-primary/8"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                {item.icon}
                <span className="flex-1 text-left">{item.label}</span>
                <ChevronDown
                  size={14}
                  className={cn(
                    "transition-transform duration-200 opacity-50",
                    isOpen && "rotate-180"
                  )}
                />
              </button>

              {/* Submenu */}
              <div
                className={cn(
                  "overflow-hidden transition-all duration-200",
                  isOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="ml-3 pl-2.5 border-l border-border/40 mt-0.5 mb-1 space-y-0.5">
                  {item.children!.map((sub) => (
                    <NavLink
                      key={sub.to}
                      to={sub.to}
                      onClick={close}
                      className={cn(
                        "flex items-center gap-2 px-2 py-[5px] rounded-md text-[12px] font-medium transition-all duration-150",
                        isSubActive(sub)
                          ? "bg-primary text-primary-foreground"
                          : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                      )}
                    >
                      {sub.icon}
                      {sub.label}
                    </NavLink>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </nav>
    </div>
  );
}

export default function AppSidebar() {
  const { open, collapsed, close } = useSidebarState();
  const user = useAuthStore((s) => s.user);

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 md:hidden" onClick={close} />
      )}

      <aside
        className={cn(
          "fixed md:static z-50 top-0 left-0 h-full bg-sidebar border-r border-sidebar-border flex flex-col shrink-0 transition-all duration-200 ease-in-out",
          collapsed ? "md:w-0 md:border-0 md:overflow-hidden" : "w-[var(--sidebar-width)]",
          open ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-3 py-3 border-b border-sidebar-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white border border-border/30 flex items-center justify-center overflow-hidden">
              <img src={mtbLogo} alt="MTB" className="h-5 object-contain" />
            </div>
            <div className="leading-tight min-w-0">
              <p className="text-[10px] font-semibold uppercase tracking-[0.06em] text-muted-foreground truncate">Mutual Trust Bank</p>
              <p className="text-[13px] font-bold text-sidebar-foreground">SBL Portal</p>
            </div>
          </div>
          <button onClick={close} className="md:hidden w-7 h-7 flex items-center justify-center rounded-md hover:bg-muted">
            <X size={14} />
          </button>
        </div>

        {/* Navigation */}
        <div className="flex-1 pt-3 overflow-y-auto">
          <NavSection title="Main" items={mainNav} />
          <NavSection title="Workspace" items={workspaceNav} />
        </div>

        {/* User footer */}
        <div className="border-t border-sidebar-border p-2.5">
          <div className="flex items-center gap-2 px-1">
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
              <Users size={13} className="text-muted-foreground" />
            </div>
            <div className="leading-tight min-w-0 flex-1">
              <p className="text-[12px] font-medium text-sidebar-foreground truncate">
                {user?.displayName || "System Admin"}
              </p>
              <p className="text-[10px] text-muted-foreground">{user?.role || "Admin"}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
