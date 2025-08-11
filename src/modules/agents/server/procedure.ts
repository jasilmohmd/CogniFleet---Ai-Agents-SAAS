import { z } from "zod";
import { eq, getTableColumns, sql } from "drizzle-orm";

import { db } from "@/db"
import { agents } from "@/db/schema"
import { createTRPCRouter, protectedProcedure } from "@/trpc/init"

import { agentsInsertSchema } from "../schema";

export const agentsRouter = createTRPCRouter({
  // TODO: Change 'getOne' to use 'protectedProcedure'
  getOne: protectedProcedure.input(z.object({ id: z.string() })).query(async ({ input }) => {
    const [existingAgent] = await db
      .select({
        ...getTableColumns(agents),
        //TODO: Change to actual count
        meetingCount: sql<number>`5`,
      })
      .from(agents)
      .where(eq(agents.id, input.id))

    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // throw new TRPCError({code: "BAD_REQUEST"});

    return existingAgent;
  }),
  // TODO: Change 'getMany' to use 'protectedProcedure'
  getMany: protectedProcedure.query(async () => {
    const data = await db
      .select()
      .from(agents);

    // await new Promise((resolve) => setTimeout(resolve, 3000));
    // throw new TRPCError({code: "BAD_REQUEST"});

    return data;
  }),
  create: protectedProcedure
    .input(agentsInsertSchema)
    .mutation(async ({ input, ctx }) => {
      const [createdAgent] = await db
        .insert(agents)
        .values({
          ...input,
          userId: ctx.auth.user.id
        })
        .returning();

      return createdAgent;
    })
});