import { TRPCError } from "@trpc/server"

import createRouter from "@backend/createRouter"

const usersRouter = createRouter().query("me", {
  resolve: async ({ ctx }) => {
    const { user } = ctx
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" })

    return user
  },
})

export default usersRouter
