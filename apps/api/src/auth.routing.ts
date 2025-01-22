import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { NewUser, User, userSelectSchema } from "./user.js";
import { defaultEndpointsFactory } from "express-zod-api";
import { usersTable } from "./schema.js";
import createHttpError from "http-errors";
import { db } from "./database.js";

const authLoginInput = z.object({
  email: z.string().email(),
});
export type AuthLoginInput = z.infer<typeof authLoginInput>;

const authLoginOutput = z.object({
  user: userSelectSchema,
  token: z.string(),
});
export type AuthLoginOutput = z.infer<typeof authLoginOutput>;
export const authLoginEndpoint = defaultEndpointsFactory.build({
  method: "post", //  (default) or array ["get", "post", ...]
  input: authLoginInput,
  output: authLoginOutput,
  handler: async ({ input, options, logger }) => {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, input.email))
      .limit(1);

    if (!user) {
      throw createHttpError.NotFound();
    }

    return authLoginOutput.parse({ user, token: "mock" });
  },
});

export const authRegisterEndpoint = defaultEndpointsFactory.build({
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
      .insert(usersTable)
      .values(newUser)
      .returning();

    return { user: userSelectSchema.parse(registered) };
  },
});
