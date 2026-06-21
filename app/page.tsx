import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { formatDate, formatMoney, isOverdue } from "@/app/lib/format";
import { waLink } from "@/app/lib/whatsapp";
import { StatusBadge } from "@/app/components/StatusBadge";

export const dynamic = "force-dynamic";

type JobRow = {
  id: string;
  type: string;
  typeLabel: string;
  title: string;
  clientName: string;
  whatsappNumber: string;
  deadline: Date | null;
  status: string;
  outstanding: number;
  editPath: string;
};

export default async function DashboardPage() {
  const [assignments, research, careStudies, coding] = await Promise.all([
    prisma.assignment.findMany(),
    prisma.researchProject.findMany(),
    prisma.careStudy.findMany(),
    prisma.codingProject.findMany(),
  ]);

  const rows: JobRow[] = [
    ...assignments.map((a) => ({
      id: a.id,
      type: "assignment",
      typeLabel: "Assignment",
      title: a.topic,
      clientName: a.clientName,
      whatsappNumber: a.whatsappNumber,
      deadline: a.deadline,
      status: a.status,
      outstanding: a.isPaid ? 0 : a.amountCharged,
      editPath: `/assignments/${a.id}`,
    })),
    ...research.map((r) => ({
      id: r.id,
      type: "research",
      typeLabel: "Research",
      title: r.topic,
      clientName: r.clientName,
      whatsappNumber: r.whatsappNumber,
      deadline: r.deadline,
      status: r.status,
      outstanding: (r.depositPaid ? 0 : r.depositAmount) + (r.balancePaid ? 0 : r.balanceAmount),
      editPath: `/research/${r.id}`,
    })),
    ...careStudies.map((c) => ({
      id: c.id,
      type: "care-study",
      typeLabel: "Care Study",
      title: c.condition,
      clientName: c.clientName,
      whatsappNumber: c.whatsappNumber,
      deadline: c.deadline,
      status: c.status,
      outstanding: (c.depositPaid ? 0 : c.depositAmount) + (c.balancePaid ? 0 : c.balanceAmount),
      editPath: `/care-studies/${c.id}`,
    })),
    ...coding.map((p) => ({
      id: p.id,
      type: "coding",
      typeLabel: "Coding",
      title: p.projectName,
      clientName: p.clientName,
      whatsappNumber: p.whatsappNumber,
      deadline: p.deadline,
      status: p.status,
      outstanding: (p.depositPaid ? 0 : p.depositAmount) + (p.balancePaid ? 0 : p.balanceAmount),
      editPath: `/coding/${p.id}`,
    })),
  ];

  rows.sort((a, b) => {
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });

  const activeRows = rows.filter((r) => r.status !== "COMPLETED");
  const overdueCount = activeRows.filter((r) => isOverdue(r.deadline, r.status)).length;
  const outstandingTotal = rows.reduce((sum, r) => sum + r.outstanding, 0);

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Active jobs" value={String(activeRows.length)} />
        <SummaryCard label="Overdue" value={String(overdueCount)} highlight={overdueCount > 0} />
        <SummaryCard label="Outstanding payments" value={formatMoney(outstandingTotal)} />
      </div>

      <div className="space-y-3">
        {rows.length === 0 && <p className="text-sm text-gray-500">No jobs tracked yet.</p>}
        {rows.map((row) => (
          <div
            key={`${row.type}-${row.id}`}
            className={`rounded-lg border bg-white p-4 ${
              isOverdue(row.deadline, row.status) ? "border-red-300" : "border-gray-200"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <span className="mb-1 inline-block rounded bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600">
                  {row.typeLabel}
                </span>
                <p className="font-medium text-gray-900">{row.title}</p>
                <p className="text-sm text-gray-500">{row.clientName}</p>
              </div>
              <StatusBadge status={row.status} />
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
              <span className={isOverdue(row.deadline, row.status) ? "font-medium text-red-600" : ""}>
                Deadline: {formatDate(row.deadline)}
                {isOverdue(row.deadline, row.status) ? " (overdue)" : ""}
              </span>
              {row.outstanding > 0 && (
                <span className="font-medium text-amber-700">
                  Owed: {formatMoney(row.outstanding)}
                </span>
              )}
              <a
                href={waLink(row.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-green-700 hover:underline"
              >
                WhatsApp
              </a>
              <Link href={row.editPath} className="text-gray-700 hover:underline">
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-semibold ${highlight ? "text-red-600" : "text-gray-900"}`}>
        {value}
      </p>
    </div>
  );
}
