"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/app/lib/prisma";

type Parent = "research" | "care-study";

function parentPath(parent: Parent): string {
  return parent === "research" ? "/research" : "/care-studies";
}

export async function addMilestone(parent: Parent, parentId: string, formData: FormData) {
  const title = String(formData.get("title") || "").trim();
  if (!title) return;
  const dueRaw = String(formData.get("dueDate") || "");

  const count = await prisma.milestone.count({
    where: parent === "research" ? { researchProjectId: parentId } : { careStudyId: parentId },
  });

  await prisma.milestone.create({
    data: {
      title,
      dueDate: dueRaw ? new Date(dueRaw) : null,
      order: count,
      ...(parent === "research"
        ? { researchProjectId: parentId }
        : { careStudyId: parentId }),
    },
  });

  revalidatePath(`${parentPath(parent)}/${parentId}`);
  revalidatePath("/");
}

export async function toggleMilestone(parent: Parent, parentId: string, id: string, isDone: boolean) {
  await prisma.milestone.update({
    where: { id },
    data: { isDone, doneAt: isDone ? new Date() : null },
  });
  revalidatePath(`${parentPath(parent)}/${parentId}`);
  revalidatePath("/");
}

export async function deleteMilestone(parent: Parent, parentId: string, id: string) {
  await prisma.milestone.delete({ where: { id } });
  revalidatePath(`${parentPath(parent)}/${parentId}`);
  revalidatePath("/");
}
