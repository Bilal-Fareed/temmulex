CREATE TABLE "payment_event_logs" (
	"id" serial PRIMARY KEY NOT NULL,
	"event_id" varchar(255),
	"event_type" varchar(255),
	"payload" jsonb,
	"created_at" timestamp DEFAULT now()
);
