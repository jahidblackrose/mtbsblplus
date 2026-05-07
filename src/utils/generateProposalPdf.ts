import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import letterHeaderImg from "@/assets/letter_header.png";
import letterFooterImg from "@/assets/letter_footer.png";

/* ============================================================
   API MODEL — RM Memo for SBL (Khan Denim style proposal)
   1-to-1 fields are objects; 1-to-Many fields are arrays.
   ============================================================ */
export interface ProposalKeySummary {
  businessMemoDate: string;
  branchName: string;
  businessName: string;
  branchRefNo: string;
  businessType: string;
  cif: string;
  enterpriseType: string;
  legalStatus: string;
  existingLimit: string;
  os: string;
  proposedLimit: string;
  earningsFromExistingClient: string;
  clientApplicationDate: string;
  gender: string;
  lendingRelationshipSince: string;
  creditMemoType: string;
  depositRelationshipSince: string;
  ratingRating: string;
  businessIncorporationDate: string;
  riskWeight: string;
  refinanceScheme: string;
  ratingValidity: string;
  keyPersonNamePosition: string;
  ratedBy: string;
  distanceFromBranchKm: string;
  doeRiskCategory: string;
  sbsCode: string;
  esrrRating: string;
  registeredBusinessAddress: string;
  doeValidity: string;
  esddRequirement: string;
  briefDescription: string;
  aboutProprietor: string;
}
export interface ProposedFacility { nature: string; limit: string; pricing: string; tenor: string; grace: string; purpose: string; security: string; }
export interface LoanExposureRow { businessName: string; fiName: string; nature: string; existingLimit: string; existingOs: string; existingPricing: string; existingExpiry: string; insSize: string; dueEmi: string; paidEmi: string; overdue: string; proposedLimit: string; proposedPricing: string; proposedExpiry: string; proposedPurpose: string; }
export interface BankTxnRow { bankName: string; accountName: string; accountType: string; sanctionedLimit: string; fromDate: string; toDate: string; ctoTotal: string; maxBal: string; minBal: string; }
export interface ClosedLoanRow { fiName: string; accountName: string; facilityType: string; initialDate: string; initialLimit: string; lastDate: string; lastLimit: string; closingDate: string; closingType: string; }
export interface KeyPerson {
  name: string; designation: string; nid: string; potentialSuccessor: string; contact: string; relationshipSuccessor: string;
  experienceYears: string; residenceStatus: string; maritalStatus: string; doingCurrentYears: string; dob: string; otherIncome: string;
  taxTin: string; dependents: string; pep: string; presentAddress: string; permanentAddress: string;
}
export interface OwnerRow { name: string; designation: string; age: string; residentialAddress: string; permanentAddress: string; sharePct: string; nid: string; mobile: string; pnw: string; maritalStatus: string; relationship: string; education: string; directorPep: string; }
export interface PremiseRow { type: string; address: string; areaSft: string; ownership: string; supportingDoc: string; deedValidity: string; }
export interface OtherBusinessInfo { manpowerMale: string; manpowerFemale: string; wholesalePct: string; retailPct: string; servicePct: string; tradeLicenseNo: string; tradeLicenseValidity: string; salesKeeping: string; }
export interface BankFinanceWcRow { item: string; current: string; projected: string; }
export interface SisterConcernRow { name: string; nature: string; legalForm: string; sharePct: string; since: string; investment: string; bankLiability: string; equity: string; turnover: string; profit: string; }
export interface AmlRow { sn: string; declaration: string; status: string; remarks: string; }
export interface CibRow { name: string; cibCode: string; inquiryDate: string; expiryDate: string; status: string; }
export interface GuarantorRow { name: string; age: string; relationship: string; profession: string; residenceStatus: string; businessName: string; cell: string; pnw: string; fundedLoan: string; }
export interface ExceptionRow { sl: string; parameter: string; actual: string; }
export interface RecommendationSignatory { role: string; name: string; designation: string; }

