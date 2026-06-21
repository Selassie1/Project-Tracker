export function formatMoney(amount: number): string {
  return new Intl.NumberFormat("en-GH", {
    style: "currency",
    currency: "GHS",
  }).format(amount);
}

export function formatDate(date: Date | string | null): string {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function isOverdue(deadline: Date | string | null, status: string): boolean {
  if (!deadline || status === "COMPLETED") return false;
  return new Date(deadline).getTime() < Date.now();
}

export function isDueWithinDays(deadline: Date | string | null, days: number): boolean {
  if (!deadline) return false;
  const t = new Date(deadline).getTime();
  const now = Date.now();
  return t >= now && t <= now + days * 24 * 60 * 60 * 1000;
}
