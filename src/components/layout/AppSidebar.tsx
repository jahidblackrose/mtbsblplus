import { Home, FolderOpen, GitBranch, BarChart3, Users, Sparkles, Settings, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

const mainNav: NavItem[] = [
  { label: "Dashboard", icon: <Home size={18} /> },
  { label: "Applications", icon: <FolderOpen size={18} /> },
  { label: "Workflow", icon: <GitBranch size={18} />, active: true },
  { label: "Reports", icon: <BarChart3 size={18} /> },
];

const workspaceNav: NavItem[] = [
  { label: "Masters", icon: <Users size={18} /> },
  { label: "Showcase", icon: <Sparkles size={18} /> },
  { label: "Settings", icon: <Settings size={18} /> },
];

function NavSection({ title, items }: { title: string; items: NavItem[] }) {
  return (
    <div className="mb-6">
      <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        {title}
      </p>
      <nav className="space-y-1 px-2">
        {items.map((item) => (
          <a
            key={item.label}
            href="#"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
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
    <aside className="w-[230px] min-h-screen bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-sidebar-border">
        <div className="w-9 h-9 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">🏛</span>
        </div>
        <div className="leading-tight">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Mutual Trust Ba…</p>
          <p className="text-sm font-semibold text-sidebar-foreground">SBL Portal</p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 pt-5">
        <NavSection title="Main" items={mainNav} />
        <NavSection title="Workspace" items={workspaceNav} />
      </div>

      {/* User */}
      <div className="border-t border-sidebar-border p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center">
          <Users size={18} className="text-muted-foreground" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-medium text-sidebar-foreground truncate max-w-[120px]">System Administr…</p>
          <p className="text-xs text-muted-foreground">Admin</p>
        </div>
      </div>
    </aside>
  );
}
