"use client"

import { useSession, signOut } from "next-auth/react"
import styles from "./profile.module.css"

export default function ProfilePage() {
  const { data: session } = useSession()
  const user = session?.user

  const initials = user?.name
    ? user.name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?"

  return (
    <div className="container">
      <header className={styles.header}>
        <h1>Profile</h1>
        <p>Manage your account details.</p>
      </header>

      <div className={styles.card}>
        <div className={styles.avatarRow}>
          <div className={styles.avatar}>{initials}</div>
          <div>
            <p className={styles.name}>{user?.name || "—"}</p>
            <p className={styles.email}>{user?.email || "—"}</p>
          </div>
        </div>
      </div>

      <div className={styles.card}>
        <h3>Account</h3>
        <div className={styles.row}>
          <span className={styles.label}>Name</span>
          <span className={styles.value}>{user?.name || "—"}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>Email</span>
          <span className={styles.value}>{user?.email || "—"}</span>
        </div>
      </div>

      <button
        className={styles.signOutBtn}
        onClick={() => signOut({ redirectTo: "/login" })}
      >
        Sign Out
      </button>
    </div>
  )
}
