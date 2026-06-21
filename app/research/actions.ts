"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

function parseResearchProject(formData: FormData) {
  const deadlineRaw = String(formData.get("deadline") || "");
  return {
    clientName: String(formData.get("clientName")),
    whatsappNumber: String(formData.get("whatsappNumber")),
    topic: String(formData.get("topic")),
    amountCharged: Number(formData.get("amountCharged")),
    depositAmount: Number(formData.get("depositAmount")),
    balanceAmount: Number(formData.get("balanceAmount")),
    deadline: deadlineRaw ? new Date(deadlineRaw) : null,
    status: String(formData.get("status")) as "PENDING" | "IN_PROGRESS" | "COMPLETED",
    notes: String(formData.get("notes") || "") || null,
  };
}

export async function createResearchProject(formData: FormData) {
  await prisma.researchProject.create({ data: parseResearchProject(formData) });
  revalidatePath("/research");
  revalidatePath("/");
  redirect("/research");
}

export async function updateResearchProject(id: string, formData: FormData) {
  await prisma.researchProject.update({ where: { id }, data: parseResearchProject(formData) });
  revalidatePath("/research");
  revalidatePath("/");
  redirect("/research");
}

export async function deleteResearchProject(id: string) {
  await prisma.researchProject.delete({ where: { id } });
  revalidatePath("/research");
  revalidatePath("/");
}

export async function toggleDepositPaid(id: string, depositPaid: boolean) {
  await prisma.researchProject.update({
    where: { id },
    data: { depositPaid, depositPaidAt: depositPaid ? new Date() : null },
  });
  revalidatePath("/research");
  revalidatePath("/");
}

export async function toggleBalancePaid(id: string, balancePaid: boolean) {
  await prisma.researchProject.update({
    where: { id },
    data: { balancePaid, balancePaidAt: balancePaid ? new Date() : null },
  });
  revalidatePath("/research");
  revalidatePath("/");
}
