import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { DepositBalanceForm } from "@/app/components/DepositBalanceForm";
import { updateResearchProject } from "../actions";

export default async function EditResearchProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.researchProject.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Edit research project</h1>
      <DepositBalanceForm
        action={updateResearchProject.bind(null, id)}
        nameField="topic"
        nameLabel="Research topic"
        initial={project}
        initialName={project.topic}
      />
    </div>
  );
}
