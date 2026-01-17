import { seedLanguages } from './languages.seed.js';
import { seedServices } from './services.seed.js';

export async function runSeeds() {
    console.log('🌱 Running database seeds...');
    await seedLanguages();
    await seedServices();
    console.log('Seeds completed successfully');
}
