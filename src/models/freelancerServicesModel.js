import { pgTable, uuid, char, integer, boolean, timestamp, primaryKey } from "drizzle-orm/pg-core";
import { freelancerProfiles } from "./freelancerProfilesModel.js";
import { services } from "./servicesModel.js";

const freelancerServices = pgTable("freelancer_services", {
    serviceId: uuid("service_id").notNull().references(() => services.uuid, { onDelete: "cascade" }),
    freelancerId: uuid("freelancer_id").notNull().references(() => freelancerProfiles.uuid, { onDelete: "cascade" }),
    fixedPriceCents: integer("fixed_price_cents").notNull(),
    currency: char("currency", { length: 3 }).notNull().default("USD"),
    isDeleted: boolean("is_deleted").default(false),
    createdAt: timestamp("created_at").defaultNow(),
    updatedAt: timestamp("updated_at").defaultNow(),
}, (table) => [
    primaryKey({ columns: [table.serviceId, table.freelancerId] }),
]);

export {
    freelancerServices
}