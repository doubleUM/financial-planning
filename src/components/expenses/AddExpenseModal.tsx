"use client"

import { useState, useEffect, useActionState } from "react"
import { X, Tag, FileText, ChevronDown } from "lucide-react"
import styles from "./AddExpenseModal.module.css"
import { getCurrencySymbol } from "@/lib/utils/currency"
import { useCurrency } from "@/components/providers/CurrencyContext"
import { addExpense } from "@/app/dashboard/expenses/actions"

export default function AddExpenseModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { currency } = useCurrency()
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [category, setCategory] = useState("")

  const [state, formAction, pending] = useActionState(addExpense, null)

  const categories = [
    "Food & Drinks", "Transport", "Shopping", "Bills & Utilities", "Entertainment", "Health", "Other"
  ]

  useEffect(() => {
    if (state && "success" in state && state.success) {
      setCategory("")
      onClose()
    }
  }, [state]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isOpen) {
      setCategory("")
      setIsSelectOpen(false)
    }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Add Expense</h2>
          <button type="button" onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        {state && "error" in state && (
          <div className={styles.errorMsg}>{state.error}</div>
        )}

        <form action={formAction} className={styles.form}>
          <input type="hidden" name="category" value={category} />

          <div className={styles.inputGroup}>
            <label>
              <span className={styles.currencySymbol}>{getCurrencySymbol(currency)}</span>
              Amount
            </label>
            <input type="number" name="amount" placeholder="0.00" step="0.01" min="0.01" required />
          </div>

          <div className={styles.inputGroup}>
            <label><Tag size={16} /> Category</label>
            <div className={styles.customSelectContainer}>
              <div
                className={styles.customSelectTrigger}
                onClick={() => setIsSelectOpen(!isSelectOpen)}
              >
                <span>{category || "Select Category"}</span>
                <ChevronDown size={20} />
              </div>

              {isSelectOpen && (
                <div className={styles.customOptions}>
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className={styles.option}
                      onClick={() => {
                        setCategory(cat)
                        setIsSelectOpen(false)
                      }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label><FileText size={16} /> Description</label>
            <input type="text" name="description" placeholder="What was it for?" />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: "100%", marginTop: "1rem" }}
            disabled={pending}
          >
            {pending ? "Saving..." : "Save Expense"}
          </button>
        </form>
      </div>
    </div>
  )
}
