"use client"

import { useSession } from "next-auth/react"
import { formatCurrency } from "@/lib/utils/currency"
import { useCurrency } from "@/components/providers/CurrencyContext"
import DemoBanner from "@/components/layout/DemoBanner"
import styles from "./expenses.module.css"

export default function ExpensesPage() {
  const { data: session } = useSession()
  const { currency: userCurrency } = useCurrency()
  const isGuest = !session?.user

  const expenses = [
    { id: 1, title: "Starbucks Coffee", category: "Food & Drinks", amount: 5.50, date: "May 21, 2026", description: "Morning latte" },
    { id: 2, title: "Netflix", category: "Entertainment", amount: 15.99, date: "May 20, 2026", description: "Monthly subscription" },
    { id: 3, title: "Grocery Store", category: "Shopping", amount: 82.30, date: "May 19, 2026", description: "Weekly groceries" },
    { id: 4, title: "Uber Ride", category: "Transport", amount: 12.40, date: "May 18, 2026", description: "Ride to office" },
    { id: 5, title: "Electric Bill", category: "Bills & Utilities", amount: 65.00, date: "May 17, 2026", description: "Monthly electricity" },
    { id: 6, title: "Gym Membership", category: "Health", amount: 30.00, date: "May 16, 2026", description: "Monthly membership" },
    { id: 7, title: "Book Purchase", category: "Shopping", amount: 24.99, date: "May 15, 2026", description: "Programming book" },
    { id: 8, title: "Lunch with friends", category: "Food & Drinks", amount: 18.75, date: "May 14, 2026", description: "Restaurant lunch" },
  ]

  const categoryEmojis: Record<string, string> = {
    "Food & Drinks": "🍔",
    "Entertainment": "🎬",
    "Shopping": "🛒",
    "Transport": "🚗",
    "Bills & Utilities": "💡",
    "Health": "💪",
    "Other": "📦",
  }

  return (
    <div className="container">
      {isGuest && <DemoBanner />}

      <header className={styles.header}>
        <h1>Expenses</h1>
        <p>Track and manage all your spending.</p>
      </header>

      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <span>Description</span>
          <span>Category</span>
          <span>Date</span>
          <span className={styles.amountCol}>Amount</span>
        </div>
        {expenses.map((expense) => (
          <div key={expense.id} className={styles.tableRow}>
            <div className={styles.titleCell}>
              <strong>{expense.title}</strong>
              <span>{expense.description}</span>
            </div>
            <div className={styles.categoryCell}>
              <span className={styles.categoryBadge}>
                {categoryEmojis[expense.category] || "📦"} {expense.category}
              </span>
            </div>
            <div className={styles.dateCell}>{expense.date}</div>
            <div className={`${styles.amountCell} mono`}>
              -{formatCurrency(expense.amount, userCurrency)}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
