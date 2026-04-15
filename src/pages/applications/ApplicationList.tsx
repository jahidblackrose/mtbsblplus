import { useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { PageHeader, PageTable, StatusBadge, FilterBar } from "@/components/common/PageComponents";
import { Button } from "@/components/ui/button";
import { FormSelect } from "@/components/common/FormControls";
import { MessageCircle } from "lucide-react";

const demoData = [
  { id: "SBL-2026-001", business: "Khan Denim Ltd", cif: "CIF-10234", branch: "Mirpur-2", status: "CRM Review", limit: "35.00", date: "2026-04-01" },
  { id: "SBL-2026-002", business: "ABC Trading Co", cif: "CIF-10312", branch: "Dhanmondi", status: "CIB Pending", limit: "18.00", date: "2026-04-02" },
  { id: "SBL-2026-003", business: "XYZ Enterprise", cif: "CIF-10455", branch: "Gulshan", status: "CAD Approved", limit: "47.00", date: "2026-04-03" },
  { id: "SBL-2026-004", business: "MNO Stores", cif: "CIF-10511", branch: "Uttara", status: "Query", limit: "22.00", date: "2026-04-04" },
  { id: "SBL-2026-005", business: "PQR Fashion", cif: "CIF-10602", branch: "Mohammadpur", status: "Disbursed", limit: "9.00", date: "2026-04-05" },
  { id: "SBL-2026-006", business: "Delta Garments", cif: "CIF-10701", branch: "Gulshan", status: "CRM Review", limit: "55.00", date: "2026-04-06" },
  { id: "SBL-2026-007", business: "Sunrise Pvt.", cif: "CIF-10803", branch: "Banani", status: "Draft", limit: "12.00", date: "2026-04-07" },
];

const statusBadge = (s: string) => {
  const v = s.includes("Approved") || s === "Disbursed" ? "success" : s === "Query" ? "warning" : s === "Draft" ? "outline" : "default";
  return <StatusBadge variant={v as any}>{s}</StatusBadge>;
};

export default function ApplicationList() {
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = statusFilter ? demoData.filter((d) => d.status === statusFilter) : demoData;

  return (
    <AppLayout>
      <PageHeader title="Applications" subtitle="All SBL loan applications">
        <Link to="/applications/new"><Button size="sm">+ New Application</Button></Link>
      </PageHeader>

      <div className="card-compact">
        <div className="px-4 py-2.5 border-b border-border">
          <FilterBar>
            <select
              className="h-[var(--control-h-sm)] rounded-md border border-input bg-background px-2.5 text-[length:var(--font-size-base)] focus:outline-none focus:ring-2 focus:ring-ring"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Draft">Draft</option>
              <option value="CRM Review">CRM Review</option>
              <option value="CIB Pending">CIB Pending</option>
              <option value="CAD Approved">CAD Approved</option>
              <option value="Query">Query</option>
              <option value="Disbursed">Disbursed</option>
            </select>
            <input
              type="text"
              placeholder="Search applications..."
              className="h-[var(--control-h-sm)] w-48 rounded-md border border-input bg-background px-2.5 text-[length:var(--font-size-base)] placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </FilterBar>
        </div>
        <PageTable
          columns={[
            { key: "id", label: "Application No.", render: (r) => <Link to={`/applications/${r.id}`} className="text-primary font-medium hover:underline">{r.id}</Link> },
            { key: "business", label: "Business Name" },
            { key: "cif", label: "CIF" },
            { key: "branch", label: "Branch" },
            { key: "status", label: "Status", render: (r) => statusBadge(r.status) },
            { key: "limit", label: "Limit (Lac)", align: "right" },
            { key: "date", label: "Date" },
            { key: "action", label: "Action", render: (r) => (
              <Link to={`/applications/${r.id}/chat`} title="Open Chat">
                <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary/80">
                  <MessageCircle className="h-4 w-4" />
                </Button>
              </Link>
            )},
          ]}
          data={filtered}
        />
      </div>
    </AppLayout>
  );
}
