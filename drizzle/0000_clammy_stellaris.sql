CREATE TABLE `expenses` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`amount` real NOT NULL,
	`note` text,
	`date` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `milk_bills` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`start_date` text NOT NULL,
	`end_date` text NOT NULL,
	`supplier_name` text DEFAULT '' NOT NULL,
	`total_quantity` real NOT NULL,
	`total_amount` real NOT NULL,
	`is_paid` integer DEFAULT 0 NOT NULL,
	`paid_date` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `milk_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`date` text NOT NULL,
	`quantity` real NOT NULL,
	`rate_per_litre` real NOT NULL,
	`supplier_name` text DEFAULT '' NOT NULL,
	`amount` real NOT NULL,
	`notes` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `reminders` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`title` text NOT NULL,
	`hour` integer NOT NULL,
	`minute` integer NOT NULL,
	`is_active` integer DEFAULT 1 NOT NULL,
	`notification_id` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE TABLE `settings` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`key` text NOT NULL,
	`value` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `settings_key_unique` ON `settings` (`key`);--> statement-breakpoint
CREATE TABLE `udhaari_entries` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`person_name` text NOT NULL,
	`amount` real NOT NULL,
	`type` text NOT NULL,
	`reason` text,
	`date` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`paid_date` text,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
