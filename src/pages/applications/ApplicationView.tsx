import { useParams, Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { PageHeader, StatusBadge } from "@/components/common/PageComponents";
import { Button } from "@/components/ui/button";

const demoApp = {
  id: "SBL-2026-001",
  business: "Khan Denim Ltd",
  cif: "CIF-10234",
  branch: "Mirpur-2",
  status: "CRM Review",
  limit: "35.00 Lac",
  date: "2026-04-01",
  businessType: "Trading",
  enterpriseType: "SME",
  legalStatus: "Proprietorship",
  memoDate: "2026-04-01",
  proposedLimit: "35.00 Lac",
  existingLimit: "0.00",
  os: "0.00",
  rating: "Unrated",
  keyPerson: "MD. RAYHAN KHAN — PROPRIETOR",
};

export default function ApplicationView() {
  const { id } = useParams();

  const fields = [
    ["Application No.", demoApp.id],
    ["Business Name", demoApp.business],
    ["CIF", demoApp.cif],
    ["Branch", demoApp.branch],
    ["Status", null], // special render
    ["Business Memo Date", demoApp.memoDate],
    ["Business Type", demoApp.businessType],
    ["Enterprise Type", demoApp.enterpriseType],
    ["Legal Status", demoApp.legalStatus],
    ["Proposed Limit", demoApp.proposedLimit],
    ["Existing Limit", demoApp.existingLimit],
    ["O/S", demoApp.os],
    ["Rating", demoApp.rating],
    ["Key Person", demoApp.keyPerson],
  ] as const;

  return (
    <AppLayout>
      <PageHeader title={`Application ${id || demoApp.id}`} subtitle="View application details">
        <Link to="/applications"><Button variant="outline" size="sm">← Back to List</Button></Link>
        <Link to={`/applications/${id || demoApp.id}/edit`}><Button size="sm">Edit</Button></Link>
      </PageHeader>

      <div className="card-compact p-4">
        <div className="form-grid">
          {fields.map(([label, value]) => (
            <div key={label} className="form-field">
              <p className="text-[length:var(--font-size-xs)] font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
              {label === "Status" ? (
                <StatusBadge variant="default">{demoApp.status}</StatusBadge>
              ) : (
                <p className="text-[length:var(--font-size-base)] text-foreground font-medium">{value}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
