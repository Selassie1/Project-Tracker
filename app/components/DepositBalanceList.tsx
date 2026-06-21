import Link from "next/link";
import { formatDate, formatMoney, isOverdue } from "@/app/lib/format";
import { waLink } from "@/app/lib/whatsapp";
import { StatusBadge } from "./StatusBadge";
import { PayBadge } from "./PayBadge";
import { DeleteButton } from "./DeleteButton";
import { SubmitButton } from "./SubmitButton";

type DepositBalanceItem = {
  id: string;
  clientName: string;
  whatsappNumber: string;
  amountCharged: number;
  depositAmount: number;
  depositPaid: boolean;
  balanceAmount: number;
  balancePaid: boolean;
  deadline: Date | null;
  status: string;
};

export function DepositBalanceList<T extends DepositBalanceItem>({
  items,
  name,
  editBasePath,
  onToggleDeposit,
  onToggleBalance,
  onDelete,
  emptyLabel,
}: {
  items: T[];
  name: (item: T) => string;
  editBasePath: string;
  onToggleDeposit: (id: string, next: boolean) => void;
  onToggleBalance: (id: string, next: boolean) => void;
  onDelete: (id: string) => void;
  emptyLabel: string;
}) {
  if (items.length === 0) {
    return <p className="card p-6 text-center text-sm text-slate-400">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => {
        const overdue = isOverdue(item.deadline, item.status);
        return (
        <div
          key={item.id}
          className={`card border-l-4 p-4 transition hover:shadow-md ${
            overdue ? "border-l-rose-500 ring-1 ring-rose-900/40" : "border-l-violet-500"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-semibold text-white">{name(item)}</p>
              <p className="text-sm text-slate-400">{item.clientName}</p>
            </div>
            <StatusBadge status={item.status} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-slate-400">
            <span className={overdue ? "font-semibold text-rose-400" : ""}>
              Deadline: {formatDate(item.deadline)}
              {overdue ? " (overdue)" : ""}
            </span>
            <span>Total: {formatMoney(item.amountCharged)}</span>
            <a
              href={waLink(item.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-emerald-400 hover:underline"
            >
              WhatsApp
            </a>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <span className="flex items-center gap-2">
              Deposit {formatMoney(item.depositAmount)} <PayBadge paid={item.depositPaid} />
            </span>
            <span className="flex items-center gap-2">
              Balance {formatMoney(item.balanceAmount)} <PayBadge paid={item.balancePaid} />
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-2">
            <form action={onToggleDeposit.bind(null, item.id, !item.depositPaid)}>
              <SubmitButton>Mark deposit {item.depositPaid ? "unpaid" : "paid"}</SubmitButton>
            </form>
            <form action={onToggleBalance.bind(null, item.id, !item.balancePaid)}>
              <SubmitButton>Mark balance {item.balancePaid ? "unpaid" : "paid"}</SubmitButton>
            </form>
            <Link href={`${editBasePath}/${item.id}`} className="btn-secondary">
              Edit
            </Link>
            <form action={onDelete.bind(null, item.id)}>
              <DeleteButton />
            </form>
          </div>
        </div>
        );
      })}
    </div>
  );
}
