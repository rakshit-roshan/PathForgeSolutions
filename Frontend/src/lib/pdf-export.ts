/**
 * lib/pdf-export.ts — Internship Report PDF Generator
 *
 * Generates a professional internship report PDF using jsPDF.
 * Called from the candidate dashboard "Export Report" page.
 *
 * Usage:
 *   import { generateInternshipReport } from '@/lib/pdf-export';
 *   await generateInternshipReport(user, logs, 'report.pdf');
 */

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { format, parseISO, differenceInDays } from "date-fns";
import type { User, DailyLog } from "@/types";
import { siteConfig } from "@/config/site.config";

interface ReportOptions {
  filename?: string;
}

export const generateInternshipReport = async (
  candidate: User,
  logs: DailyLog[],
  options: ReportOptions = {}
): Promise<void> => {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  const filename =
    options.filename ||
    `${candidate.name.replace(/\s+/g, "_")}_Internship_Report.pdf`;

  // Sort logs by date ascending
  const sortedLogs = [...logs].sort(
    (a, b) => new Date(a.logDate).getTime() - new Date(b.logDate).getTime()
  );

  const totalHours = sortedLogs.reduce((sum, l) => sum + l.hoursWorked, 0);
  const startDate = sortedLogs[0]?.logDate;
  const endDate = sortedLogs[sortedLogs.length - 1]?.logDate;
  const durationDays = startDate && endDate
    ? differenceInDays(parseISO(endDate), parseISO(startDate)) + 1
    : 0;

  // ── Page dimensions ───────────────────────────────────────────────
  const pageW = doc.internal.pageSize.getWidth();
  const margin = 15;

  // ── HEADER BAND ───────────────────────────────────────────────────
  doc.setFillColor(67, 56, 202); // Indigo-700
  doc.rect(0, 0, pageW, 38, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont("helvetica", "bold");
  doc.text(siteConfig.name, margin, 15);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Internship Completion Report", margin, 23);
  doc.text(`Generated: ${format(new Date(), "dd MMM yyyy, hh:mm a")}`, margin, 30);

  // ── CANDIDATE INFO CARD ───────────────────────────────────────────
  let y = 48;
  doc.setFillColor(248, 250, 252); // Slate-50
  doc.roundedRect(margin, y, pageW - margin * 2, 42, 3, 3, "F");
  doc.setDrawColor(226, 232, 240); // Slate-200
  doc.roundedRect(margin, y, pageW - margin * 2, 42, 3, 3, "S");

  doc.setTextColor(15, 23, 42); // Slate-900
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Candidate Information", margin + 5, y + 10);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(71, 85, 105); // Slate-600

  const infoItems = [
    [`Name:`, candidate.name],
    [`Email:`, candidate.email],
    [`Track:`, candidate.internshipTrack || "N/A"],
    [`Joining Date:`, candidate.joiningDate ? format(parseISO(candidate.joiningDate), "dd MMM yyyy") : "N/A"],
    [`Status:`, candidate.status || "ACTIVE"],
  ];

  const colW = (pageW - margin * 2 - 10) / 2;
  infoItems.forEach((item, i) => {
    const col = i % 2;
    const row = Math.floor(i / 2);
    const x = margin + 5 + col * colW;
    const iy = y + 18 + row * 8;
    doc.setFont("helvetica", "bold");
    doc.setTextColor(15, 23, 42);
    doc.text(item[0], x, iy);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(71, 85, 105);
    doc.text(item[1], x + 25, iy);
  });

  y += 50;

  // ── SUMMARY STATS ─────────────────────────────────────────────────
  const statBoxW = (pageW - margin * 2 - 9) / 4;
  const statItems = [
    { label: "Total Logs", value: sortedLogs.length.toString() },
    { label: "Total Hours", value: totalHours.toFixed(1) },
    { label: "Duration (days)", value: durationDays.toString() },
    { label: "Avg hrs/day", value: sortedLogs.length > 0 ? (totalHours / sortedLogs.length).toFixed(1) : "0" },
  ];

  statItems.forEach((stat, i) => {
    const x = margin + i * (statBoxW + 3);
    doc.setFillColor(239, 246, 255); // Blue-50
    doc.roundedRect(x, y, statBoxW, 22, 2, 2, "F");
    doc.setFontSize(15);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(67, 56, 202); // Indigo-700
    doc.text(stat.value, x + statBoxW / 2, y + 11, { align: "center" });
    doc.setFontSize(7);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 116, 139); // Slate-500
    doc.text(stat.label, x + statBoxW / 2, y + 18, { align: "center" });
  });

  y += 30;

  // ── DAILY LOG TABLE ───────────────────────────────────────────────
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(15, 23, 42);
  doc.text("Daily Activity Log", margin, y);
  y += 5;

  autoTable(doc, {
    startY: y,
    margin: { left: margin, right: margin },
    head: [["Date", "Tasks Completed", "Hours", "Challenges", "Mood"]],
    body: sortedLogs.map((log) => [
      format(parseISO(log.logDate), "dd MMM yy"),
      log.tasksDone.length > 80 ? log.tasksDone.substring(0, 77) + "..." : log.tasksDone,
      log.hoursWorked.toFixed(1),
      log.challenges
        ? log.challenges.length > 50 ? log.challenges.substring(0, 47) + "..." : log.challenges
        : "—",
      log.mood || "—",
    ]),
    headStyles: {
      fillColor: [67, 56, 202],
      textColor: 255,
      fontStyle: "bold",
      fontSize: 8,
    },
    bodyStyles: { fontSize: 7.5, textColor: [15, 23, 42] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    columnStyles: {
      0: { cellWidth: 22 },
      1: { cellWidth: 80 },
      2: { cellWidth: 15, halign: "center" },
      3: { cellWidth: 55 },
      4: { cellWidth: 16, halign: "center" },
    },
    didDrawPage: (data) => {
      // Footer on every page
      const pageCount = (doc as any).internal.getNumberOfPages();
      doc.setFontSize(7);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `${siteConfig.name} • Confidential • Page ${data.pageNumber} of ${pageCount}`,
        pageW / 2,
        doc.internal.pageSize.getHeight() - 8,
        { align: "center" }
      );
    },
  });

  // ── FINAL PAGE: SIGNATURE SECTION ─────────────────────────────────
  const finalY = (doc as any).lastAutoTable.finalY + 15;
  const pageH = doc.internal.pageSize.getHeight();

  if (finalY + 50 > pageH - 20) {
    doc.addPage();
  }

  const sigY = finalY > pageH - 70 ? 30 : finalY;

  doc.setFontSize(9);
  doc.setTextColor(71, 85, 105);
  doc.text("Authorized Signature", margin, sigY + 30);
  doc.line(margin, sigY + 20, margin + 60, sigY + 20);

  doc.text("Company Seal", pageW - margin - 60, sigY + 30);
  doc.rect(pageW - margin - 60, sigY, 60, 22);

  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `This report is auto-generated by ${siteConfig.name}'s Internship Management System.`,
    pageW / 2,
    sigY + 45,
    { align: "center" }
  );

  // ── SAVE ──────────────────────────────────────────────────────────
  doc.save(filename);
};
