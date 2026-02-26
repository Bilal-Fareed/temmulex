import { db } from '../../infra/db.js';
import { services } from '../models/servicesModel.js';

export async function seedServices() {
    await db
        .insert(services)
        .values([
            { name: 'Car Cleaner', slug: 'car-cleaner', service_type: 'lifestyle' },
            { name: 'Dog Walker', slug: 'dog-walker', service_type: 'lifestyle' },
            { name: 'Hairstylist', slug: 'hairstylist', service_type: 'lifestyle' },
            { name: 'Luxury Event Planner', slug: 'luxury-event-planner', service_type: 'lifestyle' },
            { name: 'Make-Up Artist', slug: 'make-up-artist', service_type: 'lifestyle' },
            { name: 'Nail Artist', slug: 'nail-artist', service_type: 'lifestyle' },
            { name: 'Personal Shopper', slug: 'personal-shopper', service_type: 'lifestyle' },
            { name: 'Personal Trainer', slug: 'personal-trainer', service_type: 'lifestyle' },
            { name: 'Photographer', slug: 'photographer', service_type: 'lifestyle' },
            { name: 'Pilates Instructor', slug: 'pilates-instructor', service_type: 'lifestyle' },
            { name: 'Seamstress', slug: 'seamstress', service_type: 'lifestyle' },
            { name: 'Sneaker Sourcer', slug: 'sneaker-sourcer', service_type: 'lifestyle' },
            { name: 'Swimming Teacher', slug: 'swimming-teacher', service_type: 'lifestyle' },
            { name: 'Tailor', slug: 'tailor', service_type: 'lifestyle' },
            { name: 'Tutor - Arabic', slug: 'tutor-arabic', service_type: 'lifestyle' },
            { name: 'Tutor - French', slug: 'tutor-french', service_type: 'lifestyle' },
            { name: 'Tutor - German', slug: 'tutor-german', service_type: 'lifestyle' },
            { name: 'Tutor - Mandarin', slug: 'tutor-mandarin', service_type: 'lifestyle' },
            { name: 'Tutor - Spanish', slug: 'tutor-spanish', service_type: 'lifestyle' },
            { name: 'Virtual Assistant', slug: 'virtual-assistant', service_type: 'lifestyle' },
            { name: 'Yoga Teacher', slug: 'yoga-teacher', service_type: 'lifestyle' },
            { name: 'Carpenter', slug: 'carpenter', service_type: 'property' },
            { name: 'Cleaner', slug: 'cleaner', service_type: 'property' },
            { name: 'Gardener', slug: 'gardener', service_type: 'property' },
            { name: 'Swimming Pool Maintenance', slug: 'swimming-pool-maintenance', service_type: 'property' },
            { name: 'Tree Trimmer', slug: 'tree-trimmer', service_type: 'property' },
            { name: 'Window Cleaner', slug: 'window-cleaner', service_type: 'property' },
        ])
        .onConflictDoNothing();
}
