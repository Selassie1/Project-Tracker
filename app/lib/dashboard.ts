import { prisma } from "@/app/lib/prisma";
import { isOverdue } from "@/app/lib/format";

export type PaymentEvent = { label: string; amount: number; at: Date; job: string };

export type UpcomingItem = {
  id: string;
  title: string;
  sub: string;
  due: Date;
  kind: "Job" | "Section";
  href: string;
  overdue: boolean;
};

export type MonthBucket = { label: string; total: number };

export type DashboardData = {
  collectedTotal: number;
  collectedThisMonth: number;
  outstandingTotal: number;
  activeCount: number;
  overdueCount: number;
  completedCount: number;
  months: MonthBucket[];
  upcoming: UpcomingItem[];
  recent: PaymentEvent[];
};

export async function getDashboardData(): Promise<DashboardData> {
  const [assignments, research, careStudies, coding] = await Promise.all([
    prisma.assignment.findMany(),
    prisma.researchProject.findMany({ include: { milestones: true } }),
    prisma.careStudy.findMany({ include: { milestones: true } }),
    prisma.codingProject.findMany(),
  ]);

  const payments: PaymentEvent[] = [];
  let outstandingTotal = 0;
  let activeCount = 0;
  let overdueCount = 0;
  let completedCount = 0;

  const countStatus = (status: string, deadline: Date | null) => {
    if (status === "COMPLETED") completedCount += 1;
    else {
      activeCount += 1;
      if (isOverdue(deadline, status)) overdueCount += 1;
    }
  };

  for (const a of assignments) {
    countStatus(a.status, a.deadline);
    if (a.isPaid && a.paidAt) payments.push({ label: "Paid", amount: a.amountCharged, at: a.paidAt, job: a.topic });
    else if (!a.isPaid) outstandingTotal += a.amountCharged;
  }

  const depositBalance = [
    ...research.map((r) => ({ job: r.topic, ...r })),
    ...careStudies.map((c) => ({ job: c.condition, ...c })),
  ];

  for (const r of depositBalance) {
    countStatus(r.status, r.deadline);
    if (r.depositPaid && r.depositPaidAt)
      payments.push({ label: "Deposit", amount: r.depositAmount, at: r.depositPaidAt, job: r.job });
    else if (!r.depositPaid) outstandingTotal += r.depositAmount;
    if (r.balancePaid && r.balancePaidAt)
      payments.push({ label: "Balance", amount: r.balanceAmount, at: r.balancePaidAt, job: r.job });
    else if (!r.balancePaid) outstandingTotal += r.balanceAmount;
  }

  for (const p of coding) {
    countStatus(p.status, p.deadline);
    if (p.depositPaid && p.depositPaidAt)
      payments.push({ label: "Deposit", amount: p.depositAmount, at: p.depositPaidAt, job: p.projectName });
    else if (!p.depositPaid) outstandingTotal += p.depositAmount;
    if (p.balancePaid && p.balancePaidAt)
      payments.push({ label: "Balance", amount: p.balanceAmount, at: p.balancePaidAt, job: p.projectName });
    else if (!p.balancePaid) outstandingTotal += p.balanceAmount;
  }

  const collectedTotal = payments.reduce((s, p) => s + p.amount, 0);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const collectedThisMonth = payments
    .filter((p) => p.at >= monthStart)
    .reduce((s, p) => s + p.amount, 0);

  // Last 6 months of collections, oldest first.
  const months: MonthBucket[] = [];
  for (let i = 5; i >= 0; i -= 1) {
    const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);
    const total = payments
      .filter((p) => p.at >= start && p.at < end)
      .reduce((s, p) => s + p.amount, 0);
    months.push({ label: start.toLocaleDateString("en-GH", { month: "short" }), total });
  }

  // Upcoming: job deadlines + milestone sections not yet done.
  const upcoming: UpcomingItem[] = [];
  for (const a of assignments) {
    if (a.status !== "COMPLETED" && a.deadline)
      upcoming.push({
        id: a.id,
        title: a.topic,
        sub: `Assignment · ${a.clientName}`,
        due: a.deadline,
        kind: "Job",
        href: `/assignments/${a.id}`,
        overdue: isOverdue(a.deadline, a.status),
      });
  }
  const pushJobAndSections = (
    items: typeof research,
    typeLabel: string,
    base: string,
    titleOf: (x: (typeof research)[number]) => string
  ) => {
    for (const r of items) {
      if (r.status !== "COMPLETED" && r.deadline)
        upcoming.push({
          id: r.id,
          title: titleOf(r),
          sub: `${typeLabel} · ${r.clientName}`,
          due: r.deadline,
          kind: "Job",
          href: `${base}/${r.id}`,
          overdue: isOverdue(r.deadline, r.status),
        });
      for (const m of r.milestones) {
        if (!m.isDone && m.dueDate)
          upcoming.push({
            id: m.id,
            title: m.title,
            sub: `${titleOf(r)} · ${r.clientName}`,
            due: m.dueDate,
            kind: "Section",
            href: `${base}/${r.id}`,
            overdue: isOverdue(m.dueDate, "PENDING"),
          });
      }
    }
  };
  pushJobAndSections(research, "Research", "/research", (r) => r.topic);
  pushJobAndSections(
    careStudies as unknown as typeof research,
    "Care Study",
    "/care-studies",
    (c) => (c as unknown as { condition: string }).condition
  );
  for (const p of coding) {
    if (p.status !== "COMPLETED" && p.deadline)
      upcoming.push({
        id: p.id,
        title: p.projectName,
        sub: `Coding · ${p.clientName}`,
        due: p.deadline,
        kind: "Job",
        href: `/coding/${p.id}`,
        overdue: isOverdue(p.deadline, p.status),
      });
  }
  upcoming.sort((x, y) => x.due.getTime() - y.due.getTime());

  const recent = payments.sort((x, y) => y.at.getTime() - x.at.getTime()).slice(0, 6);

  return {
    collectedTotal,
    collectedThisMonth,
    outstandingTotal,
    activeCount,
    overdueCount,
    completedCount,
    months,
    upcoming: upcoming.slice(0, 8),
    recent,
  };
}
