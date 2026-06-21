import { prisma } from "@/app/lib/prisma";
import { formatDate } from "@/app/lib/format";

export async function GET() {
  const [assignments, research, careStudies, coding] = await Promise.all([
    prisma.assignment.findMany(),
    prisma.researchProject.findMany(),
    prisma.careStudy.findMany(),
    prisma.codingProject.findMany(),
  ]);

  const rows: string[][] = [
    ["Type", "Client", "Title", "Status", "Deadline", "Total", "Paid", "Outstanding"],
  ];

  for (const a of assignments) {
    const paid = a.isPaid ? a.amountCharged : 0;
    rows.push([
      "Assignment",
      a.clientName,
      a.topic,
      a.status,
      formatDate(a.deadline),
      a.amountCharged.toFixed(2),
      paid.toFixed(2),
      (a.amountCharged - paid).toFixed(2),
    ]);
  }

  const depositBalanceRows: Array<{
    type: string;
    clientName: string;
    title: string;
    status: string;
    deadline: Date | null;
    amountCharged: number;
    depositAmount: number;
    depositPaid: boolean;
    balanceAmount: number;
    balancePaid: boolean;
  }> = [
    ...research.map((r) => ({ type: "Research", title: r.topic, ...r })),
    ...careStudies.map((c) => ({ type: "Care Study", title: c.condition, ...c })),
    ...coding.map((p) => ({ type: "Coding", title: p.projectName, ...p })),
  ];

  for (const r of depositBalanceRows) {
    const paid = (r.depositPaid ? r.depositAmount : 0) + (r.balancePaid ? r.balanceAmount : 0);
    rows.push([
      r.type,
      r.clientName,
      r.title,
      r.status,
      formatDate(r.deadline),
      r.amountCharged.toFixed(2),
      paid.toFixed(2),
      (r.amountCharged - paid).toFixed(2),
    ]);
  }

  const csv = rows.map((row) => row.map(escapeCsv).join(",")).join("\n");

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="project-tracker-export.csv"',
    },
  });
}

function escapeCsv(value: string): string {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}
