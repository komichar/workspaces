import { createSelectSchema } from "drizzle-zod";
import { usersTable } from "./schema.js";
import { type InferSelectModel, InferInsertModel } from "drizzle-orm";

export const userSelectSchema = createSelectSchema(usersTable);

export type User = InferSelectModel<typeof usersTable>;

export type NewUser = InferInsertModel<typeof usersTable>;
