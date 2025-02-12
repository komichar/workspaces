import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { authorizedEndpointFactory } from "./auth.middleware.js";
import { calculateTimeCapacity, capacitySchema } from "./capacity.service.js";
import { db } from "./database.js";
import { Office, officeSelectSchema } from "./office.js";
import { Reservation, reservationSelectSchema } from "./reservation.js";
import { officesTable, reservationsTable } from "./schema.js";
import createHttpError from "http-errors";

const getOfficeDayAvailabilityInput = z.object({
  id: z.coerce.number().positive(),
  date: z.string().length(10),
});
export type GetOfficeDayAvailabilityInput = z.infer<
  typeof getOfficeDayAvailabilityInput
>;

const timeslotSchema = z.object({
  from: z.string().datetime(), // ISO 8601 format
  to: z.string().datetime(), // ISO 8601 format
  reservation: reservationSelectSchema.optional(), // Included if the timeslot is reserved
});

export type Timeslot = z.infer<typeof timeslotSchema>;

const seatSchema = z.object({
  seat_number: z.number().positive(),
  timeslots: timeslotSchema.array(), // Array of all timeslots for the seat
});

export type Seat = z.infer<typeof seatSchema>;

const getOfficeDayAvailabilityOutput = z.object({
  office: officeSelectSchema,
  capacity: capacitySchema,
  reservations: reservationSelectSchema.array(),
  seats: seatSchema.array(),
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

    if (!office) {
      throw createHttpError.NotFound("Office not found");
    }

    const capacity = await calculateTimeCapacity(office, input.date);

    const reservations: Reservation[] = await db
      .select()
      .from(reservationsTable)
      .where(
        and(
          eq(reservationsTable.office_id, input.id),
          eq(reservationsTable.date, input.date)
        )
      );

    const seats: Seat[] = [];

    for (let index = 0; index < office.capacity; index++) {
      const seatNumber = index + 1;
      const seatReservations = reservations.filter(
        (reservation) => reservation.seat_number === seatNumber
      );

      const timeslots: Timeslot[] = [];

      const fullDay: Timeslot = {
        from: new Date(`${input.date}T08:00:00Z`).toISOString(),
        to: new Date(`${input.date}T16:00:00Z`).toISOString(),
      };

      // Split availability based on reservations
      let lastEnd = fullDay.from;
      for (const reservation of seatReservations) {
        if (lastEnd < reservation.start_time) {
          timeslots.push({ from: lastEnd, to: reservation.start_time });
        }
        timeslots.push({
          from: reservation.start_time,
          to: reservation.end_time,
          reservation: reservation,
        });
        lastEnd = reservation.end_time;
      }
      if (lastEnd < fullDay.to) {
        timeslots.push({ from: lastEnd, to: fullDay.to });
      }

      seats.push({ seat_number: seatNumber, timeslots });
    }

    return getOfficeDayAvailabilityOutput.parse({
      office,
      capacity,
      reservations,
      seats,
    });
  },
});
