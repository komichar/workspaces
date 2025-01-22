import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { User, userSelectSchema } from "./user.js";
import { defaultEndpointsFactory } from "express-zod-api";
import { usersTable } from "./schema.js";
import { db } from "./database.js";

export const usersListOutput = z.object({
  users: userSelectSchema.array(),
});
export type UsersListOutput = z.infer<typeof usersListOutput>;
export const usersListEndpoint = defaultEndpointsFactory.build({
  method: "get", // (default) or array ["get", "post", ...]
  input: z.object({
    id: z.coerce.number().positive().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    admin: z
      .string()
      .optional()
      .transform((value) => {
        if (value === undefined) return undefined;
        if (value == "true") return true;
        if (value == "false") return false;
        return undefined; // Default to undefined for invalid inputs
      }),
  }),
  output: usersListOutput,
  handler: async ({ input, options, logger }) => {
    console.log("input", input);
    const users: User[] = await db
      .select()
      .from(usersTable)
      .where(
        and(
          input.id ? eq(usersTable.id, input.id) : undefined,
          input.email ? eq(usersTable.email, input.email) : undefined,
          input.admin != undefined
            ? eq(usersTable.admin, input.admin)
            : undefined
        )
      );

    return usersListOutput.parse({ users });
  },
});

export const userByIdOutput = z.object({
  user: userSelectSchema,
});
export type UserByIdOutput = z.infer<typeof userByIdOutput>;
export const userByIdEndpoint = defaultEndpointsFactory.build({
  method: "get", // (default) or array ["get", "post", ...]
  input: z.object({
    id: z.coerce.number().positive(),
  }),
  output: userByIdOutput,
  handler: async ({ input, options, logger }) => {
    const [user]: User[] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, input.id))
      .limit(1);

    const [another] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, input.id))
      .limit(1);

    return { user: userSelectSchema.parse(user) };
  },
});
