import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { NewUser, User, userSelectSchema } from "./user.js";
import { defaultEndpointsFactory } from "express-zod-api";
import { usersTable } from "./schema.js";
import createHttpError from "http-errors";
import { db } from "./database.js";

export const daysListEndpoint = defaultEndpointsFactory.build({
  method: "get",
  input: z.object({
    day: z.string(),
  }),
  output: z.object({}),
  handler: async ({ input, options, logger }) => {
    return {};
  },
});

export const daysAnotherListEndpoint = defaultEndpointsFactory.build({
  method: "post",
  input: z.object({
    day: z.string(),
  }),
  output: z.object({}),
  handler: async ({ input, options, logger }) => {
    return {};
  },
});
