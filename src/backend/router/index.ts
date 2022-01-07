import superjson from "superjson"

import createRouter from "@backend/createRouter"

import usersRouter from "./users"

export const appRouter = createRouter()
  .transformer(superjson)

  .merge("users.", usersRouter)

export type AppRouter = typeof appRouter
