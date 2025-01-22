import { z } from "zod";
import { and, eq } from "drizzle-orm";
import {
  NewReservation,
  Reservation,
  reservationSelectSchema,
} from "./reservation";
import { defaultEndpointsFactory } from "express-zod-api";
import { db } from "./database";
import { officesTable, reservationsTable } from "./schema";
import createHttpError from "http-errors";
import { Office } from "./office";
import { authenticatedEndpointFactory } from "./auth.middleware";

export const reservationsListOutput = z.object({
  reservations: reservationSelectSchema.array(),
});
export type ReservationsListOutput = z.infer<typeof reservationsListOutput>;
const reservationsListInput = z.object({
  user_id: z.coerce.number().positive().optional(),
  office_id: z.coerce.number().positive(),
  date: z.string().length(10),
});
export type ReservationsListInput = z.infer<typeof reservationsListInput>;
export const reservationsListEndpoint = defaultEndpointsFactory.build({
  method: "get", // (default) or array ["get", "post", ...]
  input: reservationsListInput,
  output: reservationsListOutput,
  handler: async ({ input, options, logger }) => {
    console.log("input", input);

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

    return { reservations };
  },
});

export const createReservationInput = z.object({
  user_id: z.number().positive(),
  office_id: z.number().positive(),
  date: z.string().length(10),
  start_time: z.string().length(8),
  end_time: z.string().length(8),
  seat_number: z.number().positive(),
});
export type CreateReservationInput = z.infer<typeof createReservationInput>;

export const reservationsCreateEndpoint = authenticatedEndpointFactory.build({
  method: "post", // (default) or array ["get", "post", ...]
  input: createReservationInput,
  output: z.object({
    reservation: reservationSelectSchema,
  }),
  handler: async ({ input, options, logger }) => {
    // find office, check seat number
    const [office]: Office[] = await db
      .select()
      .from(officesTable)
      .where(eq(officesTable.id, input.office_id))
      .limit(1);

    if (!office) {
      throw createHttpError.NotFound();
    }

    if (input.seat_number > office.capacity!) {
      throw createHttpError.BadRequest("Seat number is invalid");
    }

    // check if user has already booked a seat for the same date

    const [existingReservation] = await db
      .select()
      .from(reservationsTable)
      .where(
        and(
          eq(reservationsTable.user_id, input.user_id),
          eq(reservationsTable.office_id, input.office_id),
          eq(reservationsTable.date, input.date)
        )
      )
      .limit(1);

    if (existingReservation) {
      throw createHttpError.BadRequest(
        "User already has a reservation for this date"
      );
    }

    // TODO: calculate high demand, throw 400 if peak limited & hours dont match
    // high demand if 75% of a day's time is already booked, capacity * 0.75 * 8h

    const newReservation: NewReservation = {
      user_id: input.user_id,
      office_id: input.office_id,
      date: input.date,
      end_time: "18:00:00",
      start_time: "09:00:00",
      seat_number: input.seat_number,
    };

    const [createdReservation] = await db
      .insert(reservationsTable)
      .values(newReservation)
      .returning();

    return { reservation: createdReservation };
  },
});

export const reservationByIdEndpoint = defaultEndpointsFactory.build({
  method: "get", // (default) or array ["get", "post", ...]
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

    return { reservation };
  },
});

export const cancelReservationByIdEndpoint = defaultEndpointsFactory.build({
  method: "delete", // (default) or array ["get", "post", ...]
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
