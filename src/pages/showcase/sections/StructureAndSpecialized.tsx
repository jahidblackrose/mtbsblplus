import { useState } from "react";
import { FormInput, FormSelect, FormField, FormTextarea } from "@/components/common/FormControls";
import { ChevronDown, ChevronUp, Info, AlertTriangle, CheckCircle2 } from "lucide-react";

export default function StructureAndSpecialized() {
  const [accordion, setAccordion] = useState<string | null>("section1");
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-6">
      {/* Section 5: Form Structure */}
      <div className="card-compact">
        <div className="px-4 py-2.5 border-b border-border">
          <h2 className="section-header">5. Form Structure & Layout</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Fieldsets, accordion groups, inline forms, and step indicators</p>
        </div>
        <div className="p-4 space-y-4">
          {/* Fieldset */}
          <fieldset className="border border-border rounded-md p-3">
            <legend className="text-[12px] font-semibold text-foreground/80 px-1.5">Personal Information</legend>
            <div className="form-grid">
              <FormInput label="First Name" placeholder="John" required />
              <FormInput label="Last Name" placeholder="Doe" required />
              <FormInput label="Date of Birth" type="date" />
              <FormSelect
                label="Gender"
                name="gender"
                options={[
                  { value: "male", label: "Male" },
                  { value: "female", label: "Female" },
                  { value: "other", label: "Other" },
                ]}
              />
            </div>
          </fieldset>

          {/* Accordion Group */}
          <div className="border border-border rounded-md divide-y divide-border">
            {[
              { id: "section1", title: "Address Details", content: (
                <div className="form-grid">
                  <FormInput label="Street" placeholder="123 Main St" />
                  <FormInput label="City" placeholder="Dhaka" />
                  <FormInput label="Postal Code" placeholder="1200" />
                  <FormSelect label="Division" name="division" options={[
                    { value: "dhaka", label: "Dhaka" },
                    { value: "ctg", label: "Chittagong" },
                  ]} />
                </div>
              )},
              { id: "section2", title: "Employment Details", content: (
                <div className="form-grid">
                  <FormInput label="Company" placeholder="Acme Corp" />
                  <FormInput label="Designation" placeholder="Manager" />
                  <FormInput label="Monthly Income" type="number" placeholder="0" />
                  <FormInput label="Experience (Years)" type="number" placeholder="0" />
                </div>
              )},
              { id: "section3", title: "Bank Details", content: (
                <div className="form-grid">
                  <FormInput label="Account Number" placeholder="1234567890" />
                  <FormInput label="Branch" placeholder="Motijheel" />
                  <FormSelect label="Account Type" name="accType" options={[
                    { value: "savings", label: "Savings" },
                    { value: "current", label: "Current" },
                  ]} />
                </div>
              )},
            ].map((section) => (
              <div key={section.id}>
                <button
                  type="button"
                  onClick={() => setAccordion(accordion === section.id ? null : section.id)}
                  className="w-full flex items-center justify-between px-3 py-2.5 text-[13px] font-medium text-foreground hover:bg-muted/50 transition-colors"
                >
                  {section.title}
                  {accordion === section.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
                {accordion === section.id && (
                  <div className="px-3 pb-3">{section.content}</div>
                )}
              </div>
            ))}
          </div>

          {/* Inline Form */}
          <div>
            <p className="text-[12px] font-semibold text-foreground/80 mb-2">Inline Search Form</p>
            <div className="flex gap-2 items-end">
              <div className="flex-1">
                <FormInput label="Search" placeholder="Enter keyword..." />
              </div>
              <div className="w-[160px]">
                <FormSelect label="Category" name="cat" options={[
                  { value: "all", label: "All" },
                  { value: "pending", label: "Pending" },
                  { value: "approved", label: "Approved" },
                ]} />
              </div>
              <button type="button" className="h-[var(--control-h)] px-4 rounded bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 transition-colors mb-[2px]">
                Search
              </button>
            </div>
          </div>

          {/* Step Indicator */}
          <div>
            <p className="text-[12px] font-semibold text-foreground/80 mb-3">Multi-Step Indicator</p>
            <div className="flex items-center gap-1 mb-4">
              {["Personal", "Address", "Employment", "Review"].map((s, i) => (
                <div key={s} className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setStep(i + 1)}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors ${
                      step === i + 1
                        ? "bg-primary text-primary-foreground"
                        : step > i + 1
                        ? "bg-primary/15 text-primary"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <span className="w-4 h-4 rounded-full bg-current/20 flex items-center justify-center text-[10px]">
                      {step > i + 1 ? "✓" : i + 1}
                    </span>
                    {s}
                  </button>
                  {i < 3 && <div className={`w-6 h-px ${step > i + 1 ? "bg-primary" : "bg-border"}`} />}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Section 6: Specialized */}
      <div className="card-compact">
        <div className="px-4 py-2.5 border-b border-border">
          <h2 className="section-header">6. Specialized & Feedback Controls</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Validation states, alerts, loading states, and helper patterns</p>
        </div>
        <div className="p-4 space-y-4">
          {/* Validation States */}
          <div className="form-grid">
            <FormField label="Valid Input">
              <div className="relative">
                <input
                  value="john@example.com"
                  readOnly
                  className="h-[var(--control-h)] w-full rounded border border-green-500 bg-green-50/30 px-2 pr-7 text-[13px] text-foreground focus:outline-none"
                />
                <CheckCircle2 size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-green-600" />
              </div>
              <p className="text-[11px] text-green-600 mt-0.5">Looks good!</p>
            </FormField>

            <FormField label="Error Input">
              <div className="relative">
                <input
                  value="invalid-email"
                  readOnly
                  className="h-[var(--control-h)] w-full rounded border border-destructive bg-destructive/5 px-2 pr-7 text-[13px] text-foreground focus:outline-none"
                />
                <AlertTriangle size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-destructive" />
              </div>
              <p className="text-[11px] text-destructive mt-0.5">Please enter a valid email address</p>
            </FormField>

            <FormField label="Warning Input">
              <div className="relative">
                <input
                  value="weak-password"
                  readOnly
                  className="h-[var(--control-h)] w-full rounded border border-yellow-500 bg-yellow-50/30 px-2 pr-7 text-[13px] text-foreground focus:outline-none"
                />
                <AlertTriangle size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-yellow-600" />
              </div>
              <p className="text-[11px] text-yellow-600 mt-0.5">Password strength: Weak</p>
            </FormField>

            <FormField label="Info Hint Input">
              <div className="relative">
                <input
                  placeholder="NID number"
                  className="h-[var(--control-h)] w-full rounded border border-input bg-background px-2 pr-7 text-[13px] focus:outline-none focus:ring-1 focus:ring-ring"
                />
                <Info size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-blue-500" />
              </div>
              <p className="text-[11px] text-blue-600 mt-0.5">Enter your 10 or 17 digit NID number</p>
            </FormField>
          </div>

          {/* Alert Messages */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded border border-green-200 bg-green-50 text-[12px] text-green-800">
              <CheckCircle2 size={14} /> Form submitted successfully!
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded border border-destructive/20 bg-destructive/5 text-[12px] text-destructive">
              <AlertTriangle size={14} /> Please fix the errors above before submitting.
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded border border-yellow-200 bg-yellow-50 text-[12px] text-yellow-800">
              <AlertTriangle size={14} /> Some fields have warnings. Review before proceeding.
            </div>
            <div className="flex items-center gap-2 px-3 py-2 rounded border border-blue-200 bg-blue-50 text-[12px] text-blue-800">
              <Info size={14} /> All fields marked with * are mandatory.
            </div>
          </div>

          {/* Loading Button States */}
          <div>
            <p className="text-[12px] font-semibold text-foreground/80 mb-2">Button States</p>
            <div className="flex flex-wrap gap-2">
              <button className="h-[var(--control-h)] px-4 rounded bg-primary text-primary-foreground text-[13px] font-medium hover:bg-primary/90 transition-colors">
                Submit
              </button>
              <button className="h-[var(--control-h)] px-4 rounded border border-input bg-background text-foreground text-[13px] font-medium hover:bg-muted transition-colors">
                Cancel
              </button>
              <button disabled className="h-[var(--control-h)] px-4 rounded bg-primary/50 text-primary-foreground text-[13px] font-medium cursor-not-allowed flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-primary-foreground/40 border-t-primary-foreground rounded-full animate-spin" />
                Loading...
              </button>
              <button className="h-[var(--control-h)] px-4 rounded bg-destructive text-destructive-foreground text-[13px] font-medium hover:bg-destructive/90 transition-colors">
                Delete
              </button>
              <button className="h-[var(--control-h)] px-4 rounded bg-green-600 text-white text-[13px] font-medium hover:bg-green-700 transition-colors">
                Approve
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
