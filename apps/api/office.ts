import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { officesTable } from "./schema";

export const officeSelectSchema = createSelectSchema(officesTable);

export type Office = z.infer<typeof officeSelectSchema>;
