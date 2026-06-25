"use client"

import { createContext, useContext, useState } from "react"
import { useSession } from "next-auth/react"

type CurrencyContextType = {
  currency: string
  setCurrency: (code: string) => void
}

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "USD",
  setCurrency: () => {},
})

type CurrencyProviderProps = {
  children: React.ReactNode
  initialCurrency?: string
}

export function CurrencyProvider({ children, initialCurrency = "USD" }: CurrencyProviderProps) {
  const { data: session } = useSession()
  const [guestCurrency, setGuestCurrency] = useState(initialCurrency)

  const currency = session?.user?.currency || guestCurrency

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency: setGuestCurrency }}>
      {children}
    </CurrencyContext.Provider>
  )
}

export function useCurrency() {
  return useContext(CurrencyContext)
}
