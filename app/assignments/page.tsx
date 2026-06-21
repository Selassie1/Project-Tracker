import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { formatDate, formatMoney, isOverdue } from "@/app/lib/format";
import { waLink } from "@/app/lib/whatsapp";
import { StatusBadge } from "@/app/components/StatusBadge";
import { PayBadge } from "@/app/components/PayBadge";
import { deleteAssignment, togglePaid } from "./actions";

export const dynamic = "force-dynamic";

export default async function AssignmentsPage() {
  const assignments = await prisma.assignment.findMany({ orderBy: { deadline: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-slate-900">Assignments</h1>
        <Link href="/assignments/new" className="btn-primary">
          + New assignment
        </Link>
      </div>

      <div className="space-y-3">
        {assignments.length === 0 && (
          <p className="card p-6 text-center text-sm text-slate-500">No assignments yet.</p>
        )}
        {assignments.map((a) => (
          <div
            key={a.id}
            className={`card border-l-4 p-4 transition hover:shadow-md ${
              isOverdue(a.deadline, a.status) ? "border-l-rose-500 ring-1 ring-rose-200" : "border-l-violet-500"
            }`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-semibold text-slate-900">{a.topic}</p>
                <p className="text-sm text-slate-500">{a.clientName}</p>
              </div>
              <div className="flex gap-2">
                <StatusBadge status={a.status} />
                <PayBadge paid={a.isPaid} />
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <span className={isOverdue(a.deadline, a.status) ? "font-semibold text-rose-600" : ""}>
                Deadline: {formatDate(a.deadline)}
                {isOverdue(a.deadline, a.status) ? " (overdue)" : ""}
              </span>
              <span>Amount: {formatMoney(a.amountCharged)}</span>
              <a
                href={waLink(a.whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-600 hover:underline"
              >
                WhatsApp
              </a>
            </div>

            <div className="mt-3 flex gap-2">
              <form action={togglePaid.bind(null, a.id, !a.isPaid)}>
                <button type="submit" className="btn-secondary">
                  Mark {a.isPaid ? "unpaid" : "paid"}
                </button>
              </form>
              <Link href={`/assignments/${a.id}`} className="btn-secondary">
                Edit
              </Link>
              <form action={deleteAssignment.bind(null, a.id)}>
                <button type="submit" className="btn-danger">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
