import type { NextAuthConfig } from "next-auth"

export const authConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnDashboard = nextUrl.pathname.startsWith("/dashboard")
      if (isLoggedIn && !isOnDashboard) {
        return Response.redirect(new URL("/dashboard", nextUrl))
      }
      return true
    },
  },
  providers: [], // Add providers with window.env vars in auth.ts
} satisfies NextAuthConfig
