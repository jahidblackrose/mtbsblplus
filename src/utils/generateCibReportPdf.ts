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
  branchCode: string;
  inquiryDate: string;
  reference: string;
  fiSubjectCode?: string;
  headOfficeRef?: string;

  // Loan info
  typeOfFinancing: string;
  creditLimit: string;
  numberOfInstallments: string;
  installmentAmount: string;
  applicationType: "New" | "Renewal" | "Enhancement" | "Other";

  // Borrower
  borrowerTitle?: string;
  borrowerName: string;
  fatherTitle?: string;
  fatherName: string;
  motherTitle?: string;
  motherName: string;
  spouseTitle?: string;
  spouseName: string;
  gender: string;
  dateOfBirth: string;
  districtOfBirth: string;
  countryOfBirth: string;

  // Address
  permanentAddress: string;
  permanentDistrict: string;
  permanentCountry: string;
  permanentPostCode: string;
  presentAddress: string;
  presentDistrict: string;
  presentCountry: string;
  presentPostCode: string;

  // IDs
  nid: string;
  tin: string;
  passport?: string;
  drivingLicense?: string;
  idIssueDate?: string;
  idIssueCountry?: string;
  mobile: string;

  // Sector
  sectorType: string;
  sectorCode?: string;

  // Undertaking
  applicantRole: string; // owner/partner/director/guarantor
  loanPurpose: string; // sanctioning/renewal/rescheduling
  companies: CibCompanyLiability[];
}

// ============================================================================
// DUMMY API DATA (Mock backend response)
// ============================================================================
export const dummyCibApiResponse: CibReportData = {
  bankName: "Mutual Trust Bank PLC.",
  branchName: "CORPORATE HEAD OFFICE",
  branchCode: "57",
  inquiryDate: "1/27/2026 3:51:09 PM",
  reference: "10628",

  typeOfFinancing: "MTB Agri Loan",
  creditLimit: "0",
  numberOfInstallments: "60",
  installmentAmount: "",
  applicationType: "New",

  borrowerName: "MD. JAHIDUR RAHMAN",
  fatherName: "MD. FAIZUR RAHMAN",
  motherName: "ASHRUFA FAYEZ",
  spouseName: "NABILA MUSTAFY",
  gender: "Male",
  dateOfBirth: "05-12-1989",
  districtOfBirth: "",
  countryOfBirth: "BD",

  permanentAddress: "H-8/10, ROAD -15, SEC 10 MYMENSINGH UTTARA MYMENSINGH",
  permanentDistrict: "DHAKA",
  permanentCountry: "Bangladesh",
  permanentPostCode: "1230",
  presentAddress: "H-8/10, ROAD -15, SEC 10 UTTARA,DHAKA UTTARA DHAKA",
  presentDistrict: "DHAKA",
  presentCountry: "Bangladesh",
  presentPostCode: "1230",

  nid: "19896125211184320",
  tin: "124938943272",
  passport: "N/A",
  drivingLicense: "N/A",
  idIssueDate: "N/A",
  idIssueCountry: "BANGLADESH",
  mobile: "01913899853",

  sectorType: "Private",
  sectorCode: "",

  applicantRole: "owner",
  loanPurpose: "sanctioning",
  companies: [
    {
      serial: "01",
      companyName: "",
      mainAddress: "",
      additionalAddress: "",
      hasLoan: true,
      bankName: "MTB",
      branchName: "Corporate Head Office",
    },
  ],
};

// ============================================================================
// MOCK API
// ============================================================================
export async function fetchCibReportData(applicationId: string): Promise<CibReportData> {
  await new Promise((r) => setTimeout(r, 300));
  return { ...dummyCibApiResponse, reference: dummyCibApiResponse.reference };
}

// ============================================================================
// COLORS
// ============================================================================
const GREEN: [number, number, number] = [154, 205, 50]; // lime/yellow-green bar
const RED: [number, number, number] = [220, 30, 30];
const BLACK: [number, number, number] = [0, 0, 0];
const GREY_LINE: [number, number, number] = [120, 120, 120];

