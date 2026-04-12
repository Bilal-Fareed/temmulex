ALTER TABLE "freelancer_questions" RENAME COLUMN "is_blocked" TO "is_mandatory";--> statement-breakpoint
ALTER TABLE "freelancer_questions" ALTER COLUMN "question" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "freelancer_questions" ADD CONSTRAINT "freelancer_questions_question_unique" UNIQUE("question");