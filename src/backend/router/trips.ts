import { TRPCError } from "@trpc/server"
import { z } from "zod"

import createRouter from "@backend/createRouter"

const tripsRouter = createRouter()
  .middleware(async ({ ctx, next }) => {
    const { user } = ctx
    if (!user) throw new TRPCError({ code: "UNAUTHORIZED" })
    else return next()
  })
  .query("all", {
    resolve: async ({ ctx }) => {
      const { prisma, user } = ctx
      const trips = await prisma.trip.findMany({
        where: {
          user: { email: user!.email },
        },
      })
      return trips
    },
  })
  .mutation("create", {
    input: z.object({
      destination: z.string().min(3),
      startDate: z.string(),
      endDate: z.string(),
      comment: z.string().optional(),
    }),
    resolve: async ({ ctx, input }) => {
      const { prisma, user } = ctx
      const trip = await prisma.trip.create({
        data: {
          user: { connect: { email: user!.email! } },
          destination: input.destination,
          startDate: input.startDate,
          endDate: input.endDate,
          comment: input.comment,
        },
      })
      return trip
    },
  })

export default tripsRouter