// ============================================================================
// PAGE 1 — CIB INQUIRY FORM
// ============================================================================
function buildCibInquiryPage(doc: jsPDF, d: CibReportData) {
  const pageW = doc.internal.pageSize.getWidth();
  const M = 12; // margin
  const RIGHT_BOX_W = 55;
  const rightBoxX = pageW - M - RIGHT_BOX_W;

  // ---- Header (centered title) ----
  doc.setFont("times", "bold");
  doc.setTextColor(...BLACK);
  doc.setFontSize(11);
  doc.text("Mutual Trust Bank PLC.", pageW / 2, 12, { align: "center" });
  doc.text("ONLINE CIB INQUIRY FORM: MTB Krishi", pageW / 2, 17, { align: "center" });
  doc.text("(TO BE FILLED IN CAPITAL LETTER/TYPE)", pageW / 2, 22, { align: "center" });

  // ---- Green bar (full width) ----
  const greenBarY = 25;
  doc.setFillColor(...GREEN);
  doc.rect(M, greenBarY, pageW - M * 2, 6, "F");

  // Subject Type label inside green bar (right)
  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...BLACK);
  doc.text("Subject Type:  Individual", pageW - M - 2, greenBarY + 4, { align: "right" });

  // (Please Tick) line under green bar — grey background segment on right
  const tickY = greenBarY + 6;
  doc.setFillColor(225, 225, 225);
  doc.rect(rightBoxX, tickY, RIGHT_BOX_W, 5, "F");
  doc.setTextColor(...BLACK);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8.5);
  doc.text("(Please Tick ✔ )", pageW - M - 2, tickY + 3.6, { align: "right" });

  // ---- Top fields (left col) + numbered options (right col) ----
  let y = tickY + 9;
  const labelX = M + 1;

  // Helper for red label + black value
  const redLabel = (label: string, value: string, ly: number) => {
    doc.setTextColor(...RED);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(label, labelX, ly);
    const labelW = doc.getTextWidth(label);
    doc.setTextColor(...BLACK);
    doc.text(" " + value, labelX + labelW, ly);
  };

  redLabel("*Type of Financing:", d.typeOfFinancing, y);

  // Numbered options (right side)
  doc.setTextColor(...RED);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  const optX = rightBoxX + 4;
  doc.text("1.  New", optX, y);
  doc.text("2.  Renewal", optX, y + 5);
  doc.text("3.  Enhancement", optX, y + 10);
  doc.text("4.  Other", optX, y + 15);

  y += 6;
  redLabel("*Credit Limit:", d.creditLimit, y);
  y += 6;

  // Installments line (red labels, black numbers)
  doc.setTextColor(...RED);
  doc.setFont("helvetica", "bold");
  doc.text("*Number of Installments:", labelX, y);
  let xCursor = labelX + doc.getTextWidth("*Number of Installments:") + 4;
  doc.setTextColor(...BLACK);
  doc.text(d.numberOfInstallments + ".", xCursor, y);
  xCursor += 18;
  doc.setTextColor(...RED);
  doc.text("Installment Amount:", xCursor, y);
  xCursor += doc.getTextWidth("Installment Amount:") + 4;
  doc.setTextColor(...BLACK);
  doc.text(d.installmentAmount || ".", xCursor, y);

  y += 5;
  doc.setTextColor(...RED);
  doc.setFont("helvetica", "bold");
  doc.text("[For Term loan ]", labelX, y);

  // ---- Horizontal divider ----
  y += 4;
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.3);
  doc.line(M, y, pageW - M, y);
  y += 5;

  // ---- Branch info (two cols) ----
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...BLACK);
  const col2X = pageW / 2 + 10;

  doc.text("Name of the Branch", labelX, y);
  doc.text(":", labelX + 50, y);
  doc.text(d.branchName, labelX + 53, y);
  doc.text("BRANCH CODE", col2X, y);
  doc.text(d.branchCode, col2X + 35, y);
  y += 5;

  doc.text("Reference no.(s) of the branch", labelX, y);
  doc.text(":" + d.reference, labelX + 50, y);
  doc.text("Date", col2X, y);
  doc.text(": " + d.inquiryDate, col2X + 35, y);
  y += 5;

  doc.setTextColor(...RED);
  doc.setFont("helvetica", "bold");
  doc.text("*FI Subject Code (CRM/CIF No.) for Existing Client:", labelX, y);
  doc.setTextColor(...BLACK);
  doc.setFont("helvetica", "normal");
  doc.text(" " + ".".repeat(50), labelX + 80, y);
  y += 5;

  doc.text("Reference no.(s) of the Head Office", labelX, y);
  doc.text(": " + ".".repeat(50), labelX + 50, y);
  y += 6;

  // ---- (TO BE FILLED IN CAPITAL LETTER/TYPE) red center ----
  doc.setTextColor(...RED);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.text("(TO BE FILLED IN CAPITAL LETTER/TYPE)", pageW / 2, y, { align: "center" });
  y += 3;

  // ---- Section: Individual Data ----
  y = greenSection(doc, "Individual Data:", y, M, pageW);

  // Name rows: title + value column
  const titleColX = labelX;
  const titleColW = 65;
  const nameColX = labelX + 80;

  const nameRow = (boldLabel: string, titleLabel: string, name: string, ly: number, mandatory = true) => {
    doc.setTextColor(...(mandatory ? RED : BLACK));
    doc.setFont("helvetica", "bold");
    doc.setFontSize(9);
    doc.text(boldLabel, titleColX, ly);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(...BLACK);
    doc.text(titleLabel, titleColX, ly + 4);
    doc.text(": " + ".".repeat(20), titleColX + 38, ly + 4);
    doc.setTextColor(...(mandatory ? RED : BLACK));
    doc.setFont("helvetica", "bold");
    doc.text(mandatory ? "*Name:" : "Name:", nameColX, ly + 4);
    doc.setTextColor(...BLACK);
    doc.setFont("helvetica", "normal");
    doc.text(" " + name, nameColX + (mandatory ? 14 : 12), ly + 4);
  };

  nameRow("*Name of the borrower:", "Title(MD, HAJEE, etc)", d.borrowerName, y);
  y += 9;
  nameRow("*Father's Name:", "Title (LATE,MD, HAJEE, etc)", d.fatherName, y);
  y += 9;
  nameRow("*Mother's Name:", "Title (LATE,MD, HAJEE, etc)", d.motherName, y);
  y += 9;
  nameRow("Spouse's Name:", "Title (LATE,MD, HAJEE, etc)", d.spouseName, y, false);
  y += 9;

  // ---- Section: Address ----
  y = greenSection(doc, "* Address:", y, M, pageW);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(...RED);
  doc.text("*Permanent/Main Address:", labelX, y);
  doc.setTextColor(...BLACK);
  doc.setFont("helvetica", "normal");
  doc.text(" " + d.permanentAddress + " .", labelX + 45, y);
  y += 5;

  // District / Country / Postal
  const triRow = (district: string, country: string, postal: string, ly: number, mandatoryCountry = true) => {
    doc.setFont("helvetica", "bold");
    doc.setTextColor(...RED);
    doc.text("*District", labelX, ly);
    doc.setTextColor(...BLACK);
    doc.setFont("helvetica", "normal");
    doc.text(": " + district, labelX + 18, ly);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...(mandatoryCountry ? RED : BLACK));
    doc.text(mandatoryCountry ? "*Country" : "Country", pageW / 2 - 10, ly);
    doc.setTextColor(...BLACK);
    doc.setFont("helvetica", "normal");
    doc.text(": " + country + ".", pageW / 2 + 8, ly);

    doc.setFont("helvetica", "bold");
    doc.setTextColor(...RED);
    doc.text("*Postal Code", pageW - M - 45, ly);
    doc.setTextColor(...BLACK);
    doc.setFont("helvetica", "normal");
    doc.text(": " + postal, pageW - M - 20, ly);
  };

  triRow(d.permanentDistrict, d.permanentCountry, d.permanentPostCode, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...RED);
  doc.text("*Present/ Additional Address:", labelX, y);
  doc.setTextColor(...BLACK);
  doc.setFont("helvetica", "normal");
  doc.text(" " + d.presentAddress + ",", labelX + 50, y);
  y += 5;
  triRow(d.presentDistrict, d.presentCountry, d.presentPostCode, y, false);
  y += 6;

  // ---- Section: Identification Document Data ----
  y = greenSection(doc, "Identification Document Data:", y, M, pageW);

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...RED);
  doc.text("*National ID No.", labelX, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BLACK);
  doc.text(": " + d.nid + ".", labelX + 32, y);
  doc.setFont("helvetica", "normal");
  doc.text("TIN", pageW / 2 + 30, y);
  doc.text(":" + d.tin + ".", pageW / 2 + 40, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...RED);
  doc.text("* Date of Birth", labelX, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BLACK);
  doc.text(": " + d.dateOfBirth + ".", labelX + 32, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...RED);
  doc.text("*Gender", pageW / 2 + 30, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BLACK);
  doc.text(": " + d.gender, pageW / 2 + 50, y);
  y += 5;

  doc.setFont("helvetica", "bold");
  doc.setTextColor(...RED);
  doc.text("*District of Birth", labelX, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BLACK);
  doc.text(": " + (d.districtOfBirth || "."), labelX + 32, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...RED);
  doc.text("*Country of Birth", pageW / 2 + 30, y);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BLACK);
  doc.text(": " + d.countryOfBirth + ".", pageW / 2 + 60, y);
  y += 5;

  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BLACK);
  doc.text("Telephone No", labelX, y);
  doc.text(": " + d.mobile, labelX + 32, y);
  y += 6;

  // ---- Section: Sector Data ----
  y = greenSection(doc, "Sector Data:", y, M, pageW);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...BLACK);
  doc.text("Sector Type", labelX, y);
  doc.text(": " + d.sectorType, labelX + 32, y);
  doc.text("Sector Code", pageW - M - 50, y);
  doc.text(": " + (d.sectorCode || "."), pageW - M - 20, y);
  y += 8;

  // ---- Statement (a / b) ----
  doc.setFont("helvetica", "normal");
  doc.setTextColor(...RED);
  doc.text("*", labelX, y);
  doc.setTextColor(...BLACK);
  doc.text("To the best of our knowledge the above owner:", labelX + 3, y);
  y += 5;
  doc.text("a.   Obtained credit facilities in individual name:", labelX + 6, y);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...RED);
  doc.text("Yes", labelX + 80, y);
  doc.setTextColor(...BLACK);
  doc.text(" ✔", labelX + 89, y);
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.text("b.   Has got other business which obtained credit facilities from the banks/financial Institution as mentioned below:", labelX + 6, y);
  y += 4;

  // ---- Banks table ----
  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M },
    head: [["Sl No", "Name of the Banks/Financial Institutions", "Name of the Branch with District"]],
    body: [["1", "", ""]],
    theme: "grid",
    styles: { fontSize: 9, cellPadding: 2, textColor: BLACK, lineColor: GREY_LINE, lineWidth: 0.2 },
    headStyles: { fillColor: [245, 245, 245], textColor: BLACK, fontStyle: "bold", lineColor: GREY_LINE, lineWidth: 0.2 },
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 80 },
    },
  });
  y = (doc as any).lastAutoTable.finalY + 8;

  // ---- Note + Signature block ----
  // Signature on right
  const sigX = pageW - M - 80;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(...BLACK);
  doc.text("Signature", sigX, y);
  doc.text(":", sigX + 22, y);
  doc.setFont("helvetica", "normal");
  doc.text("Head of the Branch / Division", sigX + 26, y);
  y += 5;
  doc.text("Name", sigX, y);
  doc.text(":", sigX + 22, y);
  doc.text(".".repeat(40), sigX + 26, y);
  y += 5;
  doc.text("Seal", sigX, y);
  doc.text(":", sigX + 22, y);
  y += 6;

  // Note (left, with line above)
  const noteY = y - 12;
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.3);
  doc.line(M, noteY, sigX - 8, noteY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8.5);
  doc.text(
    "Note:  Suppressing of distortion of any information (related to borrower / owner) by the bank / financial",
    M,
    noteY + 4,
  );
  doc.text("            Institution is punishable under Bangladesh Bank Order 1972, Chapter IV Art.48.", M, noteY + 8);

  // Mandatory note
  doc.setFont("helvetica", "bold");
  doc.setTextColor(...RED);
  doc.text("(*) indicates Mandatory fields", M, noteY + 16);
  doc.setTextColor(...BLACK);
  doc.text(".", M + 45, noteY + 16);
}

