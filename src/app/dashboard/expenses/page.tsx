import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import ExpensesClient from "./ExpensesClient"
import { getCategories } from "./actions"

export default async function ExpensesPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return <ExpensesClient expenses={[]} isGuest={true} />
  }

  const [expenses, categories] = await Promise.all([
    prisma.expense.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
    }),
    getCategories(),
  ])

  return (
    <ExpensesClient
      isGuest={false}
      categories={categories}
      expenses={expenses.map(e => ({
        id: e.id,
        description: e.description ?? "",
        category: e.category,
        amount: e.amount,
        date: e.date.toISOString(),
      }))}
    />
  )
}
