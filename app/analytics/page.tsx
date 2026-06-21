import { prisma } from "@/app/lib/prisma";
import { formatMoney } from "@/app/lib/format";

export const dynamic = "force-dynamic";

type TypeStats = {
  label: string;
  total: number;
  earned: number;
  outstanding: number;
  count: number;
  completed: number;
};

export default async function AnalyticsPage() {
  const [assignments, research, careStudies, coding] = await Promise.all([
    prisma.assignment.findMany(),
    prisma.researchProject.findMany(),
    prisma.careStudy.findMany(),
    prisma.codingProject.findMany(),
  ]);

  const byType: TypeStats[] = [
    {
      label: "Assignments",
      total: assignments.reduce((s, a) => s + a.amountCharged, 0),
      earned: assignments.reduce((s, a) => s + (a.isPaid ? a.amountCharged : 0), 0),
      outstanding: assignments.reduce((s, a) => s + (a.isPaid ? 0 : a.amountCharged), 0),
      count: assignments.length,
      completed: assignments.filter((a) => a.status === "COMPLETED").length,
    },
    {
      label: "Research",
      total: research.reduce((s, r) => s + r.amountCharged, 0),
      earned: research.reduce(
        (s, r) => s + (r.depositPaid ? r.depositAmount : 0) + (r.balancePaid ? r.balanceAmount : 0),
        0
      ),
      outstanding: research.reduce(
        (s, r) => s + (r.depositPaid ? 0 : r.depositAmount) + (r.balancePaid ? 0 : r.balanceAmount),
        0
      ),
      count: research.length,
      completed: research.filter((r) => r.status === "COMPLETED").length,
    },
    {
      label: "Care Studies",
      total: careStudies.reduce((s, c) => s + c.amountCharged, 0),
      earned: careStudies.reduce(
        (s, c) => s + (c.depositPaid ? c.depositAmount : 0) + (c.balancePaid ? c.balanceAmount : 0),
        0
      ),
      outstanding: careStudies.reduce(
        (s, c) => s + (c.depositPaid ? 0 : c.depositAmount) + (c.balancePaid ? 0 : c.balanceAmount),
        0
      ),
      count: careStudies.length,
      completed: careStudies.filter((c) => c.status === "COMPLETED").length,
    },
    {
      label: "Coding",
      total: coding.reduce((s, p) => s + p.amountCharged, 0),
      earned: coding.reduce(
        (s, p) => s + (p.depositPaid ? p.depositAmount : 0) + (p.balancePaid ? p.balanceAmount : 0),
        0
      ),
      outstanding: coding.reduce(
        (s, p) => s + (p.depositPaid ? 0 : p.depositAmount) + (p.balancePaid ? 0 : p.balanceAmount),
        0
      ),
      count: coding.length,
      completed: coding.filter((p) => p.status === "COMPLETED").length,
    },
  ];

  const totalEarned = byType.reduce((s, t) => s + t.earned, 0);
  const totalOutstanding = byType.reduce((s, t) => s + t.outstanding, 0);
  const totalJobs = byType.reduce((s, t) => s + t.count, 0);
  const totalCompleted = byType.reduce((s, t) => s + t.completed, 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-sm text-slate-400">How the business is doing across every job type.</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <SummaryCard label="Total earned" value={formatMoney(totalEarned)} gradient="from-emerald-500 to-emerald-700" />
        <SummaryCard label="Outstanding" value={formatMoney(totalOutstanding)} gradient="from-amber-500 to-amber-600" />
        <SummaryCard
          label="Jobs completed"
          value={`${totalCompleted} / ${totalJobs}`}
          gradient="from-violet-500 to-violet-700"
        />
      </div>

      <div className="card overflow-x-auto p-4">
        <table className="w-full min-w-[480px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400">
              <th className="py-2 pr-4 font-medium">Type</th>
              <th className="py-2 pr-4 font-medium">Jobs</th>
              <th className="py-2 pr-4 font-medium">Completed</th>
              <th className="py-2 pr-4 font-medium">Earned</th>
              <th className="py-2 pr-4 font-medium">Outstanding</th>
            </tr>
          </thead>
          <tbody>
            {byType.map((t) => (
              <tr key={t.label} className="border-b border-slate-800/60 text-slate-200 last:border-0">
                <td className="py-2 pr-4 font-medium text-white">{t.label}</td>
                <td className="py-2 pr-4">{t.count}</td>
                <td className="py-2 pr-4">{t.completed}</td>
                <td className="py-2 pr-4 text-emerald-400">{formatMoney(t.earned)}</td>
                <td className="py-2 pr-4 text-amber-400">{formatMoney(t.outstanding)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SummaryCard({ label, value, gradient }: { label: string; value: string; gradient: string }) {
  return (
    <div className={`rounded-xl bg-gradient-to-br ${gradient} p-4 text-white shadow-sm`}>
      <p className="text-sm text-white/80">{label}</p>
      <p className="text-3xl font-bold">{value}</p>
    </div>
  );
}
