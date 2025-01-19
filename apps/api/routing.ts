import { defaultEndpointsFactory, Routing } from "express-zod-api";
import { z } from "zod";
import { db } from "./database";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import createHttpError from "http-errors";
import { userSelectSchema } from "./user";

const helloWorldEndpoint = defaultEndpointsFactory.build({
  // method: "get" (default) or array ["get", "post", ...]
  input: z.object({
    name: z.string().optional(),
  }),
  output: z.object({
    greetings: z.string(),
  }),
  handler: async ({ input: { name }, options, logger }) => {
    logger.debug("Options:", options); // middlewares provide options
    return { greetings: `Hello, ${name || "World"}. Happy coding!` };
  },
});

const authLoginEndpoint = defaultEndpointsFactory.build({
  method: "post", //  (default) or array ["get", "post", ...]
  input: z.object({
    email: z.string().email(),
  }),
  output: z.object({
    user: userSelectSchema,
    token: z.string(),
  }),
  handler: async ({ input, options, logger }) => {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, input.email))
      .limit(1)
      .execute();

    if (!user) {
      throw createHttpError.NotFound("john not found");
    }

    logger.debug("Options:", options); // middlewares provide options

    return { user, token: "mock-token-here" };
  },
});

export const routing: Routing = {
  v1: {
    hello: helloWorldEndpoint,
    auth: {
      login: authLoginEndpoint,
    },
  },
};
