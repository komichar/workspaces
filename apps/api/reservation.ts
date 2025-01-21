import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { reservationsTable } from "./schema";

export const reservationSelectSchema = createSelectSchema(reservationsTable);

export type Reservation = z.infer<typeof reservationSelectSchema>;

export type NewReservation = typeof reservationsTable.$inferInsert;
