import { defaultEndpointsFactory, Routing } from "express-zod-api";
import { z } from "zod";
import { db } from "./database";
import { users } from "./schema";
import { eq } from "drizzle-orm";
import createHttpError from "http-errors";
import { NewUser, User, userSelectSchema } from "./user";

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
      .limit(1);

    if (!user) {
      throw createHttpError.NotFound("john not found");
    }

    logger.debug("Options:", options); // middlewares provide options

    return { user, token: "mock-token-here" };
  },
});

const authRegisterEndpoint = defaultEndpointsFactory.build({
  method: "post", //  (default) or array ["get", "post", ...]
  input: z.object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    office_id: z.number().positive(),
  }),
  output: z.object({
    user: userSelectSchema,
  }),
  handler: async ({ input, options, logger }) => {
    const newUser: NewUser = {
      office_id: input.office_id,
      email: input.email,
      name: input.name,
    };

    const [registered]: User[] = await db
      .insert(users)
      .values(newUser)
      .returning();

    logger.debug("Options:", options); // middlewares provide options

    return { user: registered, token: "mock-token-here" };
  },
});

export const routing: Routing = {
  v1: {
    hello: helloWorldEndpoint,
    auth: {
      login: authLoginEndpoint,
      register: authRegisterEndpoint,
    },
  },
};
