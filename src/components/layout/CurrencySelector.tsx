"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { ChevronDown, Globe } from "lucide-react"
import { CURRENCIES } from "@/lib/utils/currency"
import styles from "./CurrencySelector.module.css"

export default function CurrencySelector() {
  const { data: session, update } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  
  const currentCurrency = session?.user?.currency || "USD"
  const selected = CURRENCIES.find(c => c.code === currentCurrency) || CURRENCIES[0]

  const handleSelect = async (code: string) => {
    setIsOpen(false)
    
    // In a real app, we'd call a Server Action to update the DB
    // For now, we update the session client-side
    await update({ currency: code })
    
    // Pro-tip: You might want to refresh or show a toast here
  }

  return (
    <div className={styles.container}>
      <button 
        className={styles.trigger}
        onClick={() => setIsOpen(!isOpen)}
      >
        <Globe size={18} />
        <span className={styles.code}>{selected.code}</span>
        <ChevronDown size={16} className={isOpen ? styles.rotate : ""} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {CURRENCIES.map((curr) => (
            <button
              key={curr.code}
              className={`${styles.option} ${curr.code === currentCurrency ? styles.active : ""}`}
              onClick={() => handleSelect(curr.code)}
            >
              <span className={styles.symbol}>{curr.symbol}</span>
              <span className={styles.label}>{curr.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
