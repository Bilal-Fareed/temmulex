import {
    pgTable,
    serial,
    varchar,
    timestamp,
    boolean,
    uuid,
} from "drizzle-orm/pg-core";

const freelancerQuestions = pgTable("freelancer_questions", {
    id: serial("id").primaryKey(),
    uuid: uuid("uuid").defaultRandom().notNull().unique(),
    question: varchar("question", { length: 1000 }),
    isMandatory: boolean("is_blocked").default(false),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
});

export {
    freelancerQuestions,
}