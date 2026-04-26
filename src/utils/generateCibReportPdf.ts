import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

// ============================================================================
// API MODEL — CIB Report Data Structure
// ============================================================================
export interface CibCompanyLiability {
  serial: string;
  companyName: string;
  mainAddress: string;
  additionalAddress: string;
  hasLoan: boolean;
  bankName?: string;
  branchName?: string;
}

export interface CibReportData {
  // Bank / Branch
  bankName: string;
  branchName: string;
  inquiryDate: string;
  reference: string;

  // Borrower
  borrowerName: string;
  fatherName: string;
  motherName: string;
  spouseName: string;
  gender: string;
  dateOfBirth: string;
  districtOfBirth: string;
  countryOfBirth: string;

  // Address
  permanentAddress: string;
  permanentDistrict: string;
  permanentPostCode: string;
  presentAddress: string;
  presentDistrict: string;
  presentPostCode: string;

  // IDs
  nid: string;
  tin: string;
  passport?: string;
  drivingLicense?: string;
  idIssueDate?: string;
  idIssueCountry?: string;
  mobile: string;

  // Undertaking
  applicantRole: string; // owner/partner/director/guarantor
  loanPurpose: string; // sanctioning/renewal/rescheduling
  companies: CibCompanyLiability[];
}

// ============================================================================
// DUMMY API DATA (Mock backend response)
// ============================================================================
export const dummyCibApiResponse: CibReportData = {
  bankName: "Mutual Trust Bank PLC",
  branchName: "Corporate Head Office, Dhaka",
  inquiryDate: new Date().toLocaleDateString("en-GB"),
  reference: "CIB/2026/SBL-001",

  borrowerName: "MD. JAHIDUR RAHMAN",
  fatherName: "MD. FAIZUR RAHMAN",
  motherName: "ASHRUFA FAYEZ",
  spouseName: "NABILA MUSTAFY",
  gender: "Male",
  dateOfBirth: "1989-12-05",
  districtOfBirth: "DHAKA",
  countryOfBirth: "BANGLADESH",

  permanentAddress: "H-8/10, ROAD-15, SEC 10, UTTARA",
  permanentDistrict: "DHAKA",
  permanentPostCode: "1230",
  presentAddress: "H-8/10, ROAD-15, SEC 10, UTTARA",
  presentDistrict: "DHAKA",
  presentPostCode: "1230",

  nid: "19896125211184320",
  tin: "124938943272",
  passport: "N/A",
  drivingLicense: "N/A",
  idIssueDate: "N/A",
  idIssueCountry: "BANGLADESH",
  mobile: "01913899853",

  applicantRole: "Owner",
  loanPurpose: "Sanctioning",
  companies: [
    {
      serial: "01",
      companyName: "Khan Denim Ltd",
      mainAddress: "H-8/10, ROAD-15, SEC 10, UTTARA, DHAKA",
      additionalAddress: "Mymensingh Branch Office",
      hasLoan: true,
      bankName: "MTB",
      branchName: "Corporate Head Office",
    },
  ],
};

// ============================================================================
// MOCK API — replace with real API call
// ============================================================================
export async function fetchCibReportData(applicationId: string): Promise<CibReportData> {
  // Example real call:
  // const res = await fetch(`/api/applications/${applicationId}/cib-report`);
  // return res.json();
  await new Promise((r) => setTimeout(r, 300));
  return { ...dummyCibApiResponse, reference: `CIB/2026/${applicationId}` };
}

// ============================================================================
// PDF GENERATION
// ============================================================================
const BANK_BLUE: [number, number, number] = [0, 74, 153]; // #004a99
const LIGHT_GREY: [number, number, number] = [240, 243, 248];

function drawHeader(doc: jsPDF, title: string, data: CibReportData, pageW: number, margin: number) {
  // Border around full page
  doc.setDrawColor(...BANK_BLUE);
  doc.setLineWidth(0.6);
  doc.rect(margin - 4, 8, pageW - (margin - 4) * 2, doc.internal.pageSize.getHeight() - 16);

  // Logo placeholder (left)
  doc.setDrawColor(...BANK_BLUE);
  doc.setLineWidth(0.3);
  doc.rect(margin, 14, 24, 14);
  doc.setFontSize(7);
  doc.setTextColor(...BANK_BLUE);
  doc.text("MTB LOGO", margin + 12, 22, { align: "center" });

  // Bank name + title (center)
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BANK_BLUE);
  doc.text(data.bankName, pageW / 2, 18, { align: "center" });

  doc.setFontSize(11);
  doc.text(title, pageW / 2, 24, { align: "center" });

  // Branch info (right)
  doc.setFontSize(8);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(60, 60, 60);
  const rightX = pageW - margin;
  doc.text(`Branch: ${data.branchName}`, rightX, 16, { align: "right" });
  doc.text(`Date: ${data.inquiryDate}`, rightX, 20, { align: "right" });
  doc.text(`Ref: ${data.reference}`, rightX, 24, { align: "right" });

  // Divider under header
  doc.setDrawColor(...BANK_BLUE);
  doc.setLineWidth(0.4);
  doc.line(margin, 32, pageW - margin, 32);
}

