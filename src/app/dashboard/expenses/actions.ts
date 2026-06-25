'use server'

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

type ActionState = { error: string } | { success: true } | null

const DEFAULT_CATEGORIES = [
  { name: "Food & Drinks", emoji: "🍔" },
  { name: "Transport", emoji: "🚗" },
  { name: "Shopping", emoji: "🛒" },
  { name: "Bills & Utilities", emoji: "💡" },
  { name: "Entertainment", emoji: "🎬" },
  { name: "Health", emoji: "💪" },
  { name: "Other", emoji: "📦" },
]

function revalidateAll() {
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/expenses")
  revalidatePath("/dashboard/stats")
  revalidatePath("/dashboard/profile")
}

// ─── Expense Actions ────────────────────────────────────────────────────────

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

  revalidateAll()
  return { success: true }
}

export async function editExpense(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const session = await auth()
  if (!session?.user?.id) {
    return { error: "You must be logged in." }
  }

  const id = formData.get("id") as string
  const amountStr = formData.get("amount") as string
  const category = (formData.get("category") as string)?.trim()
  const description = (formData.get("description") as string)?.trim()

  if (!id) {
    return { error: "Missing expense ID." }
  }

  const amount = parseFloat(amountStr)
  if (!amountStr || isNaN(amount) || amount <= 0) {
    return { error: "Please enter a valid amount." }
  }
  if (!category) {
    return { error: "Please select a category." }
  }

  // Verify ownership
  const existing = await prisma.expense.findFirst({
    where: { id, userId: session.user.id },
  })
  if (!existing) {
    return { error: "Expense not found." }
  }

  await prisma.expense.update({
    where: { id },
    data: {
      amount,
      category,
      description: description || null,
    },
  })

  revalidateAll()
  return { success: true }
}

export async function deleteExpense(id: string): Promise<{ error?: string }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  await prisma.expense.delete({
    where: { id, userId: session.user.id },
  })

  revalidateAll()
  return {}
}

// ─── Category Actions ───────────────────────────────────────────────────────

export type CategoryData = {
  id: string
  name: string
  emoji: string
}

/**
 * Returns all categories for the current user.
 * If the user has none, seeds the default categories first.
 */
export async function getCategories(): Promise<CategoryData[]> {
  const session = await auth()
  if (!session?.user?.id) return []

  const existing = await prisma.category.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  })

  if (existing.length > 0) {
    return existing.map(c => ({ id: c.id, name: c.name, emoji: c.emoji }))
  }

  // Seed default categories for this user
  await prisma.category.createMany({
    data: DEFAULT_CATEGORIES.map(c => ({
      name: c.name,
      emoji: c.emoji,
      userId: session.user.id,
    })),
  })

  const seeded = await prisma.category.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "asc" },
  })

  return seeded.map(c => ({ id: c.id, name: c.name, emoji: c.emoji }))
}

export async function addCategory(name: string, emoji: string): Promise<{ error?: string; success?: true }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const trimmedName = name.trim()
  if (!trimmedName) return { error: "Category name is required." }

  // Check for duplicate
  const exists = await prisma.category.findUnique({
    where: { name_userId: { name: trimmedName, userId: session.user.id } },
  })
  if (exists) {
    return { error: `A category named "${trimmedName}" already exists.` }
  }

  await prisma.category.create({
    data: {
      name: trimmedName,
      emoji: emoji || "📦",
      userId: session.user.id,
    },
  })

  revalidateAll()
  return { success: true }
}

export async function renameCategory(
  categoryId: string,
  newName: string,
  newEmoji?: string
): Promise<{ error?: string; success?: true }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const trimmedName = newName.trim()
  if (!trimmedName) return { error: "Category name is required." }

  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId: session.user.id },
  })
  if (!category) return { error: "Category not found." }

  // Check for duplicate name (if name is changing)
  if (trimmedName !== category.name) {
    const duplicate = await prisma.category.findUnique({
      where: { name_userId: { name: trimmedName, userId: session.user.id } },
    })
    if (duplicate) {
      return { error: `A category named "${trimmedName}" already exists.` }
    }
  }

  // Update the category record
  await prisma.category.update({
    where: { id: categoryId },
    data: {
      name: trimmedName,
      ...(newEmoji !== undefined ? { emoji: newEmoji } : {}),
    },
  })

  // Also update all expenses that use the old category name
  if (trimmedName !== category.name) {
    await prisma.expense.updateMany({
      where: { userId: session.user.id, category: category.name },
      data: { category: trimmedName },
    })
  }

  revalidateAll()
  return { success: true }
}

/**
 * Delete a category. If expenses use it, reassign them to replacementCategoryName first.
 */
export async function deleteCategory(
  categoryId: string,
  replacementCategoryName?: string
): Promise<{ error?: string; success?: true; expenseCount?: number }> {
  const session = await auth()
  if (!session?.user?.id) return { error: "Unauthorized" }

  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId: session.user.id },
  })
  if (!category) return { error: "Category not found." }

  // Count expenses using this category
  const expenseCount = await prisma.expense.count({
    where: { userId: session.user.id, category: category.name },
  })

  if (expenseCount > 0) {
    if (!replacementCategoryName) {
      // Return the count so the UI can show the reassign dialog
      return {
        error: `${expenseCount} expense${expenseCount > 1 ? "s" : ""} use this category. Choose a category to reassign them to.`,
        expenseCount,
      }
    }

    // Verify the replacement category exists
    const replacement = await prisma.category.findFirst({
      where: { userId: session.user.id, name: replacementCategoryName },
    })
    if (!replacement) {
      return { error: "Replacement category not found." }
    }

    // Reassign all expenses
    await prisma.expense.updateMany({
      where: { userId: session.user.id, category: category.name },
      data: { category: replacementCategoryName },
    })
  }

  // Delete the category
  await prisma.category.delete({
    where: { id: categoryId },
  })

  revalidateAll()
  return { success: true }
}

export async function getCategoryExpenseCount(categoryId: string): Promise<number> {
  const session = await auth()
  if (!session?.user?.id) return 0

  const category = await prisma.category.findFirst({
    where: { id: categoryId, userId: session.user.id },
  })
  if (!category) return 0

  return await prisma.expense.count({
    where: { userId: session.user.id, category: category.name },
  })
}
