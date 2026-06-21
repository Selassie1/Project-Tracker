"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { prisma } from "@/app/lib/prisma";

function parseAssignment(formData: FormData) {
  return {
    clientName: String(formData.get("clientName")),
    whatsappNumber: String(formData.get("whatsappNumber")),
    topic: String(formData.get("topic")),
    amountCharged: Number(formData.get("amountCharged")),
    deadline: new Date(String(formData.get("deadline"))),
    status: String(formData.get("status")) as "PENDING" | "IN_PROGRESS" | "COMPLETED",
    notes: String(formData.get("notes") || "") || null,
  };
}

export async function createAssignment(formData: FormData) {
  await prisma.assignment.create({ data: parseAssignment(formData) });
  revalidatePath("/assignments");
  revalidatePath("/");
  redirect("/assignments");
}

export async function updateAssignment(id: string, formData: FormData) {
  await prisma.assignment.update({ where: { id }, data: parseAssignment(formData) });
  revalidatePath("/assignments");
  revalidatePath("/");
  redirect("/assignments");
}

export async function deleteAssignment(id: string) {
  await prisma.assignment.delete({ where: { id } });
  revalidatePath("/assignments");
  revalidatePath("/");
}

export async function togglePaid(id: string, isPaid: boolean) {
  await prisma.assignment.update({
    where: { id },
    data: { isPaid, paidAt: isPaid ? new Date() : null },
  });
  revalidatePath("/assignments");
  revalidatePath("/");
}
