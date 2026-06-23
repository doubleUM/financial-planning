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

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const [guestCurrency, setGuestCurrency] = useState("USD")

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