function greenSection(doc: jsPDF, label: string, y: number, M: number, pageW: number): number {
  doc.setFillColor(...GREEN);
  doc.rect(M, y, pageW - M * 2, 5, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9.5);
  doc.setTextColor(...BLACK);
  doc.text(label, M + 1.5, y + 3.6);
  return y + 8;
}

// ============================================================================
// PAGE 2 — UNDERTAKING
// ============================================================================
function buildUndertakingPage(doc: jsPDF, d: CibReportData) {
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const M = 18;
  const contentW = pageW - M * 2;

  // ---- Title ----
  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.setTextColor(...BLACK);
  doc.text("UNDERTAKING", pageW / 2, 18, { align: "center" });

  // Attachment-Ka top right
  doc.setFontSize(11);
  doc.text("Attachment-Ka", pageW - M, 28, { align: "right" });

  let y = 40;

  // ---- To block ----
  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.text("To", M, y); y += 5;
  doc.text("The Manager", M, y); y += 5;
  doc.text(d.bankName, M, y); y += 5;
  doc.text(d.branchName === "CORPORATE HEAD OFFICE" ? "Corporate Head Office," : d.branchName + ",", M, y); y += 5;
  doc.text("DHAKA", M, y); y += 8;

  // ---- Subject ----
  doc.text("Subject: Provision of information on the ownership of companies and their bank liabilities.", M, y);
  y += 8;

  // ---- Salutation ----
  doc.text("Dear Sir,", M, y);
  y += 7;

  // ---- Body paragraph ----
  const body =
    `I, ${d.borrowerName} ${d.applicantRole}/partner/director/guarantor of am applying for ${d.loanPurpose}/renewal/rescheduling of a loan in my own name/ aforementioned company's name. ` +
    `My father's name: ${d.fatherName} mother's name: ${d.motherName} Husband's name(in case of married woman): ${d.spouseName}., ` +
    `Main (Permanent)address: Village: ${d.permanentAddress}, Street Name/PS/Upazilla: UTTARA District: ${d.permanentDistrict} Postal code  country BD, ` +
    `Additional (Business) address: Village:${d.presentAddress}, Street Name/PS/Upazilla:  District: ${d.presentDistrict} Postal code ${d.presentPostCode} country BD., ` +
    `Date of Birth: ${d.dateOfBirth} District of Birth: ${d.districtOfBirth} Country of Birth: ${d.idIssueCountry || "BANGLADESH"}  National ID Number: ${d.nid} ` +
    `Other ID documents(Passport/Driving licence/Nationality Certificate) : ID number……${d.passport || "N/A"}…….ID issue date……${d.idIssueDate || "N/A"}………ID issue country ${d.idIssueCountry || "BANGLADESH"}.,` +
    `TIN: ${d.tin}, Gender: ${d.gender}, Telephone Number: ${d.mobile} are given for your kind consideration. ` +
    `The list of companies under the ownership of mine along with their bank liability status is given in the following table:`;

  doc.setFontSize(11);
  const lines = doc.splitTextToSize(body, contentW);
  // justified text - simple approach
  doc.text(lines, M, y, { align: "justify", maxWidth: contentW, lineHeightFactor: 1.5 });
  y += lines.length * 5.5 + 4;

  // ---- Companies table with merged headers ----
  // Column widths (sum = contentW)
  const colW = {
    serial: 18,
    company: 28,
    main: 26,
    additional: 26,
    bankFI: 30,
    branch: 30,
    na: 16,
  };
  const totalW = Object.values(colW).reduce((a, b) => a + b, 0);
  // Scale to contentW
  const scale = contentW / totalW;
  Object.keys(colW).forEach((k) => ((colW as any)[k] = (colW as any)[k] * scale));

  autoTable(doc, {
    startY: y,
    margin: { left: M, right: M },
    head: [
      [
        { content: "Serial no.", rowSpan: 3, styles: { valign: "middle", halign: "center" } },
        { content: "Name of the Company", rowSpan: 3, styles: { valign: "middle", halign: "center" } },
        { content: "Main Address", rowSpan: 3, styles: { valign: "middle", halign: "center" } },
        { content: "Additional Address", rowSpan: 3, styles: { valign: "middle", halign: "center" } },
        { content: "Whether the company is availing any loan or not", colSpan: 3, styles: { halign: "center" } },
      ],
      [
        { content: "Yes", colSpan: 2, styles: { halign: "center" } },
        { content: "N/A", rowSpan: 2, styles: { valign: "middle", halign: "center" } },
      ],
      [
        { content: "Name of the bank/FI", styles: { halign: "center" } },
        { content: "Name of the branch", styles: { halign: "center" } },
      ],
    ],
    body: d.companies.map((c) => [
      c.serial,
      c.companyName,
      c.mainAddress,
      c.additionalAddress,
      c.hasLoan ? c.bankName || "" : "",
      c.hasLoan ? c.branchName || "" : "",
      c.hasLoan ? "" : "N/A",
    ]),
    theme: "grid",
    styles: {
      fontSize: 10,
      cellPadding: 3,
      textColor: BLACK,
      lineColor: BLACK,
      lineWidth: 0.3,
      valign: "middle",
      halign: "center",
    },
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: BLACK,
      fontStyle: "normal",
      lineColor: BLACK,
      lineWidth: 0.3,
    },
    columnStyles: {
      0: { cellWidth: colW.serial },
      1: { cellWidth: colW.company },
      2: { cellWidth: colW.main },
      3: { cellWidth: colW.additional },
      4: { cellWidth: colW.bankFI },
      5: { cellWidth: colW.branch },
      6: { cellWidth: colW.na },
    },
  });
  y = (doc as any).lastAutoTable.finalY + 6;

  // ---- Closing paragraph ----
  doc.setFont("helvetica", "normal");
  doc.setFontSize(11);
  const closing =
    "Apart from stated above, if any liability in my own name or my company's name is found, I will be bound to obey any decision made by the authority concerned relating to sanctioning/renewal/rescheduling of the loan applied for and I will be punishable by law for providing this false or fabricated information.";
  const closingLines = doc.splitTextToSize(closing, contentW);
  doc.text(closingLines, M, y, { lineHeightFactor: 1.5 });
  y += closingLines.length * 5.5 + 8;

  // ---- Signature box (2 columns) ----
  const boxH = 36;
  const colWidth = contentW / 2;
  doc.setDrawColor(...BLACK);
  doc.setLineWidth(0.3);
  // Outer rect
  doc.rect(M, y, contentW, boxH);
  // Divider
  doc.line(M + colWidth, y, M + colWidth, y + boxH);

  // Left cell text
  doc.setFontSize(11);
  const leftText = doc.splitTextToSize(
    "Seal and Signature of the bank official  who certified the borrower",
    colWidth - 6,
  );
  doc.text(leftText, M + 3, y + 8);

  // Right cell text
  let ry = y + 6;
  doc.text("Customer's Signature:", M + colWidth + 3, ry); ry += 8;
  doc.setFont("helvetica", "normal");
  doc.text("Name:", M + colWidth + 3, ry);
  doc.setFont("helvetica", "bold");
  doc.text(d.borrowerName, M + colWidth + 15, ry);
  doc.setFont("helvetica", "normal");
  ry += 8;
  doc.text("Name of the Borrowing organization", M + colWidth + 3, ry);
}

// ============================================================================
// MAIN
// ============================================================================
export function generateCibReportPdf(data: CibReportData) {
  const doc = new jsPDF("p", "mm", "a4");
  buildCibInquiryPage(doc, data);
  doc.addPage();
  buildUndertakingPage(doc, data);
  doc.save(`CIB_Report_${data.borrowerName.replace(/\s+/g, "_")}.pdf`);
}
