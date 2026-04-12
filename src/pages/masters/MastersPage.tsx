import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { PageHeader, PageTable, StatusBadge, TabNav, FilterBar } from "@/components/common/PageComponents";
import { Button } from "@/components/ui/button";

const masterTabs = [
  { id: "branches", label: "Branches" },
  { id: "users", label: "Users" },
  { id: "roles", label: "Roles" },
  { id: "products", label: "Products" },
];

const branchesData = [
  { code: "BR-001", name: "Mirpur-2", zone: "Dhaka North", manager: "Zahir Uddin", status: "Active" },
  { code: "BR-002", name: "Dhanmondi", zone: "Dhaka South", manager: "Rina Akter", status: "Active" },
  { code: "BR-003", name: "Gulshan", zone: "Dhaka North", manager: "Kamal H.", status: "Active" },
  { code: "BR-004", name: "Uttara", zone: "Dhaka North", manager: "Sadia K.", status: "Inactive" },
  { code: "BR-005", name: "Banani", zone: "Dhaka North", manager: "Tariq R.", status: "Active" },
];
const usersData = [
  { empId: "EMP-001", name: "System Administrator", role: "Admin", branch: "Head Office", status: "Active" },
  { empId: "EMP-002", name: "Zahir Uddin", role: "CRM", branch: "Mirpur-2", status: "Active" },
  { empId: "EMP-003", name: "Rina Akter", role: "BM", branch: "Dhanmondi", status: "Active" },
  { empId: "EMP-004", name: "Kamal H.", role: "CIB", branch: "Gulshan", status: "Active" },
];
const rolesData = [
  { id: "R-01", name: "Admin", permissions: "Full Access", users: 1 },
  { id: "R-02", name: "RM", permissions: "Create, View", users: 12 },
  { id: "R-03", name: "BM", permissions: "Create, View, Approve", users: 8 },
  { id: "R-04", name: "CRM", permissions: "View, Approve, Query", users: 4 },
  { id: "R-05", name: "CIB", permissions: "View, Verify", users: 3 },
  { id: "R-06", name: "CAD", permissions: "View, Final Approve", users: 2 },
];
const productsData = [
  { code: "P-001", name: "Working Capital", category: "SBL", maxLimit: "1.00 Cr", status: "Active" },
  { code: "P-002", name: "Term Loan", category: "SBL", maxLimit: "2.00 Cr", status: "Active" },
  { code: "P-003", name: "Overdraft", category: "SBL", maxLimit: "50.00 Lac", status: "Active" },
];

export default function MastersPage() {
  const [tab, setTab] = useState("branches");

  return (
    <AppLayout>
      <PageHeader title="Masters" subtitle="Manage system master data">
        <Button size="sm">+ Add New</Button>
      </PageHeader>
      <TabNav tabs={masterTabs} active={tab} onChange={setTab} />
      <div className="card-compact">
        {tab === "branches" && (
          <PageTable columns={[
            { key: "code", label: "Code" }, { key: "name", label: "Branch Name" },
            { key: "zone", label: "Zone" }, { key: "manager", label: "Manager" },
            { key: "status", label: "Status", render: (r: any) => <StatusBadge variant={r.status === "Active" ? "success" : "outline"}>{r.status}</StatusBadge> },
          ]} data={branchesData} />
        )}
        {tab === "users" && (
          <PageTable columns={[
            { key: "empId", label: "Emp ID" }, { key: "name", label: "Name" },
            { key: "role", label: "Role" }, { key: "branch", label: "Branch" },
            { key: "status", label: "Status", render: (r: any) => <StatusBadge variant="success">{r.status}</StatusBadge> },
          ]} data={usersData} />
        )}
        {tab === "roles" && (
          <PageTable columns={[
            { key: "id", label: "ID" }, { key: "name", label: "Role Name" },
            { key: "permissions", label: "Permissions" },
            { key: "users", label: "Users", align: "right" },
          ]} data={rolesData} />
        )}
        {tab === "products" && (
          <PageTable columns={[
            { key: "code", label: "Code" }, { key: "name", label: "Product Name" },
            { key: "category", label: "Category" }, { key: "maxLimit", label: "Max Limit", align: "right" },
            { key: "status", label: "Status", render: (r: any) => <StatusBadge variant="success">{r.status}</StatusBadge> },
          ]} data={productsData} />
        )}
      </div>
    </AppLayout>
  );
}
