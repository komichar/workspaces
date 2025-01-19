CREATE TABLE `offices` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`city` text NOT NULL,
	`capacity` integer,
	`is_peak_limited` integer DEFAULT false
);
