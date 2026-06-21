import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { DepositBalanceForm } from "@/app/components/DepositBalanceForm";
import { MilestoneSection } from "@/app/components/MilestoneSection";
import { updateCareStudy } from "../actions";

export default async function EditCareStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const study = await prisma.careStudy.findUnique({
    where: { id },
    include: { milestones: { orderBy: [{ dueDate: "asc" }, { order: "asc" }] } },
  });
  if (!study) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Edit care study</h1>
      <DepositBalanceForm
        action={updateCareStudy.bind(null, id)}
        nameField="condition"
        nameLabel="Condition / topic"
        initial={study}
        initialName={study.condition}
      />
      <MilestoneSection parent="care-study" parentId={id} milestones={study.milestones} />
    </div>
  );
}
