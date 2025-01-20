import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { officesTable } from "./schema";

export const officeSelectSchema = createSelectSchema(officesTable);
export const officeInsertSchema = createInsertSchema(officesTable);

export type Office = z.infer<typeof officeSelectSchema>;

export type NewOffice = typeof officesTable.$inferInsert;
