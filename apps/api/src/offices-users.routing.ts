import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { User, userSelectSchema } from "./user.js";
import { defaultEndpointsFactory } from "express-zod-api";
import { usersTable } from "./schema.js";
import { db } from "./database.js";

export const officesUsersListOutput = z.object({
  users: userSelectSchema.array(),
});
export type OfficeUsersListOutput = z.infer<typeof officesUsersListOutput>;
export const officesUsersListEndpoint = defaultEndpointsFactory.build({
  method: "get", // (default) or array ["get", "post", ...]
  input: z.object({
    id: z.coerce.number().positive(),
  }),
  output: officesUsersListOutput,
  handler: async ({ input, options, logger }) => {
    const users: User[] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.office_id, input.id));

    return officesUsersListOutput.parse({ users });
  },
});
