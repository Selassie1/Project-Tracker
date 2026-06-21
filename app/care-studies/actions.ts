"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

function parseCareStudy(formData: FormData) {
  const deadlineRaw = String(formData.get("deadline") || "");
  return {
    clientName: String(formData.get("clientName")),
    whatsappNumber: String(formData.get("whatsappNumber")),
    condition: String(formData.get("condition")),
    amountCharged: Number(formData.get("amountCharged")),
    depositAmount: Number(formData.get("depositAmount")),
    balanceAmount: Number(formData.get("balanceAmount")),
    deadline: deadlineRaw ? new Date(deadlineRaw) : null,
    status: String(formData.get("status")) as "PENDING" | "IN_PROGRESS" | "COMPLETED",
    notes: String(formData.get("notes") || "") || null,
  };
}

export async function createCareStudy(formData: FormData) {
  await prisma.careStudy.create({ data: parseCareStudy(formData) });
  revalidatePath("/care-studies");
  revalidatePath("/");
  redirect("/care-studies");
}

export async function updateCareStudy(id: string, formData: FormData) {
  await prisma.careStudy.update({ where: { id }, data: parseCareStudy(formData) });
  revalidatePath("/care-studies");
  revalidatePath("/");
  redirect("/care-studies");
}

export async function deleteCareStudy(id: string) {
  await prisma.careStudy.delete({ where: { id } });
  revalidatePath("/care-studies");
  revalidatePath("/");
}

export async function toggleDepositPaid(id: string, depositPaid: boolean) {
  await prisma.careStudy.update({
    where: { id },
    data: { depositPaid, depositPaidAt: depositPaid ? new Date() : null },
  });
  revalidatePath("/care-studies");
  revalidatePath("/");
}

export async function toggleBalancePaid(id: string, balancePaid: boolean) {
  await prisma.careStudy.update({
    where: { id },
    data: { balancePaid, balancePaidAt: balancePaid ? new Date() : null },
  });
  revalidatePath("/care-studies");
  revalidatePath("/");
}
