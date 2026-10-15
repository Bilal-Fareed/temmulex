CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"order_uuid" uuid NOT NULL,
	"price" numeric NOT NULL,
	"item_name" varchar(255),
	"description" text,
	"payment_status" varchar DEFAULT 'pending',
	"payment_reference_id" text DEFAULT null,
	"payout_transfer_id" varchar DEFAULT null,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "order_items_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_uuid_orders_uuid_fk" FOREIGN KEY ("order_uuid") REFERENCES "public"."orders"("uuid") ON DELETE no action ON UPDATE no action;