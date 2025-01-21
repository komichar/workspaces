import { and, eq } from "drizzle-orm";
import {
  defaultEndpointsFactory,
  DependsOnMethod,
  Routing,
} from "express-zod-api";
import createHttpError from "http-errors";
import { z } from "zod";
import { db } from "./database";
import { NewOffice, Office, officeSelectSchema } from "./office";
import {
  NewReservation,
  Reservation,
  reservationSelectSchema,
} from "./reservation";
import { officesTable, reservationsTable, usersTable } from "./schema";
import { NewUser, User, userSelectSchema } from "./user";
import { date } from "drizzle-orm/mysql-core";

const helloWorldEndpoint = defaultEndpointsFactory.build({
  method: "get", // (default) or array ["get", "post", ...]
  input: z.object({
    name: z.string().optional(),
  }),
  output: z.object({
    greetings: z.string(),
  }),
  handler: async ({ input: { name }, options, logger }) => {
    logger.debug("Options:", options); // middlewares provide options
    return { greetings: `Hello, ${name || "World"}. Happy coding!` };
  },
});

const officeListOutput = z.object({
  offices: officeSelectSchema.array(),
});
export type OfficeListOutput = z.infer<typeof officeListOutput>;

const officesListEndpoint = defaultEndpointsFactory.build({
  method: "get", // (default) or array ["get", "post", ...]
  input: z.object({
    name: z.string().optional(),
  }),
  output: officeListOutput,
  handler: async ({ input: { name }, options, logger }) => {
    const offices: Office[] = await db.select().from(officesTable);

    logger.debug("Options:", options); // middlewares provide options
    return { offices };
  },
});

const officeByIdOutput = z.object({
  office: officeSelectSchema,
});
export type OfficeByIdOutput = z.infer<typeof officeByIdOutput>;

const officeByIdEndpoint = defaultEndpointsFactory.build({
  method: "get", // (default) or array ["get", "post", ...]
  input: z.object({
    id: z.coerce.number().positive(),
  }),
  output: officeByIdOutput,
  handler: async ({ input, options, logger }) => {
    const [office]: Office[] = await db
      .select()
      .from(officesTable)
      .where(eq(officesTable.id, input.id))
      .limit(1);

    logger.debug("Options:", options); // middlewares provide options

    return { office };
  },
});

const officeCreateEndpoint = defaultEndpointsFactory.build({
  method: "post", // (default) or array ["get", "post", ...]
  input: z.object({
    city: z.string().min(3).max(255),
    capacity: z.number().min(1).max(1000),
    is_peak_limited: z.boolean(),
  }),
  output: z.object({
    office: officeSelectSchema,
  }),
  handler: async ({ input, options, logger }) => {
    const newOffice: NewOffice = {
      city: input.city,
      capacity: input.capacity,
      is_peak_limited: input.is_peak_limited,
    };

    const [createdOffice]: Office[] = await db
      .insert(officesTable)
      .values(newOffice)
      .returning();

    logger.debug("Options:", options); // middlewares provide options

    return { office: createdOffice };
  },
});

const userByIdOutput = z.object({
  user: userSelectSchema,
});
export type UserByIdOutput = z.infer<typeof userByIdOutput>;
const userByIdEndpoint = defaultEndpointsFactory.build({
  method: "get", // (default) or array ["get", "post", ...]
  input: z.object({
    id: z.coerce.number().positive(),
  }),
  output: userByIdOutput,
  handler: async ({ input, options, logger }) => {
    const [user]: User[] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, input.id))
      .limit(1);

    logger.debug("Options:", options); // middlewares provide options

    return { user };
  },
});

const usersListEndpoint = defaultEndpointsFactory.build({
  method: "get", // (default) or array ["get", "post", ...]
  input: z.object({
    id: z.coerce.number().positive().optional(),
    name: z.string().optional(),
    email: z.string().optional(),
    admin: z
      .string()
      .optional()
      .transform((value) => {
        if (value === undefined) return undefined;
        if (value == "true") return true;
        if (value == "false") return false;
        return undefined; // Default to undefined for invalid inputs
      }),
  }),
  output: z.object({
    users: userSelectSchema.array(),
  }),
  handler: async ({ input, options, logger }) => {
    console.log("input", input);
    const users: User[] = await db
      .select()
      .from(usersTable)
      .where(
        and(
          input.id ? eq(usersTable.id, input.id) : undefined,
          input.email ? eq(usersTable.email, input.email) : undefined,
          input.admin != undefined
            ? eq(usersTable.admin, input.admin)
            : undefined
        )
      );

    logger.debug("Options:", options); // middlewares provide options
    return { users };
  },
});

