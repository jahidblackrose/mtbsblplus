import { useState } from "react";
import { FormInput, FormSelect, FormField } from "@/components/common/FormControls";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Search } from "lucide-react";

const sampleTags = ["React", "TypeScript", "Tailwind"];

export default function AdvancedAndData() {
  const [tags, setTags] = useState<string[]>(sampleTags);
  const [tagInput, setTagInput] = useState("");
  const [multiSelect, setMultiSelect] = useState<string[]>(["dhaka"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [rating, setRating] = useState(3);

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => setTags(tags.filter((t) => t !== tag));

  const toggleMulti = (val: string) => {
    setMultiSelect((prev) =>
      prev.includes(val) ? prev.filter((v) => v !== val) : [...prev, val]
    );
  };

  const cities = ["dhaka", "chittagong", "sylhet", "rajshahi", "khulna", "barisal"];
  const filtered = cities.filter((c) => c.includes(searchQuery.toLowerCase()));

  return (
    <div className="space-y-6">
      {/* Section 3: Advanced Inputs */}
      <div className="card-compact">
        <div className="px-4 py-2.5 border-b border-border">
          <h2 className="section-header">3. Advanced Interactive Controls</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Tag inputs, multi-select, star ratings, and searchable selects</p>
        </div>
        <div className="p-4 form-grid">
          {/* Tag Input */}
          <FormField label="Tag Input" className="col-span-2">
            <div className="flex flex-wrap gap-1.5 p-1.5 border border-input rounded bg-background min-h-[var(--control-h)]">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="gap-1 text-[11px] h-6">
                  {tag}
                  <X size={10} className="cursor-pointer hover:text-destructive" onClick={() => removeTag(tag)} />
                </Badge>
              ))}
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                placeholder="Type and press Enter..."
                className="flex-1 min-w-[100px] bg-transparent text-[13px] outline-none px-1"
              />
            </div>
          </FormField>

          {/* Multi-select checkboxes */}
          <FormField label="Multi-Select (Checkbox)" className="col-span-2">
            <div className="flex flex-wrap gap-2">
              {cities.map((city) => (
                <label
                  key={city}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[12px] font-medium cursor-pointer transition-colors ${
                    multiSelect.includes(city)
                      ? "bg-primary/10 border-primary text-primary"
                      : "border-input text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={multiSelect.includes(city)}
                    onChange={() => toggleMulti(city)}
                    className="sr-only"
                  />
                  {city.charAt(0).toUpperCase() + city.slice(1)}
                </label>
              ))}
            </div>
          </FormField>

          {/* Star Rating */}
          <FormField label={`Star Rating (${rating}/5)`}>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className={`text-lg transition-colors ${star <= rating ? "text-yellow-500" : "text-muted-foreground/30"}`}
                >
                  ★
                </button>
              ))}
            </div>
          </FormField>

          {/* Searchable Select */}
          <FormField label="Searchable Select">
            <div className="relative">
              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search city..."
                className="h-[var(--control-h)] w-full rounded border border-input bg-background pl-7 pr-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            {searchQuery && (
              <div className="mt-1 border border-input rounded bg-background shadow-sm max-h-[120px] overflow-y-auto">
                {filtered.length ? filtered.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSearchQuery(c.charAt(0).toUpperCase() + c.slice(1))}
                    className="w-full text-left px-2.5 py-1.5 text-[12px] hover:bg-muted transition-colors"
                  >
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </button>
                )) : (
                  <p className="px-2.5 py-1.5 text-[12px] text-muted-foreground">No results</p>
                )}
              </div>
            )}
          </FormField>
        </div>
      </div>

      {/* Section 4: Data Display Inputs */}
      <div className="card-compact">
        <div className="px-4 py-2.5 border-b border-border">
          <h2 className="section-header">4. Data Display & Formatted Inputs</h2>
          <p className="text-[12px] text-muted-foreground mt-0.5">Currency, percentage, prefixed/suffixed, and masked inputs</p>
        </div>
        <div className="p-4 form-grid">
          {/* Currency Input */}
          <FormField label="Currency (BDT)">
            <div className="relative">
              <span className="absolute left-2 top-1/2 -translate-y-1/2 text-[12px] font-medium text-muted-foreground">৳</span>
              <input
                type="number"
                placeholder="0.00"
                className="h-[var(--control-h)] w-full rounded border border-input bg-background pl-6 pr-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </FormField>

          {/* Percentage */}
          <FormField label="Percentage">
            <div className="relative">
              <input
                type="number"
                placeholder="0"
                min={0}
                max={100}
                className="h-[var(--control-h)] w-full rounded border border-input bg-background px-2 pr-7 text-[13px] focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[12px] font-medium text-muted-foreground">%</span>
            </div>
          </FormField>

          {/* Prefixed Input */}
          <FormField label="Website URL">
            <div className="flex">
              <span className="inline-flex items-center px-2 rounded-l border border-r-0 border-input bg-muted text-[12px] text-muted-foreground">https://</span>
              <input
                placeholder="example.com"
                className="h-[var(--control-h)] flex-1 rounded-r border border-input bg-background px-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </FormField>

          {/* Input with icon */}
          <FormField label="Input with Icon">
            <div className="relative">
              <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                placeholder="Search..."
                className="h-[var(--control-h)] w-full rounded border border-input bg-background pl-7 pr-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
          </FormField>

          {/* Input with button */}
          <FormField label="Input with Action">
            <div className="flex">
              <input
                placeholder="Enter value..."
                className="h-[var(--control-h)] flex-1 rounded-l border border-r-0 border-input bg-background px-2 text-[13px] focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <button type="button" className="h-[var(--control-h)] px-3 rounded-r bg-primary text-primary-foreground text-[12px] font-medium hover:bg-primary/90 transition-colors">
                <Plus size={14} />
              </button>
            </div>
          </FormField>

          {/* Readonly formatted */}
          <FormField label="Formatted Display">
            <div className="h-[var(--control-h)] flex items-center px-2 rounded border border-input bg-muted text-[13px] font-mono text-foreground">
              BDT 1,25,00,000.00
            </div>
          </FormField>
        </div>
      </div>
    </div>
  );
}
