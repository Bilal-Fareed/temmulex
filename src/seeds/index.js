import { seedLanguages } from './languages.seed.js';
import { seedServices } from './services.seed.js';
import { seedQuestions } from './questions.seed.js';

export async function runSeeds() {
    console.log('🌱 Running database seeds...');
    await seedLanguages();
    await seedServices();
    await seedQuestions();
    console.log('Seeds completed successfully');
}
