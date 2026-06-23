"use client"

import { useSession } from "next-auth/react"
import { formatCurrency } from "@/lib/utils/currency"
import { useCurrency } from "@/components/providers/CurrencyContext"
import DemoBanner from "@/components/layout/DemoBanner"
import styles from "./stats.module.css"

export default function StatsPage() {
  const { data: session } = useSession()
  const { currency: userCurrency } = useCurrency()
  const isGuest = !session?.user

  const categoryBreakdown = [
    { category: "Food & Drinks", emoji: "🍔", amount: 245.80, percentage: 32 },
    { category: "Shopping", emoji: "🛒", amount: 187.50, percentage: 24 },
    { category: "Bills & Utilities", emoji: "💡", amount: 130.00, percentage: 17 },
    { category: "Transport", emoji: "🚗", amount: 98.40, percentage: 13 },
    { category: "Entertainment", emoji: "🎬", amount: 65.99, percentage: 8 },
    { category: "Health", emoji: "💪", amount: 45.00, percentage: 6 },
  ]

  const monthlyTrend = [
    { month: "Jan", amount: 920 },
    { month: "Feb", amount: 1050 },
    { month: "Mar", amount: 880 },
    { month: "Apr", amount: 1200 },
    { month: "May", amount: 772.69 },
  ]

  const maxMonthly = Math.max(...monthlyTrend.map(m => m.amount))

  return (
    <div className="container">
      {isGuest && <DemoBanner />}

      <header className={styles.header}>
        <h1>Statistics</h1>
        <p>Insights into your spending habits.</p>
      </header>

      <div className={styles.grid}>
        {/* Monthly Spending Trend */}
        <div className={styles.card}>
          <h3>Monthly Spending</h3>
          <div className={styles.chartContainer}>
            {monthlyTrend.map((month) => (
              <div key={month.month} className={styles.barGroup}>
                <div className={styles.barWrapper}>
                  <div
                    className={styles.bar}
                    style={{ height: `${(month.amount / maxMonthly) * 100}%` }}
                  />
                </div>
                <span className={styles.barLabel}>{month.month}</span>
                <span className={styles.barValue}>
                  {formatCurrency(month.amount, userCurrency)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className={styles.card}>
          <h3>By Category</h3>
          <div className={styles.categoryList}>
            {categoryBreakdown.map((cat) => (
              <div key={cat.category} className={styles.categoryItem}>
                <div className={styles.categoryInfo}>
                  <span className={styles.categoryEmoji}>{cat.emoji}</span>
                  <div className={styles.categoryText}>
                    <strong>{cat.category}</strong>
                    <span>{formatCurrency(cat.amount, userCurrency)}</span>
                  </div>
                </div>
                <div className={styles.categoryBar}>
                  <div
                    className={styles.categoryFill}
                    style={{ width: `${cat.percentage}%` }}
                  />
                </div>
                <span className={styles.categoryPct}>{cat.percentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Summary Cards */}
        <div className={styles.summaryRow}>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Total This Month</span>
            <strong className={styles.summaryValue}>
              {formatCurrency(772.69, userCurrency)}
            </strong>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Daily Average</span>
            <strong className={styles.summaryValue}>
              {formatCurrency(36.79, userCurrency)}
            </strong>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Top Category</span>
            <strong className={styles.summaryValue}>🍔 Food & Drinks</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
