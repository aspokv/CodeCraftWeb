CREATE TABLE `demo_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`email` text NOT NULL,
	`school` text NOT NULL,
	`role` text NOT NULL,
	`created_at` text NOT NULL,
	`consent_at` text NOT NULL,
	`ip_hash` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_demo_ip_created` ON `demo_requests` (`ip_hash`,`created_at`);