import { INFINITE_QUERY_LIMIT } from '@/config/infinite-query';
import { db } from '@/db';
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';

import { privateProcedure, publicProcedure, router } from './trpc';

export const appRouter = router({
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // check if user exists in auth provider
    if (!user || !user.id || !user.email) {
      throw new TRPCError({ code: 'UNAUTHORIZED' });
    }

    // check if user exists in db
    const dbUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    // if not exists in db first time logging in, persist
    if (!dbUser) {
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
        },
      });
    }

    return { success: true };
  }),
  getUserFiles: privateProcedure.query(async ({ ctx }) => {
    const { userId } = ctx;
    return await db.file.findMany({
      where: {
        userId,
      },
    });
  }),
  getFile: privateProcedure
    .input(
      z.object({
        key: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const file = await db.file.findFirst({
        where: {
          key: input.key,
          userId,
        },
      });
      if (!file) throw new TRPCError({ code: 'NOT_FOUND' });
      return file;
    }),
  deleteFile: privateProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const { userId } = ctx;
      const file = await db.file.findFirst({
        where: { id: input.id, userId },
      });

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

      await db.file.delete({
        where: {
          id: input.id,
        },
      });

      return file;
    }),
  getFileUploadStatus: privateProcedure
    .input(
      z.object({
        fileId: z.string(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const file = await db.file.findFirst({
        where: {
          id: input.fileId,
          userId: ctx.userId,
        },
      });

      if (!file) return { status: 'PENDING' as const };
      return { status: file.uploadStatus };
    }),
  getFileMessages: privateProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).nullish(),
        cursor: z.string().nullish(),
        fileId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { userId } = ctx;
      const { fileId, cursor } = input;
      const limit = input.limit ?? INFINITE_QUERY_LIMIT;

      const file = await db.file.findFirst({
        where: {
          id: fileId,
          userId,
        },
      });

      if (!file) throw new TRPCError({ code: 'NOT_FOUND' });

      const messages = await db.message.findMany({
        take: limit + 1,
        where: {
          fileId,
        },
        orderBy: { created_at: 'desc' },
        cursor: cursor ? { id: cursor } : undefined,
        select: {
          id: true,
          isUserMessage: true,
          created_at: true,
          text: true,
        },
      });

      let nextCursor: typeof cursor | undefined = undefined;
      if (messages.length > limit) {
        const nextItem = messages.pop();
        nextCursor = nextItem?.id;
      }

      return {
        messages,
        nextCursor,
      };
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
