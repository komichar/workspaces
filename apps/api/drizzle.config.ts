import "dotenv/config";
import { defineConfig } from "drizzle-kit";

// @ts-ignore, NOTE: import would like .js extension at the end
// but then it cant run "pnpm exec drizzle-kit studio" command
import { environment } from "./src/environment";

export default defineConfig({
  out: "./drizzle",
  schema: "./src/schema.ts",
  dialect: "sqlite",
  dbCredentials: {
    url: environment.DB_FILE_NAME,
  },
});
