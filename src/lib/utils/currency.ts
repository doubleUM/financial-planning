export const CURRENCIES = [
  { code: "USD", symbol: "$", label: "US Dollar", locale: "en-US" },
  { code: "EUR", symbol: "€", label: "Euro", locale: "de-DE" },
  { code: "GBP", symbol: "£", label: "British Pound", locale: "en-GB" },
  { code: "IDR", symbol: "Rp", label: "Indonesian Rupiah", locale: "id-ID" },
  { code: "JPY", symbol: "¥", label: "Japanese Yen", locale: "ja-JP" },
]

export function formatCurrency(amount: number, currencyCode: string = "USD") {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0]
  
  return new Intl.NumberFormat(currency.locale, {
    style: "currency",
    currency: currency.code,
  }).format(amount)
}

export function getCurrencySymbol(currencyCode: string = "USD") {
  const currency = CURRENCIES.find(c => c.code === currencyCode) || CURRENCIES[0]
  return currency.symbol
}
