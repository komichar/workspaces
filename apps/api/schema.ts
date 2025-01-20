import { int, sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users", {
  id: int().primaryKey({ autoIncrement: true }),
  office_id: int("office_id").references(() => officesTable.id),
  name: text().notNull(),
  admin: integer({ mode: "boolean" }).default(false),
  email: text().notNull().unique(),
});

export const officesTable = sqliteTable("offices", {
  id: int().primaryKey({ autoIncrement: true }),
  city: text().notNull(),
  capacity: integer(),
  is_peak_limited: integer({ mode: "boolean" }).default(false),
});

export const reservationsTable = sqliteTable("reservations", {
  id: int().primaryKey({ autoIncrement: true }),
  user_id: int("user_id")
    .notNull()
    .references(() => usersTable.id),
  office_id: int("office_id")
    .notNull()
    .references(() => officesTable.id),
  seat_number: int("seat_number").notNull(),
  date: text("date").notNull(), // SQLite stores TIMESTAMP as TEXT
  start_time: text("start_time").notNull(), // SQLite stores TIMESTAMP as TEXT
  end_time: text("end_time").notNull(), // SQLite stores TIMESTAMP as TEXT
  status: text("status").notNull().default("active"), // Use TEXT for ENUM-like behavior
});
