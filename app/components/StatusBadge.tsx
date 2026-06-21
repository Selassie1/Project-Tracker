const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-slate-500/10 text-slate-300 ring-1 ring-slate-500/30",
  IN_PROGRESS: "bg-sky-500/10 text-sky-300 ring-1 ring-sky-500/30",
  COMPLETED: "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30",
};

const STATUS_DOT: Record<string, string> = {
  PENDING: "bg-slate-400",
  IN_PROGRESS: "bg-sky-500",
  COMPLETED: "bg-emerald-500",
};

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In progress",
  COMPLETED: "Completed",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        STATUS_STYLES[status] ?? STATUS_STYLES.PENDING
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[status] ?? STATUS_DOT.PENDING}`} />
      {STATUS_LABELS[status] ?? status}
    </span>
  );
}
