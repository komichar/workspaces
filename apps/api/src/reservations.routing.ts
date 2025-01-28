import { and, eq, gte, lte, or } from "drizzle-orm";
import { defaultEndpointsFactory } from "express-zod-api";
import createHttpError from "http-errors";
import { z } from "zod";
import { authorizedEndpointFactory } from "./auth.middleware.js";
import { calculateTimeCapacity, capacitySchema } from "./capacity.service.js";
import { db } from "./database.js";
import { Office } from "./office.js";
import {
  NewReservation,
  Reservation,
  reservationSelectSchema,
} from "./reservation.js";
import { officesTable, reservationsTable } from "./schema.js";

export const reservationsListOutput = z.object({
  reservations: reservationSelectSchema.array(),
  capacity: capacitySchema,
});
export type ReservationsListOutput = z.infer<typeof reservationsListOutput>;
const reservationsListInput = z.object({
  user_id: z.coerce.number().positive().optional(),
  office_id: z.coerce.number().positive(),
  date: z.string().length(10),
});
export type ReservationsListInput = z.infer<typeof reservationsListInput>;
export const reservationsListEndpoint = defaultEndpointsFactory.build({
  method: "get",
  input: reservationsListInput,
  output: reservationsListOutput,
  handler: async ({ input, options, logger }) => {
    const [office]: Office[] = await db
      .select()
      .from(officesTable)
      .where(eq(officesTable.id, input.office_id))
      .limit(1);

    const reservations: Reservation[] = await db
      .select()
      .from(reservationsTable)
      .where(
        and(
          input.user_id
            ? eq(reservationsTable.user_id, input.user_id)
            : undefined,
          eq(reservationsTable.office_id, input.office_id),
          eq(reservationsTable.date, input.date)
        )
      );

    const capacity = await calculateTimeCapacity(office, input.date);

    return reservationsListOutput.parse({ reservations, capacity });
  },
});

export const createReservationInput = z.object({
  office_id: z.number().positive(),
  date: z.string().length(10), // TODO: remove input, take it from start_time after  validating
  start_time: z.string().datetime(),
  end_time: z.string().datetime(),
  seat_number: z.number().positive(),
});
export type CreateReservationInput = z.infer<typeof createReservationInput>;

export const reservationsCreateEndpoint = authorizedEndpointFactory.build({
  method: "post",
  input: createReservationInput,
  output: z.object({
    reservation: reservationSelectSchema,
  }),
  handler: async ({ input, options, logger }) => {
    const [office]: Office[] = await db
      .select()
      .from(officesTable)
      .where(eq(officesTable.id, input.office_id))
      .limit(1);

    if (!office) {
      throw createHttpError.NotFound();
    }

    if (input.seat_number > office.capacity) {
      throw createHttpError.BadRequest("Seat number is invalid");
    }

    const [conflictingReservation] = await db
      .select()
      .from(reservationsTable)
      .where(
        or(
          // Prevent overlapping reservations for the same seat
          and(
            eq(reservationsTable.office_id, input.office_id),
            eq(reservationsTable.seat_number, input.seat_number),
            or(
              and(
                gte(reservationsTable.start_time, input.start_time),
                lte(reservationsTable.start_time, input.end_time)
              ),
              and(
                gte(reservationsTable.end_time, input.start_time),
                lte(reservationsTable.end_time, input.end_time)
              ),
              and(
                lte(reservationsTable.start_time, input.start_time),
                gte(reservationsTable.end_time, input.end_time)
              )
            )
          ),
          // Prevent duplicate reservations by the same user on the same day
          and(
            eq(reservationsTable.user_id, options.user.id),
            eq(reservationsTable.office_id, input.office_id),
            eq(reservationsTable.date, input.date)
          )
        )
      )
      .limit(1);

    if (conflictingReservation) {
      throw createHttpError.BadRequest(
        "There is already a reservation that conflicts with the specified time range."
      );
    }

    // TODO: calculate high demand, throw 400 to reject the full day reservation
    const capacityBefore = await calculateTimeCapacity(office, input.date);

    const newReservation: NewReservation = {
      user_id: options.user.id,
      office_id: input.office_id,
      date: input.date,
      end_time: input.end_time,
      start_time: input.start_time,
      seat_number: input.seat_number,
    };

    const [createdReservation] = await db
      .insert(reservationsTable)
      .values(newReservation)
      .returning();

    const capacityAfter = await calculateTimeCapacity(office, input.date);

    return { reservation: reservationSelectSchema.parse(createdReservation) };
  },
});

export const reservationByIdEndpoint = defaultEndpointsFactory.build({
  method: "get",
  input: z.object({
    id: z.coerce.number().positive(),
  }),
  output: z.object({
    reservation: reservationSelectSchema,
  }),
  handler: async ({ input, options, logger }) => {
    const [reservation]: Reservation[] = await db
      .select()
      .from(reservationsTable)
      .where(eq(reservationsTable.id, input.id))
      .limit(1);

    if (!reservation) {
      throw createHttpError.NotFound();
    }

    return { reservation: reservationSelectSchema.parse(reservation) };
  },
});

export const cancelReservationByIdEndpoint = defaultEndpointsFactory.build({
  method: "delete",
  input: z.object({
    id: z.coerce.number().positive(),
  }),
  output: z.object({}),
  handler: async ({ input }) => {
    const res = await db
      .delete(reservationsTable)
      .where(eq(reservationsTable.id, input.id));

    return {};
  },
});
