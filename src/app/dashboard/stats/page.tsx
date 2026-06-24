import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import StatsClient, { type StatsData } from "./StatsClient"

const categoryEmojis: Record<string, string> = {
  "Food & Drinks": "🍔",
  "Entertainment": "🎬",
  "Shopping": "🛒",
  "Transport": "🚗",
  "Bills & Utilities": "💡",
  "Health": "💪",
  "Other": "📦",
}

export default async function StatsPage() {
  const session = await auth()

  if (!session?.user?.id) {
    return <StatsClient isGuest={true} data={null} />
  }

  const expenses = await prisma.expense.findMany({
    where: { userId: session.user.id },
    select: { amount: true, category: true, date: true },
  })

  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  // Category breakdown (all-time)
  const byCategory = new Map<string, number>()
  let grandTotal = 0
  for (const e of expenses) {
    byCategory.set(e.category, (byCategory.get(e.category) ?? 0) + e.amount)
    grandTotal += e.amount
  }
  const categoryBreakdown = [...byCategory.entries()]
    .map(([category, amount]) => ({
      category,
      emoji: categoryEmojis[category] ?? "📦",
      amount,
      percentage: grandTotal > 0 ? Math.round((amount / grandTotal) * 100) : 0,
    }))
    .sort((a, b) => b.amount - a.amount)

  // Monthly trend (last 5 months)
  const monthlyTrend: { month: string; amount: number }[] = []
  for (let i = 4; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const next = new Date(now.getFullYear(), now.getMonth() - i + 1, 1)
    const amount = expenses
      .filter(e => e.date >= d && e.date < next)
      .reduce((sum, e) => sum + e.amount, 0)
    monthlyTrend.push({ month: d.toLocaleDateString("en-US", { month: "short" }), amount })
  }

  // This month summary
  const totalThisMonth = expenses
    .filter(e => e.date >= startOfMonth)
    .reduce((sum, e) => sum + e.amount, 0)
  const dayOfMonth = now.getDate()
  const dailyAverage = dayOfMonth > 0 ? totalThisMonth / dayOfMonth : 0
  const topCategory = categoryBreakdown[0]

  const data: StatsData = {
    categoryBreakdown,
    monthlyTrend,
    totalThisMonth,
    dailyAverage,
    topCategory: topCategory ? `${topCategory.emoji} ${topCategory.category}` : "—",
    hasData: expenses.length > 0,
  }

  return <StatsClient isGuest={false} data={data} />
}
