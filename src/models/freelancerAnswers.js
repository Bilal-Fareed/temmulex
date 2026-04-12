import {
    pgTable,
    serial,
    timestamp,
    uuid,
    varchar,
} from "drizzle-orm/pg-core";
import { freelancerProfiles } from "./freelancerProfilesModel.js";
import { freelancerQuestions } from "./freelancerQuestions.js";

const freelancerAnswers = pgTable("freelancer_answers", {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    answer: varchar("answer", { length: 1000 }),
    questionId: uuid("question_id").references(() => freelancerQuestions.uuid, { onDelete: "cascade" }).notNull(),
    freelancerId: uuid("freelancer_id").notNull().references(() => freelancerProfiles.uuid, { onDelete: "cascade" }),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export {
    freelancerAnswers,
}