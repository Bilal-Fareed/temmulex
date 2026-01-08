CREATE TABLE "conversations" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"order_uuid" uuid NOT NULL,
	"client_uuid" uuid NOT NULL,
	"freelancer_uuid" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "conversations_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"sender_uuid" uuid NOT NULL,
	"conversation_uuid" uuid NOT NULL,
	"content" text,
	"attachment_url" varchar(255),
	"is_read" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "messages_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"client_uuid" uuid NOT NULL,
	"freelancer_uuid" uuid,
	"price" numeric NOT NULL,
	"status" varchar DEFAULT 'pending',
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "orders_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "reviews" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"order_uuid" uuid NOT NULL,
	"reviewer_uuid" uuid NOT NULL,
	"freelancer_uuid" uuid NOT NULL,
	"rating" integer,
	"comments" text,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "reviews_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"token_id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_uuid" uuid NOT NULL,
	"user_type" varchar(255),
	"device_id" varchar(255) NOT NULL,
	"user_agent" varchar(255),
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"revoked" boolean DEFAULT false
);
--> statement-breakpoint
CREATE TABLE "freelancer_profiles" (
	"id" serial NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid PRIMARY KEY NOT NULL,
	"location" geometry(point) NOT NULL,
	"resume_link" varchar(500),
	"certificate_link" varchar(500),
	"profile_status" varchar(100) DEFAULT 'pending',
	"is_blocked" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "freelancer_profiles_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "freelancer_languages" (
	"language_id" uuid NOT NULL,
	"freelancer_id" uuid NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "freelancer_languages_language_id_freelancer_id_pk" PRIMARY KEY("language_id","freelancer_id")
);
--> statement-breakpoint
CREATE TABLE "freelancer_services" (
	"service_id" uuid NOT NULL,
	"freelancer_id" uuid NOT NULL,
	"fixed_price_cents" integer NOT NULL,
	"currency" char(3) DEFAULT 'USD' NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "freelancer_services_service_id_freelancer_id_pk" PRIMARY KEY("service_id","freelancer_id")
);
--> statement-breakpoint
CREATE TABLE "languages" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"code" varchar(10) NOT NULL,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "languages_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "languages_name_unique" UNIQUE("name"),
	CONSTRAINT "languages_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE "services" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(150) NOT NULL,
	"slug" varchar(150) NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp,
	CONSTRAINT "services_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "services_name_unique" UNIQUE("name"),
	CONSTRAINT "services_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"password" varchar(255),
	"title" varchar(255),
	"first_name" varchar(255),
	"last_name" varchar(255),
	"country" varchar(255),
	"dob" date,
	"phone" varchar(255),
	"profile_picture" varchar(500),
	"is_verified" boolean DEFAULT false,
	"is_blocked" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"refresh_token_version" integer DEFAULT 0,
	CONSTRAINT "users_uuid_unique" UNIQUE("uuid"),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_order_uuid_orders_uuid_fk" FOREIGN KEY ("order_uuid") REFERENCES "public"."orders"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_client_uuid_users_uuid_fk" FOREIGN KEY ("client_uuid") REFERENCES "public"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "conversations" ADD CONSTRAINT "conversations_freelancer_uuid_users_uuid_fk" FOREIGN KEY ("freelancer_uuid") REFERENCES "public"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_conversation_uuid_conversations_uuid_fk" FOREIGN KEY ("conversation_uuid") REFERENCES "public"."conversations"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_client_uuid_users_uuid_fk" FOREIGN KEY ("client_uuid") REFERENCES "public"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "orders" ADD CONSTRAINT "orders_freelancer_uuid_users_uuid_fk" FOREIGN KEY ("freelancer_uuid") REFERENCES "public"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_order_uuid_orders_uuid_fk" FOREIGN KEY ("order_uuid") REFERENCES "public"."orders"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_reviewer_uuid_users_uuid_fk" FOREIGN KEY ("reviewer_uuid") REFERENCES "public"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_freelancer_uuid_users_uuid_fk" FOREIGN KEY ("freelancer_uuid") REFERENCES "public"."users"("uuid") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "freelancer_languages" ADD CONSTRAINT "freelancer_languages_language_id_languages_uuid_fk" FOREIGN KEY ("language_id") REFERENCES "public"."languages"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "freelancer_languages" ADD CONSTRAINT "freelancer_languages_freelancer_id_freelancer_profiles_uuid_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."freelancer_profiles"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "freelancer_services" ADD CONSTRAINT "freelancer_services_service_id_services_uuid_fk" FOREIGN KEY ("service_id") REFERENCES "public"."services"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "freelancer_services" ADD CONSTRAINT "freelancer_services_freelancer_id_freelancer_profiles_uuid_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."freelancer_profiles"("uuid") ON DELETE cascade ON UPDATE no action;