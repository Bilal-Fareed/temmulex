CREATE TABLE "admin" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"first_name" varchar(255),
	"last_name" varchar(255),
	"role" varchar(255),
	"is_blocked" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"refresh_token_version" integer DEFAULT 0,
	CONSTRAINT "admin_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "admin_email_unique" UNIQUE("email")
);