export interface ProposalData {
  applicationId: string;
  keySummary: ProposalKeySummary;                // 1-1
  proposedFacility: ProposedFacility[];           // 1-1 (printed as table; usually one row)
  loanExposure: LoanExposureRow[];                // 1-M
  bankTransactions: BankTxnRow[];                 // 1-M
  closedLoans: ClosedLoanRow[];                   // 1-M
  keyPerson: KeyPerson;                           // 1-1
  owners: OwnerRow[];                             // 1-M
  premises: PremiseRow[];                         // 1-M
  otherBusinessInfo: OtherBusinessInfo;           // 1-1
  bankFinanceWc: BankFinanceWcRow[];              // 1-M (rows of W/C calc)
  sisterConcerns: SisterConcernRow[];             // 1-M
  amlChecklist: AmlRow[];                         // 1-1 list of items
  cibCompliance: CibRow[];                        // 1-M
  guarantors: GuarantorRow[];                     // 1-M
  visitReport: string;                            // 1-1
  exceptions: ExceptionRow[];                     // 1-M
  recommendation: string[];                       // 1-1 bullet list
  signatories: RecommendationSignatory[];         // 1-M (3 columns)
  attachments: string[];                          // 1-M
}

/* ===================== Dummy API ===================== */
export async function fetchProposalData(applicationId: string): Promise<ProposalData> {
  await new Promise((r) => setTimeout(r, 200));
  return {
    applicationId,
    keySummary: {
      businessMemoDate: "01.02.2026", branchName: "Mirpur-2 Branch",
      businessName: "KHAN DENIM", branchRefNo: "MTB/MIRPUR-2 BRANCH/SME/KHAN DENIM/2026/",
      businessType: "Trading", cif: "20008262",
      enterpriseType: "Small", legalStatus: "Proprietorship",
      existingLimit: "2.00", os: "0.00", proposedLimit: "4.00",
      earningsFromExistingClient: "—", clientApplicationDate: "25/01/2026",
      gender: "Male", lendingRelationshipSince: "18/01/2024",
      creditMemoType: "New", depositRelationshipSince: "06/01/2022",
      ratingRating: "—", businessIncorporationDate: "04/01/2022",
      riskWeight: "—", refinanceScheme: "N/A",
      ratingValidity: "—", keyPersonNamePosition: "Md. Rayhan Khan",
      ratedBy: "Select One", distanceFromBranchKm: "0.5",
      doeRiskCategory: "Green", sbsCode: "CBS",
      esrrRating: "Low Risk",
      registeredBusinessAddress: "Plot:Ka/A, North Bishil, Shop: B/27, (1st floor), Hazrat Shah Ali School and College Market, Mirpur, Dhaka",
      doeValidity: "NIL", esddRequirement: "Yes",
      briefDescription: "The concern is a wholesaler of readymade Denim Jeans pant for men. The business includes items such as export quality jeans denim pants. It has a showroom and a godown for wholesale trading. Mr. Md. Rayhan Khan is the owner of this concern. The business started its journey in 2022 (as per Trade License) in the name of Khan Denim. The trade items he deals with have a high demand in garments sector and the business does not have any apparent threat to setback in any situation. The location of his showroom is in a booming commercial area at Shop: B/27, (1st floor), Hazrat Shah Ali School and College Market, Dhaka.",
      aboutProprietor: "Mr Md. Rayhan Khan is the proprietor of the concern. He started the business in 2022 at Mirpur, Dhaka on rented premise in the name of Khan Denim. He has eight (08) years of business experience in the same sector. He has experience in marketing, sales and sourcing the products for the growth of his business. The business owner is a successful entrepreneur who has a passion for business. More than 100+ customers visit his showroom on a daily basis. He strives to provide the best quality materials and craftsmanship to ensure the delivery of the best possible products to customers.",
    },
    proposedFacility: [
      { nature: "SBL / SBL PLUS", limit: "40", pricing: "14.50", tenor: "24", grace: "0", purpose: "Business Expansion", security: "10% FDR" },
    ],
    loanExposure: [],
    bankTransactions: [
      { bankName: "MTB PLC", accountName: "KHAN DENIM", accountType: "CD", sanctionedLimit: "NIL", fromDate: "01.02.2025", toDate: "15.01.2026", ctoTotal: "63.70", maxBal: "9.08", minBal: "1.15" },
    ],
    closedLoans: [
      { fiName: "MTB", accountName: "KHAN DENIM", facilityType: "SBL TERM LOAN", initialDate: "17.01.2024", initialLimit: "2.00 M", lastDate: "17.01.2024", lastLimit: "2.00 M", closingDate: "27.01.2026", closingType: "MATURITY" },
    ],
    keyPerson: {
      name: "MD. RAYHAN KHAN", designation: "PROPRIETOR",
      nid: "19892694807821943", potentialSuccessor: "JAFRIN AKTER EMA",
      contact: "01974286863", relationshipSuccessor: "SPOUSE",
      experienceYears: "7 YEARS", residenceStatus: "PERMANENT",
      maritalStatus: "MARRIED", doingCurrentYears: "7",
      dob: "11/06/1989", otherIncome: "N/A",
      taxTin: "158798145953", dependents: "3",
      pep: "N/A",
      presentAddress: "HOUSE#3, ROAD#4, RUPNAGAR R/A, MIRPUR, DHAKA",
      permanentAddress: "DHANPATI KHOLA, MURADNAGAR, CUMILLA.",
    },
    owners: [
      { name: "MD. RAYHAN KHAN", designation: "PROPRIETOR", age: "37", residentialAddress: "HOUSE#3, ROAD#4, RUPNAGAR R/A, MIRPUR, DHAKA", permanentAddress: "DHANPATI KHOLA, MURADNAGAR, CUMILLA.", sharePct: "100%", nid: "19892694807821943", mobile: "01974286863", pnw: "53", maritalStatus: "MARRIED", relationship: "PROPRIETOR", education: "HSC", directorPep: "N/A" },
    ],
    premises: [
      { type: "Office", address: "Plot-KA/1, North Bishil, Shop No-B/27, 1st Floor, Hazrat Shah Ali School & College Market, Mirpur-1, Dhaka-1216", areaSft: "300", ownership: "Rented", supportingDoc: "Rental Deed", deedValidity: "30/04/2027" },
      { type: "Showroom", address: "Plot-KA/1, North Bishil, Shop No-B/27, 1st Floor, Hazrat Shah Ali School & College Market, Mirpur-1, Dhaka-1216", areaSft: "300", ownership: "Rented", supportingDoc: "Rental Deed", deedValidity: "30/04/2027" },
      { type: "Godown", address: "B/32, Underground, Hazrat Shah Ali School & College Market, Mirpur-1, Dhaka-1216", areaSft: "300", ownership: "Rented", supportingDoc: "Rental Deed", deedValidity: "—" },
    ],
    otherBusinessInfo: {
      manpowerMale: "4", manpowerFemale: "N/A",
      wholesalePct: "80%", retailPct: "20%", servicePct: "N/A",
      tradeLicenseNo: "TRAD/DNCC/040632/2022", tradeLicenseValidity: "30.06.2026",
      salesKeeping: "Kacha Khata",
    },
    bankFinanceWc: [
      { item: "(+) Average Inventory Holding (Value of Inventory)", current: "4.30 M", projected: "4.73 M" },
      { item: "(+) Average Receivable Holding (Value of A/C Recv.)", current: "4.60 M", projected: "5.06 M" },
      { item: "(+) Average Advance Payment to Suppliers, if any", current: "—", projected: "—" },
      { item: "(-) Average Payable Amount (Value of A/C Payable)", current: "0.39 M", projected: "0.43 M" },
      { item: "Total W/C Requirement", current: "8.51 M", projected: "9.36 M" },
      { item: "Existing Working Capital Loan in all FIs", current: "0.00", projected: "0.00" },
      { item: "Scope for Additional Working Capital Loan", current: "—", projected: "6.55 M" },
      { item: "Proposed TL as W/C", current: "—", projected: "4.00 M" },
      { item: "Debt : Equity", current: "—", projected: "1:0.42" },
    ],
    sisterConcerns: [],
    amlChecklist: [
      { sn: "1", declaration: "CDD has been completed during account opening of the customer", status: "Yes", remarks: "" },
      { sn: "2", declaration: "All necessary documents in establishing the client's legitimacy have been obtained", status: "No", remarks: "" },
      { sn: "3", declaration: "Borrowing capacity of the borrower has been validated", status: "Yes", remarks: "" },
      { sn: "4", declaration: "Credit facilities have been utilized for the purpose stated as per sanction letter", status: "Yes", remarks: "" },
      { sn: "5", declaration: "Genuineness, reliability, correlation with Borrower and Supplier/Importer have been checked", status: "Yes", remarks: "" },
      { sn: "6", declaration: "Before export or import competitive price has been justified", status: "N/A", remarks: "" },
      { sn: "7", declaration: "History of ML/TF predicate offences has been checked", status: "Yes", remarks: "" },
      { sn: "8", declaration: "No adverse news about the Customer", status: "Yes", remarks: "" },
      { sn: "9", declaration: "Guidelines / policies related to AML & CFT have been complied", status: "Yes", remarks: "" },
    ],
    cibCompliance: [
      { name: "MD. RAYHAN KHAN", cibCode: "K3433054122", inquiryDate: "19.01.2026", expiryDate: "19.03.2026", status: "Standard" },
      { name: "JAFRIN AKTER EMA", cibCode: "U0110067151", inquiryDate: "19.01.2026", expiryDate: "19.03.2026", status: "Standard" },
      { name: "MOHAMMED ALAMGIR HOSSAIN", cibCode: "N0000692860", inquiryDate: "19.01.2026", expiryDate: "19.03.2026", status: "Standard" },
    ],
    guarantors: [
      { name: "MD. RAYHAN KHAN", age: "36", relationship: "Sponsor", profession: "Businessman", residenceStatus: "Permanent", businessName: "Khan Denim", cell: "01974286863", pnw: "52.7", fundedLoan: "903009" },
      { name: "JAFRIN AKTER EMA", age: "22", relationship: "Spouse", profession: "Housewife", residenceStatus: "Permanent", businessName: "N/A", cell: "01724286863", pnw: "3.2", fundedLoan: "915001" },
      { name: "MOHAMMED ALAMGIR HOSSAIN", age: "51", relationship: "Friend", profession: "Businessman", residenceStatus: "Permanent", businessName: "Dubai Fashion", cell: "01763301057", pnw: "26.0", fundedLoan: "903009" },
    ],
    visitReport: "The business premise was visited on 11.01.2026 by Mr. Md Anwar Pasha Chowdhury (Designation: SVP, Dept: BM) and Ms. Kaniz Fatima Lily (Designation: RM, Dept: SME). The Proprietor MD. RAYHAN KHAN was also present at that time. At the time of client premise visit, we found the value of inventory BDT 4.30 million and receivable BDT 4.60 million.",
    exceptions: [{ sl: "1", parameter: "—", actual: "—" }],
    recommendation: [
      "THIS CLIENT HAS GOOD REPAYMENT RECORD.",
      "BUSINESS BANK TRANSACTION IS 95%.",
      "THIS CLIENT HAS GOOD REPAYMENT RECORD WITH MTB.",
      "APPLICANT BUSINESS EXPERIENCE IS MORE THAN 8 YEARS.",
    ],
    signatories: [
      { role: "MAKER", name: "Kaniz Fatima Lily", designation: "SME RM" },
      { role: "CLUSTER HEAD", name: "MD Mhabub Nurul Alam", designation: "BDM" },
      { role: "CHECKER", name: "Md. Anwar Pasha Chowdhury", designation: "Branch Manager" },
    ],
    attachments: [
      "DVC verified Audited / Management prepared income statement, balance sheet.",
      "Buyers and suppliers' details",
      "PNW Statements for all guarantors",
      "ICRRS qualitative indicator (Non-financial indicators)",
      "Other documents as per main documents checklist",
    ],
  };
}

