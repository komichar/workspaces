import { createSelectSchema } from "drizzle-zod";
import { z } from "zod";
import { offices } from "./schema";

const officeSelectSchema = createSelectSchema(offices);

export type Office = z.infer<typeof officeSelectSchema>;
