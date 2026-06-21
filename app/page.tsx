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

const TYPE_STYLES: Record<string, { bar: string; badge: string }> = {
  assignment: { bar: "border-l-violet-500", badge: "bg-violet-500/10 text-violet-300" },
  research: { bar: "border-l-sky-500", badge: "bg-sky-500/10 text-sky-300" },
  "care-study": { bar: "border-l-rose-500", badge: "bg-rose-500/10 text-rose-300" },
  coding: { bar: "border-l-amber-500", badge: "bg-amber-500/10 text-amber-300" },
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
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-sm text-slate-400">Everything you&apos;re working on, in one place.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard
          label="Active jobs"
          value={String(activeRows.length)}
          gradient="from-violet-500 to-violet-700"
        />
        <SummaryCard
          label="Overdue"
          value={String(overdueCount)}
          gradient={overdueCount > 0 ? "from-rose-500 to-rose-700" : "from-emerald-500 to-emerald-700"}
        />
        <SummaryCard
          label="Outstanding payments"
          value={formatMoney(outstandingTotal)}
          gradient="from-amber-500 to-amber-600"
        />
      </div>

      <div className="space-y-3">
        {rows.length === 0 && (
          <p className="card p-6 text-center text-sm text-slate-400">No jobs tracked yet.</p>
        )}
        {rows.map((row) => {
          const overdue = isOverdue(row.deadline, row.status);
          const style = TYPE_STYLES[row.type] ?? TYPE_STYLES.assignment;
          return (
            <div
              key={`${row.type}-${row.id}`}
              className={`card border-l-4 p-4 transition hover:shadow-md ${
                overdue ? "border-l-rose-500 ring-1 ring-rose-900/40" : style.bar
              }`}
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <span
                    className={`mb-1 inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${style.badge}`}
                  >
                    {row.typeLabel}
                  </span>
                  <p className="font-semibold text-white">{row.title}</p>
                  <p className="text-sm text-slate-400">{row.clientName}</p>
                </div>
                <StatusBadge status={row.status} />
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-400">
                <span className={overdue ? "font-semibold text-rose-400" : ""}>
                  Deadline: {formatDate(row.deadline)}
                  {overdue ? " (overdue)" : ""}
                </span>
                {row.outstanding > 0 && (
                  <span className="font-semibold text-amber-400">
                    Owed: {formatMoney(row.outstanding)}
                  </span>
                )}
                <a
                  href={waLink(row.whatsappNumber)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-emerald-400 hover:underline"
                >
                  WhatsApp
                </a>
                <Link href={row.editPath} className="font-medium text-violet-400 hover:underline">
                  Edit
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SummaryCard({
  label,
  value,
  gradient,
}: {
  label: string;
  value: string;
  gradient: string;
}) {
  return (
    <div className={`rounded-xl bg-gradient-to-br ${gradient} p-4 text-white shadow-sm`}>
      <p className="text-sm text-white/80">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
