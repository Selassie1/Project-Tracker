"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatDate, formatMoney, isDueWithinDays, isOverdue } from "@/app/lib/format";
import { waLink } from "@/app/lib/whatsapp";
import { StatusBadge } from "./StatusBadge";

export type JobRow = {
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

type Filter = "all" | "active" | "overdue" | "week";

const FILTER_LABELS: Record<Filter, string> = {
  all: "All",
  active: "Active",
  overdue: "Overdue",
  week: "Due this week",
};

export function JobsExplorer({ rows }: { rows: JobRow[] }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("all");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();

    return rows.filter((row) => {
      if (filter === "active" && row.status === "COMPLETED") return false;
      if (filter === "overdue" && !isOverdue(row.deadline, row.status)) return false;
      if (filter === "week" && !isDueWithinDays(row.deadline, 7)) return false;
      if (q && !row.title.toLowerCase().includes(q) && !row.clientName.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [rows, filter, query]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by client or title…"
          className="input max-w-xs"
        />
        <div className="flex flex-wrap gap-2">
          {(Object.keys(FILTER_LABELS) as Filter[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-sm font-medium transition ${
                filter === f
                  ? "bg-violet-600 text-white"
                  : "bg-slate-800 text-slate-300 hover:bg-slate-700"
              }`}
            >
              {FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 && (
          <p className="card p-6 text-center text-sm text-slate-400">No jobs match.</p>
        )}
        {filtered.map((row) => {
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
