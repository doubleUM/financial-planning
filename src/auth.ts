import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "@/lib/prisma"
import { authConfig } from "./auth.config"
import GitHub from "next-auth/providers/github"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

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
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email as string
          }
        })
        
        if (!user || !user.password) {
          return null
        }
        
        const passwordsMatch = await bcrypt.compare(
          credentials.password as string,
          user.password
        )
        
        if (passwordsMatch) {
          return user
        }
        
        return null
      }
    })
  ],
})
