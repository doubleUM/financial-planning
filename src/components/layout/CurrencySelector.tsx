"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { ChevronDown, Globe } from "lucide-react"
import { CURRENCIES } from "@/lib/utils/currency"
import { updateCurrency } from "@/app/actions"
import { useCurrency } from "@/components/providers/CurrencyContext"
import styles from "./CurrencySelector.module.css"

export default function CurrencySelector() {
  const { data: session, update } = useSession()
  const { currency: currentCurrency, setCurrency } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const selected = CURRENCIES.find(c => c.code === currentCurrency) || CURRENCIES[0]

  const handleSelect = async (code: string) => {
    if (isPending) return
    setIsOpen(false)
    setIsPending(true)

    try {
      if (session?.user?.id) {
        await updateCurrency(code)
        await update({ currency: code })
      }
      setCurrency(code)
    } catch (error) {
      console.error("Failed to update currency", error)
    } finally {
      setIsPending(false)
    }
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
