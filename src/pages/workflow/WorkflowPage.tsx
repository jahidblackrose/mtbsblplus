import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { PageHeader, PageTable, StatusBadge, TabNav } from "@/components/common/PageComponents";

const workflowTabs = [
  { id: "crm", label: "CRM Pending" },
  { id: "cib", label: "CIB Pending" },
  { id: "cad", label: "CAD Pending" },
  { id: "queries", label: "Queries" },
];

const crmData = [
  { appNo: "SBL-2026-001", business: "Khan Denim", branch: "Mirpur-2", days: 2, amount: "35.0 Lac", assignee: "Zahir Uddin" },
  { appNo: "SBL-2026-002", business: "ABC Trading", branch: "Dhanmondi", days: 3, amount: "18.0 Lac", assignee: "Rina Akter" },
  { appNo: "SBL-2026-006", business: "Delta Garments", branch: "Gulshan", days: 1, amount: "55.0 Lac", assignee: "Kamal H." },
];
const cibData = [
  { appNo: "SBL-2026-003", business: "XYZ Enterprise", branch: "Gulshan", days: 1, amount: "47.0 Lac", assignee: "System" },
];
const cadData = [
  { appNo: "SBL-2026-005", business: "PQR Fashion", branch: "Mohammadpur", days: 2, amount: "9.0 Lac", assignee: "Admin" },
];
const queryData = [
  { appNo: "SBL-2026-004", business: "MNO Stores", branch: "Uttara", days: 5, amount: "22.0 Lac", queryBy: "Kamal H.", queryType: "Document Missing" },
];

const columns = [
  { key: "appNo", label: "Application No." },
  { key: "business", label: "Business" },
  { key: "branch", label: "Branch" },
  { key: "days", label: "Days", align: "right" as const },
  { key: "amount", label: "Amount", align: "right" as const },
  { key: "assignee", label: "Assignee" },
];

const queryColumns = [
  { key: "appNo", label: "Application No." },
  { key: "business", label: "Business" },
  { key: "branch", label: "Branch" },
  { key: "days", label: "Days", align: "right" as const },
  { key: "queryBy", label: "Raised By" },
  { key: "queryType", label: "Query Type" },
];

export default function WorkflowPage() {
  const [tab, setTab] = useState("crm");

  const getData = () => {
    switch (tab) {
      case "cib": return cibData;
      case "cad": return cadData;
      case "queries": return queryData;
      default: return crmData;
    }
  };

  const titles: Record<string, string> = {
    crm: "CRM Pending Review",
    cib: "CIB Pending Verification",
    cad: "CAD Pending Approval",
    queries: "Query Management",
  };

  return (
    <AppLayout>
      <PageHeader title="Workflow" subtitle={titles[tab]} />
      <TabNav tabs={workflowTabs} active={tab} onChange={setTab} />
      <div className="card-compact">
        {tab === "queries" ? (
          <PageTable columns={queryColumns} data={queryData} emptyMessage="No queries." />
        ) : (
          <PageTable columns={columns} data={tab === "cib" ? cibData : tab === "cad" ? cadData : crmData} emptyMessage="No pending items." />
        )}
      </div>
    </AppLayout>
  );
}
