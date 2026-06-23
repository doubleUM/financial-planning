"use client"

import { useState } from "react"
import { loginUser, registerUser } from "./actions"
import styles from "./login.module.css"

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)
    
    const formData = new FormData(e.currentTarget)
    
    try {
      if (isLogin) {
        const result = await loginUser(formData)
        if (result?.error) {
          setError(result.error)
        } else if (result?.success) {
          window.location.href = "/dashboard"
          return
        }
      } else {
        const result = await registerUser(formData)
        if (result?.error) {
          setError(result.error)
        } else if (result?.success) {
          window.location.href = "/dashboard"
          return
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className={styles.authForm}>
        {!isLogin && (
          <div className={styles.inputGroup}>
            <label htmlFor="name">Name</label>
            <input 
              type="text" 
              id="name" 
              name="name" 
              placeholder="John Doe"
              required 
            />
          </div>
        )}
        <div className={styles.inputGroup}>
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="you@example.com"
            required 
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="password">Password</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="••••••••"
            required 
            minLength={6}
          />
        </div>
        
        {error && <div className={styles.error}>{error}</div>}
        
        <button type="submit" className="btn btn-primary w-full" disabled={isLoading}>
          {isLoading ? "Please wait..." : (isLogin ? "Sign In" : "Sign Up")}
        </button>
      </form>
      
      <div className={styles.toggleText}>
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button type="button" onClick={() => { setIsLogin(!isLogin); setError(null); }}>
          {isLogin ? "Sign up" : "Sign in"}
        </button>
      </div>
    </>
  )
}
