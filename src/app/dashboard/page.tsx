import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import DashboardClient from "./DashboardClient"

export default async function DashboardPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return <DashboardClient expenses={[]} monthlySpent={0} totalSpent={0} isGuest={true} userName="Explorer" />
  }

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const [recentExpenses, monthlyAgg, totalAgg] = await Promise.all([
    prisma.expense.findMany({
      where: { userId: session.user.id },
      orderBy: { date: "desc" },
      take: 3,
    }),
    prisma.expense.aggregate({
      where: { userId: session.user.id, date: { gte: startOfMonth } },
      _sum: { amount: true },
    }),
    prisma.expense.aggregate({
      where: { userId: session.user.id },
      _sum: { amount: true },
      _count: true,
    }),
  ])

  return (
    <DashboardClient
      expenses={recentExpenses.map(e => ({
        id: e.id,
        description: e.description ?? e.category,
        category: e.category,
        amount: e.amount,
        date: e.date.toISOString(),
      }))}
      monthlySpent={monthlyAgg._sum.amount ?? 0}
      totalSpent={totalAgg._sum.amount ?? 0}
      totalCount={totalAgg._count}
      isGuest={false}
      userName={session.user.name ?? "User"}
    />
  )
}
