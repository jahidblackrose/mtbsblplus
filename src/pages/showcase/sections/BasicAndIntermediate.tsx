import { useState } from "react";
import { FormInput, FormSelect, FormTextarea, FormField } from "@/components/common/FormControls";

export default function BasicAndIntermediate() {
  const [checked, setChecked] = useState(false);
  const [radio, setRadio] = useState("option1");
  const [toggle, setToggle] = useState(false);
  const [range, setRange] = useState(50);
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [color, setColor] = useState("#2B5797");
  const [file, setFile] = useState<File | null>(null);

  return (
    <div className="space-y-6">
      {/* Section 1: Basic Inputs */}
      <div className="card-compact">
        <div className="px-4 py-2.5 border-b border-border">
          <h2 className="section-header">1. Basic Input Controls</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Standard form inputs — text, number, email, password, and more</p>
        </div>
        <div className="p-4 form-grid">
          <FormInput label="Text Input" placeholder="Enter text..." />
          <FormInput label="Email" type="email" placeholder="user@example.com" required />
          <FormInput label="Password" type="password" placeholder="••••••••" required />
          <FormInput label="Number" type="number" placeholder="0" />
          <FormInput label="Phone" type="tel" placeholder="+880-1XXX-XXXXXX" />
          <FormInput label="URL" type="url" placeholder="https://example.com" />
          <FormInput label="Disabled Input" disabled value="Cannot edit this" />
          <FormInput label="Read-only Input" readOnly value="Read-only value" />
          <FormTextarea label="Textarea" placeholder="Enter description..." />
          <FormInput label="Search" type="search" placeholder="Search..." />
        </div>
      </div>

      {/* Section 2: Selection & Toggle Controls */}
      <div className="card-compact">
        <div className="px-4 py-2.5 border-b border-border">
          <h2 className="section-header">2. Selection & Toggle Controls</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Checkboxes, radios, switches, selects, and range inputs</p>
        </div>
        <div className="p-4 form-grid">
          <FormSelect
            label="Select Dropdown"
            name="demo-select"
            required
            options={[
              { value: "dhaka", label: "Dhaka" },
              { value: "ctg", label: "Chittagong" },
              { value: "sylhet", label: "Sylhet" },
              { value: "rajshahi", label: "Rajshahi" },
            ]}
          />

          <FormField label="Checkbox">
            <label className="flex items-center gap-2 cursor-pointer text-[13px]">
              <input
                type="checkbox"
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                className="h-4 w-4 rounded border-input accent-primary"
              />
              Accept terms and conditions
            </label>
          </FormField>

          <FormField label="Radio Group">
            <div className="flex gap-4">
              {["option1", "option2", "option3"].map((opt) => (
                <label key={opt} className="flex items-center gap-1.5 cursor-pointer text-[13px]">
                  <input
                    type="radio"
                    name="demo-radio"
                    value={opt}
                    checked={radio === opt}
                    onChange={(e) => setRadio(e.target.value)}
                    className="h-4 w-4 accent-primary"
                  />
                  {opt.replace("option", "Option ")}
                </label>
              ))}
            </div>
          </FormField>

          <FormField label="Toggle Switch">
            <button
              type="button"
              onClick={() => setToggle(!toggle)}
              className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${toggle ? "bg-primary" : "bg-muted-foreground/30"}`}
            >
              <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${toggle ? "translate-x-[18px]" : "translate-x-[3px]"}`} />
            </button>
            <span className="text-[12px] text-muted-foreground ml-2">{toggle ? "On" : "Off"}</span>
          </FormField>

          <FormField label={`Range Slider (${range})`}>
            <input
              type="range"
              min={0}
              max={100}
              value={range}
              onChange={(e) => setRange(+e.target.value)}
              className="w-full accent-primary h-1.5"
            />
          </FormField>

          <FormInput label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          <FormInput label="Time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />

          <FormField label="Color Picker">
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="h-[var(--control-h)] w-10 rounded border border-input cursor-pointer"
              />
              <span className="text-[13px] text-muted-foreground">{color}</span>
            </div>
          </FormField>

          <FormField label="File Upload">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-[13px] text-muted-foreground file:mr-2 file:py-1 file:px-3 file:rounded file:border-0 file:text-[12px] file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
            />
            {file && <span className="text-[11px] text-muted-foreground">Selected: {file.name}</span>}
          </FormField>
        </div>
      </div>
    </div>
  );
}
