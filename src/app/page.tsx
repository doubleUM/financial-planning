import Link from "next/link"
import { ArrowRight, Zap, BarChart3, ShieldCheck, Wallet, TrendingUp } from "lucide-react"
import styles from "./page.module.css"

export default function Home() {
  return (
    <>
      {/* Full-bleed Hero */}
      <section className={styles.hero}>
        <div className={styles.heroGlow} />
        <div className={`container ${styles.heroInner}`}>
          <p className={styles.eyebrow}>Expense Tracking, Reimagined</p>
          <h1 className={styles.title}>
            Your money,<br />finally organized.
          </h1>
          <p className={styles.subtitle}>
            Stop guessing where your paycheck goes. SpendWise gives you 
            clarity in seconds — not spreadsheets.
          </p>
          <div className={styles.ctaGroup}>
            <Link href="/login" className="btn btn-primary">
              Get Started Free <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Strip */}
      <section className={styles.statsStrip}>
        <div className={`container ${styles.statsInner}`}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>3s</span>
            <span className={styles.statDesc}>Average entry time</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>5+</span>
            <span className={styles.statDesc}>Currencies supported</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>100%</span>
            <span className={styles.statDesc}>Free to use</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <span className={styles.statNumber}>E2E</span>
            <span className={styles.statDesc}>Encrypted data</span>
          </div>
        </div>
      </section>

      {/* Alternating Feature Rows */}
      <section className={styles.features}>
        <div className={`container ${styles.featureRow}`}>
          <div className={styles.featureText}>
            <div className={styles.featureIcon}>
              <Zap size={20} />
            </div>
            <h2>Add expenses in seconds</h2>
            <p>
              Our smart input learns your habits. Just tap the amount, 
              pick a category, and you're done. No forms, no friction.
            </p>
          </div>
          <div className={styles.featureVisual}>
            <div className={styles.mockInput}>
              <span className={styles.mockCurrency}>$</span>
              <span className={styles.mockAmount}>24.50</span>
            </div>
            <div className={styles.mockTags}>
              <span className={styles.mockTag}>🍔 Food</span>
              <span className={`${styles.mockTag} ${styles.mockTagActive}`}>☕ Coffee</span>
              <span className={styles.mockTag}>🚗 Transport</span>
            </div>
          </div>
        </div>

        <div className={`container ${styles.featureRow} ${styles.featureRowReverse}`}>
          <div className={styles.featureText}>
            <div className={styles.featureIcon}>
              <BarChart3 size={20} />
            </div>
            <h2>See where it all goes</h2>
            <p>
              Beautiful breakdowns by category, week, or month. 
              Spot trends before they become problems.
            </p>
          </div>
          <div className={styles.featureVisual}>
            <div className={styles.miniChart}>
              <div className={styles.chartBar} style={{ height: "40%" }} />
              <div className={styles.chartBar} style={{ height: "65%" }} />
              <div className={styles.chartBar} style={{ height: "55%" }} />
              <div className={styles.chartBar} style={{ height: "80%" }} />
              <div className={`${styles.chartBar} ${styles.chartBarActive}`} style={{ height: "90%" }} />
              <div className={styles.chartBar} style={{ height: "50%" }} />
              <div className={styles.chartBar} style={{ height: "70%" }} />
            </div>
          </div>
        </div>

        <div className={`container ${styles.featureRow}`}>
          <div className={styles.featureText}>
            <div className={styles.featureIcon}>
              <Wallet size={20} />
            </div>
            <h2>Your currency, your rules</h2>
            <p>
              Switch between USD, EUR, GBP, IDR, and JPY instantly. 
              All your totals update in real time.
            </p>
          </div>
          <div className={styles.featureVisual}>
            <div className={styles.currencyStack}>
              <div className={styles.currencyRow}><span>🇺🇸</span> USD <span className={styles.currencyVal}>$1,250.00</span></div>
              <div className={`${styles.currencyRow} ${styles.currencyRowActive}`}><span>🇮🇩</span> IDR <span className={styles.currencyVal}>Rp 19.500.000</span></div>
              <div className={styles.currencyRow}><span>🇪🇺</span> EUR <span className={styles.currencyVal}>€1,147.50</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className={styles.bottomCta}>
        <div className="container">
          <h2>Ready to take control?</h2>
          <p>Join SpendWise today. It's free, fast, and private.</p>
          <Link href="/login" className="btn btn-primary">
            Create Your Account <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </>
  )
}
