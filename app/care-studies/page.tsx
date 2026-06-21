import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { DepositBalanceList } from "@/app/components/DepositBalanceList";
import { deleteCareStudy, toggleDepositPaid, toggleBalancePaid } from "./actions";

export const dynamic = "force-dynamic";

export default async function CareStudiesPage() {
  const studies = await prisma.careStudy.findMany({ orderBy: { deadline: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-white">Care studies</h1>
        <Link href="/care-studies/new" className="btn-primary">
          + New care study
        </Link>
      </div>

      <DepositBalanceList
        items={studies}
        name={(s) => s.condition}
        editBasePath="/care-studies"
        onToggleDeposit={toggleDepositPaid}
        onToggleBalance={toggleBalancePaid}
        onDelete={deleteCareStudy}
        emptyLabel="No care studies yet."
      />
    </div>
  );
}
