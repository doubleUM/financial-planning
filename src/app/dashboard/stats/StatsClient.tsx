"use client"

import { useState, useRef, useEffect } from "react"
import { formatCurrency } from "@/lib/utils/currency"
import { useCurrency } from "@/components/providers/CurrencyContext"
import DemoBanner from "@/components/layout/DemoBanner"
import { ChevronDown } from "lucide-react"
import styles from "./stats.module.css"

export type StatsData = {
  categoryBreakdown: { category: string; emoji: string; amount: number; percentage: number }[]
  monthlyTrend: { month: string; amount: number }[]
  totalThisMonth: number
  dailyAverage: number
  topCategory: string
  hasData: boolean
}

const MOCK_DATA: StatsData = {
  categoryBreakdown: [
    { category: "Food & Drinks", emoji: "🍔", amount: 245.80, percentage: 32 },
    { category: "Shopping", emoji: "🛒", amount: 187.50, percentage: 24 },
    { category: "Bills & Utilities", emoji: "💡", amount: 130.00, percentage: 17 },
    { category: "Transport", emoji: "🚗", amount: 98.40, percentage: 13 },
    { category: "Entertainment", emoji: "🎬", amount: 65.99, percentage: 8 },
    { category: "Health", emoji: "💪", amount: 45.00, percentage: 6 },
  ],
  monthlyTrend: [
    { month: "Jan", amount: 920 },
    { month: "Feb", amount: 1050 },
    { month: "Mar", amount: 880 },
    { month: "Apr", amount: 1200 },
    { month: "May", amount: 772.69 },
  ],
  totalThisMonth: 772.69,
  dailyAverage: 36.79,
  topCategory: "🍔 Food & Drinks",
  hasData: true,
}

export default function StatsClient({ isGuest, data }: { isGuest: boolean; data: StatsData | null }) {
  const { currency: userCurrency } = useCurrency()
  const [chartView, setChartView] = useState<"monthly" | "category">("monthly")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const stats = isGuest ? MOCK_DATA : data!

  if (!isGuest && !stats.hasData) {
    return (
      <div className="container">
        <header className={styles.header}>
          <h1>Statistics</h1>
          <p>Insights into your spending habits.</p>
        </header>
        <div className={styles.card}>
          <div className={styles.emptyState}>
            <p>No data yet. Add some expenses to see your statistics.</p>
          </div>
        </div>
      </div>
    )
  }

  const maxMonthly = Math.max(...stats.monthlyTrend.map(m => m.amount), 1)

  return (
    <div className="container">
      {isGuest && <DemoBanner />}

      <header className={styles.header}>
        <h1>Statistics</h1>
        <p>Insights into your spending habits.</p>
      </header>

      <div className={styles.grid}>
        {/* Main Chart */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h3>{chartView === "monthly" ? "Monthly Spending" : "Category Spending"}</h3>
            <div className={styles.customSelect} ref={dropdownRef}>
              <button 
                className={styles.selectTrigger}
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                {chartView === "monthly" ? "Monthly View" : "Category View"}
                <ChevronDown size={16} className={`${styles.chevron} ${isDropdownOpen ? styles.chevronOpen : ""}`} />
              </button>
              
              {isDropdownOpen && (
                <div className={styles.selectMenu}>
                  <button 
                    className={`${styles.selectOption} ${chartView === "monthly" ? styles.selectOptionActive : ""}`}
                    onClick={() => { setChartView("monthly"); setIsDropdownOpen(false); }}
                  >
                    Monthly View
                  </button>
                  <button 
                    className={`${styles.selectOption} ${chartView === "category" ? styles.selectOptionActive : ""}`}
                    onClick={() => { setChartView("category"); setIsDropdownOpen(false); }}
                  >
                    Category View
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className={styles.chartContainer}>
            {chartView === "monthly" ? (
              stats.monthlyTrend.map((month) => (
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
              ))
            ) : (
              stats.categoryBreakdown.slice(0, 5).map((cat) => (
                <div key={cat.category} className={styles.barGroup}>
                  <div className={styles.barWrapper}>
                    <div
                      className={styles.bar}
                      style={{ 
                        height: `${(cat.amount / Math.max(...stats.categoryBreakdown.map(c => c.amount), 1)) * 100}%`,
                        background: 'linear-gradient(180deg, var(--accent-light), var(--accent))'
                      }}
                    />
                  </div>
                  <span className={styles.barLabel} title={cat.category}>{cat.emoji}</span>
                  <span className={styles.barValue}>
                    {formatCurrency(cat.amount, userCurrency)}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className={styles.card}>
          <h3>By Category</h3>
          <div className={styles.categoryList}>
            {stats.categoryBreakdown.map((cat) => (
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
              {formatCurrency(stats.totalThisMonth, userCurrency)}
            </strong>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Daily Average</span>
            <strong className={styles.summaryValue}>
              {formatCurrency(stats.dailyAverage, userCurrency)}
            </strong>
          </div>
          <div className={styles.summaryCard}>
            <span className={styles.summaryLabel}>Top Category</span>
            <strong className={styles.summaryValue}>{stats.topCategory}</strong>
          </div>
        </div>
      </div>
    </div>
  )
}
