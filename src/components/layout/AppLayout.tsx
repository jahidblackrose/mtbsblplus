import React from "react";
import AppSidebar from "@/components/layout/AppSidebar";
import TopBar from "@/components/layout/TopBar";
import { SidebarProvider } from "@/hooks/use-sidebar-state";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <div className="app-shell">
        <AppSidebar />
        <div className="app-main overflow-y-auto scrollbar-none">
          <TopBar />
          <main className="app-content flex-1 p-4">{children}</main>
          <footer className="border-t border-border px-4 py-2.5 flex items-center justify-between">
            <p className="text-[length:var(--font-size-xs)] text-muted-foreground">
              © 2026 Mutual Trust Bank PLC. All rights reserved.
            </p>
            <p className="text-[length:var(--font-size-xs)] text-muted-foreground">SBL Portal v1.0.0</p>
          </footer>
        </div>
      </div>
    </SidebarProvider>
  );
}
