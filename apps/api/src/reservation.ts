import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { reservationsTable } from "./schema.js";
import { type InferSelectModel } from "drizzle-orm";

export const reservationSelectSchema = createSelectSchema(reservationsTable);

export type Reservation = InferSelectModel<typeof reservationsTable>;

export type NewReservation = typeof reservationsTable.$inferInsert;
