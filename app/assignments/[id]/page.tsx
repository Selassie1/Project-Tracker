import { notFound } from "next/navigation";
import { prisma } from "@/app/lib/prisma";
import { AssignmentForm } from "../AssignmentForm";
import { updateAssignment } from "../actions";

export default async function EditAssignmentPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const assignment = await prisma.assignment.findUnique({ where: { id } });
  if (!assignment) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Edit assignment</h1>
      <AssignmentForm action={updateAssignment.bind(null, id)} initial={assignment} />
    </div>
  );
}
