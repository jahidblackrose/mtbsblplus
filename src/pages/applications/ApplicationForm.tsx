import React, { useState, useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import AppLayout from "@/components/layout/AppLayout";
import { FormInput, FormSelect, FormTextarea } from "@/components/common/FormControls";
import { SearchableSelect } from "@/components/common/SearchableSelect";
import { DataTable, Td } from "@/components/common/DataTable";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, Loader2, ShieldCheck } from "lucide-react";

/* ─── Types ─── */
interface LoanExposure {
  businessName: string; fiName: string; nature: string;
  existingLimit: string; existingOs: string; existingPricing: string; existingExpiry: string;
  insSize: string; dueEmi: string; paidEmi: string; overdue: string;
  proposedLimit: string; proposedPricing: string; proposedExpiry: string; proposedPurpose: string;
}
interface BankTransactionRecord {
  bankName: string; accountName: string; accountType: string; sanctionedLimit: string;
  fromDate: string; toDate: string; cto: string; maxBalance: string; minBalance: string;
}
interface PreviousLoanClosingRecord {
  fiName: string; accountName: string; facilityType: string;
  initialSanctionDate: string; initialSanctionLimit: string;
  lastSanctionDate: string; lastSanctionLimit: string;
  closingDate: string; closingType: string;
}
interface KeyPersonInformation {
  name: string; designationInBusiness: string; nidNo: string; potentialSuccessorName: string;
  contactNumber: string; relationshipWithSuccessor: string; relevantBusinessExperienceYears: string;
  residenceStatus: string; maritalStatus: string; doingCurrentForYears: string;
  dateOfBirth: string; otherSourceOfIncome: string; taxCertificateTinNo: string;
  dependentFamilyMembers: string; pepDescription: string; presentAddress: string; permanentAddress: string;
}
interface OwnerInformation {
  name: string; designation: string; age: string; residentialAddress: string; permanentAddress: string;
  sharePercentage: string; nidNo: string; mobileNumber: string; pnwM: string;
  maritalStatus: string; relationshipWithKeyPerson: string; educationLevel: string; directorInBankNbfipep: string;
}
interface PremiseOwnershipRecord {
  premiseType: string; address: string; areaSft: string;
  ownershipStatus: string; supportingDocuments: string; deedValidity: string;
}
interface OtherBusinessInformation {
  existingManpowerMale: string; existingManpowerFemale: string; totalSalesPercentage: string;
  wholesalePercentage: string; retailPercentage: string; servicePercentage: string;
  lastTradeLicenseNo: string; lastTradeLicenseValidity: string; salesKeeping: string;
}
interface BankFinanceRequirementRow { item: string; currentYear: string; projectedYear: string; }
interface SisterAlliedConcernRecord {
  concernName: string; businessNature: string; legalForm: string; sharePercentage: string;
  businessSince: string; totalInvestment: string; bankLiability: string;
  equity: string; turnover: string; profit: string;
}
interface AmlCftDeclarationRow { serialNo: number; declaration: string; status: "yes" | "no" | "na"; remarks: string; }
interface PersonalGuarantor {
  name: string; nid: string; dob: string; districtOfBirth: string; gender: string;
  relationshipWithKeyBorrower: string; profession: string; residenceStatus: string;
  businessName: string; pnwMil: string; fundedLoanLimit: string;
  fatherName: string; motherName: string; spouseName: string; mobileNo: string;
  presentAddress: string; presentDistrict: string; presentPostCode: string;
  permanentAddress: string; permanentDistrict: string; permanentPostCode: string;
  cibCode: string; cibInquiryDate: string; cibExpiryDate: string; cibStatus: string;
}

/* ─── Static data ─── */
type TabId = "summary" | "documents" | "history" | "bank" | "previous-close-loan" | "key-person-information" | "owner-information" | "premise-ownership" | "other-business-information" | "bank-finance-requirement" | "sister-allied-concern" | "aml-cft-declaration" | "personal-guarantors";

const tabs: { id: TabId; label: string; subtitle: string }[] = [
  { id: "summary", label: "Summary", subtitle: "Capture core application summary details." },
  { id: "documents", label: "Proposed Facility", subtitle: "Capture proposed facility details for this application." },
  { id: "history", label: "Loan Exposure", subtitle: "Capture existing and proposed exposure for this obligor and related parties." },
  { id: "bank", label: "Record Of Bank Transaction", subtitle: "Capture bank account behavior across financial institutions." },
  { id: "previous-close-loan", label: "Previous Close Loan", subtitle: "Previous loan closing history (BDT in M)." },
  { id: "key-person-information", label: "Key Person's Information", subtitle: "Most values can come from API, but users can update them." },
  { id: "owner-information", label: "Owner's Information", subtitle: "Single owner information section." },
  { id: "premise-ownership", label: "Premise Ownership", subtitle: "One-to-many entry for premise ownership details." },
  { id: "other-business-information", label: "Other Business Information", subtitle: "Single entry section." },
  { id: "bank-finance-requirement", label: "Bank Finance Requirement For W/C", subtitle: "Update Current Yr. and Proj. Yr. values." },
  { id: "sister-allied-concern", label: "Particulars Of Sister/Allied Concern", subtitle: "One-to-many section." },
  { id: "aml-cft-declaration", label: "AML/CFT Declaration/Check List", subtitle: "Status: Yes / No / N/A. Remarks editable." },
  { id: "personal-guarantors", label: "Personal Guarantor(s)", subtitle: "Add one or more personal guarantors with CIB info (one-to-many)." },
];

const bangladeshBanks = [
  "AB Bank Limited", "Agrani Bank Limited", "Al-Arafah Islami Bank Limited", "Bank Asia Limited",
  "BRAC Bank Limited", "City Bank Limited", "Dhaka Bank Limited", "Dutch-Bangla Bank Limited",
  "Eastern Bank Limited", "First Security Islami Bank Limited", "Islami Bank Bangladesh Limited",
  "Jamuna Bank Limited", "Mercantile Bank Limited", "Mutual Trust Bank Limited", "National Bank Limited",
  "One Bank Limited", "Prime Bank Limited", "Pubali Bank Limited", "Standard Chartered Bank",
  "Trust Bank Limited", "United Commercial Bank Limited", "Uttara Bank Limited",
].map((b) => ({ value: b, label: b }));

const emptyExposure: LoanExposure = { businessName: "", fiName: "", nature: "", existingLimit: "", existingOs: "", existingPricing: "", existingExpiry: "", insSize: "", dueEmi: "", paidEmi: "", overdue: "", proposedLimit: "", proposedPricing: "", proposedExpiry: "", proposedPurpose: "" };
const emptyBankRecord: BankTransactionRecord = { bankName: "", accountName: "", accountType: "", sanctionedLimit: "", fromDate: "", toDate: "", cto: "", maxBalance: "", minBalance: "" };
const emptyPrevLoan: PreviousLoanClosingRecord = { fiName: "", accountName: "", facilityType: "", initialSanctionDate: "", initialSanctionLimit: "", lastSanctionDate: "", lastSanctionLimit: "", closingDate: "", closingType: "" };
const emptyPremise: PremiseOwnershipRecord = { premiseType: "", address: "", areaSft: "", ownershipStatus: "", supportingDocuments: "", deedValidity: "" };
const emptySister: SisterAlliedConcernRecord = { concernName: "", businessNature: "", legalForm: "", sharePercentage: "", businessSince: "", totalInvestment: "", bankLiability: "", equity: "", turnover: "", profit: "" };
const emptyGuarantor: PersonalGuarantor = {
  name: "", nid: "", dob: "", districtOfBirth: "", gender: "", relationshipWithKeyBorrower: "",
  profession: "", residenceStatus: "", businessName: "", pnwMil: "", fundedLoanLimit: "",
  fatherName: "", motherName: "", spouseName: "", mobileNo: "",
  presentAddress: "", presentDistrict: "", presentPostCode: "",
  permanentAddress: "", permanentDistrict: "", permanentPostCode: "",
  cibCode: "", cibInquiryDate: "", cibExpiryDate: "", cibStatus: "",
};

