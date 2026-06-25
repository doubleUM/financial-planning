"use client"

import { SessionProvider } from "next-auth/react"
import { CurrencyProvider } from "./CurrencyContext"

type ProvidersProps = {
  children: React.ReactNode
  initialCurrency?: string
}

export default function Providers({ children, initialCurrency }: ProvidersProps) {
  return (
    <SessionProvider>
      <CurrencyProvider initialCurrency={initialCurrency}>{children}</CurrencyProvider>
    </SessionProvider>
  )
}
