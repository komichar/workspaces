import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { usersTable } from "./schema";

export const userSelectSchema = createSelectSchema(usersTable);

export type User = z.infer<typeof userSelectSchema>;

export type NewUser = typeof usersTable.$inferInsert;
