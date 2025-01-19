import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { reservations } from "./schema";

const reservationSelectSchema = createSelectSchema(reservations);

export type Reservation = z.infer<typeof reservationSelectSchema>;
