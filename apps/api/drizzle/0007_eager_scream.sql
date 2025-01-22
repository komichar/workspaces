PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_offices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`city` text NOT NULL,
	`capacity` integer NOT NULL,
	`is_peak_limited` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_offices`("id", "city", "capacity", "is_peak_limited") SELECT "id", "city", "capacity", "is_peak_limited" FROM `offices`;--> statement-breakpoint
DROP TABLE `offices`;--> statement-breakpoint
ALTER TABLE `__new_offices` RENAME TO `offices`;--> statement-breakpoint
PRAGMA foreign_keys=ON;