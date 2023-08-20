import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const challengeRouter = createTRPCRouter({
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.challenge.findMany({
      include: {
        translateChallenge: true,
      },
    });
  }),

  getById: publicProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.challenge.findUnique({
        where: {
          id: input.id,
        },
        include: {
          translateChallenge: true,
        },
      });
    }),

  create: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.challenge.create({
        data: {
          prompt: input.text,
          type: "translate",
          translateChallenge: {
            create: {
              name: "translate",
              score: 0,
            },
          },
        },
      });
    }),
});
