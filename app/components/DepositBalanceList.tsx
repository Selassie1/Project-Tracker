import Link from "next/link";
import { formatDate, formatMoney, isOverdue } from "@/app/lib/format";
import { waLink } from "@/app/lib/whatsapp";
import { StatusBadge } from "./StatusBadge";
import { PayBadge } from "./PayBadge";

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
    return <p className="text-sm text-gray-500">{emptyLabel}</p>;
  }

  return (
    <div className="space-y-3">
      {items.map((item) => (
        <div
          key={item.id}
          className={`rounded-lg border bg-white p-4 ${
            isOverdue(item.deadline, item.status) ? "border-red-300" : "border-gray-200"
          }`}
        >
          <div className="flex flex-wrap items-start justify-between gap-2">
            <div>
              <p className="font-medium text-gray-900">{name(item)}</p>
              <p className="text-sm text-gray-500">{item.clientName}</p>
            </div>
            <StatusBadge status={item.status} />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <span className={isOverdue(item.deadline, item.status) ? "font-medium text-red-600" : ""}>
              Deadline: {formatDate(item.deadline)}
              {isOverdue(item.deadline, item.status) ? " (overdue)" : ""}
            </span>
            <span>Total: {formatMoney(item.amountCharged)}</span>
            <a
              href={waLink(item.whatsappNumber)}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-700 hover:underline"
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
              <button type="submit" className="btn-secondary">
                Mark deposit {item.depositPaid ? "unpaid" : "paid"}
              </button>
            </form>
            <form action={onToggleBalance.bind(null, item.id, !item.balancePaid)}>
              <button type="submit" className="btn-secondary">
                Mark balance {item.balancePaid ? "unpaid" : "paid"}
              </button>
            </form>
            <Link href={`${editBasePath}/${item.id}`} className="btn-secondary">
              Edit
            </Link>
            <form action={onDelete.bind(null, item.id)}>
              <button type="submit" className="btn-danger">
                Delete
              </button>
            </form>
          </div>
        </div>
      ))}
    </div>
  );
}
