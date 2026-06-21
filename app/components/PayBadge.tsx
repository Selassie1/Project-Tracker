export function PayBadge({ paid }: { paid: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
        paid
          ? "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-300"
          : "bg-amber-100 text-amber-700 ring-1 ring-amber-300"
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${paid ? "bg-emerald-500" : "bg-amber-500"}`} />
      {paid ? "Paid" : "Unpaid"}
    </span>
  );
}
