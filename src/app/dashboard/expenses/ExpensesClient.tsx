"use client"

import { useState, useTransition } from "react"
import { Trash2 } from "lucide-react"
import { formatCurrency } from "@/lib/utils/currency"
import { useCurrency } from "@/components/providers/CurrencyContext"
import DemoBanner from "@/components/layout/DemoBanner"
import { deleteExpense } from "./actions"
import styles from "./expenses.module.css"

type Expense = {
  id: string
  description: string
  category: string
  amount: number
  date: string
}

const categoryEmojis: Record<string, string> = {
  "Food & Drinks": "🍔",
  "Entertainment": "🎬",
  "Shopping": "🛒",
  "Transport": "🚗",
  "Bills & Utilities": "💡",
  "Health": "💪",
  "Other": "📦",
}

const MOCK_EXPENSES: Expense[] = [
  { id: "1", description: "Morning latte", category: "Food & Drinks", amount: 5.50, date: "2026-05-21" },
  { id: "2", description: "Monthly subscription", category: "Entertainment", amount: 15.99, date: "2026-05-20" },
  { id: "3", description: "Weekly groceries", category: "Shopping", amount: 82.30, date: "2026-05-19" },
  { id: "4", description: "Ride to office", category: "Transport", amount: 12.40, date: "2026-05-18" },
  { id: "5", description: "Monthly electricity", category: "Bills & Utilities", amount: 65.00, date: "2026-05-17" },
  { id: "6", description: "Monthly membership", category: "Health", amount: 30.00, date: "2026-05-16" },
]

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default function ExpensesClient({ expenses, isGuest }: { expenses: Expense[]; isGuest: boolean }) {
  const { currency: userCurrency } = useCurrency()
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const rows = isGuest ? MOCK_EXPENSES : expenses

  function handleDelete(id: string) {
    setDeletingId(id)
    startTransition(async () => {
      await deleteExpense(id)
      setDeletingId(null)
    })
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
          <span />
        </div>
        {rows.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No expenses yet. Tap the + button to add your first one!</p>
          </div>
        ) : (
          rows.map((expense) => (
            <div key={expense.id} className={styles.tableRow}>
              <div className={styles.titleCell}>
                <strong>{expense.description || expense.category}</strong>
                {expense.description && <span>{expense.category}</span>}
              </div>
              <div className={styles.categoryCell}>
                <span className={styles.categoryBadge}>
                  {categoryEmojis[expense.category] || "📦"} {expense.category}
                </span>
              </div>
              <div className={styles.dateCell}>{formatDate(expense.date)}</div>
              <div className={`${styles.amountCell} mono`}>
                -{formatCurrency(expense.amount, userCurrency)}
              </div>
              <div className={styles.actionCell}>
                {!isGuest && (
                  <button
                    className={styles.deleteBtn}
                    onClick={() => handleDelete(expense.id)}
                    disabled={isPending && deletingId === expense.id}
                    aria-label="Delete expense"
                  >
                    <Trash2 size={15} />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
