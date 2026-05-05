import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.currency = (user as any).currency || "USD"
      }
      if (trigger === "update" && session?.currency) {
        token.currency = session.currency
      }
      return token
    },
    async session({ session, token }) {
      if (token.currency) {
        session.user.currency = token.currency as string
      }
      return session
    },
  },
  providers: [
    GitHub,
    Google,
  ],
})
