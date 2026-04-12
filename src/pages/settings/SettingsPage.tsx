import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { PageHeader, TabNav } from "@/components/common/PageComponents";
import { FormInput, FormSelect, FormTextarea } from "@/components/common/FormControls";
import { Button } from "@/components/ui/button";

const settingsTabs = [
  { id: "settings", label: "Settings" },
  { id: "profile", label: "Profile" },
];

export default function SettingsPage() {
  const [tab, setTab] = useState("settings");

  return (
    <AppLayout>
      <PageHeader title="Settings" subtitle="System and profile settings" />
      <TabNav tabs={settingsTabs} active={tab} onChange={setTab} />

      {tab === "settings" && (
        <div className="card-compact p-4 max-w-2xl">
          <h3 className="section-header mb-3">General Settings</h3>
          <div className="form-grid">
            <FormSelect label="Default Branch" name="defaultBranch" options={[
              { value: "mirpur", label: "Mirpur-2" }, { value: "dhanmondi", label: "Dhanmondi" },
              { value: "gulshan", label: "Gulshan" }, { value: "uttara", label: "Uttara" },
            ]} />
            <FormSelect label="Date Format" name="dateFormat" options={[
              { value: "yyyy-mm-dd", label: "YYYY-MM-DD" }, { value: "dd/mm/yyyy", label: "DD/MM/YYYY" },
            ]} />
            <FormSelect label="Currency" name="currency" options={[{ value: "bdt", label: "BDT (৳)" }]} />
            <FormInput label="Session Timeout (min)" name="sessionTimeout" type="number" defaultValue="30" />
          </div>
          <div className="mt-4">
            <Button size="sm">Save Settings</Button>
          </div>
        </div>
      )}

      {tab === "profile" && (
        <div className="card-compact p-4 max-w-2xl">
          <h3 className="section-header mb-3">User Profile</h3>
          <div className="form-grid">
            <FormInput label="Full Name" name="fullName" defaultValue="System Administrator" />
            <FormInput label="Employee ID" name="empId" defaultValue="EMP-001" disabled />
            <FormInput label="Email" name="email" type="email" defaultValue="admin@mtb.com" />
            <FormInput label="Mobile" name="mobile" defaultValue="+880 1700 000000" />
            <FormSelect label="Role" name="role" options={[{ value: "admin", label: "Admin" }]} />
            <FormInput label="Branch" name="branch" defaultValue="Head Office" disabled />
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm">Update Profile</Button>
            <Button size="sm" variant="outline">Change Password</Button>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
