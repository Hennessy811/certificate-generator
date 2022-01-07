import { createReactQueryHooks } from "@trpc/react"
import type { inferProcedureOutput } from "@trpc/server"

import type { AppRouter } from "@backend/router"

const trpc = createReactQueryHooks<AppRouter>()
export default trpc

export type inferQueryOutput<
  TRouteKey extends keyof AppRouter["_def"]["queries"]
> = inferProcedureOutput<AppRouter["_def"]["queries"][TRouteKey]>
