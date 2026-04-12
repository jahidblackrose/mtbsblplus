import { useState, useRef, useEffect } from "react";
import { ChevronLeft, Search, Bell, LogOut, Check, Info, AlertTriangle, X, FileText } from "lucide-react";
import { useSidebarState } from "@/hooks/use-sidebar-state";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { cn } from "@/lib/utils";

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

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: "info" | "success" | "warning";
}

const initialNotifications: Notification[] = [
  { id: "1", title: "Application Approved", message: "SBL-2024-00142 has been approved by CAD", time: "2 min ago", read: false, type: "success" },
  { id: "2", title: "New Query Assigned", message: "Query #Q-887 assigned to your desk for review", time: "15 min ago", read: false, type: "info" },
  { id: "3", title: "Disbursement Pending", message: "3 applications pending disbursement clearance", time: "1 hr ago", read: false, type: "warning" },
  { id: "4", title: "CRM Review Complete", message: "SBL-2024-00139 CRM review completed", time: "3 hrs ago", read: true, type: "success" },
  { id: "5", title: "System Maintenance", message: "Scheduled maintenance tonight at 11:00 PM", time: "5 hrs ago", read: true, type: "info" },
];

const typeIcon = {
  info: <Info size={14} className="text-blue-500 shrink-0" />,
  success: <Check size={14} className="text-green-600 shrink-0" />,
  warning: <AlertTriangle size={14} className="text-yellow-600 shrink-0" />,
};

export default function TopBar() {
  const { toggle } = useSidebarState();
  const location = useLocation();
  const pageInfo = getPageInfo(location.pathname);
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [showNotifs, setShowNotifs] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifs(false);
      }
    };
    if (showNotifs) document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showNotifs]);

  const markAllRead = () => setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  const markRead = (id: string) => setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, read: true } : n));
  const removeNotif = (id: string) => setNotifications((prev) => prev.filter((n) => n.id !== id));

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

      {/* Right: App ID badge, bell, user, logout */}
      <div className="flex items-center gap-3">
        {/* Application ID Badge */}
        {location.pathname.startsWith("/applications/") && (
          <div className="hidden sm:flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-lg px-2.5 py-1.5">
            <FileText size={13} className="text-primary" />
            <span className="text-[11px] font-semibold text-primary tracking-wide">App. Id -</span>
            <span className="text-[12px] font-bold text-foreground">SBL001</span>
          </div>
        )}
        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifs(!showNotifs)}
            className="w-8 h-8 rounded-full border border-border flex items-center justify-center hover:bg-muted transition-colors relative"
          >
            <Bell size={14} className="text-foreground" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-destructive text-destructive-foreground text-[9px] font-bold flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifs && (
            <div className="absolute right-0 top-full mt-2 w-[340px] bg-card border border-border rounded-lg shadow-lg z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-3 py-2.5 border-b border-border bg-muted/30">
                <p className="text-[13px] font-semibold text-foreground">Notifications</p>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[11px] font-medium text-primary hover:underline"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div className="max-h-[320px] overflow-y-auto divide-y divide-border">
                {notifications.length === 0 ? (
                  <div className="py-8 text-center text-[13px] text-muted-foreground">
                    No notifications
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      onClick={() => markRead(n.id)}
                      className={cn(
                        "flex gap-2.5 px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors",
                        !n.read && "bg-primary/[0.03]"
                      )}
                    >
                      <div className="mt-0.5">{typeIcon[n.type]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn("text-[12px] leading-snug", !n.read ? "font-semibold text-foreground" : "font-medium text-foreground/80")}>
                            {n.title}
                          </p>
                          <button
                            onClick={(e) => { e.stopPropagation(); removeNotif(n.id); }}
                            className="shrink-0 w-4 h-4 flex items-center justify-center rounded hover:bg-muted text-muted-foreground hover:text-foreground"
                          >
                            <X size={10} />
                          </button>
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-snug mt-0.5 truncate">{n.message}</p>
                        <p className="text-[10px] text-muted-foreground/60 mt-1">{n.time}</p>
                      </div>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0 mt-1.5" />}
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              <div className="border-t border-border px-3 py-2 text-center">
                <button className="text-[11px] font-medium text-primary hover:underline">
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

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
