import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { authorizedEndpointFactory } from "./auth.middleware.js";
import { calculateTimeCapacity, capacitySchema } from "./capacity.service.js";
import { db } from "./database.js";
import { Office, officeSelectSchema } from "./office.js";
import { Reservation, reservationSelectSchema } from "./reservation.js";
import { officesTable, reservationsTable } from "./schema.js";

const getOfficeDayAvailabilityInput = z.object({
  id: z.coerce.number().positive(),
  date: z.string().length(10),
});
export type GetOfficeDayAvailabilityInput = z.infer<
  typeof getOfficeDayAvailabilityInput
>;
const getOfficeDayAvailabilityOutput = z.object({
  office: officeSelectSchema,
  capacity: capacitySchema,
  reservations: reservationSelectSchema.array(),
});
export type GetOfficeDayAvailabilityOutput = z.infer<
  typeof getOfficeDayAvailabilityOutput
>;

export const getOfficeDayAvailability = authorizedEndpointFactory.build({
  method: "get",
  input: getOfficeDayAvailabilityInput,
  output: getOfficeDayAvailabilityOutput,
  handler: async ({ input, options, logger }) => {
    const [office]: Office[] = await db
      .select()
      .from(officesTable)
      .where(eq(officesTable.id, input.id))
      .limit(1);

    const capacity = await calculateTimeCapacity(office, input.date);

    const reservations: Reservation[] = await db
      .select()
      .from(reservationsTable)
      .where(
        and(
          eq(reservationsTable.user_id, options.user.id),
          eq(reservationsTable.office_id, input.id),
          eq(reservationsTable.date, input.date)
        )
      );

    return getOfficeDayAvailabilityOutput.parse({
      office,
      capacity,
      reservations,
    });
  },
});
