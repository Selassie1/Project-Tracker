import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { DepositBalanceList } from "@/app/components/DepositBalanceList";
import { deleteCodingProject, toggleDepositPaid, toggleBalancePaid } from "./actions";

export const dynamic = "force-dynamic";

export default async function CodingPage() {
  const projects = await prisma.codingProject.findMany({ orderBy: { deadline: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Coding projects</h1>
        <Link href="/coding/new" className="btn-primary">
          + New coding project
        </Link>
      </div>

      <DepositBalanceList
        items={projects}
        name={(p) => p.projectName}
        editBasePath="/coding"
        onToggleDeposit={toggleDepositPaid}
        onToggleBalance={toggleBalancePaid}
        onDelete={deleteCodingProject}
        emptyLabel="No coding projects yet."
      />
    </div>
  );
}
