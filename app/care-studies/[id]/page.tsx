import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { DepositBalanceForm } from "@/app/components/DepositBalanceForm";
import { updateCareStudy } from "../actions";

export default async function EditCareStudyPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const study = await prisma.careStudy.findUnique({ where: { id } });
  if (!study) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-900">Edit care study</h1>
      <DepositBalanceForm
        action={updateCareStudy.bind(null, id)}
        nameField="condition"
        nameLabel="Condition / topic"
        initial={study}
        initialName={study.condition}
      />
    </div>
  );
}
