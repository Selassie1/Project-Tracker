export function PayBadge({ paid }: { paid: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        paid
          ? "bg-emerald-500/10 text-emerald-300 ring-1 ring-emerald-500/30"
          : "bg-amber-500/10 text-amber-300 ring-1 ring-amber-500/30"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${paid ? "bg-emerald-500" : "bg-amber-500"}`} />
      {paid ? "Paid" : "Unpaid"}
    </span>
  );
}
