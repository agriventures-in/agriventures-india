import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { UserRole } from "@prisma/client"
import { compare } from "bcryptjs"
import { type NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import { prisma } from "@/lib/prisma"

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error("NEXTAUTH_SECRET environment variable is required")
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
    newUser: "/register",
    error: "/login",
  },
  debug: process.env.NODE_ENV === "development",
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email and password are required")
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase() },
        })

        if (!user || !user.hashedPassword) {
          throw new Error("Invalid email or password")
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.hashedPassword
        )

        if (!isPasswordValid) {
          throw new Error("Invalid email or password")
        }

        return {
          id: user.id,
          email: user.email,
          name: user.fullName,
          role: user.role,
          image: user.avatarUrl,
        }
      },
    }),
    ...(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          }),
        ]
      : []),
    ...(process.env.LINKEDIN_CLIENT_ID && process.env.LINKEDIN_CLIENT_SECRET
      ? [
          {
            id: "linkedin",
            name: "LinkedIn",
            type: "oauth" as const,
            authorization: {
              url: "https://www.linkedin.com/oauth/v2/authorization",
              params: { scope: "openid profile email" },
            },
            token: "https://www.linkedin.com/oauth/v2/accessToken",
            userinfo: "https://api.linkedin.com/v2/userinfo",
            client: {
              token_endpoint_auth_method: "client_secret_post" as const,
            },
            clientId: process.env.LINKEDIN_CLIENT_ID,
            clientSecret: process.env.LINKEDIN_CLIENT_SECRET,
            profile(profile: {
              sub: string
              name: string
              email: string
              picture?: string
            }) {
              return {
                id: profile.sub,
                name: profile.name,
                email: profile.email,
                image: profile.picture ?? null,
                role: UserRole.COMMUNITY,
              }
            },
          },
        ]
      : []),
  ],
  callbacks: {
    async signIn({ user, account }) {
      // For OAuth sign-ins, auto-link the account if the email already exists
      if (account && account.provider !== "credentials" && user.email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
          include: { accounts: { where: { provider: account.provider } } },
        })

        if (existingUser && existingUser.accounts.length === 0) {
          // User exists but hasn't linked this OAuth provider — link it now
          await prisma.account.create({
            data: {
              userId: existingUser.id,
              type: account.type,
              provider: account.provider,
              providerAccountId: account.providerAccountId,
              access_token: account.access_token,
              refresh_token: account.refresh_token,
              expires_at: account.expires_at,
              token_type: account.token_type,
              scope: account.scope,
              id_token: account.id_token,
            },
          })

          // Update profile picture if not set
          if (!existingUser.avatarUrl && user.image) {
            await prisma.user.update({
              where: { id: existingUser.id },
              data: { avatarUrl: user.image },
            })
          }

          return true
        }
      }
      return true
    },
    async jwt({ token, user, trigger }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      // Refresh from DB if not present (e.g. OAuth sign-in) or on session update
      if ((!token.role || trigger === "update") && token.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: token.email },
          select: { role: true, id: true, emailVerified: true },
        })
        if (dbUser) {
          token.role = dbUser.role
          token.id = dbUser.id
          token.emailVerified = !!dbUser.emailVerified
        }
      }

      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role
        session.user.emailVerified = token.emailVerified ?? false
      }
      return session
    },
  },
}