const reservationsListOutput = z.object({
  reservations: reservationSelectSchema.array(),
});
export type ReservationsListOutput = z.infer<typeof reservationsListOutput>;
const reservationsListInput = z.object({
  user_id: z.coerce.number().positive(),
  office_id: z.coerce.number().positive(),
  date: z.string().length(10),
});
export type ReservationsListInput = z.infer<typeof reservationsListInput>;
const reservationsListEndpoint = defaultEndpointsFactory.build({
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
          eq(reservationsTable.user_id, input.user_id),
          eq(reservationsTable.office_id, input.office_id),
          eq(reservationsTable.date, input.date)
        )
      );

    logger.debug("Options:", options); // middlewares provide options

    return { reservations };
  },
});

const createReservationInput = z.object({
  user_id: z.number().positive(),
  office_id: z.number().positive(),
  date: z.string().length(10),
  start_time: z.string().length(8),
  end_time: z.string().length(8),
  seat_number: z.number().positive(),
});
export type CreateReservationInput = z.infer<typeof createReservationInput>;

const reservationsCreateEndpoint = defaultEndpointsFactory.build({
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

    // TODO: calculate high demand, throw 400 if peak limited & hours dont match
    // high demand if 75% of a day's time is already booked, capacity * 0.75 * 8h

    const nu: NewReservation = {
      user_id: input.user_id,
      office_id: input.office_id,
      date: input.date,
      end_time: "18:00:00",
      start_time: "09:00:00",
      seat_number: input.seat_number,
    };

    const [reservation] = await db
      .insert(reservationsTable)
      .values(nu)
      .returning();

    logger.debug("Options:", options); // middlewares provide options

    return { reservation: reservation };
  },
});

const reservationByIdEndpoint = defaultEndpointsFactory.build({
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

    logger.debug("Options:", options); // middlewares provide options

    return { reservation };
  },
});

const cancelReservationByIdEndpoint = defaultEndpointsFactory.build({
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
const authLoginInput = z.object({
  email: z.string().email(),
});
export type AuthLoginInput = z.infer<typeof authLoginInput>;

const authLoginOutput = z.object({
  user: userSelectSchema,
  token: z.string(),
});
export type AuthLoginOutput = z.infer<typeof authLoginOutput>;
const authLoginEndpoint = defaultEndpointsFactory.build({
  method: "post", //  (default) or array ["get", "post", ...]
  input: authLoginInput,
  output: authLoginOutput,
  handler: async ({ input, options, logger }) => {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, input.email))
      .limit(1);

    if (!user) {
      throw createHttpError.NotFound();
    }

    logger.debug("Options:", options); // middlewares provide options

    return { user, token: "mock-token-here" };
  },
});

const authRegisterEndpoint = defaultEndpointsFactory.build({
  method: "post", //  (default) or array ["get", "post", ...]
  input: z.object({
    name: z.string().min(3).max(255),
    email: z.string().email(),
    office_id: z.number().positive(),
  }),
  output: z.object({
    user: userSelectSchema,
  }),
  handler: async ({ input, options, logger }) => {
    const newUser: NewUser = {
      office_id: input.office_id,
      email: input.email,
      name: input.name,
    };

    const [registered]: User[] = await db
      .insert(usersTable)
      .values(newUser)
      .returning();

    logger.debug("Options:", options); // middlewares provide options

    return { user: registered, token: "mock-token-here" };
  },
});

export const routing: Routing = {
  v1: {
    hello: helloWorldEndpoint,
    auth: {
      login: authLoginEndpoint,
      register: authRegisterEndpoint,
    },
    offices: new DependsOnMethod({
      get: officesListEndpoint,
      post: officeCreateEndpoint,
    }).nest({
      ":id": new DependsOnMethod({
        get: officeByIdEndpoint,
      }),
    }),
    users: usersListEndpoint.nest({
      ":id": userByIdEndpoint,
    }),
    reservations: new DependsOnMethod({
      get: reservationsListEndpoint,
      post: reservationsCreateEndpoint,
    }).nest({
      ":id": new DependsOnMethod({
        get: reservationByIdEndpoint,
        delete: cancelReservationByIdEndpoint,
      }),
    }),
  },
};
