CREATE TABLE IF NOT EXISTS "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"stripe_customer_id" text
);
--> statement-breakpoint
ALTER TABLE "accounts" RENAME COLUMN "stripe_id" TO "plaid_id";