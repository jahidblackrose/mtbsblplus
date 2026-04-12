import AppSidebar from "@/components/layout/AppSidebar";
import TopBar from "@/components/layout/TopBar";

export default function Index() {
  return (
    <div className="app-shell">
      <AppSidebar />
      <div className="app-main">
        <TopBar />
        <main className="flex-1 p-4">
          <h1 className="text-[length:var(--font-size-xl)] font-bold text-foreground">CRM Pending Review</h1>
          <p className="text-[length:var(--font-size-sm)] text-muted-foreground mt-0.5">
            Applications pending CRM review and approval
          </p>

          <div className="mt-4 card-compact">
            <div className="px-4 py-2.5 border-b border-border">
              <h2 className="section-header">Pending Applications</h2>
            </div>
            <div className="flex items-center justify-center py-14">
              <p className="text-[length:var(--font-size-sm)] text-muted-foreground">No applications pending CRM review.</p>
            </div>
          </div>
        </main>

        <footer className="border-t border-border px-4 py-2.5 flex items-center justify-between">
          <p className="text-[length:var(--font-size-xs)] text-muted-foreground">
            © 2026 Mutual Trust Bank PLC. All rights reserved.
          </p>
          <p className="text-[length:var(--font-size-xs)] text-muted-foreground">SBL Portal v1.0.0</p>
        </footer>
      </div>
    </div>
  );
}
