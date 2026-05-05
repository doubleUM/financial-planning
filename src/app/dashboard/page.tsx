import { auth } from "@/auth"
import { redirect } from "next/navigation"
import { TrendingUp, TrendingDown, DollarSign, Calendar } from "lucide-react"
import styles from "./dashboard.module.css"
import { formatCurrency } from "@/lib/utils/currency"

export default async function Dashboard() {
  const session = await auth()

  if (!session) {
    redirect("/login")
  }

  const userCurrency = session.user?.currency || "USD"

  // Mock data for initial UI
  const stats = [
    { label: "Total Balance", value: 4250.00, icon: DollarSign, trend: "+12%" },
    { label: "Monthly Spent", value: 1120.50, icon: TrendingDown, trend: "-5%" },
    { label: "Monthly Income", value: 2800.00, icon: TrendingUp, trend: "+8%" },
  ]

  const recentExpenses = [
    { id: 1, title: "Starbucks", category: "Food", amount: 5.50, date: "Today" },
    { id: 2, title: "Netflix", category: "Subscription", amount: 15.99, date: "Yesterday" },
    { id: 3, title: "Groceries", category: "Shopping", amount: 82.30, date: "2 days ago" },
  ]

  return (
    <div className="container">
      <header className={styles.welcome}>
        <h1>Welcome back, {session.user?.name || "there"}</h1>
        <p>Here's what's happening with your finances.</p>
      </header>

      <section className={styles.statsGrid}>
        {stats.map((stat, i) => (
          <div key={i} className={styles.statCard}>
            <div className={styles.statHeader}>
              <div className={styles.iconBox}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className={styles.statContent}>
              <span className={styles.statLabel}>{stat.label}</span>
              <h2 className={styles.statValue}>{formatCurrency(stat.value, userCurrency)}</h2>
            </div>
          </div>
        ))}
      </section>

      <section className={styles.contentGrid}>
        <div className={styles.mainContent}>
          <div className={styles.sectionHeader}>
            <h3>Recent Expenses</h3>
            <button className="btn btn-secondary">View All</button>
          </div>
          <div className={styles.expenseList}>
            {recentExpenses.map((expense) => (
              <div key={expense.id} className={styles.expenseItem}>
                <div className={styles.expenseInfo}>
                  <strong>{expense.title}</strong>
                  <span>{expense.category} • {expense.date}</span>
                </div>
                <div className={`${styles.expenseAmount} mono`}>
                  -{formatCurrency(expense.amount, userCurrency)}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.sideContent}>
          <h3>Monthly Goal</h3>
          <div className={styles.goalProgress}>
            <div className={styles.progressHeader}>
              <span>Savings Goal</span>
              <span>75%</span>
            </div>
            <div className={styles.progressBar}>
              <div className={styles.progressFill} style={{ width: "75%" }}></div>
            </div>
            <p>You're almost there! Just {formatCurrency(250, userCurrency)} more to reach your goal.</p>
          </div>
        </div>
      </section>
    </div>
  )
}
