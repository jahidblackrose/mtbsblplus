import AppLayout from "@/components/layout/AppLayout";
import { PageHeader, StatCard, PageTable, StatusBadge } from "@/components/common/PageComponents";
import { FileText, ClipboardCheck, TrendingUp, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stats = [
  { title: "Total Applications", value: 245, change: "+12% this month", tone: "primary" as const, icon: <FileText size={16} />, note: "Across branch and head office pipeline" },
  { title: "Pending Review", value: 38, change: "8 need same-day action", tone: "warning" as const, icon: <ClipboardCheck size={16} />, note: "CRM, CIB, and CAD touchpoints" },
  { title: "Approved Cases", value: 156, change: "+8% conversion lift", tone: "success" as const, icon: <TrendingUp size={16} />, note: "This quarter" },
  { title: "Disbursed Amount", value: "12.5 Cr", change: "+15% vs previous month", tone: "accent" as const, icon: <DollarSign size={16} />, note: "Live BDT position" },
];

const pendingItems = [
  { applicationNo: "SBL-2026-001", businessName: "Khan Denim", stage: "CIB", days: 2, branch: "Mirpur-2", amount: "BDT 35.0 Lac" },
  { applicationNo: "SBL-2026-002", businessName: "ABC Trading", stage: "CRM", days: 3, branch: "Dhanmondi", amount: "BDT 18.0 Lac" },
  { applicationNo: "SBL-2026-003", businessName: "XYZ Enterprise", stage: "CAD", days: 1, branch: "Gulshan", amount: "BDT 47.0 Lac" },
  { applicationNo: "SBL-2026-004", businessName: "MNO Stores", stage: "Query", days: 5, branch: "Uttara", amount: "BDT 22.0 Lac" },
  { applicationNo: "SBL-2026-005", businessName: "PQR Fashion", stage: "CRM", days: 2, branch: "Mohammadpur", amount: "BDT 9.0 Lac" },
];

const activityItems = [
  { action: "Approved", application: "SBL-2026-010", user: "Zahir Uddin (CRM)", time: "2 min ago" },
  { action: "Submitted", application: "SBL-2026-015", user: "Rina Akter (BM)", time: "15 min ago" },
  { action: "Query raised", application: "SBL-2026-004", user: "Kamal H. (CIB)", time: "1 hr ago" },
  { action: "Disbursed", application: "SBL-2026-008", user: "System", time: "3 hr ago" },
];

const stageBadge = (stage: string) => {
  const v = stage === "Query" ? "warning" : stage === "CAD" ? "success" : "default";
  return <StatusBadge variant={v as any}>{stage}</StatusBadge>;
};

export default function Dashboard() {
  return (
    <AppLayout>
      <PageHeader title="Dashboard" subtitle="Overview of your SBL pipeline">
        <Link to="/applications/new">
          <Button size="sm">+ New Application</Button>
        </Link>
      </PageHeader>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        {stats.map((s) => <StatCard key={s.title} {...s} />)}
      </div>

      {/* Tables */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-3">
        <div className="xl:col-span-2 card-compact">
          <div className="px-4 py-2.5 border-b border-border flex items-center justify-between">
            <h2 className="section-header">Pending Applications</h2>
            <Link to="/workflow/crm" className="text-[length:var(--font-size-xs)] text-primary font-medium hover:underline">View all</Link>
          </div>
          <PageTable
            columns={[
              { key: "applicationNo", label: "Application No." },
              { key: "businessName", label: "Business" },
              { key: "stage", label: "Stage", render: (r) => stageBadge(r.stage) },
              { key: "days", label: "Days", align: "right" },
              { key: "branch", label: "Branch" },
              { key: "amount", label: "Amount", align: "right" },
            ]}
            data={pendingItems}
          />
        </div>

        <div className="card-compact">
          <div className="px-4 py-2.5 border-b border-border">
            <h2 className="section-header">Recent Activity</h2>
          </div>
          <div className="divide-y divide-border">
            {activityItems.map((a, i) => (
              <div key={i} className="px-4 py-2.5">
                <p className="text-[length:var(--font-size-sm)] text-foreground">
                  <span className="font-medium">{a.action}</span> — {a.application}
                </p>
                <p className="text-[length:var(--font-size-xs)] text-muted-foreground">{a.user} · {a.time}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
