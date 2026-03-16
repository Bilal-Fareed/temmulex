CREATE TABLE "notification_tokens" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token" varchar(255) NOT NULL,
	"device_id" varchar(255) NOT NULL,
	"user_agent" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "notification_tokens_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "notification_tokens_token_unique" UNIQUE("token")
);
