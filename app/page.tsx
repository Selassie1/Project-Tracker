import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { formatDate, formatMoney } from "@/app/lib/format";
import { getDashboardData } from "@/app/lib/dashboard";
import { JobsExplorer, type JobRow } from "@/app/components/JobsExplorer";
import { EarningsChart } from "@/app/components/EarningsChart";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [data, assignments, research, careStudies, coding] = await Promise.all([
    getDashboardData(),
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

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Dashboard</h1>
          <p className="text-sm text-slate-400">
            {data.activeCount} active · {data.overdueCount} overdue · {data.completedCount} completed
          </p>
        </div>
        <Link href="/analytics" className="btn-secondary">
          View analytics →
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <MetricCard
          label="Collected so far"
          value={formatMoney(data.collectedTotal)}
          accent="from-emerald-500/20 to-emerald-500/5 ring-emerald-500/20"
          valueClass="text-emerald-300"
        />
        <MetricCard
          label="This month"
          value={formatMoney(data.collectedThisMonth)}
          accent="from-violet-500/20 to-violet-500/5 ring-violet-500/20"
          valueClass="text-violet-200"
        />
        <MetricCard
          label="Outstanding"
          value={formatMoney(data.outstandingTotal)}
          accent="from-amber-500/20 to-amber-500/5 ring-amber-500/20"
          valueClass="text-amber-300"
        />
        <MetricCard
          label="Active jobs"
          value={String(data.activeCount)}
          accent="from-sky-500/20 to-sky-500/5 ring-sky-500/20"
          valueClass="text-sky-200"
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <EarningsChart months={data.months} />
        </div>
        <div className="lg:col-span-2">
          <RecentActivity recent={data.recent} />
        </div>
      </div>

      <UpcomingDeadlines upcoming={data.upcoming} />

      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-white">All jobs</h2>
        <JobsExplorer rows={rows} />
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  accent,
  valueClass,
}: {
  label: string;
  value: string;
  accent: string;
  valueClass: string;
}) {
  return (
    <div className={`rounded-xl bg-gradient-to-br p-4 ring-1 ${accent}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-400">{label}</p>
      <p className={`mt-1 text-2xl font-bold ${valueClass}`}>{value}</p>
    </div>
  );
}

function RecentActivity({ recent }: { recent: { label: string; amount: number; at: Date; job: string }[] }) {
  return (
    <div className="card h-full p-5">
      <h2 className="mb-4 text-sm font-semibold text-slate-300">Recent payments</h2>
      {recent.length === 0 ? (
        <p className="text-sm text-slate-500">No payments recorded yet.</p>
      ) : (
        <ul className="space-y-3">
          {recent.map((r, i) => (
            <li key={i} className="flex items-center justify-between gap-2 text-sm">
              <div className="min-w-0">
                <p className="truncate font-medium text-white">{r.job}</p>
                <p className="text-xs text-slate-500">
                  {r.label} · {formatDate(r.at)}
                </p>
              </div>
              <span className="shrink-0 font-semibold text-emerald-300">+{formatMoney(r.amount)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function UpcomingDeadlines({
  upcoming,
}: {
  upcoming: {
    id: string;
    title: string;
    sub: string;
    due: Date;
    kind: "Job" | "Section";
    href: string;
    overdue: boolean;
  }[];
}) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">Coming up</h2>
      {upcoming.length === 0 ? (
        <p className="card p-6 text-center text-sm text-slate-400">Nothing scheduled. You&apos;re all caught up.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {upcoming.map((u) => (
            <Link
              key={`${u.kind}-${u.id}`}
              href={u.href}
              className={`card flex items-center justify-between gap-3 border-l-4 p-4 transition hover:shadow-md ${
                u.overdue ? "border-l-rose-500" : u.kind === "Section" ? "border-l-sky-500" : "border-l-violet-500"
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase ${
                      u.kind === "Section" ? "bg-sky-500/10 text-sky-300" : "bg-violet-500/10 text-violet-300"
                    }`}
                  >
                    {u.kind}
                  </span>
                  <p className="truncate font-semibold text-white">{u.title}</p>
                </div>
                <p className="mt-1 truncate text-xs text-slate-400">{u.sub}</p>
              </div>
              <span className={`shrink-0 text-sm font-medium ${u.overdue ? "text-rose-400" : "text-slate-300"}`}>
                {formatDate(u.due)}
                {u.overdue ? " · overdue" : ""}
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
