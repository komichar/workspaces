import { z } from "zod";
import { and, eq } from "drizzle-orm";
import { NewOffice, Office, officeSelectSchema } from "./office";
import { defaultEndpointsFactory } from "express-zod-api";
import { db } from "./database";
import { officesTable } from "./schema";
import { adminEndpointFactory } from "./auth.middleware";

export const officeListOutput = z.object({
  offices: officeSelectSchema.array(),
});
export type OfficeListOutput = z.infer<typeof officeListOutput>;

export const officesListEndpoint = defaultEndpointsFactory.build({
  method: "get", // (default) or array ["get", "post", ...]
  input: z.object({
    name: z.string().optional(),
  }),
  output: officeListOutput,
  handler: async ({ input: { name }, options, logger }) => {
    const offices: Office[] = await db.select().from(officesTable);

    return { offices };
  },
});

export const officeByIdOutput = z.object({
  office: officeSelectSchema,
});
export type OfficeByIdOutput = z.infer<typeof officeByIdOutput>;

export const officeByIdEndpoint = defaultEndpointsFactory.build({
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

    return { office };
  },
});

export const officeCreateEndpoint = adminEndpointFactory.build({
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

    return { office: createdOffice };
  },
});
