import { pgTable, uuid, boolean, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { freelancerProfiles } from "./freelancerProfilesModel.js";
import { languages } from "./languagesModel.js";

const freelancerLanguages = pgTable("freelancer_languages", {
    languageId: uuid("language_id").notNull().references(() => languages.uuid, { onDelete: "cascade" }),
    freelancerId: uuid("freelancer_id").notNull().references(() => freelancerProfiles.uuid, { onDelete: "cascade" }),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
    primaryKey({ columns: [table.languageId, table.freelancerId] }),
]);

export {
    freelancerLanguages
}