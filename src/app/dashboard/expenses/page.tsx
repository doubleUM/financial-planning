import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import ExpensesClient from "./ExpensesClient"

export default async function ExpensesPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return <ExpensesClient expenses={[]} isGuest={true} />
  }

  const expenses = await prisma.expense.findMany({
    where: { userId: session.user.id },
    orderBy: { date: "desc" },
  })

  return (
    <ExpensesClient
      isGuest={false}
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
