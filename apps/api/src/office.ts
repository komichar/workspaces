import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { officesTable } from "./schema.js";
import { type InferSelectModel, InferInsertModel } from "drizzle-orm";

export const officeSelectSchema = createSelectSchema(officesTable);
export const officeInsertSchema = createInsertSchema(officesTable);

export type Office = InferSelectModel<typeof officesTable>;

export type NewOffice = typeof officesTable.$inferInsert;
