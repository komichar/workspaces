import "dotenv/config";
import { drizzle } from "drizzle-orm/libsql";
// import { usersTable } from "./schema";

export const db = drizzle(process.env.DB_FILE_NAME!);

// db.insert(usersTable)
//   .values({ id: 1, name: "Alice", age: 30, email: "something" })
//   .execute();
