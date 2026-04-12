import AppLayout from "@/components/layout/AppLayout";
import { PageHeader, StatusBadge } from "@/components/common/PageComponents";
import { FileText, ClipboardCheck, TrendingUp, DollarSign, ArrowRight, Sparkles, FileDown, ClipboardList } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const stats = [
  { title: "Total Applications", value: "245", change: "+12% this month", changeColor: "text-emerald-600", note: "Across branch and head office pipeline", icon: <FileText size={16} /> },
  { title: "Pending Review", value: "38", change: "8 need same-day action", changeColor: "text-amber-600", note: "CRM, CIB, and CAD touchpoints", icon: <ClipboardCheck size={16} /> },
  { title: "Approved Cases", value: "156", change: "+8% conversion lift", changeColor: "text-emerald-600", note: "From reviewed applications this quarter", icon: <TrendingUp size={16} /> },
  { title: "Disbursed Amount", value: "12.5 Cr", change: "+15% vs previous month", changeColor: "text-emerald-600", note: "Live BDT disbursement position", icon: <DollarSign size={16} /> },
];

const pendingItems = [
  { id: "SBL-2026-001", business: "Khan Denim", branch: "Mirpur-2", stage: "CIB", amount: "BDT 35.0 Lac", aging: "2 days" },
  { id: "SBL-2026-002", business: "ABC Trading", branch: "Dhanmondi", stage: "CRM", amount: "BDT 18.0 Lac", aging: "3 days" },
  { id: "SBL-2026-003", business: "XYZ Enterprise", branch: "Gulshan", stage: "CAD", amount: "BDT 47.0 Lac", aging: "1 day" },
  { id: "SBL-2026-004", business: "MNO Stores", branch: "Uttara", stage: "Query", amount: "BDT 22.0 Lac", aging: "5 days" },
  { id: "SBL-2026-005", business: "PQR Fashion", branch: "Mohammadpur", stage: "CRM", amount: "BDT 9.0 Lac", aging: "2 days" },
];

const activityItems = [
  { action: "Application submitted", detail: "SBL-2026-001 — RM - Mirpur", time: "10 mins ago", icon: <FileText size={14} /> },
  { action: "CIB uploaded", detail: "SBL-2026-002 — CIB Officer", time: "25 mins ago", icon: <ClipboardList size={14} /> },
  { action: "Query raised", detail: "SBL-2026-003 — CRM Officer", time: "1 hour ago", icon: <ClipboardCheck size={14} /> },
  { action: "Application approved", detail: "SBL-2026-004 — CRM Head", time: "2 hours ago", icon: <TrendingUp size={14} /> },
  { action: "Loan disbursed", detail: "SBL-2026-005 — CAD Officer", time: "3 hours ago", icon: <FileDown size={14} /> },
];

const tatItems = [
  { label: "Branch Application", current: "18h", target: "24h", pct: 75, color: "bg-primary" },
  { label: "CIB Processing", current: "36h", target: "48h", pct: 75, color: "bg-primary" },
  { label: "CRM Review", current: "60h", target: "72h", pct: 83, color: "bg-emerald-500" },
  { label: "Query Resolution", current: "30h", target: "24h", pct: 125, color: "bg-red-500" },
  { label: "CAD Sanction", current: "20h", target: "24h", pct: 83, color: "bg-emerald-500" },
];

const stageBadge = (stage: string) => {
  const v = stage === "Query" ? "warning" : stage === "CAD" ? "success" : "default";
  return <StatusBadge variant={v as any}>{stage}</StatusBadge>;
};

const agingBadge = (aging: string) => {
  const days = parseInt(aging);
  const color = days >= 5 ? "text-red-600" : days >= 3 ? "text-amber-600" : "text-emerald-600";
  return <span className={`text-[length:var(--font-size-xs)] font-semibold ${color}`}>{aging}</span>;
};

