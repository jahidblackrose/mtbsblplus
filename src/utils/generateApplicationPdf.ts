import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import letterHeaderImg from "@/assets/letter_header.png";
import letterFooterImg from "@/assets/letter_footer.png";

interface ApplicationData {
  id: string;
  business: string;
  cif: string;
  branch: string;
  status: string;
  limit: string;
  date: string;
  businessType?: string;
  enterpriseType?: string;
  legalStatus?: string;
  memoDate?: string;
  proposedLimit?: string;
  existingLimit?: string;
  os?: string;
  rating?: string;
  keyPerson?: string;
  remarks?: string;
}

export function generateApplicationPdf(app: ApplicationData) {
  const doc = new jsPDF("p", "mm", "a4");
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 18;
  let y = 10;

  // Header image
  try {
    doc.addImage(letterHeaderImg, "PNG", margin, y, pageW - margin * 2, 18);
  } catch {
    // fallback text header
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text("Mutual Trust Bank PLC", pageW / 2, y + 10, { align: "center" });
  }
  y += 24;

  // Divider
  doc.setDrawColor(43, 87, 151);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 8;

  // Title
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(43, 87, 151);
  doc.text("Application Summary Report", pageW / 2, y, { align: "center" });
  y += 8;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString("en-GB")} | Application: ${app.id}`, pageW / 2, y, { align: "center" });
  y += 10;

  // Key details table
  const details: [string, string][] = [
    ["Application No.", app.id],
    ["Business Name", app.business],
    ["CIF", app.cif],
    ["Branch", app.branch],
    ["Status", app.status],
    ["Business Type", app.businessType || "—"],
    ["Enterprise Type", app.enterpriseType || "—"],
    ["Legal Status", app.legalStatus || "—"],
    ["Date", app.date],
    ["Memo Date", app.memoDate || "—"],
    ["Proposed Limit", app.proposedLimit || app.limit],
    ["Existing Limit", app.existingLimit || "0.00"],
    ["Outstanding", app.os || "0.00"],
    ["Rating", app.rating || "Unrated"],
    ["Key Person", app.keyPerson || "—"],
  ];

  autoTable(doc, {
    startY: y,
    head: [["Field", "Value"]],
    body: details,
    margin: { left: margin, right: margin },
    styles: { fontSize: 9, cellPadding: 2.5 },
    headStyles: { fillColor: [43, 87, 151], textColor: 255, fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    columnStyles: { 0: { fontStyle: "bold", cellWidth: 55 } },
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // Remarks
  if (app.remarks) {
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(43, 87, 151);
    doc.text("Remarks / Observations", margin, y);
    y += 5;
    doc.setFont("helvetica", "normal");
    doc.setTextColor(60, 60, 60);
    doc.setFontSize(9);
    const lines = doc.splitTextToSize(app.remarks, pageW - margin * 2);
    doc.text(lines, margin, y);
    y += lines.length * 4.5 + 8;
  }

  // Signature block
  if (y > pageH - 55) {
    doc.addPage();
    y = 25;
  }

  y = pageH - 52;
  doc.setDrawColor(180, 180, 180);
  doc.setLineWidth(0.2);

  const sigW = (pageW - margin * 2 - 20) / 3;
  const labels = ["Prepared By", "Reviewed By", "Approved By"];
  labels.forEach((lbl, i) => {
    const x = margin + i * (sigW + 10);
    doc.line(x, y, x + sigW, y);
    doc.setFontSize(8);
    doc.setTextColor(120, 120, 120);
    doc.text(lbl, x + sigW / 2, y + 5, { align: "center" });
    doc.text("Date: ___________", x + sigW / 2, y + 10, { align: "center" });
  });

  // Footer image
  try {
    doc.addImage(letterFooterImg, "PNG", margin, pageH - 16, pageW - margin * 2, 10);
  } catch {
    doc.setFontSize(7);
    doc.setTextColor(150, 150, 150);
    doc.text("© 2026 Mutual Trust Bank PLC — www.mutualtrust.com", pageW / 2, pageH - 8, { align: "center" });
  }

  // Save
  const filename = `${app.id.replace(/[^a-zA-Z0-9-]/g, "_")}_Summary.pdf`;
  doc.save(filename);
}
