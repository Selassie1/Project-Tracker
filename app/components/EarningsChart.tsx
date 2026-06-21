import { formatMoney } from "@/app/lib/format";
import type { MonthBucket } from "@/app/lib/dashboard";

export function EarningsChart({ months }: { months: MonthBucket[] }) {
  const max = Math.max(...months.map((m) => m.total), 1);

  return (
    <div className="card p-5">
      <div className="mb-4 flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-slate-300">Collected · last 6 months</h2>
        <span className="text-xs text-slate-500">{formatMoney(months.reduce((s, m) => s + m.total, 0))}</span>
      </div>
      <div className="flex h-40 items-end justify-between gap-2">
        {months.map((m) => {
          const pct = Math.round((m.total / max) * 100);
          return (
            <div key={m.label} className="group flex flex-1 flex-col items-center gap-2">
              <div className="relative flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-violet-700 to-violet-400 transition-all group-hover:from-violet-600 group-hover:to-violet-300"
                  style={{ height: `${Math.max(pct, 2)}%` }}
                  title={formatMoney(m.total)}
                />
              </div>
              <span className="text-xs text-slate-500">{m.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
