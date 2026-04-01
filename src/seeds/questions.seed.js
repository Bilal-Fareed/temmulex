import { db } from '../../infra/db.js';
import { freelancerQuestions } from '../models/freelancerQuestions.js';

export async function seedQuestions() {
    await db
        .insert(freelancerQuestions)
        .values([
            { question: 'You’re currently communicating with a client via messaging, and they take hours (or even days) to respond. How do you maintain momentum without being intrusive?', isMandatory: true },
            { question: 'A client asks you to collect a gift for them by 5pm today for a baby shower they are attending at 6pm. It is currently 4pm, and you are 30 minutes away from the store. You know you don’t have much time, and the client is relying on you to complete this task. How would you approach this request to meet the client’s expectations?', isMandatory: true },
            { question: 'You have a demanding client who has asked for 15 different items, ranging from a cashmere blanket to three pairs of swimsuits for a holiday they are going on in one week’s time. How would you manage this request effectively to ensure all items are delivered on time and to their expected standard?', isMandatory: true },
            { question: 'How would you describe luxury service?', isMandatory: true },
        ])
        .onConflictDoNothing();
}
