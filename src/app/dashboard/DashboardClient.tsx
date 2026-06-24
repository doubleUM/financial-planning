"use client"

import { TrendingUp, TrendingDown, DollarSign, Receipt } from "lucide-react"
import Link from "next/link"
import styles from "./dashboard.module.css"
import { formatCurrency } from "@/lib/utils/currency"
import { useCurrency } from "@/components/providers/CurrencyContext"
import DemoBanner from "@/components/layout/DemoBanner"

type Expense = {
  id: string
  description: string
  category: string
  amount: number
  date: string
}

type Props = {
  expenses: Expense[]
  monthlySpent: number
  totalSpent: number
  totalCount?: number
  isGuest: boolean
  userName: string
}

const MOCK_STATS = [
  { label: "Total Balance", value: 4250.00, icon: DollarSign },
  { label: "Monthly Spent", value: 1120.50, icon: TrendingDown },
  { label: "Monthly Income", value: 2800.00, icon: TrendingUp },
]

const MOCK_EXPENSES = [
  { id: "1", description: "Starbucks", category: "Food", amount: 5.50, date: new Date().toISOString() },
  { id: "2", description: "Netflix", category: "Subscription", amount: 15.99, date: new Date().toISOString() },
  { id: "3", description: "Groceries", category: "Shopping", amount: 82.30, date: new Date().toISOString() },
]

function formatRelativeDate(iso: string) {
  const date = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  if (diffDays === 0) return "Today"
  if (diffDays === 1) return "Yesterday"
  return `${diffDays} days ago`
}

export default function DashboardClient({ expenses, monthlySpent, totalSpent, totalCount = 0, isGuest, userName }: Props) {
  const { currency: userCurrency } = useCurrency()

  if (isGuest) {
    return (
      <div className="container">
        <DemoBanner />
        <header className={styles.welcome}>
          <h1>Welcome back, Explorer</h1>
          <p>Here's what's happening with your finances.</p>
        </header>
        <section className={styles.statsGrid}>
          {MOCK_STATS.map((stat, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statHeader}>
                <div className={styles.iconBox}><stat.icon size={24} /></div>
              </div>
              <div className={styles.statContent}>
                <span className={styles.statLabel}>{stat.label}</span>
                <h2 className={styles.statValue}>{formatCurrency(stat.value, userCurrency)}</h2>
              </div>
            </div>
          ))}
        </section>
        <section className={styles.contentGrid}>
          <div className={styles.mainContent}>
            <div className={styles.sectionHeader}>
              <h3>Recent Expenses</h3>
              <Link href="/dashboard/expenses" className="btn btn-secondary">View All</Link>
            </div>
            <div className={styles.expenseList}>
              {MOCK_EXPENSES.map(e => (
                <div key={e.id} className={styles.expenseItem}>
                  <div className={styles.expenseInfo}>
                    <strong>{e.description}</strong>
                    <span>{e.category}</span>
                  </div>
                  <div className={`${styles.expenseAmount} mono`}>-{formatCurrency(e.amount, userCurrency)}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.sideContent}>
            <h3>Monthly Goal</h3>
            <div className={styles.goalProgress}>
              <div className={styles.progressHeader}><span>Savings Goal</span><span>75%</span></div>
              <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: "75%" }} /></div>
              <p>Sign in to track your real savings goal.</p>
            </div>
          </div>
        </section>
      </div>
    )
  }

  const stats = [
    { label: "Monthly Spent", value: monthlySpent, icon: TrendingDown },
    { label: "Total Spent", value: totalSpent, icon: DollarSign },
    { label: "Total Expenses", value: totalCount, icon: Receipt, isCount: true },
  ]

  return (
    <div className="container">
      <header className={styles.welcome}>
        <h1>Welcome back, {userName}</h1>
        <p>Here's what's happening with your finances.</p>
      </header>

      <section className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.iconBox}><stat.icon size={24} /></div>
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>{stat.label}</span>
              <h2 className={styles.statValue}>
                {stat.isCount ? stat.value : formatCurrency(stat.value as number, userCurrency)}
              </h2>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <div className={styles.sectionHeader}>
            <h3>Recent Expenses</h3>
            <Link href="/dashboard/expenses" className="btn btn-secondary">View All</Link>
          </div>
          <div className={styles.expenseList}>
            {expenses.length === 0 ? (
              <div className={styles.emptyState}>
                <p>No expenses yet. Add your first one!</p>
              </div>
            ) : (
              expenses.map(e => (
                <div key={e.id} className={styles.expenseItem}>
                  <div className={styles.expenseInfo}>
                    <strong>{e.description}</strong>
                    <span>{e.category} • {formatRelativeDate(e.date)}</span>
                  </div>
                  <div className={`${styles.expenseAmount} mono`}>-{formatCurrency(e.amount, userCurrency)}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className={styles.sideContent}>
          <h3>Monthly Goal</h3>
          <div className={styles.goalProgress}>
            <div className={styles.progressHeader}><span>Savings Goal</span><span>—</span></div>
            <div className={styles.progressBar}><div className={styles.progressFill} style={{ width: "0%" }} /></div>
            <p>Goal tracking coming soon.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
