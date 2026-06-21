import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { DepositBalanceForm } from "@/app/components/DepositBalanceForm";
import { MilestoneSection } from "@/app/components/MilestoneSection";
import { updateResearchProject } from "../actions";

export default async function EditResearchProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.researchProject.findUnique({
    where: { id },
    include: { milestones: { orderBy: [{ dueDate: "asc" }, { order: "asc" }] } },
  });
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-white">Edit research project</h1>
      <DepositBalanceForm
        action={updateResearchProject.bind(null, id)}
        nameField="topic"
        nameLabel="Research topic"
        initial={project}
        initialName={project.topic}
      />
      <MilestoneSection parent="research" parentId={id} milestones={project.milestones} />
    </div>
  );
}
