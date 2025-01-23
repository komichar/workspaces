import { z } from "zod";

const environmentSchema = z.object({
  DB_FILE_NAME: z.string().trim().min(5),
  LISTEN_PORT: z.coerce.number().min(1000).max(9000),
});

const environmentValidation = environmentSchema.safeParse(process.env);

if (!environmentValidation.success) {
  console.error(environmentValidation.error.issues);
  throw new Error(
    "Invalid environment variables, make sure you have .env file"
  );
  process.exit(1);
}

export const environment = environmentValidation.data;
