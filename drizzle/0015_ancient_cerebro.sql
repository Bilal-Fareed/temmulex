CREATE TABLE "freelancer_questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"question" varchar(1000),
	"is_blocked" boolean DEFAULT false,
	"is_deleted" boolean DEFAULT false,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "freelancer_questions_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
CREATE TABLE "freelancer_answers" (
	"id" serial PRIMARY KEY NOT NULL,
	"uuid" uuid DEFAULT gen_random_uuid() NOT NULL,
	"answer" varchar(1000),
	"question_id" uuid NOT NULL,
	"freelancer_id" uuid NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "freelancer_answers_uuid_unique" UNIQUE("uuid")
);
--> statement-breakpoint
ALTER TABLE "freelancer_answers" ADD CONSTRAINT "freelancer_answers_question_id_freelancer_questions_uuid_fk" FOREIGN KEY ("question_id") REFERENCES "public"."freelancer_questions"("uuid") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "freelancer_answers" ADD CONSTRAINT "freelancer_answers_freelancer_id_freelancer_profiles_uuid_fk" FOREIGN KEY ("freelancer_id") REFERENCES "public"."freelancer_profiles"("uuid") ON DELETE cascade ON UPDATE no action;