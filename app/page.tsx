import { prisma } from "@/app/lib/prisma";
import { formatMoney, isOverdue } from "@/app/lib/format";
import { JobsExplorer, type JobRow } from "@/app/components/JobsExplorer";

export const dynamic = "force-dynamic";

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

      <JobsExplorer rows={rows} />
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
