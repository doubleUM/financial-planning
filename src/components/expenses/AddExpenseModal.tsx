"use client"

import { useState, useEffect, useActionState } from "react"
import { X, Tag, FileText, ChevronDown } from "lucide-react"
import styles from "./AddExpenseModal.module.css"
import { getCurrencySymbol } from "@/lib/utils/currency"
import { useCurrency } from "@/components/providers/CurrencyContext"
import { addExpense, editExpense, getCategories, type CategoryData } from "@/app/dashboard/expenses/actions"

type Expense = {
  id: string
  description: string
  category: string
  amount: number
}

type Props = {
  isOpen: boolean
  onClose: () => void
  expense?: Expense | null
}

export default function AddExpenseModal({ isOpen, onClose, expense }: Props) {
  const { currency } = useCurrency()
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [category, setCategory] = useState("")
  const [categories, setCategories] = useState<CategoryData[]>([])
  const [loadingCategories, setLoadingCategories] = useState(false)

  const isEditMode = !!expense

  const [state, formAction, pending] = useActionState(
    isEditMode ? editExpense : addExpense,
    null
  )

  // Fetch categories when modal opens
  useEffect(() => {
    if (isOpen) {
      setLoadingCategories(true)
      getCategories().then((cats) => {
        setCategories(cats)
        setLoadingCategories(false)
      })
    }
  }, [isOpen])

  // Reset form when modal opens
  useEffect(() => {
    if (isOpen) {
      setCategory(expense?.category || "")
      setIsSelectOpen(false)
    }
  }, [isOpen, expense])

  // Close on success
  useEffect(() => {
    if (state && "success" in state && state.success) {
      setCategory("")
      onClose()
    }
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{isEditMode ? "Edit Expense" : "Add Expense"}</h2>
          <button type="button" onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        {state && "error" in state && (
          <div className={styles.errorMsg}>{state.error}</div>
        )}

        <form action={formAction} className={styles.form}>
          {isEditMode && <input type="hidden" name="id" value={expense.id} />}
          <input type="hidden" name="category" value={category} />

          <div className={styles.inputGroup}>
            <label>
              <span className={styles.currencySymbol}>{getCurrencySymbol(currency)}</span>
              Amount
            </label>
            <input
              type="number"
              name="amount"
              placeholder="0.00"
              step="0.01"
              min="0.01"
              required
              defaultValue={isEditMode ? expense.amount : undefined}
            />
          </div>

          <div className={styles.inputGroup}>
            <label><Tag size={16} /> Category</label>
            <div className={styles.customSelectContainer}>
              <div
                className={styles.customSelectTrigger}
                onClick={() => setIsSelectOpen(!isSelectOpen)}
              >
                <span>
                  {category
                    ? `${categories.find(c => c.name === category)?.emoji || "📦"} ${category}`
                    : "Select Category"}
                </span>
                <ChevronDown size={20} />
              </div>

              {isSelectOpen && (
                <div className={styles.customOptions}>
                  {loadingCategories ? (
                    <div className={styles.option} style={{ color: "var(--text-muted)" }}>Loading...</div>
                  ) : categories.length === 0 ? (
                    <div className={styles.option} style={{ color: "var(--text-muted)" }}>No categories yet</div>
                  ) : (
                    categories.map((cat) => (
                      <div
                        key={cat.id}
                        className={styles.option}
                        onClick={() => {
                          setCategory(cat.name)
                          setIsSelectOpen(false)
                        }}
                      >
                        {cat.emoji} {cat.name}
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label><FileText size={16} /> Description</label>
            <input
              type="text"
              name="description"
              placeholder="What was it for?"
              defaultValue={isEditMode ? expense.description : undefined}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={pending}
          >
            {pending
              ? (isEditMode ? "Updating..." : "Saving...")
              : (isEditMode ? "Update Expense" : "Save Expense")
            }
          </button>
        </form>
      </div>
    </div>
  )
}
