import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { DepositBalanceForm } from "@/app/components/DepositBalanceForm";
import { updateCodingProject } from "../actions";

export default async function EditCodingProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = await prisma.codingProject.findUnique({ where: { id } });
  if (!project) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Edit coding project</h1>
      <DepositBalanceForm
        action={updateCodingProject.bind(null, id)}
        nameField="projectName"
        nameLabel="Project name"
        initial={project}
        initialName={project.projectName}
      />
    </div>
  );
}
