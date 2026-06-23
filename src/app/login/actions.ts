"use server"

import { signIn } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { AuthError } from "next-auth"

export async function loginUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirect: false,
    })
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Invalid email or password" }
        default:
          return { error: "Something went wrong. Please try again." }
      }
    }
    throw error
  }

  return { success: true }
}

export async function registerUser(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const name = formData.get("name") as string
  
  if (!email || !password) {
    return { error: "Email and password are required" }
  }
  
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters" }
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return { error: "Email is already registered" }
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    })
  } catch (error) {
    console.error("Registration error:", error)
    return { error: "Something went wrong during registration. Please try again." }
  }

  // Auto login after registration
  return loginUser(formData)
}