/* ===================== PDF Renderer ===================== */
const BAND_BG: [number, number, number] = [220, 230, 245];   // section header light blue
const BAND_TXT: [number, number, number] = [43, 87, 151];    // bank blue
const HEAD_BG: [number, number, number] = [43, 87, 151];     // table header bg
const ALT_BG: [number, number, number] = [245, 247, 250];

export function generateProposalPdf(data: ProposalData) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 12;

  const drawHeader = () => {
    try { doc.addImage(letterHeaderImg, "PNG", margin, 8, pageW - margin * 2, 18); }
    catch {
      doc.setFontSize(13); doc.setFont("helvetica", "bold");
      doc.text("Mutual Trust Bank PLC", pageW / 2, 18, { align: "center" });
    }
    doc.setDrawColor(...BAND_TXT); doc.setLineWidth(0.4);
    doc.line(margin, 28, pageW - margin, 28);
  };
  const drawFooter = (pageNum: number, pageTotal: number) => {
    try { doc.addImage(letterFooterImg, "PNG", margin, pageH - 16, pageW - margin * 2, 10); }
    catch {
      doc.setFontSize(7); doc.setTextColor(150);
      doc.text("© Mutual Trust Bank PLC", pageW / 2, pageH - 8, { align: "center" });
    }
    doc.setFontSize(8); doc.setTextColor(100);
    doc.text(`Page ${pageNum} of ${pageTotal}`, pageW - margin, pageH - 18, { align: "right" });
  };

  drawHeader();
  let y = 32;

  // Title
  doc.setFont("helvetica", "bold"); doc.setFontSize(13); doc.setTextColor(...BAND_TXT);
  doc.text("RM Memo for SBL", pageW / 2, y, { align: "center" });
  y += 4;
  doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor(110);
  doc.text(`Application: ${data.applicationId}   |   Generated: ${new Date().toLocaleDateString("en-GB")}`, pageW / 2, y + 3, { align: "center" });
  y += 7;

  const ensureSpace = (need = 30) => {
    if (y > pageH - 25 - need) { doc.addPage(); drawHeader(); y = 32; }
  };

  const sectionTitle = (text: string) => {
    ensureSpace(14);
    doc.setFillColor(...BAND_BG);
    doc.rect(margin, y, pageW - margin * 2, 6, "F");
    doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(...BAND_TXT);
    doc.text(text, margin + 2, y + 4.2);
    y += 8;
  };

  const baseTable = (head: any[], body: any[][], opts: any = {}) => {
    autoTable(doc, {
      startY: y,
      head, body,
      margin: { left: margin, right: margin },
      styles: { fontSize: 7.8, cellPadding: 1.6, lineColor: [200, 200, 200], lineWidth: 0.1, overflow: "linebreak", valign: "middle" },
      headStyles: { fillColor: HEAD_BG, textColor: 255, fontStyle: "bold", fontSize: 8 },
      alternateRowStyles: { fillColor: ALT_BG },
      ...opts,
    });
    y = (doc as any).lastAutoTable.finalY + 4;
  };

  // ========== 1. KEY SUMMARY (1-1) ==========
  sectionTitle("1. KEY SUMMARY");
  const k = data.keySummary;
  const kvRows: [string, string, string, string][] = [
    ["Business Memo Date", k.businessMemoDate, "Branch Name", k.branchName],
    ["Name of Business", k.businessName, "Branch Reference No.", k.branchRefNo],
    ["Business Type", k.businessType, "CIF", k.cif],
    ["Enterprise Type", k.enterpriseType, "Existing Limit / O/S / Proposed", `${k.existingLimit} / ${k.os} / ${k.proposedLimit}`],
    ["Legal Status", k.legalStatus, "Client Application Date", k.clientApplicationDate],
    ["Earnings from existing client", k.earningsFromExistingClient, "Lending Relationship Since", k.lendingRelationshipSince],
    ["Gender", k.gender, "Deposit Relationship Since", k.depositRelationshipSince],
    ["Credit Memo Type", k.creditMemoType, "Business Incorporation Date", k.businessIncorporationDate],
    ["Credit Rating", k.ratingRating, "Refinance Scheme", k.refinanceScheme],
    ["Risk Weight", k.riskWeight, "Key Person Name & Position", k.keyPersonNamePosition],
    ["Rating Validity", k.ratingValidity, "Distance from Branch (KM)", k.distanceFromBranchKm],
    ["Rated By", k.ratedBy, "SBS Code", k.sbsCode],
    ["DoE Risk Category", k.doeRiskCategory, "DoE Validity", k.doeValidity],
    ["ESRR Rating", k.esrrRating, "ESDD Requirement", k.esddRequirement],
  ];
  baseTable(
    [[{ content: "Field", styles: { halign: "left" } }, "Value", "Field", "Value"]],
    kvRows,
    { columnStyles: { 0: { fontStyle: "bold", cellWidth: 42 }, 1: { cellWidth: 51 }, 2: { fontStyle: "bold", cellWidth: 42 }, 3: { cellWidth: 51 } } }
  );
  baseTable([["Registered Business Address"]], [[k.registeredBusinessAddress]]);
  baseTable([["Brief Description of Business"]], [[k.briefDescription]]);
  baseTable([["About the Proprietor"]], [[k.aboutProprietor]]);

  // ========== 2. PROPOSED FACILITY (1-1) ==========
  sectionTitle("2. PROPOSED FACILITY WITH MTB");
  baseTable(
    [["Nature of Facility", "Limit", "Pricing (%)", "Tenor (M)", "Grace", "Purpose", "Margin / Security"]],
    data.proposedFacility.map(p => [p.nature, p.limit, p.pricing, p.tenor, p.grace, p.purpose, p.security]),
  );

  // ========== 3. LOAN EXPOSURE (1-M) ==========
  sectionTitle("3. LOAN EXPOSURE INCLUDING SISTER CONCERN IN ALL FIs INCLUDING MTB");
  if (data.loanExposure.length === 0) {
    baseTable([["Status"]], [["NIL"]]);
  } else {
    baseTable(
      [["Business", "FI", "Nature", "Limit", "O/S", "Pricing %", "Expiry", "Ins.Size", "Due EMI", "Paid EMI", "Overdue", "Prop. Limit", "Prop. Price %", "Prop. Expiry", "Purpose"]],
      data.loanExposure.map(r => [r.businessName, r.fiName, r.nature, r.existingLimit, r.existingOs, r.existingPricing, r.existingExpiry, r.insSize, r.dueEmi, r.paidEmi, r.overdue, r.proposedLimit, r.proposedPricing, r.proposedExpiry, r.proposedPurpose]),
      { styles: { fontSize: 6.8, cellPadding: 1.2 } }
    );
  }

  // ========== 4. BANK TRANSACTION (1-M) ==========
  sectionTitle("4. RECORD OF BANK TRANSACTION");
  baseTable(
    [["Bank", "Account Name", "A/C Type", "Sanc. Limit", "From", "To", "CTO Total", "Max Bal.", "Min Bal."]],
    data.bankTransactions.map(b => [b.bankName, b.accountName, b.accountType, b.sanctionedLimit, b.fromDate, b.toDate, b.ctoTotal, b.maxBal, b.minBal])
  );

  // ========== 5. PREVIOUS LOAN CLOSING (1-M) ==========
  sectionTitle("5. PREVIOUS LOAN CLOSING HISTORY (BDT in M)");
  baseTable(
    [["FI", "Account Name", "Facility", "Initial Date", "Initial Limit", "Last Date", "Last Limit", "Closing Date", "Closing Type"]],
    data.closedLoans.map(c => [c.fiName, c.accountName, c.facilityType, c.initialDate, c.initialLimit, c.lastDate, c.lastLimit, c.closingDate, c.closingType])
  );

  // ========== 6. KEY PERSON INFO (1-1) ==========
  sectionTitle("6. KEY PERSON'S INFORMATION");
  const kp = data.keyPerson;
  baseTable(
    [[{ content: "Field", styles: { halign: "left" } }, "Value", "Field", "Value"]],
    [
      ["Name", kp.name, "Designation", kp.designation],
      ["NID No.", kp.nid, "Potential Successor", kp.potentialSuccessor],
      ["Contact Number", kp.contact, "Relationship of Successor", kp.relationshipSuccessor],
      ["Relevant Business Exp. (Yrs)", kp.experienceYears, "Residence Status", kp.residenceStatus],
      ["Marital Status", kp.maritalStatus, "Doing Current for (Years)", kp.doingCurrentYears],
      ["Date of Birth", kp.dob, "Other Source of Income", kp.otherIncome],
      ["Tax Certificate / TIN", kp.taxTin, "No. of Dependents", kp.dependents],
      ["PEP Description", kp.pep, "—", "—"],
    ],
    { columnStyles: { 0: { fontStyle: "bold", cellWidth: 42 }, 1: { cellWidth: 51 }, 2: { fontStyle: "bold", cellWidth: 42 }, 3: { cellWidth: 51 } } }
  );
  baseTable([["Present Address"]], [[kp.presentAddress]]);
  baseTable([["Permanent Address"]], [[kp.permanentAddress]]);

  // ========== 7. OWNER'S INFO (1-M) ==========
  sectionTitle("7. OWNER'S INFORMATION");
  baseTable(
    [["Name", "Designation", "Age", "Residential Address", "Permanent Address", "% Share", "NID", "Mobile", "PNW (M)", "Marital", "Relation", "Edu.", "Director/PEP"]],
    data.owners.map(o => [o.name, o.designation, o.age, o.residentialAddress, o.permanentAddress, o.sharePct, o.nid, o.mobile, o.pnw, o.maritalStatus, o.relationship, o.education, o.directorPep]),
    { styles: { fontSize: 6.6, cellPadding: 1.1 } }
  );

  // ========== 8. PREMISE OWNERSHIP (1-M) ==========
  sectionTitle("8. PREMISE OWNERSHIP");
  baseTable(
    [["Premise Type", "Address", "Area (SFT)", "Ownership", "Supporting Doc.", "Deed Validity"]],
    data.premises.map(p => [p.type, p.address, p.areaSft, p.ownership, p.supportingDoc, p.deedValidity])
  );

  // ========== 9. OTHER BUSINESS INFO (1-1) ==========
  sectionTitle("9. OTHER BUSINESS INFORMATION");
  const ob = data.otherBusinessInfo;
  baseTable(
    [[{ content: "Field", styles: { halign: "left" } }, "Value", "Field", "Value"]],
    [
      ["Manpower (Male)", ob.manpowerMale, "Manpower (Female)", ob.manpowerFemale],
      ["Wholesale (%)", ob.wholesalePct, "Retail (%)", ob.retailPct],
      ["Service (%)", ob.servicePct, "Sales Keeping", ob.salesKeeping],
      ["Last Trade License No.", ob.tradeLicenseNo, "Trade License Validity", ob.tradeLicenseValidity],
    ],
    { columnStyles: { 0: { fontStyle: "bold", cellWidth: 42 }, 1: { cellWidth: 51 }, 2: { fontStyle: "bold", cellWidth: 42 }, 3: { cellWidth: 51 } } }
  );

  // ========== 10. BANK FINANCE REQUIREMENT FOR W/C (1-M of items) ==========
  sectionTitle("10. BANK FINANCE REQUIREMENT FOR W/C");
  baseTable(
    [["Items", "Current Yr.", "Proj. Yr. (Growth @10%)"]],
    data.bankFinanceWc.map(r => [r.item, r.current, r.projected]),
    { columnStyles: { 0: { cellWidth: 110 } } }
  );

  // ========== 11. SISTER CONCERN (1-M) ==========
  sectionTitle("11. PARTICULARS OF SISTER / ALLIED CONCERN");
  if (data.sisterConcerns.length === 0) {
    baseTable([["Status"]], [["N/A"]]);
  } else {
    baseTable(
      [["Concern", "Nature", "Legal Form", "% Share", "Since", "Investment", "Bank Liability", "Equity", "Turnover", "Profit"]],
      data.sisterConcerns.map(s => [s.name, s.nature, s.legalForm, s.sharePct, s.since, s.investment, s.bankLiability, s.equity, s.turnover, s.profit])
    );
  }

  // ========== 12. AML/CFT (1-M list) ==========
  sectionTitle("12. AML / CFT DECLARATION CHECKLIST");
  baseTable(
    [["S.N.", "AML/CFT Declaration", "Status", "Remarks"]],
    data.amlChecklist.map(a => [a.sn, a.declaration, a.status, a.remarks]),
    { columnStyles: { 0: { cellWidth: 10 }, 2: { cellWidth: 20, halign: "center" }, 3: { cellWidth: 30 } } }
  );

  // ========== 13. CIB COMPLIANCE (1-M) ==========
  sectionTitle("13. CIB COMPLIANCE");
  baseTable(
    [["Name", "CIB Code", "Inquiry Date", "Expiry Date", "Status"]],
    data.cibCompliance.map(c => [c.name, c.cibCode, c.inquiryDate, c.expiryDate, c.status])
  );

  // ========== 14. PERSONAL GUARANTORS (1-M) ==========
  sectionTitle("14. PERSONAL GUARANTOR(S)");
  baseTable(
    [["Name", "Age", "Relationship", "Profession", "Residence", "Business", "Cell No.", "PNW (M)", "Funded Loan"]],
    data.guarantors.map(g => [g.name, g.age, g.relationship, g.profession, g.residenceStatus, g.businessName, g.cell, g.pnw, g.fundedLoan])
  );

  // ========== 15. VISIT REPORT (1-1) ==========
  sectionTitle("15. VISIT REPORT");
  baseTable([["Report"]], [[data.visitReport]]);

  // ========== 16. EXCEPTIONS (1-M) ==========
  sectionTitle("16. EXCEPTION(S)");
  baseTable(
    [["Sl. No.", "Parameter as per Existing PPG", "Actual Exceptions Occurred"]],
    data.exceptions.map(e => [e.sl, e.parameter, e.actual]),
    { columnStyles: { 0: { cellWidth: 16, halign: "center" } } }
  );

  // ========== 17. BASIS OF RECOMMENDATION (1-1) ==========
  sectionTitle("17. BASIS OF RECOMMENDATION");
  baseTable([["SME Banking Recommendation"]], [["We recommend approval of the proposed credit facilities on the following merits:\n\n• " + data.recommendation.join("\n• ")]]);

  // ========== 18. RECOMMENDATION (1-M signatories) ==========
  sectionTitle("18. RECOMMENDATION");
  baseTable(
    [data.signatories.map(s => s.role)],
    [data.signatories.map(s => `Name: ${s.name}\nDesignation: ${s.designation}\n\nSignature: ____________________`)],
    { styles: { minCellHeight: 24, fontSize: 8 } }
  );

  // ========== Attachments ==========
  ensureSpace(20);
  doc.setFont("helvetica", "bold"); doc.setFontSize(9.5); doc.setTextColor(...BAND_TXT);
  doc.text("Attachments:", margin, y + 2); y += 6;
  doc.setFont("helvetica", "normal"); doc.setFontSize(8.5); doc.setTextColor(40);
  data.attachments.forEach((a, i) => {
    ensureSpace(8);
    const lines = doc.splitTextToSize(`${i + 1}. ${a}`, pageW - margin * 2 - 4);
    doc.text(lines, margin + 2, y);
    y += lines.length * 4 + 1;
  });

  // Footer on all pages
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) { doc.setPage(i); drawFooter(i, total); }

  doc.save(`${data.applicationId.replace(/[^a-zA-Z0-9-]/g, "_")}_Proposal.pdf`);
}
