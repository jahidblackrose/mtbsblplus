import { useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import BasicAndIntermediate from "./sections/BasicAndIntermediate";
import AdvancedAndData from "./sections/AdvancedAndData";
import StructureAndSpecialized from "./sections/StructureAndSpecialized";

const sections = [
  { id: "basic", label: "1-2. Basic & Intermediate" },
  { id: "advanced", label: "3-4. Advanced & Data" },
  { id: "structure", label: "5-6. Structure & Specialized" },
];

export default function FormShowcase() {
  const [activeSection, setActiveSection] = useState("all");

  return (
    <AppLayout>
      <div className="space-y-4">
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-1.5">
          <button
            onClick={() => setActiveSection("all")}
            className={`rounded px-3 py-1.5 text-[12px] font-medium transition-colors ${
              activeSection === "all"
                ? "bg-primary text-primary-foreground"
                : "bg-background text-muted-foreground border border-input hover:bg-muted"
            }`}
          >
            All Components
          </button>
          {sections.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveSection(s.id)}
              className={`rounded px-3 py-1.5 text-[12px] font-medium transition-colors ${
                activeSection === s.id
                  ? "bg-primary text-primary-foreground"
                  : "bg-background text-muted-foreground border border-input hover:bg-muted"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Sections */}
        {(activeSection === "all" || activeSection === "basic") && <BasicAndIntermediate />}
        {(activeSection === "all" || activeSection === "advanced") && <AdvancedAndData />}
        {(activeSection === "all" || activeSection === "structure") && <StructureAndSpecialized />}
      </div>
    </AppLayout>
  );
}
