import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { procedure, router } from "./trpc";

import { TRPCError } from "@trpc/server";
import { db } from "@/db";

export const appRouter = router({
  authCallback: procedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    // check if user exists in auth provider
    if (!user || !user.id || !user.email) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
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
});

// export type definition of API
export type AppRouter = typeof appRouter;
