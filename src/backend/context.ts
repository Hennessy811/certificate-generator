import { PrismaClient, User } from "@prisma/client"
import * as trpc from "@trpc/server"
import * as trpcNext from "@trpc/server/adapters/next"
import { getSession } from "next-auth/react"

export const prisma = new PrismaClient({
  log:
    process.env.NODE_ENV === "development"
      ? ["query", "error", "warn"]
      : ["error"],
})

export const createContext = async ({
  req,
  res,
}: trpcNext.CreateNextContextOptions) => {
  const _user = (await getSession({ req }))?.user
  const user = null as User | null

  const result = {
    req,
    res,
    prisma,
    user,
  }
  if (_user?.email) {
    const user = await prisma.user.findUnique({ where: { email: _user.email } })
    result.user = user
  }

  return result
}

export type Context = trpc.inferAsyncReturnType<typeof createContext>