function drawSectionTitle(doc: jsPDF, text: string, y: number, margin: number, pageW: number): number {
  doc.setFillColor(...BANK_BLUE);
  doc.rect(margin, y, pageW - margin * 2, 6, "F");
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255, 255, 255);
  doc.text(text, margin + 2, y + 4.2);
  return y + 9;
}

function drawFooter(doc: jsPDF, pageNum: number, totalPages: number, pageW: number, pageH: number) {
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.setFont("helvetica", "normal");
  doc.text(
    "This is a system-generated document. Confidential — for internal bank use only.",
    pageW / 2,
    pageH - 5,
    { align: "center" },
  );
  doc.text(`Page ${pageNum} of ${totalPages}`, pageW - 18, pageH - 5);
}

// ----------- PAGE 1: CIB INQUIRY FORM -----------
function buildCibInquiryPage(doc: jsPDF, data: CibReportData) {
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 14;
  drawHeader(doc, "ONLINE CIB INQUIRY FORM", data, pageW, margin);

  let y = 38;

  // ---- Individual Data (2-column) ----
  y = drawSectionTitle(doc, "INDIVIDUAL DATA", y, margin, pageW);
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    body: [
      ["Borrower Name", data.borrowerName, "Father's Name", data.fatherName],
      ["Mother's Name", data.motherName, "Spouse's Name", data.spouseName],
      ["Gender", data.gender, "Date of Birth", data.dateOfBirth],
      ["District of Birth", data.districtOfBirth, "Country of Birth", data.countryOfBirth],
      ["Mobile No.", data.mobile, "Applicant Role", data.applicantRole],
    ],
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 2 },
    columnStyles: {
      0: { fontStyle: "bold", fillColor: LIGHT_GREY, cellWidth: 35 },
      1: { cellWidth: 55 },
      2: { fontStyle: "bold", fillColor: LIGHT_GREY, cellWidth: 35 },
      3: { cellWidth: "auto" },
    },
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // ---- Address ----
  y = drawSectionTitle(doc, "ADDRESS DETAILS", y, margin, pageW);
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Type", "Address", "District", "Post Code"]],
    body: [
      ["Permanent", data.permanentAddress, data.permanentDistrict, data.permanentPostCode],
      ["Present", data.presentAddress, data.presentDistrict, data.presentPostCode],
    ],
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: BANK_BLUE, textColor: 255, fontStyle: "bold" },
    columnStyles: {
      0: { fontStyle: "bold", cellWidth: 25 },
      2: { cellWidth: 30 },
      3: { cellWidth: 25 },
    },
  });
  y = (doc as any).lastAutoTable.finalY + 5;

  // ---- Identification Documents ----
  y = drawSectionTitle(doc, "IDENTIFICATION DOCUMENT DATA", y, margin, pageW);
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Document", "Number", "Issue Date", "Issue Country"]],
    body: [
      ["National ID (NID)", data.nid, "—", data.idIssueCountry || "BANGLADESH"],
      ["TIN", data.tin, "—", "BANGLADESH"],
      ["Passport", data.passport || "N/A", data.idIssueDate || "N/A", data.idIssueCountry || "N/A"],
      ["Driving License", data.drivingLicense || "N/A", "N/A", "N/A"],
    ],
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { fillColor: BANK_BLUE, textColor: 255, fontStyle: "bold" },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 45 } },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // ---- Signatures ----
  const pageH = doc.internal.pageSize.getHeight();
  const sigY = pageH - 35;
  doc.setDrawColor(120, 120, 120);
  doc.setLineWidth(0.3);
  doc.line(margin + 10, sigY, margin + 70, sigY);
  doc.line(pageW - margin - 70, sigY, pageW - margin - 10, sigY);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(60, 60, 60);
  doc.text("Borrower Signature", margin + 40, sigY + 5, { align: "center" });
  doc.text("Bank Official Seal & Signature", pageW - margin - 40, sigY + 5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(`Name: ${data.borrowerName}`, margin + 40, sigY + 10, { align: "center" });
  doc.text(`Date: ${data.inquiryDate}`, pageW - margin - 40, sigY + 10, { align: "center" });
}

