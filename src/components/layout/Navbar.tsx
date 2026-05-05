"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, List, PieChart, Plus, User } from "lucide-react"
import styles from "./Navbar.module.css"
import AddExpenseModal from "../expenses/AddExpenseModal"
import CurrencySelector from "./CurrencySelector"

export default function Navbar() {
  const pathname = usePathname()

  const navItems = [
    { name: "Home", icon: Home, path: "/dashboard" },
    { name: "Expenses", icon: List, path: "/dashboard/expenses" },
    { name: "Stats", icon: PieChart, path: "/dashboard/stats" },
    { name: "Profile", icon: User, path: "/dashboard/profile" },
  ]

  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      {/* Mobile Bottom Nav */}
      <nav className={styles.mobileNav}>
        {navItems.map((item) => (
          <Link 
            key={item.path} 
            href={item.path}
            className={`${styles.navItem} ${pathname === item.path ? styles.active : ""}`}
          >
            <item.icon size={24} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* Quick Add Button */}
      <button className={styles.fab} onClick={() => setIsModalOpen(true)}>
        <Plus size={28} />
      </button>

      <AddExpenseModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      {/* Desktop Side/Top Nav placeholder */}
      <header className={styles.header}>
        <div className="container">
          <div className={styles.headerContent}>
            <Link href="/dashboard" className={styles.logo}>
              SpendWise
            </Link>
            <div className={styles.headerRight}>
              <div className={styles.desktopNav}>
                {navItems.map((item) => (
                  <Link 
                    key={item.path} 
                    href={item.path}
                    className={`${styles.desktopNavItem} ${pathname === item.path ? styles.active : ""}`}
                  >
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </Link>
                ))}
              </div>
              <CurrencySelector />
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
