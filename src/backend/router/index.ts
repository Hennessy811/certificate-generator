import superjson from "superjson"

import createRouter from "@backend/createRouter"

import tripsRouter from "./trips"
import usersRouter from "./users"

export const appRouter = createRouter()
  .transformer(superjson)

  .merge("users.", usersRouter)
  .merge("trips.", tripsRouter)

export type AppRouter = typeof appRouter
