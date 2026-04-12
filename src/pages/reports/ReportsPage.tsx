import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { PageHeader, PageTable, StatusBadge, TabNav, FilterBar } from "@/components/common/PageComponents";

const reportTabs = [
  { id: "pending", label: "Pending" },
  { id: "outstanding", label: "Outstanding" },
  { id: "disbursement", label: "Disbursement" },
  { id: "tat", label: "TAT" },
];

const pendingData = [
  { appNo: "SBL-2026-001", business: "Khan Denim", stage: "CRM", branch: "Mirpur-2", days: 2, amount: "35.0" },
  { appNo: "SBL-2026-002", business: "ABC Trading", stage: "CIB", branch: "Dhanmondi", days: 3, amount: "18.0" },
  { appNo: "SBL-2026-004", business: "MNO Stores", stage: "Query", branch: "Uttara", days: 5, amount: "22.0" },
];
const outstandingData = [
  { appNo: "SBL-2026-010", business: "GreenTex", limit: "50.00", os: "42.50", branch: "Gulshan", expiry: "2027-03-31" },
  { appNo: "SBL-2026-011", business: "BlueTrade", limit: "25.00", os: "20.00", branch: "Banani", expiry: "2026-12-31" },
];
const disbursementData = [
  { appNo: "SBL-2026-005", business: "PQR Fashion", amount: "9.00", date: "2026-04-05", branch: "Mohammadpur", method: "BEFTN" },
  { appNo: "SBL-2026-008", business: "Sunrise Pvt.", amount: "12.00", date: "2026-04-07", branch: "Banani", method: "Cheque" },
];
const tatData = [
  { stage: "RM to BM", targetDays: 2, avgDays: 1.8, status: "Within" },
  { stage: "BM to CRM", targetDays: 3, avgDays: 3.2, status: "Beyond" },
  { stage: "CRM to CIB", targetDays: 2, avgDays: 1.5, status: "Within" },
  { stage: "CIB to CAD", targetDays: 3, avgDays: 2.9, status: "Within" },
  { stage: "CAD Approval", targetDays: 2, avgDays: 4.1, status: "Beyond" },
];

export default function ReportsPage() {
  const [tab, setTab] = useState("pending");

  return (
    <AppLayout>
      <PageHeader title="Reports" subtitle="Analytics and operational reports" />
      <TabNav tabs={reportTabs} active={tab} onChange={setTab} />
      <div className="card-compact">
        {tab === "pending" && (
          <PageTable columns={[
            { key: "appNo", label: "App No." }, { key: "business", label: "Business" },
            { key: "stage", label: "Stage", render: (r: any) => <StatusBadge>{r.stage}</StatusBadge> },
            { key: "branch", label: "Branch" }, { key: "days", label: "Days", align: "right" },
            { key: "amount", label: "Amount (Lac)", align: "right" },
          ]} data={pendingData} />
        )}
        {tab === "outstanding" && (
          <PageTable columns={[
            { key: "appNo", label: "App No." }, { key: "business", label: "Business" },
            { key: "limit", label: "Limit", align: "right" }, { key: "os", label: "O/S", align: "right" },
            { key: "branch", label: "Branch" }, { key: "expiry", label: "Expiry" },
          ]} data={outstandingData} />
        )}
        {tab === "disbursement" && (
          <PageTable columns={[
            { key: "appNo", label: "App No." }, { key: "business", label: "Business" },
            { key: "amount", label: "Amount (Lac)", align: "right" }, { key: "date", label: "Date" },
            { key: "branch", label: "Branch" }, { key: "method", label: "Method" },
          ]} data={disbursementData} />
        )}
        {tab === "tat" && (
          <PageTable columns={[
            { key: "stage", label: "Stage" },
            { key: "targetDays", label: "Target (Days)", align: "right" },
            { key: "avgDays", label: "Avg. (Days)", align: "right" },
            { key: "status", label: "Status", render: (r: any) => <StatusBadge variant={r.status === "Within" ? "success" : "warning"}>{r.status}</StatusBadge> },
          ]} data={tatData} />
        )}
      </div>
    </AppLayout>
  );
}
