import AppSidebar from "@/components/layout/AppSidebar";
import TopBar from "@/components/layout/TopBar";

export default function Index() {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <div className="flex-1 flex flex-col">
        <TopBar />
        <main className="flex-1 p-8">
          <h1 className="text-2xl font-bold text-foreground">CRM Pending Review</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Applications pending CRM review and approval
          </p>

          <div className="mt-6 rounded-xl border border-border bg-card shadow-sm">
            <div className="px-6 py-4 border-b border-border">
              <h2 className="text-base font-semibold text-foreground">Pending Applications</h2>
            </div>
            <div className="flex items-center justify-center py-20">
              <p className="text-sm text-muted-foreground">No applications pending CRM review.</p>
            </div>
          </div>
        </main>

        <footer className="border-t border-border px-8 py-4 flex items-center justify-between">
          <p className="text-xs text-muted-foreground">
            © 2026 Mutual Trust Bank PLC. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">SBL Portal v1.0.0</p>
        </footer>
      </div>
    </div>
  );
}