const bdDistricts = [
  "Bagerhat","Bandarban","Barguna","Barisal","Bhola","Bogra","Brahmanbaria","Chandpur","Chapainawabganj","Chittagong",
  "Chuadanga","Comilla","Cox's Bazar","Dhaka","Dinajpur","Faridpur","Feni","Gaibandha","Gazipur","Gopalganj",
  "Habiganj","Jamalpur","Jessore","Jhalokati","Jhenaidah","Joypurhat","Khagrachhari","Khulna","Kishoreganj","Kurigram",
  "Kushtia","Lakshmipur","Lalmonirhat","Madaripur","Magura","Manikganj","Meherpur","Moulvibazar","Munshiganj","Mymensingh",
  "Naogaon","Narail","Narayanganj","Narsingdi","Natore","Netrokona","Nilphamari","Noakhali","Pabna","Panchagarh",
  "Patuakhali","Pirojpur","Rajbari","Rajshahi","Rangamati","Rangpur","Satkhira","Shariatpur","Sherpur","Sirajganj",
  "Sunamganj","Sylhet","Tangail","Thakurgaon",
].map((d) => ({ value: d, label: d }));

/* ─── Helpers ─── */
const SectionDivider = ({ title }: { title: string }) => (
  <div className="col-span-full mt-1">
    <p className="text-[length:var(--font-size-xs)] font-semibold uppercase tracking-wider text-muted-foreground">{title}</p>
  </div>
);

const AddButton = ({ onClick, label }: { onClick: () => void; label: string }) => (
  <div className="flex justify-end mt-3">
    <Button type="button" variant="outline" size="sm" onClick={onClick}>{label}</Button>
  </div>
);

