import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { users } from "./schema";

export const userSelectSchema = createSelectSchema(users);

export type User = z.infer<typeof userSelectSchema>;