// ----------- PAGE 2: UNDERTAKING -----------
function buildUndertakingPage(doc: jsPDF, data: CibReportData) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 14;
  drawHeader(doc, "UNDERTAKING — ATTACHMENT-KA", data, pageW, margin);

  let y = 40;

  // To address block
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(40, 40, 40);
  doc.text("To", margin, y); y += 5;
  doc.text("The Manager", margin, y); y += 5;
  doc.text(data.bankName, margin, y); y += 5;
  doc.text(data.branchName, margin, y); y += 8;

  doc.setFont("helvetica", "bold");
  doc.text("Subject: Provision of information on the ownership of companies and their bank liabilities.", margin, y);
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.text("Dear Sir,", margin, y); y += 6;

  // Undertaking body
  const body =
    `I, ${data.borrowerName}, ${data.applicantRole.toLowerCase()} of am applying for ${data.loanPurpose.toLowerCase()} of a loan in my own name. ` +
    `My father's name: ${data.fatherName}, mother's name: ${data.motherName}, spouse's name: ${data.spouseName}. ` +
    `Permanent address: ${data.permanentAddress}, District: ${data.permanentDistrict}, Post Code: ${data.permanentPostCode}, Country: BD. ` +
    `Present address: ${data.presentAddress}, District: ${data.presentDistrict}, Post Code: ${data.presentPostCode}. ` +
    `Date of Birth: ${data.dateOfBirth}, District of Birth: ${data.districtOfBirth}, Country of Birth: ${data.countryOfBirth}. ` +
    `National ID Number: ${data.nid}, TIN: ${data.tin}, Gender: ${data.gender}, Telephone: ${data.mobile}. ` +
    `The list of companies under my ownership along with their bank liability status is given in the following table:`;

  doc.setFontSize(9.5);
  const lines = doc.splitTextToSize(body, pageW - margin * 2);
  doc.text(lines, margin, y, { align: "justify", maxWidth: pageW - margin * 2 });
  y += lines.length * 4.6 + 4;

  // Companies table
  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Sl.", "Company Name", "Main Address", "Additional Address", "Loan?", "Bank", "Branch"]],
    body: data.companies.map((c) => [
      c.serial,
      c.companyName,
      c.mainAddress,
      c.additionalAddress,
      c.hasLoan ? "Yes" : "N/A",
      c.bankName || "—",
      c.branchName || "—",
    ]),
    theme: "grid",
    styles: { fontSize: 8.5, cellPadding: 2 },
    headStyles: { fillColor: BANK_BLUE, textColor: 255, fontStyle: "bold" },
    columnStyles: {
      0: { cellWidth: 10, halign: "center" },
      4: { cellWidth: 14, halign: "center" },
    },
  });
  y = (doc as any).lastAutoTable.finalY + 6;

  // Declaration
  doc.setFontSize(9.5);
  doc.setFont("helvetica", "italic");
  doc.setTextColor(40, 40, 40);
  const decl =
    "I hereby declare that the information provided is true and correct to the best of my knowledge. " +
    "Apart from stated above, if any liability in my own name or my company's name is found, I will be bound to obey any decision " +
    "made by the authority concerned relating to sanctioning/renewal/rescheduling of the loan applied for and I will be punishable " +
    "by law for providing this false or fabricated information.";
  const declLines = doc.splitTextToSize(decl, pageW - margin * 2);
  doc.text(declLines, margin, y);
  y += declLines.length * 4.6 + 6;

  // Horizontal separator
  doc.setDrawColor(...BANK_BLUE);
  doc.setLineWidth(0.3);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Signatures
  const sigY = pageH - 35;
  doc.setDrawColor(120, 120, 120);
  doc.line(margin + 10, sigY, margin + 80, sigY);
  doc.line(pageW - margin - 80, sigY, pageW - margin - 10, sigY);
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(60, 60, 60);
  doc.text("Seal & Signature of Bank Official", margin + 45, sigY + 5, { align: "center" });
  doc.text("Customer's Signature", pageW - margin - 45, sigY + 5, { align: "center" });
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text("(Who certified the borrower)", margin + 45, sigY + 10, { align: "center" });
  doc.text(`Name: ${data.borrowerName}`, pageW - margin - 45, sigY + 10, { align: "center" });
}

export function generateCibReportPdf(data: CibReportData) {
  const doc = new jsPDF("p", "mm", "a4");

  // Page 1: CIB Inquiry Form
  buildCibInquiryPage(doc, data);

  // Page 2: Undertaking
  doc.addPage();
  buildUndertakingPage(doc, data);

  // Footers
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const total = doc.getNumberOfPages();
  for (let i = 1; i <= total; i++) {
    doc.setPage(i);
    drawFooter(doc, i, total, pageW, pageH);
  }

  doc.save(`CIB_Report_${data.borrowerName.replace(/\s+/g, "_")}.pdf`);
}
