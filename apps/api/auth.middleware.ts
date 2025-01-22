import { z } from "zod";
import createHttpError from "http-errors";
import { defaultEndpointsFactory, Middleware } from "express-zod-api";
import { db } from "./database";
import { usersTable } from "./schema";
import { User } from "./user";
import { eq } from "drizzle-orm";

export const authMiddleware = new Middleware({
  security: {
    and: [{ type: "bearer" }],
  },
  input: z.object({}),
  handler: async ({ input, request, logger }) => {
    const authorization = z.string().safeParse(request.headers.authorization);

    if (!authorization.success) {
      throw createHttpError.Unauthorized("Invalid authentication header");
    }

    const bearerEmailValidation = z
      .string()
      .email()
      .safeParse(authorization.data.replace("Bearer ", ""));

    if (!bearerEmailValidation.success) {
      throw createHttpError.Unauthorized("Invalid token - must be an email");
    }

    const [user]: User[] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, bearerEmailValidation.data))
      .limit(1);

    if (!user) throw createHttpError.Unauthorized("User not found");

    return { user }; // provides endpoints with options.user
  },
});

export const authenticatedEndpointFactory =
  defaultEndpointsFactory.addMiddleware(authMiddleware);

export const adminEndpointFactory = authenticatedEndpointFactory
  .addMiddleware(authMiddleware)
  .addMiddleware(
    new Middleware({
      input: z.object({}),
      handler: async ({ options }) => {
        if (!options.user.admin)
          throw createHttpError.Forbidden("User must be admin");

        return {};
      },
    })
  );
