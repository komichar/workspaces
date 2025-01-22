import { and, eq, sql } from "drizzle-orm";
import { db } from "./database.js";
import { Office } from "./office.js";
import { reservationsTable } from "./schema.js";
import { z } from "zod";

export const capacitySchema = z.object({
  office_id: z.number().positive(),
  total_capacity_hours: z.number().int().positive(),
  high_demand: z.boolean(),
  booked_hours: z.number().int().nonnegative(),
  filled_ratio: z.number().min(0).max(1),
  filled_percentage: z.string(),
});

export type Capacity = z.infer<typeof capacitySchema>;

const PEAK_DEMAND_THRESHOLD = 0.5; // 50% of total time capacity for the given office for the given day

export async function calculateTimeCapacity(
  office: Office,
  date: string
): Promise<Capacity> {
  let highDemand = false;
  const totalCapacityHours = office.capacity * 8;

  const [booked] = await db
    .select({
      totalBookedHours: sql<number>`
        COALESCE(
          SUM(
            (strftime('%H', ${reservationsTable.end_time}) - strftime('%H', ${reservationsTable.start_time}))
          ), 0
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

  const ratio = booked.totalBookedHours / totalCapacityHours;
  if (office.is_peak_limited && ratio >= PEAK_DEMAND_THRESHOLD) {
    highDemand = true;
  }

  const capacity: Capacity = {
    office_id: office.id,
    total_capacity_hours: totalCapacityHours,
    high_demand: highDemand,
    booked_hours: booked.totalBookedHours || 0,
    filled_ratio: ratio,
    filled_percentage: (ratio * 100).toString().substring(0, 2) + "%",
  };

  return capacity;
}
