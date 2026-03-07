CREATE TABLE "contact_us" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"full_name" varchar(255),
	"email" varchar(255),
	"message" text,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "contact_us_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_status" varchar DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payment_reference_id" varchar DEFAULT null;