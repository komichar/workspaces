import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
import { environment } from "./environment.js";

export const db = drizzle(environment.DB_FILE_NAME);
