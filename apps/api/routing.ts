import { and, eq, ilike, like, sql } from "drizzle-orm";
import { defaultEndpointsFactory, Routing } from "express-zod-api";
import createHttpError from "http-errors";
import { z } from "zod";
import { db, ilikeSqlite } from "./database";
import { officesTable, usersTable } from "./schema";
import { NewUser, User, userSelectSchema } from "./user";
import { Office, officeSelectSchema } from "./office";

const helloWorldEndpoint = defaultEndpointsFactory.build({
  // method: "get" (default) or array ["get", "post", ...]
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

const officesEndpoint = defaultEndpointsFactory.build({
  method: "get", // (default) or array ["get", "post", ...]
  input: z.object({
    name: z.string().optional(),
  }),
  output: z.object({
    offices: officeSelectSchema.array(),
  }),
  handler: async ({ input: { name }, options, logger }) => {
    const offices: Office[] = await db.select().from(officesTable);

    logger.debug("Options:", options); // middlewares provide options
    return { offices };
  },
});

const officeByIdEndpoint = defaultEndpointsFactory.build({
  method: "get", // (default) or array ["get", "post", ...]
  input: z.object({
    id: z.coerce.number().positive(),
  }),
  output: officeSelectSchema,
  handler: async ({ input, options, logger }) => {
    const [office]: Office[] = await db
      .select()
      .from(officesTable)
      .where(eq(officesTable.id, input.id))
      .limit(1);

    logger.debug("Options:", options); // middlewares provide options

    return office;
  },
});

const userByIdEndpoint = defaultEndpointsFactory.build({
  method: "get", // (default) or array ["get", "post", ...]
  input: z.object({
    id: z.coerce.number().positive(),
  }),
  output: userSelectSchema,
  handler: async ({ input, options, logger }) => {
    const [user]: User[] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.id, input.id))
      .limit(1);

    logger.debug("Options:", options); // middlewares provide options

    return user;
  },
});

const usersEndpoint = defaultEndpointsFactory.build({
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

const authLoginEndpoint = defaultEndpointsFactory.build({
  method: "post", //  (default) or array ["get", "post", ...]
  input: z.object({
    email: z.string().email(),
  }),
  output: z.object({
    user: userSelectSchema,
    token: z.string(),
  }),
  handler: async ({ input, options, logger }) => {
    const [user] = await db
      .select()
      .from(usersTable)
      .where(eq(usersTable.email, input.email))
      .limit(1);

    if (!user) {
      throw createHttpError.NotFound("john not found");
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
    offices: officesEndpoint.nest({
      ":id": officeByIdEndpoint,
    }),
    users: usersEndpoint.nest({
      ":id": userByIdEndpoint,
    }),
  },
};
