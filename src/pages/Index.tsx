import AppLayout from "@/components/layout/AppLayout";
import { PageHeader, PageTable } from "@/components/common/PageComponents";

export default function Index() {
  return (
    <AppLayout>
      <PageHeader title="CRM Pending Review" subtitle="Applications pending CRM review and approval" />
      <div className="card-compact">
        <div className="px-4 py-2.5 border-b border-border">
          <h2 className="section-header">Pending Applications</h2>
        </div>
        <div className="flex items-center justify-center py-14">
          <p className="text-[length:var(--font-size-sm)] text-muted-foreground">No applications pending CRM review.</p>
        </div>
      </div>
    </AppLayout>
  );
}
