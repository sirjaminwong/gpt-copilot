import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const wordRouter = createTRPCRouter({
  hello: publicProcedure
    .input(z.object({ text: z.string() }))
    .query(({ input }) => {
      return {
        greeting: `Hello ${input.text}`,
      };
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.word.findMany();
  }),

  create: publicProcedure
    .input(z.object({ text: z.string() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.word.create({
        data: {
          word: input.text,
        },
      });
    }),
});
