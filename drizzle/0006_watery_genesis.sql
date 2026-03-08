ALTER TABLE "conversations" DROP CONSTRAINT "conversations_order_uuid_orders_uuid_fk";
--> statement-breakpoint
ALTER TABLE "conversations" DROP COLUMN "order_uuid";