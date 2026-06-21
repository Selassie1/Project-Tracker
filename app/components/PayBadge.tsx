export function PayBadge({ paid }: { paid: boolean }) {
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
        paid ? "bg-green-100 text-green-800" : "bg-amber-100 text-amber-800"
      }`}
    >
      {paid ? "Paid" : "Unpaid"}
    </span>
  );
}
