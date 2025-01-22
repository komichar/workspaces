import { z } from "zod";
import createHttpError from "http-errors";
import { defaultEndpointsFactory, Middleware } from "express-zod-api";
import { db } from "./database";
import { usersTable } from "./schema";
import { User } from "./user";
import { eq } from "drizzle-orm";

export const authMiddleware = new Middleware({
  security: {
    // this information is optional and used for generating documentation
    and: [
      { type: "input", name: "key" },
      { type: "header", name: "token" },
    ],
  },
  handler: async ({ input, request, logger }) => {
    const authenticationHeader = z
      .string()
      .parse(request.headers.authentication);

    const bearerEmail = z
      .string()
      .email()
      .parse(authenticationHeader.replace("Bearer ", ""));

    const [user]: User[] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, bearerEmail))
      .limit(1);

    if (!user) throw createHttpError(401, "Invalid token");

    return { user }; // provides endpoints with options.user
  },
});

export const authenticatedEndpointFactory =
  defaultEndpointsFactory.addMiddleware(authMiddleware);