export default function Dashboard() {
  return (
    <AppLayout>
      <PageHeader title="Dashboard" subtitle="Operational Workspace" />

      {/* Hero + side stats */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-3 mb-4">
        <div className="card-compact p-6">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 mb-4">
            <Sparkles size={12} className="text-primary" />
            <span className="text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-muted-foreground">Operational Overview</span>
          </div>
          <h2 className="text-[1.35rem] font-bold text-foreground leading-snug mb-2">
            A cleaner control room for SBL<br className="hidden sm:block" />
            applications, reviews, and disbursement tracking.
          </h2>
          <p className="text-[length:var(--font-size-sm)] text-muted-foreground max-w-[32rem] mb-5">
            Monitor queue pressure, accelerate decision points, and keep branch-to-head-office coordination visible in one consistent workspace.
          </p>
          <div className="flex items-center gap-2">
            <Link to="/applications/new">
              <Button size="sm">New Application <ArrowRight size={13} className="ml-1" /></Button>
            </Link>
            <Link to="/reports/pending">
              <Button size="sm" variant="outline"><ClipboardList size={13} className="mr-1" /> View Pending Report</Button>
            </Link>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {[
            { label: "Open Queue Today", value: "38" },
            { label: "Branch Coverage", value: "14" },
            { label: "Disbursement Run-Rate", value: "15%" },
          ].map((s) => (
            <div key={s.label} className="card-compact p-3 flex items-start justify-between">
              <div>
                <p className="text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-primary">{s.label}</p>
                <p className="text-[length:var(--font-size-2xl)] font-bold text-foreground mt-1">{s.value}</p>
              </div>
              <TrendingUp size={16} className="text-muted-foreground mt-1" />
            </div>
          ))}
        </div>
      </div>

      {/* Stat cards row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3 mb-4">
        {stats.map((s) => (
          <div key={s.title} className="card-compact p-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[length:var(--font-size-xs)] font-medium text-muted-foreground">{s.title}</p>
                <p className="text-[length:var(--font-size-2xl)] font-bold text-foreground mt-1">{s.value}</p>
                <p className={`text-[length:var(--font-size-xs)] font-medium mt-0.5 ${s.changeColor}`}>{s.change}</p>
              </div>
              <div className="w-8 h-8 rounded-md bg-primary/10 flex items-center justify-center text-primary">
                {s.icon}
              </div>
            </div>
            <p className="text-[length:var(--font-size-xs)] text-muted-foreground mt-2 border-t border-border pt-2">{s.note}</p>
          </div>
        ))}
      </div>

      {/* Pending table + Activity + TAT */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-3">
        {/* Left: Pending applications */}
        <div className="card-compact">
          <div className="px-4 py-3 border-b border-border">
            <p className="text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-primary mb-0.5">Priority Queue</p>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[length:var(--font-size-lg)] font-bold text-foreground">Pending applications</h2>
                <p className="text-[length:var(--font-size-xs)] text-muted-foreground">Cases requiring near-term action across branch and review teams.</p>
              </div>
              <Link to="/applications" className="text-[length:var(--font-size-xs)] text-primary font-semibold hover:underline whitespace-nowrap">
                Open full pipeline
              </Link>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border text-[length:var(--font-size-sm)]">
              <thead className="bg-muted/50">
                <tr>
                  {["Application", "Business", "Branch", "Stage", "Amount", "Aging"].map((h) => (
                    <th key={h} className="px-3 py-2 font-semibold text-muted-foreground whitespace-nowrap text-left uppercase text-[length:var(--font-size-xs)] tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border bg-card">
                {pendingItems.map((r) => (
                  <tr key={r.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-3 py-2"><Link to={`/applications/${r.id}`} className="text-primary font-semibold hover:underline">{r.id}</Link></td>
                    <td className="px-3 py-2 text-foreground">{r.business}</td>
                    <td className="px-3 py-2 text-muted-foreground">{r.branch}</td>
                    <td className="px-3 py-2">{stageBadge(r.stage)}</td>
                    <td className="px-3 py-2 text-foreground">{r.amount}</td>
                    <td className="px-3 py-2">{agingBadge(r.aging)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right column */}
        <div className="flex flex-col gap-3">
          {/* Recent actions */}
          <div className="card-compact">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Live Activity</p>
              <h2 className="text-[length:var(--font-size-lg)] font-bold text-foreground">Recent actions</h2>
            </div>
            <div className="divide-y divide-border">
              {activityItems.map((a, i) => (
                <div key={i} className="px-4 py-2.5 flex items-start gap-3">
                  <div className="w-7 h-7 rounded-md bg-muted flex items-center justify-center text-muted-foreground shrink-0 mt-0.5">
                    {a.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[length:var(--font-size-sm)] font-medium text-foreground">{a.action}</p>
                    <p className="text-[length:var(--font-size-xs)] text-muted-foreground">{a.detail}</p>
                  </div>
                  <p className="text-[length:var(--font-size-xs)] text-muted-foreground whitespace-nowrap uppercase tracking-wider shrink-0">{a.time}</p>
                </div>
              ))}
            </div>
          </div>

          {/* TAT overview */}
          <div className="card-compact">
            <div className="px-4 py-3 border-b border-border">
              <p className="text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-muted-foreground mb-0.5">Turnaround Control</p>
              <h2 className="text-[length:var(--font-size-lg)] font-bold text-foreground">TAT overview</h2>
            </div>
            <div className="divide-y divide-border">
              {tatItems.map((t) => (
                <div key={t.label} className="px-4 py-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <p className="text-[length:var(--font-size-sm)] font-medium text-foreground">{t.label}</p>
                    <p className="text-[length:var(--font-size-xs)] text-muted-foreground">{t.current} / {t.target}</p>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div className={`h-full rounded-full ${t.color}`} style={{ width: `${Math.min(t.pct, 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
