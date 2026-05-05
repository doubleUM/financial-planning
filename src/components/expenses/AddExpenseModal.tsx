"use client"

import { useState, useRef, useEffect } from "react"
import { useSession } from "next-auth/react"
import { X, DollarSign, Tag, FileText, ChevronDown } from "lucide-react"
import styles from "./AddExpenseModal.module.css"
import { getCurrencySymbol } from "@/lib/utils/currency"

export default function AddExpenseModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { data: session } = useSession()
  const [isSelectOpen, setIsSelectOpen] = useState(false)
  const [category, setCategory] = useState("")
  
  const categories = [
    "Food & Drinks", "Transport", "Shopping", "Bills & Utilities", "Entertainment", "Health", "Other"
  ]

  if (!isOpen) return null

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={`${styles.modal}`} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Add Expense</h2>
          <button onClick={onClose} className={styles.closeBtn}><X size={20} /></button>
        </div>

        <form className={styles.form}>
          <div className={styles.inputGroup}>
            <label>
              <span className={styles.currencySymbol}>
                {getCurrencySymbol(session?.user?.currency)}
              </span>
              Amount
            </label>
            <input type="number" placeholder="0.00" step="0.01" required />
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
            <input type="text" placeholder="What was it for?" />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Save Expense
          </button>
        </form>
      </div>
    </div>
  )
}
