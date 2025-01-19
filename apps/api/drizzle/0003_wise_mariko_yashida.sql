ALTER TABLE `reservations` ADD `user_id` integer NOT NULL REFERENCES users(id);--> statement-breakpoint
ALTER TABLE `reservations` ADD `office_id` integer NOT NULL REFERENCES offices(id);