import { UserRole } from "@prisma/client"
import "next-auth"

declare module "next-auth" {
  interface User {
    role: UserRole
  }

  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      image?: string
      emailVerified: boolean
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: UserRole
    id: string
    emailVerified: boolean
  }
}
