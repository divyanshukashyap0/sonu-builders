import { doc, setDoc, collection, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PROJECTS, TESTIMONIALS, CONTACT_INFO, COMPANY_NAME } from '../constants';

export const seedDatabase = async () => {
    const batch = writeBatch(db);

    try {
        // 1. Seed Projects
        PROJECTS.forEach((project) => {
            const docRef = doc(collection(db, 'projects')); // Auto-ID
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...projectData } = project; // Remove ID to let Firestore handle it or store it if needed
            batch.set(docRef, projectData);
        });

        // 2. Seed Testimonials
        TESTIMONIALS.forEach((testimonial) => {
            const docRef = doc(collection(db, 'testimonials'));
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id, ...testimonialData } = testimonial;
            batch.set(docRef, testimonialData);
        });

        // 3. Seed Settings (General)
        const generalRef = doc(db, 'settings', 'general');
        batch.set(generalRef, {
            name: COMPANY_NAME,
            email: CONTACT_INFO.email,
            phone: CONTACT_INFO.phone,
            address: CONTACT_INFO.address
        });

        // 4. Seed Settings (Images) - Default values
        const imagesRef = doc(db, 'settings', 'images');
        batch.set(imagesRef, {
            homeHero: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
            aboutBanner: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
        });

        // 5. Seed Admins (Placeholder - User needs to edit this or I'll add their email if known)
        // Adding a placeholder admin. User said "create a collection for admins"
        const adminEmail = "sonu15enterprises@gmail.com";
        const adminRef = doc(db, 'admins', adminEmail);
        batch.set(adminRef, {
            role: 'admin',
            createdAt: new Date().toISOString()
        });

        await batch.commit();
        console.log("Database seeded successfully!");
        return true;
    } catch (error) {
        console.error("Error seeding database:", error);
        return false;
    }
};
