import { and, eq, sql } from "drizzle-orm";
import { db } from "./database.js";
import { Office } from "./office.js";
import { reservationsTable } from "./schema.js";

type TimeCapacity = {
  ofice_id: number;
  total_capacity_hours: number;
  high_demand: boolean;
  booked_hours: number;
  ratio: number;
  percentage: string;
};

export async function calculateTimeCapacity(
  office: Office,
  date: string
): Promise<TimeCapacity> {
  let highDemand = false;
  const totalCapacityHours = office.capacity * 8;

  const [booked] = await db
    .select({
      hours: sql<number>`
        SUM(
          (strftime('%H', ${reservationsTable.end_time}) - strftime('%H', ${reservationsTable.start_time}))
        )
      `.as("totalBookedHours"),
    })
    .from(reservationsTable)
    .where(
      and(
        eq(reservationsTable.office_id, office.id),
        eq(reservationsTable.date, date),
        eq(reservationsTable.status, "active")
      )
    );
  const ratio = booked.hours / totalCapacityHours;
  if (office.is_peak_limited && ratio > 0.75) {
    highDemand = true;
  }

  const timeCapacity: TimeCapacity = {
    ofice_id: office.id,
    total_capacity_hours: totalCapacityHours,
    high_demand: highDemand,
    booked_hours: booked.hours,
    ratio,
    percentage: (ratio * 100).toString().substring(0, 2) + "%",
  };

  return timeCapacity;
}
