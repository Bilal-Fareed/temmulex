ALTER TABLE "orders" ADD COLUMN "commissionPercentage" numeric DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "orders" ADD COLUMN "payout_transfer_id" varchar DEFAULT null;--> statement-breakpoint
ALTER TABLE "freelancer_profiles" ADD COLUMN "stripe_account_id" varchar(100) DEFAULT null;--> statement-breakpoint
ALTER TABLE "freelancer_profiles" ADD COLUMN "onboarding_complete" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "freelancer_profiles" ADD COLUMN "charges_enabled" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "freelancer_profiles" ADD COLUMN "payouts_enabled" boolean DEFAULT false;