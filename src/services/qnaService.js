import { db } from '../../infra/db.js';
import { freelancerAnswers } from "../models/freelancerAnswers.js";
import { freelancerQuestions } from "../models/freelancerQuestions.js";
import { eq } from "drizzle-orm";

const getQuestions = async () => {
    return await db
        .select({
            uuid: freelancerQuestions.uuid,
            question: freelancerQuestions.question,
            isMandatory: freelancerQuestions.isMandatory,
        })
        .from(freelancerQuestions)
        .where(eq(freelancerQuestions.isDeleted, false))
}

const insertAnswers = async (answers, options = {}) => {
    const { transaction } = options;
    const executor = transaction || db;

    await executor.insert(freelancerAnswers).values(answers);
}

export {
    getQuestions,
    insertAnswers,
}
