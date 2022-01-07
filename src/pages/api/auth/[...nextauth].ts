import { PrismaAdapter } from "@next-auth/prisma-adapter"
import NextAuth from "next-auth"
// import GithubProvider from "next-auth/providers/github"
import GoogleProvider from "next-auth/providers/google"

import { prisma } from "@backend/context"
// import CredentialsProvider from "next-auth/providers/credentials"

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXT_AUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  jwt: {
    secret: process.env.NEXT_AUTH_SECRET,
    maxAge: 60 * 60 * 24 * 30,
  },
  // Configure one or more authentication providers
  providers: [
    // GithubProvider({
    //   clientId: process.env.GITHUB_ID,
    //   clientSecret: process.env.GITHUB_SECRET,
    // }),
    GoogleProvider({
      clientId: process.env.GOOGLE_ID || "",
      clientSecret: process.env.GOOGLE_SECRET || "",
    }),

    // EmailProvider({
    //   from: "mitia2022@gmail.com",
    // }),

    // ...add more providers here
  ],
})
