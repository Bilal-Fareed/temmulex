import { customType } from "drizzle-orm/pg-core";

export const geographyPoint = customType({
    dataType() {
        return "geography(Point, 4326)";
    },

    toDriver(value) {
        if (!value) return null;

        const { lat, lng } = value;

        // longitude FIRST
        return `SRID=4326;POINT(${lng} ${lat})`;
    },

    fromDriver(value) {
        // We don't parse WKB here
        return value;
    },
});
