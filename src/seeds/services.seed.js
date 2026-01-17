import { db } from '../../infra/db.js';
import { services } from '../models/servicesModel.js';

export async function seedServices() {
    await db
        .insert(services)
        .values([
            { name: 'Car Cleaner', slug: 'car-cleaner' },
            { name: 'Dog Walker', slug: 'dog-walker' },
            { name: 'Hairstylist', slug: 'hairstylist' },
            { name: 'Luxury Event Planner', slug: 'luxury-event-planner' },
            { name: 'Make-Up Artist', slug: 'make-up-artist' },
            { name: 'Nail Artist', slug: 'nail-artist' },
            { name: 'Personal Shopper', slug: 'personal-shopper' },
            { name: 'Personal Trainer', slug: 'personal-trainer' },
            { name: 'Photographer', slug: 'photographer' },
            { name: 'Pilates Instructor', slug: 'pilates-instructor' },
            { name: 'Seamstress', slug: 'seamstress' },
            { name: 'Sneaker Sourcer', slug: 'sneaker-sourcer' },
            { name: 'Swimming Teacher', slug: 'swimming-teacher' },
            { name: 'Tailor', slug: 'tailor' },
            { name: 'Tutor - Arabic', slug: 'tutor-arabic' },
            { name: 'Tutor - French', slug: 'tutor-french' },
            { name: 'Tutor - German', slug: 'tutor-german' },
            { name: 'Tutor - Mandarin', slug: 'tutor-mandarin' },
            { name: 'Tutor - Spanish', slug: 'tutor-spanish' },
            { name: 'Virtual Assistant', slug: 'virtual-assistant' },
            { name: 'Yoga Teacher', slug: 'yoga-teacher' },
            { name: 'Carpenter', slug: 'carpenter' },
            { name: 'Cleaner', slug: 'cleaner' },
            { name: 'Gardener', slug: 'gardener' },
            { name: 'Swimming Pool Maintenance', slug: 'swimming-pool-maintenance' },
            { name: 'Tree Trimmer', slug: 'tree-trimmer' },
            { name: 'Window Cleaner', slug: 'window-cleaner' },
        ])
        .onConflictDoNothing();
}
