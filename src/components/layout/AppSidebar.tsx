import { Home, FolderOpen, GitBranch, BarChart3, Users, Sparkles, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const mainNav: NavItem[] = [
  { label: "Dashboard", icon: <Home size={15} /> },
  { label: "Applications", icon: <FolderOpen size={15} /> },
  { label: "Workflow", icon: <GitBranch size={15} />, active: true },
  { label: "Reports", icon: <BarChart3 size={15} /> },
];

const workspaceNav: NavItem[] = [
  { label: "Masters", icon: <Users size={15} /> },
  { label: "Showcase", icon: <Sparkles size={15} /> },
  { label: "Settings", icon: <Settings size={15} /> },
];

function NavSection({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div className="mb-4">
      <p className="px-3 mb-1 text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
        {title}
      </p>
      <nav className="space-y-0.5 px-1.5">
        {items.map((item) => (
          <a
            key={item.label}
            href="#"
            className={cn(
              "flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-[length:var(--font-size-base)] font-medium transition-colors",
              item.active
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent/50"
            )}
          >
            {item.icon}
            {item.label}
          </a>
        ))}
      </nav>
    </div>
  );
}

export default function AppSidebar() {
  return (
    <aside className="w-[var(--sidebar-width)] min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col shrink-0">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-3 py-3 border-b border-sidebar-border">
        <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-[length:var(--font-size-xs)]">🏛</span>
        </div>
        <div className="leading-tight min-w-0">
          <p className="text-[length:var(--font-size-xs)] font-semibold text-muted-foreground uppercase tracking-wide truncate">
            Mutual Trust Ba…
          </p>
          <p className="text-[length:var(--font-size-base)] font-semibold text-sidebar-foreground">SBL Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 pt-3">
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
  );
}
