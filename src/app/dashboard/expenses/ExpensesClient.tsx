"use client"

import { useState, useTransition } from "react"
import { Trash2, Pencil } from "lucide-react"
import { formatCurrency } from "@/lib/utils/currency"
import { useCurrency } from "@/components/providers/CurrencyContext"
import DemoBanner from "@/components/layout/DemoBanner"
import AddExpenseModal from "@/components/expenses/AddExpenseModal"
import { deleteExpense, type CategoryData } from "./actions"
import styles from "./expenses.module.css"

type Expense = {
  id: string
  description: string
  category: string
  amount: number
  date: string
}

const MOCK_EXPENSES: Expense[] = [
  { id: "1", description: "Morning latte", category: "Food & Drinks", amount: 5.50, date: "2026-05-21" },
  { id: "2", description: "Monthly subscription", category: "Entertainment", amount: 15.99, date: "2026-05-20" },
  { id: "3", description: "Weekly groceries", category: "Shopping", amount: 82.30, date: "2026-05-19" },
  { id: "4", description: "Ride to office", category: "Transport", amount: 12.40, date: "2026-05-18" },
  { id: "5", description: "Monthly electricity", category: "Bills & Utilities", amount: 65.00, date: "2026-05-17" },
  { id: "6", description: "Monthly membership", category: "Health", amount: 30.00, date: "2026-05-16" },
]

const DEFAULT_EMOJI_MAP: Record<string, string> = {
  "Food & Drinks": "🍔",
  "Entertainment": "🎬",
  "Shopping": "🛒",
  "Transport": "🚗",
  "Bills & Utilities": "💡",
  "Health": "💪",
  "Other": "📦",
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

type Props = {
  expenses: Expense[]
  isGuest: boolean
  categories?: CategoryData[]
}

export default function ExpensesClient({ expenses, isGuest, categories = [] }: Props) {
  const { currency: userCurrency } = useCurrency()
  const [isPending, startTransition] = useTransition()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null)
  const rows = isGuest ? MOCK_EXPENSES : expenses

  // Build emoji map from categories (fallback to defaults for guests)
  const emojiMap: Record<string, string> = isGuest
    ? DEFAULT_EMOJI_MAP
    : Object.fromEntries(categories.map(c => [c.name, c.emoji]))

  function handleDeleteClick(id: string) {
    setConfirmDeleteId(id)
  }

  function handleCancelDelete() {
    setConfirmDeleteId(null)
  }

  function handleConfirmDelete(id: string) {
    setDeletingId(id)
    setConfirmDeleteId(null)
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
                  {emojiMap[expense.category] || "📦"} {expense.category}
                </span>
              </div>
              <div className={styles.dateCell}>{formatDate(expense.date)}</div>
              <div className={`${styles.amountCell} mono`}>
                -{formatCurrency(expense.amount, userCurrency)}
              </div>
              <div className={styles.actionCell}>
                {!isGuest && (
                  confirmDeleteId === expense.id ? (
                    <div className={styles.confirmDeleteGroup}>
                      <span className={styles.confirmText}>Delete?</span>
                      <button
                        className={styles.confirmYesBtn}
                        onClick={() => handleConfirmDelete(expense.id)}
                        disabled={isPending && deletingId === expense.id}
                        aria-label="Confirm delete"
                      >
                        Yes
                      </button>
                      <button
                        className={styles.confirmNoBtn}
                        onClick={handleCancelDelete}
                        disabled={isPending && deletingId === expense.id}
                        aria-label="Cancel delete"
                      >
                        No
                      </button>
                    </div>
                  ) : (
                    <>
                      <button
                        className={styles.editBtn}
                        onClick={() => setEditingExpense(expense)}
                        aria-label="Edit expense"
                        disabled={isPending && deletingId === expense.id}
                      >
                        <Pencil size={15} />
                      </button>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDeleteClick(expense.id)}
                        disabled={isPending && deletingId === expense.id}
                        aria-label="Delete expense"
                      >
                        <Trash2 size={15} />
                      </button>
                    </>
                  )
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Expense Modal */}
      <AddExpenseModal
        isOpen={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        expense={editingExpense}
      />
    </div>
  )
}

