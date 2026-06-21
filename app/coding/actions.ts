"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

function parseCodingProject(formData: FormData) {
  const deadlineRaw = String(formData.get("deadline") || "");
  return {
    clientName: String(formData.get("clientName")),
    whatsappNumber: String(formData.get("whatsappNumber")),
    projectName: String(formData.get("projectName")),
    amountCharged: Number(formData.get("amountCharged")),
    depositAmount: Number(formData.get("depositAmount")),
    balanceAmount: Number(formData.get("balanceAmount")),
    deadline: deadlineRaw ? new Date(deadlineRaw) : null,
    status: String(formData.get("status")) as "PENDING" | "IN_PROGRESS" | "COMPLETED",
    notes: String(formData.get("notes") || "") || null,
  };
}

export async function createCodingProject(formData: FormData) {
  await prisma.codingProject.create({ data: parseCodingProject(formData) });
  revalidatePath("/coding");
  revalidatePath("/");
  redirect("/coding");
}

export async function updateCodingProject(id: string, formData: FormData) {
  await prisma.codingProject.update({ where: { id }, data: parseCodingProject(formData) });
  revalidatePath("/coding");
  revalidatePath("/");
  redirect("/coding");
}

export async function deleteCodingProject(id: string) {
  await prisma.codingProject.delete({ where: { id } });
  revalidatePath("/coding");
  revalidatePath("/");
}

export async function toggleDepositPaid(id: string, depositPaid: boolean) {
  await prisma.codingProject.update({
    where: { id },
    data: { depositPaid, depositPaidAt: depositPaid ? new Date() : null },
  });
  revalidatePath("/coding");
  revalidatePath("/");
}

export async function toggleBalancePaid(id: string, balancePaid: boolean) {
  await prisma.codingProject.update({
    where: { id },
    data: { balancePaid, balancePaidAt: balancePaid ? new Date() : null },
  });
  revalidatePath("/coding");
  revalidatePath("/");
}
