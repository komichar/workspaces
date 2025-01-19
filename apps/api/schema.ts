// import { int, sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { int, sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  office_id: int("office_id").references(() => offices.id),
  name: text().notNull(),
  admin: integer({ mode: "boolean" }).default(false),
  email: text().notNull().unique(),
});

export const offices = sqliteTable("offices", {
  id: int().primaryKey({ autoIncrement: true }),
  city: text().notNull(),
  capacity: integer(),
  is_peak_limited: integer({ mode: "boolean" }).default(false),
});

export const reservations = sqliteTable("reservations", {
  id: int().primaryKey({ autoIncrement: true }),
  user_id: int("user_id")
    .notNull()
    .references(() => users.id),
  office_id: int("office_id")
    .notNull()
    .references(() => offices.id),
  seat_number: int("seat_number").notNull(),
  date: text("date").notNull(), // SQLite stores TIMESTAMP as TEXT
  start_time: text("start_time").notNull(), // SQLite stores TIMESTAMP as TEXT
  end_time: text("end_time").notNull(), // SQLite stores TIMESTAMP as TEXT
  status: text("status").notNull().default("active"), // Use TEXT for ENUM-like behavior
});
