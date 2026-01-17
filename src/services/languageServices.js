import { db } from '../../infra/db.js';
import { languages } from "../models/languagesModel.js";
import { eq } from "drizzle-orm";

const getLanguages = async (options = {}) => {
    return await db
        .select({
            uuid: languages.uuid,
            name: languages.name,
            code: languages.code,
        })
        .from(languages)
        .where(eq(languages.isDeleted, false))
}

export {
    getLanguages,
}
