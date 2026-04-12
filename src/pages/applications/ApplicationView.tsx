import { useParams, Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { PageHeader, StatusBadge } from "@/components/common/PageComponents";
import { Button } from "@/components/ui/button";
import { FileDown } from "lucide-react";
import { generateApplicationPdf } from "@/utils/generateApplicationPdf";

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
  remarks: "Applicant has been a client since 2019 with good transaction history. Proposed limit within policy guideline.",
};

export default function ApplicationView() {
  const { id } = useParams();

  const fields = [
    ["Application No.", demoApp.id],
    ["Business Name", demoApp.business],
    ["CIF", demoApp.cif],
    ["Branch", demoApp.branch],
    ["Status", null],
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
        <Button size="sm" variant="outline" onClick={() => generateApplicationPdf(demoApp)}>
          <FileDown size={14} className="mr-1.5" /> Download PDF
        </Button>
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
