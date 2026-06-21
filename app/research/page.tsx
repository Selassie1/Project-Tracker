import Link from "next/link";
import { prisma } from "@/app/lib/prisma";
import { DepositBalanceList } from "@/app/components/DepositBalanceList";
import { deleteResearchProject, toggleDepositPaid, toggleBalancePaid } from "./actions";

export const dynamic = "force-dynamic";

export default async function ResearchPage() {
  const projects = await prisma.researchProject.findMany({ orderBy: { deadline: "asc" } });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Research projects</h1>
        <Link href="/research/new" className="btn-primary">
          + New research project
        </Link>
      </div>

      <DepositBalanceList
        items={projects}
        name={(p) => p.topic}
        editBasePath="/research"
        onToggleDeposit={toggleDepositPaid}
        onToggleBalance={toggleBalancePaid}
        onDelete={deleteResearchProject}
        emptyLabel="No research projects yet."
      />
    </div>
  );
}