/* ─── Component ─── */
const ApplicationForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id?: string }>();
  const isEditMode = !!id;

  const [step, setStep] = useState<"input" | "confirm">(isEditMode ? "confirm" : "input");
  const [cif, setCif] = useState("");
  const [companyData, setCompanyData] = useState<{ cif: string; name: string; address: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isVerified, setIsVerified] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("summary");

  // Tab states
  const [currentExposure, setCurrentExposure] = useState<LoanExposure>({ ...emptyExposure });
  const [exposures, setExposures] = useState<LoanExposure[]>([]);
  const [currentBankRecord, setCurrentBankRecord] = useState<BankTransactionRecord>({ ...emptyBankRecord });
  const [bankRecords, setBankRecords] = useState<BankTransactionRecord[]>([]);
  const [currentPrevLoan, setCurrentPrevLoan] = useState<PreviousLoanClosingRecord>({ ...emptyPrevLoan });
  const [prevLoans, setPrevLoans] = useState<PreviousLoanClosingRecord[]>([]);
  const [keyPerson, setKeyPerson] = useState<KeyPersonInformation>({
    name: "MD. RAYHAN KHAN", designationInBusiness: "PROPRIETOR", nidNo: "19892694807821943",
    potentialSuccessorName: "JAFRIN AKTER EMA", contactNumber: "01974286863",
    relationshipWithSuccessor: "SPOUSE", relevantBusinessExperienceYears: "7 YEARS",
    residenceStatus: "PERMANENT", maritalStatus: "MARRIED", doingCurrentForYears: "7",
    dateOfBirth: "1989-11-06", otherSourceOfIncome: "N/A", taxCertificateTinNo: "158798145953",
    dependentFamilyMembers: "3", pepDescription: "N/A",
    presentAddress: "HOUSE#3, ROAD#4, RUPNAGAR R/A, MIRPUR, DHAKA",
    permanentAddress: "DHANPATI KHOLA, MURADNAGAR, CUMILLA.",
  });
  const [owner, setOwner] = useState<OwnerInformation>({
    name: "", designation: "", age: "", residentialAddress: "", permanentAddress: "",
    sharePercentage: "", nidNo: "", mobileNumber: "", pnwM: "", maritalStatus: "",
    relationshipWithKeyPerson: "", educationLevel: "", directorInBankNbfipep: "",
  });
  const [currentPremise, setCurrentPremise] = useState<PremiseOwnershipRecord>({ ...emptyPremise });
  const [premises, setPremises] = useState<PremiseOwnershipRecord[]>([]);
  const [otherBiz, setOtherBiz] = useState<OtherBusinessInformation>({
    existingManpowerMale: "4", existingManpowerFemale: "N/A", totalSalesPercentage: "",
    wholesalePercentage: "80", retailPercentage: "20", servicePercentage: "N/A",
    lastTradeLicenseNo: "TRAD/DNCC/040632/2022", lastTradeLicenseValidity: "2026-06-30", salesKeeping: "Kacha Khata",
  });
  const [bankFinance, setBankFinance] = useState<BankFinanceRequirementRow[]>([
    { item: "(+) Average Inventory Holding (Value of Inventory)", currentYear: "4.30", projectedYear: "4.73" },
    { item: "(+) Average Receivable Holding (Value of A/C Recv.)", currentYear: "4.60", projectedYear: "5.06" },
    { item: "(+) Average Advance Payment to Suppliers, if any", currentYear: "", projectedYear: "" },
    { item: "(-) Average Payable Amount (Value of A/C Payable)", currentYear: "0.39", projectedYear: "0.43" },
    { item: "Total W/C Requirement", currentYear: "8.51", projectedYear: "9.36" },
    { item: "Existing Working Capital Loan in all FIs (Limit for Continuous + O/S only for TL/DL)", currentYear: "0.00", projectedYear: "0.00" },
    { item: "Scope for Additional Working Capital Loan", currentYear: "", projectedYear: "6.55" },
    { item: "Proposed TL as W/C", currentYear: "", projectedYear: "4.00" },
    { item: "Debt : Equity", currentYear: "", projectedYear: "1:0.42" },
  ]);
  const [currentSister, setCurrentSister] = useState<SisterAlliedConcernRecord>({ ...emptySister });
  const [sisters, setSisters] = useState<SisterAlliedConcernRecord[]>([]);
  const [currentGuarantor, setCurrentGuarantor] = useState<PersonalGuarantor>({ ...emptyGuarantor });
  const [guarantors, setGuarantors] = useState<PersonalGuarantor[]>([]);
  const [editingGuarantorIndex, setEditingGuarantorIndex] = useState<number | null>(null);
  const [guarantorVerifyStatus, setGuarantorVerifyStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [guarantorVerifyMessage, setGuarantorVerifyMessage] = useState<string>("");
  const [amlCft, setAmlCft] = useState<AmlCftDeclarationRow[]>([
    { serialNo: 1, declaration: "CDD has been completed during account opening of the customer", status: "yes", remarks: "" },
    { serialNo: 2, declaration: "All necessary documents in establishing the clients legitimacy have been obtained", status: "yes", remarks: "" },
    { serialNo: 3, declaration: "Borrowing capacity of the borrower has been validated", status: "yes", remarks: "" },
    { serialNo: 4, declaration: "Credit facilities have been utilized for the purpose stated as per sanction letter", status: "yes", remarks: "" },
    { serialNo: 5, declaration: "Genuineness, reliability, correlation with Borrower and Supplier/importer have been checked", status: "yes", remarks: "" },
    { serialNo: 6, declaration: "Before export or import competitive price has been justified", status: "na", remarks: "" },
    { serialNo: 7, declaration: "History of ML/TF predicate offences has been checked", status: "yes", remarks: "" },
    { serialNo: 8, declaration: "No adverse news about the Customer", status: "yes", remarks: "" },
    { serialNo: 9, declaration: "Guidelines / policies related to AML&CFT have been complied", status: "yes", remarks: "" },
  ]);

  const currentTabIndex = tabs.findIndex((t) => t.id === activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === tabs.length - 1;
  const tabConfig = tabs[currentTabIndex < 0 ? 0 : currentTabIndex];
  const today = new Date().toISOString().slice(0, 10);

  const handleVerify = async () => {
    if (!cif.trim()) { setError("Please enter Company CIF"); toast.warning("Please enter Company CIF"); return; }
    setLoading(true); setError(""); setIsVerified(false); setCompanyData(null);
    toast.loading("Verifying CIF...", { id: "cif-verify" });
    // Demo fallback
    setTimeout(() => {
      setCompanyData({ cif, name: "Demo Company Name", address: "Demo Company Address, Dhaka" });
      setIsVerified(true);
      setLoading(false);
      toast.success("CIF verified successfully", { id: "cif-verify" });
    }, 600);
  };

  const goToDetails = () => {
    if (!companyData || !isVerified) { setError("Please verify CIF before proceeding."); toast.error("Please verify CIF before proceeding."); return; }
    setStep("confirm");
    toast.success("Application SBL001 created successfully!", { description: "You can now fill in the application details." });
  };

  const handleProceed = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isLastTab) {
      const next = tabs[currentTabIndex + 1];
      if (next) {
        setActiveTab(next.id);
        toast.success(`Saved — Moving to ${next.label}`);
      }
    } else {
      toast.success("Application submitted successfully!", { description: "SBL001 has been submitted for review." });
    }
  };

  const handleBack = () => {
    if (!isFirstTab) {
      const prev = tabs[currentTabIndex - 1];
      if (prev) setActiveTab(prev.id);
      return;
    }
    setStep("input"); setCif(""); setCompanyData(null); setIsVerified(false); setActiveTab("summary"); setError("");
  };

  // Generic updaters
  const updateExposure = (f: keyof LoanExposure, v: string) => setCurrentExposure((p) => ({ ...p, [f]: v }));
  const updateBankRec = (f: keyof BankTransactionRecord, v: string) => setCurrentBankRecord((p) => ({ ...p, [f]: v }));
  const updatePrevLoan = (f: keyof PreviousLoanClosingRecord, v: string) => setCurrentPrevLoan((p) => ({ ...p, [f]: v }));
  const updateKeyPerson = (f: keyof KeyPersonInformation, v: string) => setKeyPerson((p) => ({ ...p, [f]: v }));
  const updateOwner = (f: keyof OwnerInformation, v: string) => setOwner((p) => ({ ...p, [f]: v }));
  const updatePremise = (f: keyof PremiseOwnershipRecord, v: string) => setCurrentPremise((p) => ({ ...p, [f]: v }));
  const updateOtherBiz = (f: keyof OtherBusinessInformation, v: string) => setOtherBiz((p) => ({ ...p, [f]: v }));
  const updateSister = (f: keyof SisterAlliedConcernRecord, v: string) => setCurrentSister((p) => ({ ...p, [f]: v }));
  const updateGuarantor = (f: keyof PersonalGuarantor, v: string) => setCurrentGuarantor((p) => ({ ...p, [f]: v }));

  return (
    <AppLayout>
      <div>
          {/* Step 1: CIF */}
          {step === "input" && !isEditMode && (
            <div className="space-y-4">
              <div>
                <h1 className="text-[length:var(--font-size-xl)] font-bold text-foreground">New Application</h1>
                <p className="text-[length:var(--font-size-sm)] text-muted-foreground mt-0.5">Enter CIF, verify customer details, then proceed.</p>
              </div>
              <div className="card-compact p-4">
                <h2 className="section-header mb-3">Company Identification Number</h2>
                <div className="form-grid">
                  <FormInput label="CIF" value={cif} onChange={(e) => { setCif(e.target.value); setError(""); setIsVerified(false); setCompanyData(null); }} placeholder="Enter CIF" disabled={loading} />
                </div>
                <div className="mt-3 flex items-center gap-3">
                  <Button type="button" variant="outline" size="sm" onClick={handleVerify} disabled={loading || !cif.trim()}>
                    {loading ? "Verifying..." : "Verify"}
                  </Button>
                  <Button type="button" size="sm" onClick={goToDetails} disabled={!isVerified || !companyData}>Proceed</Button>
                </div>
                {companyData && (
                  <div className="form-grid mt-4">
                    <FormInput label="Company Name" value={companyData.name} disabled helperText="Fetched from master data" />
                    <FormInput label="Company Address" value={companyData.address} disabled helperText="Fetched from master data" />
                  </div>
                )}
                {error && <p className="mt-3 text-[length:var(--font-size-sm)] text-destructive">{error}</p>}
              </div>
            </div>
          )}

          {/* Step 2: Tabs */}
          {step === "confirm" && companyData && (
            <div className="space-y-3">
              {/* Stepper header */}
              <div className="card-compact">
                <div className="px-4 py-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <div className="shrink-0 sm:w-52 min-w-0 flex items-center gap-2">
                    <div className="min-w-0">
                      <h2 className="text-[length:var(--font-size-md)] font-semibold text-foreground truncate">
                        {(currentTabIndex < 0 ? 0 : currentTabIndex) + 1}. {tabConfig.label}
                      </h2>
                      <p className="text-[length:var(--font-size-xs)] text-muted-foreground mt-0.5 truncate">{tabConfig.subtitle}</p>
                    </div>
                    <div className="shrink-0 flex items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-lg px-2.5 py-1.5 sm:hidden">
                      <span className="text-[11px] font-semibold text-primary">App. Id. -</span>
                      <span className="text-[12px] font-bold text-foreground">SBL001</span>
                    </div>
                  </div>
                  <div className="flex-1 flex sm:justify-center">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {tabs.map((tab, i) => (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setActiveTab(tab.id)}
                          title={tab.label}
                          className={`flex h-6 w-6 items-center justify-center rounded-full text-[length:var(--font-size-xs)] font-semibold transition shrink-0 ${
                            activeTab === tab.id
                              ? "bg-primary text-primary-foreground"
                              : i < currentTabIndex
                              ? "bg-primary/20 text-primary"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {i + 1}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="hidden sm:flex shrink-0 items-center gap-1.5 bg-primary/10 border border-primary/20 rounded-lg px-2.5 py-1.5">
                    <span className="text-[11px] font-semibold text-primary">App. Id. -</span>
                    <span className="text-[12px] font-bold text-foreground">SBL001</span>
                  </div>
                </div>
              </div>

              {/* Tab body */}
              <form onSubmit={handleProceed}>
                <div className="card-compact p-4">
                  {/* Tab 1: Summary */}
                  {activeTab === "summary" && (
                    <div className="form-grid">
                      <FormInput label="Business Memo Date" type="date" name="businessMemoDate" required defaultValue={today} helperText="Defaulted to today" />
                      <FormInput label="Branch Name" name="branchName" defaultValue="" disabled helperText="Auto-filled from login" />
                      <FormInput label="Name of Business (API)" name="businessNameApi" defaultValue={companyData.name} disabled helperText="Read-only from company master" />
                      <FormInput label="Branch Reference No." name="branchRefNo" placeholder="Enter branch reference no." />
                      <FormSelect label="Business Type" name="businessType" required options={[{ value: "manufacturing", label: "Manufacturing" }, { value: "trading", label: "Trading" }, { value: "services", label: "Services" }]} />
                      <FormInput label="CIF" name="cifSelect" defaultValue={companyData.cif} disabled helperText="From previous step" />
                      <FormSelect label="Enterprise Type" name="enterpriseType" options={[{ value: "micro", label: "Micro" }, { value: "sme", label: "SME" }, { value: "corporate", label: "Corporate" }]} />
                      <FormInput label="Exposure" name="exposure" type="number" placeholder="0.00" tooltip="Total credit exposure of the obligor across all facilities and financial institutions" />
                      <FormSelect label="Legal Status" name="legalStatus" options={[{ value: "proprietorship", label: "Proprietorship" }, { value: "partnership", label: "Partnership" }, { value: "limited", label: "Limited Company" }]} />
                      <FormInput label="Existing Limit (BDT)" name="existingLimit" type="number" placeholder="0.00" />
                      <FormInput label="O/S" name="osAmount" type="number" placeholder="0.00" />
                      <FormInput label="Proposed Limit (BDT)" name="proposedLimit" type="number" placeholder="0.00" required />
                      <FormInput label="Earnings from Existing Client" name="earningsExistingClient" type="number" placeholder="0.00" />
                      <FormSelect label="Gender (API)" name="gender" disabled options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }]} helperText="Auto-filled from CIF" />
                      <FormInput label="Client Application Date" name="clientApplicationDate" type="date" />
                      <FormSelect label="Credit Memo Type" name="creditMemoType" options={[{ value: "new", label: "New" }, { value: "renewal", label: "Renewal" }, { value: "enhancement", label: "Enhancement" }]} />
                      <FormInput label="Lending Relationship Since" name="lendingRelationshipSince" type="date" />
                      <FormInput label="Rating" name="rating" placeholder="Rating / grade" />
                      <FormInput label="Deposit Relationship Since" name="depositRelationshipSince" type="date" />
                      <FormInput label="Risk Weight" name="riskWeight" type="number" placeholder="0.00" />
                      <FormInput label="Business Incorporation Date" name="businessIncorporationDate" type="date" />
                      <FormInput label="Validity" name="validity" type="date" />
                      <FormInput label="Name of Refinance Scheme" name="refinanceSchemeName" placeholder="Enter refinance scheme name" />
                      <FormSelect label="Rated By" name="ratedBy" options={[{ value: "internal", label: "Internal Rating" }, { value: "external", label: "External Agency" }]} />
                      <FormInput label="Key Person Name & Position" name="keyPerson" placeholder="e.g. MD & CEO" />
                      <FormSelect label="DOE Risk Category" name="doeRiskCategory" tooltip="Department of Environment risk classification based on business sector and environmental impact" options={[{ value: "green", label: "Green" }, { value: "yellow", label: "Yellow" }, { value: "red", label: "Red" }]} />
                      <FormInput label="Distance from Branch (KM)" name="distanceFromBranch" type="number" step="0.1" placeholder="0.0" />
                      <FormSelect label="ESRR Rating" name="esrrRating" tooltip="Environmental & Social Risk Rating — assessed per Bangladesh Bank ESRM guidelines" options={[{ value: "low", label: "Low Risk" }, { value: "medium", label: "Medium Risk" }, { value: "high", label: "High Risk" }]} />
                      <FormInput label="SBS Code" name="sbsCode" placeholder="Enter SBS code" tooltip="Special Business Sector code per Bangladesh Bank classification" helperText="Editable as per policy" />
                      <FormInput label="DOE Validity" name="doeValidity" type="date" />
                      <FormTextarea label="Registered Business Address" name="registeredBusinessAddress" />
                      <FormSelect label="ESDD Requirement" name="esddRequirement" tooltip="Environmental & Social Due Diligence — required for medium/high ESRR rated facilities" options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} />
                      <FormTextarea label="Brief Description of Business" name="businessDescription" rows={3} />
                      <FormTextarea label="About the Proprietor" name="aboutProprietor" rows={3} />
                    </div>
                  )}

                  {/* Tab 2: Proposed Facility */}
                  {activeTab === "documents" && (
                    <div className="form-grid">
                      <FormSelect label="Nature of facility" name="facilityNature" required options={[{ value: "wc", label: "Working Capital" }, { value: "term_loan", label: "Term Loan" }, { value: "overdraft", label: "Overdraft" }]} />
                      <FormInput label="Limit (BDT)" name="facilityLimit" type="number" placeholder="0.00" required />
                      <FormInput label="Pricing (%)" name="facilityPricing" type="number" step="0.01" placeholder="0.00" />
                      <FormInput label="Tenor (Months)" name="facilityTenor" type="number" placeholder="0" />
                      <FormInput label="Grace Period (Months)" name="facilityGracePeriod" type="number" placeholder="0" />
                      <FormInput label="Purpose" name="facilityPurpose" placeholder="Purpose of facility" />
                      <FormTextarea label="Margin / Security" name="facilityMarginSecurity" placeholder="Describe margin, collateral and security details" rows={3} />
                    </div>
                  )}

                  {/* Tab 3: Loan Exposure */}
                  {activeTab === "history" && (
                    <>
                      <div className="form-grid">
                        <FormInput label="Name of Business" placeholder="Name of business / sister concern" value={currentExposure.businessName} onChange={(e) => updateExposure("businessName", e.target.value)} />
                        <FormInput label="FI Name" placeholder="Financial institution name" value={currentExposure.fiName} onChange={(e) => updateExposure("fiName", e.target.value)} />
                        <FormInput label="Nature of Facility" placeholder="e.g. TL, OD, LC" value={currentExposure.nature} onChange={(e) => updateExposure("nature", e.target.value)} />
                        <SectionDivider title="Existing exposure" />
                        <FormInput label="Existing Limit (BDT)" type="number" placeholder="0.00" value={currentExposure.existingLimit} onChange={(e) => updateExposure("existingLimit", e.target.value)} />
                        <FormInput label="Existing O/S (BDT)" type="number" placeholder="0.00" value={currentExposure.existingOs} onChange={(e) => updateExposure("existingOs", e.target.value)} />
                        <FormInput label="Existing Pricing (%)" type="number" step="0.01" placeholder="0.00" value={currentExposure.existingPricing} onChange={(e) => updateExposure("existingPricing", e.target.value)} />
                        <FormInput label="Existing Expiry" type="date" value={currentExposure.existingExpiry} onChange={(e) => updateExposure("existingExpiry", e.target.value)} />
                        <FormInput label="Ins Size" type="number" placeholder="0.00" value={currentExposure.insSize} onChange={(e) => updateExposure("insSize", e.target.value)} />
                        <FormInput label="Due EMI" type="number" placeholder="0.00" value={currentExposure.dueEmi} onChange={(e) => updateExposure("dueEmi", e.target.value)} />
                        <FormInput label="Paid EMI" type="number" placeholder="0.00" value={currentExposure.paidEmi} onChange={(e) => updateExposure("paidEmi", e.target.value)} />
                        <FormInput label="Overdue (BDT)" type="number" placeholder="0.00" value={currentExposure.overdue} onChange={(e) => updateExposure("overdue", e.target.value)} />
                        <SectionDivider title="Proposed exposure" />
                        <FormInput label="Proposed Limit (BDT)" type="number" placeholder="0.00" value={currentExposure.proposedLimit} onChange={(e) => updateExposure("proposedLimit", e.target.value)} />
                        <FormInput label="Proposed Pricing (%)" type="number" step="0.01" placeholder="0.00" value={currentExposure.proposedPricing} onChange={(e) => updateExposure("proposedPricing", e.target.value)} />
                        <FormInput label="Proposed Expiry / Tenor" placeholder="Date or months" value={currentExposure.proposedExpiry} onChange={(e) => updateExposure("proposedExpiry", e.target.value)} />
                        <FormInput label="Proposed Purpose" placeholder="Purpose of proposed facility" value={currentExposure.proposedPurpose} onChange={(e) => updateExposure("proposedPurpose", e.target.value)} />
                      </div>
                      <AddButton onClick={() => { if (!currentExposure.businessName && !currentExposure.fiName) return; setExposures((p) => [...p, currentExposure]); setCurrentExposure({ ...emptyExposure }); }} label="Add exposure" />
                      {exposures.length > 0 && (
                        <DataTable className="mt-3" headers={[
                          { label: "Business", rowSpan: 2 }, { label: "FI", rowSpan: 2 }, { label: "Nature", rowSpan: 2 },
                          { label: "Existing", colSpan: 8, align: "center" }, { label: "Proposed", colSpan: 4, align: "center" },
                        ]} subHeaders={[
                          { label: "Limit", align: "right" }, { label: "O/S", align: "right" }, { label: "Pricing%", align: "right" }, { label: "Expiry" },
                          { label: "Ins Size", align: "right" }, { label: "Due EMI", align: "right" }, { label: "Paid EMI", align: "right" }, { label: "Overdue", align: "right" },
                          { label: "Limit", align: "right" }, { label: "Pricing%", align: "right" }, { label: "Expiry/Tenor" }, { label: "Purpose" },
                        ]}>
                          {exposures.map((r, i) => (
                            <tr key={i}>
                              <Td>{r.businessName}</Td><Td>{r.fiName}</Td><Td>{r.nature}</Td>
                              <Td align="right">{r.existingLimit}</Td><Td align="right">{r.existingOs}</Td><Td align="right">{r.existingPricing}</Td><Td>{r.existingExpiry}</Td>
                              <Td align="right">{r.insSize}</Td><Td align="right">{r.dueEmi}</Td><Td align="right">{r.paidEmi}</Td><Td align="right">{r.overdue}</Td>
                              <Td align="right">{r.proposedLimit}</Td><Td align="right">{r.proposedPricing}</Td><Td>{r.proposedExpiry}</Td><Td>{r.proposedPurpose}</Td>
                            </tr>
                          ))}
                        </DataTable>
                      )}
                    </>
                  )}

                  {/* Tab 4: Record Of Bank Transaction */}
                  {activeTab === "bank" && (
                    <>
                      <div className="form-grid">
                        <SearchableSelect label="Name of Bank" name="bankName" options={bangladeshBanks} placeholder="Search bank" onValueChange={(v) => updateBankRec("bankName", v)} />
                        <FormInput label="Account Name" placeholder="Enter account name" value={currentBankRecord.accountName} onChange={(e) => updateBankRec("accountName", e.target.value)} />
                        <FormInput label="Account Type" placeholder="e.g. Current, SND, Savings" value={currentBankRecord.accountType} onChange={(e) => updateBankRec("accountType", e.target.value)} />
                        <FormInput label="Sanctioned Limit (BDT)" type="number" placeholder="0.00" value={currentBankRecord.sanctionedLimit} onChange={(e) => updateBankRec("sanctionedLimit", e.target.value)} />
                        <FormInput label="From (Date)" type="date" value={currentBankRecord.fromDate} onChange={(e) => updateBankRec("fromDate", e.target.value)} />
                        <FormInput label="To (Date)" type="date" value={currentBankRecord.toDate} onChange={(e) => updateBankRec("toDate", e.target.value)} />
                        <FormInput label="CTO" placeholder="Credit turnover" value={currentBankRecord.cto} onChange={(e) => updateBankRec("cto", e.target.value)} />
                        <FormInput label="Max. Balance" type="number" placeholder="0.00" value={currentBankRecord.maxBalance} onChange={(e) => updateBankRec("maxBalance", e.target.value)} />
                        <FormInput label="Min. Balance" type="number" placeholder="0.00" value={currentBankRecord.minBalance} onChange={(e) => updateBankRec("minBalance", e.target.value)} />
                      </div>
                      <AddButton onClick={() => { if (!currentBankRecord.bankName && !currentBankRecord.accountName) return; setBankRecords((p) => [...p, currentBankRecord]); setCurrentBankRecord({ ...emptyBankRecord }); }} label="Add record" />
                      {bankRecords.length > 0 && (
                        <DataTable className="mt-3" headers={[
                          { label: "Bank" }, { label: "Account" }, { label: "Type" }, { label: "Limit", align: "right" },
                          { label: "From" }, { label: "To" }, { label: "CTO", align: "right" }, { label: "Max Bal.", align: "right" }, { label: "Min Bal.", align: "right" },
                        ]}>
                          {bankRecords.map((r, i) => (
                            <tr key={i}>
                              <Td>{r.bankName}</Td><Td>{r.accountName}</Td><Td>{r.accountType}</Td><Td align="right">{r.sanctionedLimit}</Td>
                              <Td>{r.fromDate}</Td><Td>{r.toDate}</Td><Td align="right">{r.cto}</Td><Td align="right">{r.maxBalance}</Td><Td align="right">{r.minBalance}</Td>
                            </tr>
                          ))}
                        </DataTable>
                      )}
                    </>
                  )}

                  {/* Tab 5: Previous Close Loan */}
                  {activeTab === "previous-close-loan" && (
                    <>
                      <div className="form-grid">
                        <SearchableSelect label="FI Name" name="prevLoanFiName" options={bangladeshBanks} placeholder="Search FI name" onValueChange={(v) => updatePrevLoan("fiName", v)} />
                        <FormInput label="Account Name" placeholder="Enter account name" value={currentPrevLoan.accountName} onChange={(e) => updatePrevLoan("accountName", e.target.value)} />
                        <FormInput label="Facility Type" placeholder="e.g. TL, OD, CC" value={currentPrevLoan.facilityType} onChange={(e) => updatePrevLoan("facilityType", e.target.value)} />
                        <FormInput label="Initial Sanction Date" type="date" value={currentPrevLoan.initialSanctionDate} onChange={(e) => updatePrevLoan("initialSanctionDate", e.target.value)} />
                        <FormInput label="Initial Sanction Limit (BDT M)" type="number" step="0.01" placeholder="0.00" value={currentPrevLoan.initialSanctionLimit} onChange={(e) => updatePrevLoan("initialSanctionLimit", e.target.value)} />
                        <FormInput label="Last Sanction Date" type="date" value={currentPrevLoan.lastSanctionDate} onChange={(e) => updatePrevLoan("lastSanctionDate", e.target.value)} />
                        <FormInput label="Last Sanction Limit (BDT M)" type="number" step="0.01" placeholder="0.00" value={currentPrevLoan.lastSanctionLimit} onChange={(e) => updatePrevLoan("lastSanctionLimit", e.target.value)} />
                        <FormInput label="Closing Date" type="date" value={currentPrevLoan.closingDate} onChange={(e) => updatePrevLoan("closingDate", e.target.value)} />
                        <FormSelect label="Closing Type" name="prevLoanClosingType" value={currentPrevLoan.closingType} onChange={(e) => updatePrevLoan("closingType", e.target.value)} options={[{ value: "fully_closed", label: "Fully Closed" }, { value: "partially_closed", label: "Partially Closed" }, { value: "rescheduled", label: "Rescheduled" }, { value: "write_off", label: "Write-off" }]} />
                      </div>
                      <AddButton onClick={() => { if (!currentPrevLoan.fiName && !currentPrevLoan.accountName) return; setPrevLoans((p) => [...p, currentPrevLoan]); setCurrentPrevLoan({ ...emptyPrevLoan }); }} label="Add record" />
                      {prevLoans.length > 0 && (
                        <DataTable className="mt-3" headers={[
                          { label: "FI Name" }, { label: "Account" }, { label: "Type" },
                          { label: "Init. Date" }, { label: "Init. Limit", align: "right" },
                          { label: "Last Date" }, { label: "Last Limit", align: "right" },
                          { label: "Closing Date" }, { label: "Closing Type" },
                        ]}>
                          {prevLoans.map((r, i) => (
                            <tr key={i}>
                              <Td>{r.fiName}</Td><Td>{r.accountName}</Td><Td>{r.facilityType}</Td>
                              <Td>{r.initialSanctionDate}</Td><Td align="right">{r.initialSanctionLimit}</Td>
                              <Td>{r.lastSanctionDate}</Td><Td align="right">{r.lastSanctionLimit}</Td>
                              <Td>{r.closingDate}</Td><Td>{r.closingType}</Td>
                            </tr>
                          ))}
                        </DataTable>
                      )}
                    </>
                  )}

                  {/* Tab 6: Key Person's Information */}
                  {activeTab === "key-person-information" && (
                    <div className="form-grid">
                      <FormInput label="Name" name="keyPersonName" value={keyPerson.name} onChange={(e) => updateKeyPerson("name", e.target.value)} />
                      <FormInput label="Designation in the business" name="designationInBusiness" value={keyPerson.designationInBusiness} onChange={(e) => updateKeyPerson("designationInBusiness", e.target.value)} />
                      <FormInput label="NID No." name="nidNo" value={keyPerson.nidNo} onChange={(e) => updateKeyPerson("nidNo", e.target.value)} />
                      <FormInput label="Potential successor name" name="potentialSuccessorName" value={keyPerson.potentialSuccessorName} onChange={(e) => updateKeyPerson("potentialSuccessorName", e.target.value)} />
                      <FormInput label="Contact Number" name="contactNumber" value={keyPerson.contactNumber} onChange={(e) => updateKeyPerson("contactNumber", e.target.value)} />
                      <FormInput label="Relationship with Successor" name="relationshipWithSuccessor" value={keyPerson.relationshipWithSuccessor} onChange={(e) => updateKeyPerson("relationshipWithSuccessor", e.target.value)} />
                      <FormInput label="Relevant Business Exp. (Yrs)" name="relevantBusinessExperienceYears" value={keyPerson.relevantBusinessExperienceYears} onChange={(e) => updateKeyPerson("relevantBusinessExperienceYears", e.target.value)} />
                      <FormInput label="Residence Status" name="residenceStatus" value={keyPerson.residenceStatus} onChange={(e) => updateKeyPerson("residenceStatus", e.target.value)} />
                      <FormSelect label="Marital Status" name="maritalStatus" value={keyPerson.maritalStatus} onChange={(e) => updateKeyPerson("maritalStatus", e.target.value)} options={[{ value: "MARRIED", label: "Married" }, { value: "UNMARRIED", label: "Unmarried" }, { value: "DIVORCED", label: "Divorced" }, { value: "WIDOWED", label: "Widowed" }]} />
                      <FormInput label="Doing Current for (Yrs)" name="doingCurrentForYears" value={keyPerson.doingCurrentForYears} onChange={(e) => updateKeyPerson("doingCurrentForYears", e.target.value)} />
                      <FormInput label="Date of Birth" name="dateOfBirth" type="date" value={keyPerson.dateOfBirth} onChange={(e) => updateKeyPerson("dateOfBirth", e.target.value)} />
                      <FormInput label="Other Source of Income" name="otherSourceOfIncome" value={keyPerson.otherSourceOfIncome} onChange={(e) => updateKeyPerson("otherSourceOfIncome", e.target.value)} />
                      <FormInput label="Tax Certificate / TIN No." name="taxCertificateTinNo" value={keyPerson.taxCertificateTinNo} onChange={(e) => updateKeyPerson("taxCertificateTinNo", e.target.value)} />
                      <FormInput label="Dependent Family Members" name="dependentFamilyMembers" value={keyPerson.dependentFamilyMembers} onChange={(e) => updateKeyPerson("dependentFamilyMembers", e.target.value)} />
                      <FormTextarea label="PEP Description" name="pepDescription" value={keyPerson.pepDescription} onChange={(e) => updateKeyPerson("pepDescription", e.target.value)} />
                      <FormTextarea label="Present Address" name="presentAddress" value={keyPerson.presentAddress} onChange={(e) => updateKeyPerson("presentAddress", e.target.value)} />
                      <FormTextarea label="Permanent Address" name="permanentAddress" value={keyPerson.permanentAddress} onChange={(e) => updateKeyPerson("permanentAddress", e.target.value)} />
                    </div>
                  )}

                  {/* Tab 7: Owner's Information */}
                  {activeTab === "owner-information" && (
                    <div className="form-grid">
                      <FormInput label="Name" name="ownerName" value={owner.name} onChange={(e) => updateOwner("name", e.target.value)} />
                      <FormInput label="Designation" name="ownerDesignation" value={owner.designation} onChange={(e) => updateOwner("designation", e.target.value)} />
                      <FormInput label="Age" name="ownerAge" type="number" value={owner.age} onChange={(e) => updateOwner("age", e.target.value)} />
                      <FormInput label="% Shares" name="ownerSharePercentage" type="number" step="0.01" value={owner.sharePercentage} onChange={(e) => updateOwner("sharePercentage", e.target.value)} />
                      <FormInput label="NID No." name="ownerNidNo" value={owner.nidNo} onChange={(e) => updateOwner("nidNo", e.target.value)} />
                      <FormInput label="Mobile Number" name="ownerMobileNumber" value={owner.mobileNumber} onChange={(e) => updateOwner("mobileNumber", e.target.value)} />
                      <FormInput label="PNW (M)" name="ownerPnwM" type="number" step="0.01" value={owner.pnwM} onChange={(e) => updateOwner("pnwM", e.target.value)} />
                      <FormSelect label="Marital Status" name="ownerMaritalStatus" value={owner.maritalStatus} onChange={(e) => updateOwner("maritalStatus", e.target.value)} options={[{ value: "married", label: "Married" }, { value: "unmarried", label: "Unmarried" }, { value: "divorced", label: "Divorced" }, { value: "widowed", label: "Widowed" }]} />
                      <FormInput label="Relationship with Key Person" name="ownerRelationshipWithKeyPerson" value={owner.relationshipWithKeyPerson} onChange={(e) => updateOwner("relationshipWithKeyPerson", e.target.value)} />
                      <FormInput label="Education Level" name="ownerEducationLevel" value={owner.educationLevel} onChange={(e) => updateOwner("educationLevel", e.target.value)} />
                      <FormSelect label="DIRECTOR in Bank/NBFI/PEP" name="ownerDirectorInBankNbfipep" value={owner.directorInBankNbfipep} onChange={(e) => updateOwner("directorInBankNbfipep", e.target.value)} options={[{ value: "yes", label: "Yes" }, { value: "no", label: "No" }]} />
                      <FormTextarea label="Residential Address" name="ownerResidentialAddress" value={owner.residentialAddress} onChange={(e) => updateOwner("residentialAddress", e.target.value)} />
                      <FormTextarea label="Permanent Address" name="ownerPermanentAddress" value={owner.permanentAddress} onChange={(e) => updateOwner("permanentAddress", e.target.value)} />
                    </div>
                  )}

                  {/* Tab 8: Premise Ownership */}
                  {activeTab === "premise-ownership" && (
                    <>
                      <div className="form-grid">
                        <FormInput label="Premise Type" placeholder="e.g. Factory, Showroom, Office" value={currentPremise.premiseType} onChange={(e) => updatePremise("premiseType", e.target.value)} />
                        <FormInput label="Address" placeholder="Enter premise address" value={currentPremise.address} onChange={(e) => updatePremise("address", e.target.value)} />
                        <FormInput label="Area (SFT)" type="number" step="0.01" placeholder="0.00" value={currentPremise.areaSft} onChange={(e) => updatePremise("areaSft", e.target.value)} />
                        <FormSelect label="Ownership Status" name="premiseOwnershipStatus" value={currentPremise.ownershipStatus} onChange={(e) => updatePremise("ownershipStatus", e.target.value)} options={[{ value: "rented", label: "Rented" }, { value: "owned", label: "Owned" }]} />
                        <FormInput label="Supporting Documents" placeholder="Enter document details" value={currentPremise.supportingDocuments} onChange={(e) => updatePremise("supportingDocuments", e.target.value)} />
                        <FormInput label="Deed Validity" type="date" value={currentPremise.deedValidity} onChange={(e) => updatePremise("deedValidity", e.target.value)} />
                      </div>
                      <AddButton onClick={() => { if (!currentPremise.premiseType && !currentPremise.address) return; setPremises((p) => [...p, currentPremise]); setCurrentPremise({ ...emptyPremise }); }} label="Add record" />
                      {premises.length > 0 && (
                        <DataTable className="mt-3" headers={[
                          { label: "Premise Type" }, { label: "Address" }, { label: "Area (SFT)", align: "right" },
                          { label: "Ownership" }, { label: "Supporting Docs" }, { label: "Deed Validity" },
                        ]}>
                          {premises.map((r, i) => (
                            <tr key={i}>
                              <Td>{r.premiseType}</Td><Td>{r.address}</Td><Td align="right">{r.areaSft}</Td>
                              <Td>{r.ownershipStatus}</Td><Td>{r.supportingDocuments}</Td><Td>{r.deedValidity}</Td>
                            </tr>
                          ))}
                        </DataTable>
                      )}
                    </>
                  )}

                  {/* Tab 9: Other Business Information */}
                  {activeTab === "other-business-information" && (
                    <div className="form-grid">
                      <FormInput label="Existing Manpower - Male" name="existingManpowerMale" value={otherBiz.existingManpowerMale} onChange={(e) => updateOtherBiz("existingManpowerMale", e.target.value)} />
                      <FormInput label="Existing Manpower - Female" name="existingManpowerFemale" value={otherBiz.existingManpowerFemale} onChange={(e) => updateOtherBiz("existingManpowerFemale", e.target.value)} />
                      <FormInput label="Total Sales Percentage" name="totalSalesPercentage" value={otherBiz.totalSalesPercentage} onChange={(e) => updateOtherBiz("totalSalesPercentage", e.target.value)} />
                      <FormInput label="Wholesale (%)" name="wholesalePercentage" value={otherBiz.wholesalePercentage} onChange={(e) => updateOtherBiz("wholesalePercentage", e.target.value)} />
                      <FormInput label="Retail (%)" name="retailPercentage" value={otherBiz.retailPercentage} onChange={(e) => updateOtherBiz("retailPercentage", e.target.value)} />
                      <FormInput label="Service (%)" name="servicePercentage" value={otherBiz.servicePercentage} onChange={(e) => updateOtherBiz("servicePercentage", e.target.value)} />
                      <FormInput label="Last Trade License No." name="lastTradeLicenseNo" value={otherBiz.lastTradeLicenseNo} onChange={(e) => updateOtherBiz("lastTradeLicenseNo", e.target.value)} />
                      <FormInput label="Last Trade License Validity" name="lastTradeLicenseValidity" type="date" value={otherBiz.lastTradeLicenseValidity} onChange={(e) => updateOtherBiz("lastTradeLicenseValidity", e.target.value)} />
                      <FormInput label="Sales Keeping" name="salesKeeping" value={otherBiz.salesKeeping} onChange={(e) => updateOtherBiz("salesKeeping", e.target.value)} />
                    </div>
                  )}

                  {/* Tab 10: Bank Finance Requirement For W/C */}
                  {activeTab === "bank-finance-requirement" && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-border text-[length:var(--font-size-xs)]">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-2.5 py-1.5 text-left font-semibold text-muted-foreground">Item</th>
                            <th className="px-2.5 py-1.5 text-right font-semibold text-muted-foreground w-36">Current Yr.</th>
                            <th className="px-2.5 py-1.5 text-right font-semibold text-muted-foreground w-36">Proj. Yr. (Growth @10%)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-card">
                          {bankFinance.map((row, i) => (
                            <tr key={i}>
                              <td className="px-2.5 py-1.5 text-foreground text-[length:var(--font-size-base)]">{row.item}</td>
                              <td className="px-2.5 py-1.5">
                                <input
                                  type="text"
                                  className="h-[var(--control-h-sm)] w-full rounded-md border border-input bg-background px-2 text-right text-[length:var(--font-size-base)] text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                                  value={row.currentYear}
                                  onChange={(e) => setBankFinance((p) => p.map((r, ri) => ri === i ? { ...r, currentYear: e.target.value } : r))}
                                />
                              </td>
                              <td className="px-2.5 py-1.5">
                                <input
                                  type="text"
                                  className="h-[var(--control-h-sm)] w-full rounded-md border border-input bg-background px-2 text-right text-[length:var(--font-size-base)] text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                                  value={row.projectedYear}
                                  onChange={(e) => setBankFinance((p) => p.map((r, ri) => ri === i ? { ...r, projectedYear: e.target.value } : r))}
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Tab 11: Sister/Allied Concern */}
                  {activeTab === "sister-allied-concern" && (
                    <>
                      <div className="form-grid">
                        <FormInput label="Name of the concern" value={currentSister.concernName} onChange={(e) => updateSister("concernName", e.target.value)} />
                        <FormInput label="Business Nature" value={currentSister.businessNature} onChange={(e) => updateSister("businessNature", e.target.value)} />
                        <FormInput label="Legal Form" value={currentSister.legalForm} onChange={(e) => updateSister("legalForm", e.target.value)} />
                        <FormInput label="% of Share" type="number" step="0.01" value={currentSister.sharePercentage} onChange={(e) => updateSister("sharePercentage", e.target.value)} />
                        <FormInput label="Business Since" value={currentSister.businessSince} onChange={(e) => updateSister("businessSince", e.target.value)} />
                        <FormInput label="Total Invst." type="number" step="0.01" value={currentSister.totalInvestment} onChange={(e) => updateSister("totalInvestment", e.target.value)} />
                        <FormInput label="Bank Liability" type="number" step="0.01" value={currentSister.bankLiability} onChange={(e) => updateSister("bankLiability", e.target.value)} />
                        <FormInput label="Equity" type="number" step="0.01" value={currentSister.equity} onChange={(e) => updateSister("equity", e.target.value)} />
                        <FormInput label="Turnover" type="number" step="0.01" value={currentSister.turnover} onChange={(e) => updateSister("turnover", e.target.value)} />
                        <FormInput label="Profit" type="number" step="0.01" value={currentSister.profit} onChange={(e) => updateSister("profit", e.target.value)} />
                      </div>
                      <AddButton onClick={() => { if (!currentSister.concernName && !currentSister.businessNature) return; setSisters((p) => [...p, currentSister]); setCurrentSister({ ...emptySister }); }} label="Add record" />
                      {sisters.length > 0 && (
                        <DataTable className="mt-3" headers={[
                          { label: "Concern" }, { label: "Nature" }, { label: "Legal Form" }, { label: "% Share", align: "right" },
                          { label: "Since" }, { label: "Total Invst.", align: "right" }, { label: "Bank Liab.", align: "right" },
                          { label: "Equity", align: "right" }, { label: "Turnover", align: "right" }, { label: "Profit", align: "right" },
                        ]}>
                          {sisters.map((r, i) => (
                            <tr key={i}>
                              <Td>{r.concernName}</Td><Td>{r.businessNature}</Td><Td>{r.legalForm}</Td><Td align="right">{r.sharePercentage}</Td>
                              <Td>{r.businessSince}</Td><Td align="right">{r.totalInvestment}</Td><Td align="right">{r.bankLiability}</Td>
                              <Td align="right">{r.equity}</Td><Td align="right">{r.turnover}</Td><Td align="right">{r.profit}</Td>
                            </tr>
                          ))}
                        </DataTable>
                      )}
                    </>
                  )}

                  {/* Tab 12: AML/CFT Declaration */}
                  {activeTab === "aml-cft-declaration" && (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-border text-[length:var(--font-size-xs)]">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="px-2.5 py-1.5 text-left font-semibold text-muted-foreground w-12">S.N.</th>
                            <th className="px-2.5 py-1.5 text-left font-semibold text-muted-foreground">AML/CFT Declaration</th>
                            <th className="px-2.5 py-1.5 text-left font-semibold text-muted-foreground w-28">Status</th>
                            <th className="px-2.5 py-1.5 text-left font-semibold text-muted-foreground w-44">Remarks</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border bg-card">
                          {amlCft.map((row, i) => (
                            <tr key={row.serialNo}>
                              <td className="px-2.5 py-1.5 text-foreground">{row.serialNo}</td>
                              <td className="px-2.5 py-1.5 text-foreground text-[length:var(--font-size-base)]">{row.declaration}</td>
                              <td className="px-2.5 py-1.5">
                                <select
                                  className="h-[var(--control-h-sm)] w-full rounded-md border border-input bg-background px-2 text-[length:var(--font-size-base)] text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                                  value={row.status}
                                  onChange={(e) => setAmlCft((p) => p.map((r, ri) => ri === i ? { ...r, status: e.target.value as "yes" | "no" | "na" } : r))}
                                >
                                  <option value="yes">Yes</option>
                                  <option value="no">No</option>
                                  <option value="na">N/A</option>
                                </select>
                              </td>
                              <td className="px-2.5 py-1.5">
                                <input
                                  type="text"
                                  className="h-[var(--control-h-sm)] w-full rounded-md border border-input bg-background px-2 text-[length:var(--font-size-base)] text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-1"
                                  value={row.remarks}
                                  onChange={(e) => setAmlCft((p) => p.map((r, ri) => ri === i ? { ...r, remarks: e.target.value } : r))}
                                  placeholder="Remarks"
                                />
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {/* Tab 13: Personal Guarantor(s) */}
                  {activeTab === "personal-guarantors" && (
                    <>
                      <div className="form-grid">
                        <SectionDivider title="Guarantor Identity" />
                        <FormInput label="Name" placeholder="Full name" value={currentGuarantor.name} onChange={(e) => updateGuarantor("name", e.target.value)} />
                        <FormInput label="NID" placeholder="National ID number" value={currentGuarantor.nid} onChange={(e) => updateGuarantor("nid", e.target.value)} />
                        <FormInput label="Date of Birth" type="date" value={currentGuarantor.dob} onChange={(e) => updateGuarantor("dob", e.target.value)} />
                        <SearchableSelect label="District of Birth" name="guarantorDistrictOfBirth" options={bdDistricts} placeholder="Search district" onValueChange={(v) => updateGuarantor("districtOfBirth", v)} />
                        <FormSelect label="Gender" name="guarantorGender" value={currentGuarantor.gender} onChange={(e) => updateGuarantor("gender", e.target.value)} options={[{ value: "male", label: "Male" }, { value: "female", label: "Female" }, { value: "other", label: "Other" }]} />
                        <FormInput label="Relationship with Key Borrower" placeholder="e.g. Spouse, Brother" value={currentGuarantor.relationshipWithKeyBorrower} onChange={(e) => updateGuarantor("relationshipWithKeyBorrower", e.target.value)} />
                        <FormInput label="Profession of PG" placeholder="Profession" value={currentGuarantor.profession} onChange={(e) => updateGuarantor("profession", e.target.value)} />
                        <FormSelect label="Residence Status" name="guarantorResidenceStatus" value={currentGuarantor.residenceStatus} onChange={(e) => updateGuarantor("residenceStatus", e.target.value)} options={[{ value: "permanent", label: "Permanent" }, { value: "rented", label: "Rented" }, { value: "owned", label: "Owned" }, { value: "family", label: "Family" }]} />
                        <FormInput label="Business Name (if any)" placeholder="Business name" value={currentGuarantor.businessName} onChange={(e) => updateGuarantor("businessName", e.target.value)} />
                        <FormInput label="PNW (Mil)" type="number" step="0.01" placeholder="0.00" value={currentGuarantor.pnwMil} onChange={(e) => updateGuarantor("pnwMil", e.target.value)} />
                        <FormInput label="Funded Loan (Limit)" type="number" step="0.01" placeholder="0.00" value={currentGuarantor.fundedLoanLimit} onChange={(e) => updateGuarantor("fundedLoanLimit", e.target.value)} />

                        <SectionDivider title="Family" />
                        <FormInput label="Father Name" value={currentGuarantor.fatherName} onChange={(e) => updateGuarantor("fatherName", e.target.value)} />
                        <FormInput label="Mother Name" value={currentGuarantor.motherName} onChange={(e) => updateGuarantor("motherName", e.target.value)} />
                        <FormInput label="Spouse Name" value={currentGuarantor.spouseName} onChange={(e) => updateGuarantor("spouseName", e.target.value)} />
                        <FormInput label="Mobile No." placeholder="01XXXXXXXXX" value={currentGuarantor.mobileNo} onChange={(e) => updateGuarantor("mobileNo", e.target.value)} />

                        <SectionDivider title="Present Address" />
                        <FormTextarea label="Present Address" value={currentGuarantor.presentAddress} onChange={(e) => updateGuarantor("presentAddress", e.target.value)} />
                        <SearchableSelect label="Present District" name="guarantorPresentDistrict" options={bdDistricts} placeholder="Search district" onValueChange={(v) => updateGuarantor("presentDistrict", v)} />
                        <FormInput label="Present Post Code" value={currentGuarantor.presentPostCode} onChange={(e) => updateGuarantor("presentPostCode", e.target.value)} />

                        <SectionDivider title="Permanent Address" />
                        <FormTextarea label="Permanent Address" value={currentGuarantor.permanentAddress} onChange={(e) => updateGuarantor("permanentAddress", e.target.value)} />
                        <SearchableSelect label="Permanent District" name="guarantorPermanentDistrict" options={bdDistricts} placeholder="Search district" onValueChange={(v) => updateGuarantor("permanentDistrict", v)} />
                        <FormInput label="Permanent Post Code" value={currentGuarantor.permanentPostCode} onChange={(e) => updateGuarantor("permanentPostCode", e.target.value)} />

                        <SectionDivider title="CIB Information" />
                        <FormInput label="CIB Code" placeholder="CIB code" value={currentGuarantor.cibCode} onChange={(e) => updateGuarantor("cibCode", e.target.value)} />
                        <FormInput label="Inquiry Date" type="date" value={currentGuarantor.cibInquiryDate} onChange={(e) => updateGuarantor("cibInquiryDate", e.target.value)} />
                        <FormInput label="Expiry Date" type="date" value={currentGuarantor.cibExpiryDate} onChange={(e) => updateGuarantor("cibExpiryDate", e.target.value)} />
                        <FormSelect label="Status" name="guarantorCibStatus" value={currentGuarantor.cibStatus} onChange={(e) => updateGuarantor("cibStatus", e.target.value)} options={[{ value: "clean", label: "Clean" }, { value: "standard", label: "Standard" }, { value: "sma", label: "SMA" }, { value: "sub_standard", label: "Sub-Standard" }, { value: "doubtful", label: "Doubtful" }, { value: "bad_loss", label: "Bad/Loss" }]} />
                      </div>
                      <div className="flex justify-end gap-2 mt-3">
                        {editingGuarantorIndex !== null && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setCurrentGuarantor({ ...emptyGuarantor });
                              setEditingGuarantorIndex(null);
                            }}
                          >
                            Cancel
                          </Button>
                        )}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (!currentGuarantor.name && !currentGuarantor.nid) {
                              toast.warning("Enter at least Name or NID before saving");
                              return;
                            }
                            if (editingGuarantorIndex !== null) {
                              setGuarantors((p) => p.map((g, i) => (i === editingGuarantorIndex ? currentGuarantor : g)));
                              toast.success("Guarantor updated");
                              setEditingGuarantorIndex(null);
                            } else {
                              setGuarantors((p) => [...p, currentGuarantor]);
                              toast.success("Guarantor added");
                            }
                            setCurrentGuarantor({ ...emptyGuarantor });
                          }}
                        >
                          {editingGuarantorIndex !== null ? "Update Guarantor" : "Add Guarantor"}
                        </Button>
                      </div>
                      {guarantors.length > 0 && (
                        <DataTable
                          className="mt-3"
                          headers={[
                            { label: "#" }, { label: "Name" }, { label: "NID" }, { label: "DOB" },
                            { label: "Gender" }, { label: "Relationship" }, { label: "Profession" },
                            { label: "Mobile" }, { label: "PNW (M)", align: "right" }, { label: "Funded Limit", align: "right" },
                            { label: "CIB Code" }, { label: "CIB Inquiry" }, { label: "CIB Expiry" }, { label: "CIB Status" },
                            { label: "Actions", align: "center" },
                          ]}
                        >
                          {guarantors.map((g, i) => (
                            <tr key={i} className={editingGuarantorIndex === i ? "bg-primary/5" : undefined}>
                              <Td>{i + 1}</Td>
                              <Td>{g.name}</Td>
                              <Td>{g.nid}</Td>
                              <Td>{g.dob}</Td>
                              <Td>{g.gender}</Td>
                              <Td>{g.relationshipWithKeyBorrower}</Td>
                              <Td>{g.profession}</Td>
                              <Td>{g.mobileNo}</Td>
                              <Td align="right">{g.pnwMil}</Td>
                              <Td align="right">{g.fundedLoanLimit}</Td>
                              <Td>{g.cibCode}</Td>
                              <Td>{g.cibInquiryDate}</Td>
                              <Td>{g.cibExpiryDate}</Td>
                              <Td>{g.cibStatus}</Td>
                              <Td align="center">
                                <div className="flex items-center justify-center gap-1">
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-primary hover:text-primary"
                                    onClick={() => {
                                      setCurrentGuarantor({ ...g });
                                      setEditingGuarantorIndex(i);
                                      toast.info("Editing guarantor — update fields and click Update");
                                    }}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="h-7 px-2 text-destructive hover:text-destructive"
                                    onClick={() => {
                                      setGuarantors((p) => p.filter((_, idx) => idx !== i));
                                      if (editingGuarantorIndex === i) {
                                        setCurrentGuarantor({ ...emptyGuarantor });
                                        setEditingGuarantorIndex(null);
                                      }
                                      toast.success("Guarantor removed");
                                    }}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </Td>
                            </tr>
                          ))}
                        </DataTable>
                      )}
                    </>
                  )}
                </div>
                {error && <p className="mt-3 text-[length:var(--font-size-sm)] text-destructive">{error}</p>}
                <div className="form-actions-sticky -mx-4 -mb-4 mt-4 rounded-b-lg">
                  <Button type="button" variant="outline" onClick={handleBack} disabled={loading}>Back</Button>
                  <div className="flex items-center gap-2">
                    <Button type="button" variant="ghost" disabled={loading} onClick={() => toast.info("Draft saved", { description: "Your progress has been saved." })}>Save Draft</Button>
                    <Button type="submit" disabled={loading}>
                      {loading ? "Processing..." : isLastTab ? "Submit" : "Next Step"}
                    </Button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
    </AppLayout>
  );
};

export default ApplicationForm;
