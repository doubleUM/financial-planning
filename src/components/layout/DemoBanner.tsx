import Link from "next/link"
import { Sparkles } from "lucide-react"
import styles from "./DemoBanner.module.css"

export default function DemoBanner() {
  return (
    <div className={styles.banner}>
      <div className={styles.content}>
        <div className={styles.icon}>
          <Sparkles size={18} />
        </div>
        <div className={styles.text}>
          <strong>You're viewing demo data</strong>
          <span>Sign up to start tracking your own expenses!</span>
        </div>
      </div>
      <div className={styles.actions}>
        <Link href="/login" className={styles.primaryBtn}>
          Create Account
        </Link>
        <Link href="/login" className={styles.secondaryBtn}>
          Sign In
        </Link>
      </div>
    </div>
  )
}
