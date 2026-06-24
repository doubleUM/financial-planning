'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type ActionState = { error: string } | { success: true } | null

export async function addExpense(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "You must be logged in to add an expense." }
  }

  const amountStr = formData.get("amount") as string
  const category = (formData.get("category") as string)?.trim()
  const description = (formData.get("description") as string)?.trim()

  const amount = parseFloat(amountStr)
  if (!amountStr || isNaN(amount) || amount <= 0) {
    return { error: "Please enter a valid amount." }
  }
  if (!category) {
    return { error: "Please select a category." }
  }

  await prisma.expense.create({
    data: {
      amount,
      category,
      description: description || null,
      userId: session.user.id,
    },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/expenses")
  revalidatePath("/dashboard/stats")

  return { success: true }
}

export async function deleteExpense(id: string): Promise<{ error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  await prisma.expense.delete({
    where: { id, userId: session.user.id },
  })

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/expenses")
  revalidatePath("/dashboard/stats")

  return {}
}
