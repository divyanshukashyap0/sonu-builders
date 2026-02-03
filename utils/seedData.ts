import { db } from '../lib/firebase';
import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';

const services = [
    {
        title: 'Full Home Interiors',
        description: 'Transforming your entire home with cohesive design themes, smart space planning, and premium finishes.',
        icon: 'Home',
        order: 1
    },
    {
        title: 'Modular Kitchens',
        description: 'Ergonomic and stylish modular kitchens designed for modern cooking needs with maximum storage.',
        icon: 'ChefHat',
        order: 2
    },
    {
        title: 'Living Room Design',
        description: 'Creating luxurious and inviting living spaces with custom furniture, lighting, and decor.',
        icon: 'Sofa',
        order: 3
    },
    {
        title: 'Wardrobe & Storage',
        description: 'Customized wardrobes and smart storage solutions that blend functionality with aesthetics.',
        icon: 'Box',
        order: 4
    },
    {
        title: 'False Ceiling & Lighting',
        description: 'Elegant false ceiling designs and ambient lighting solutions to enhance the mood of your home.',
        icon: 'Lightbulb',
        order: 5
    },
    {
        title: 'Bathroom Renovations',
        description: 'Modern bathroom designs with premium fittings, tiling, and space-saving layouts.',
        icon: 'Droplets',
        order: 6
    }
];

export async function seedServices() {
    const servicesRef = collection(db, 'services');
    const snapshot = await getDocs(query(servicesRef, limit(1)));

    if (snapshot.empty) {
        console.log('Seeding services...');
        for (const service of services) {
            await addDoc(servicesRef, service);
        }
        console.log('Services seeded successfully.');
    } else {
        console.log('Services already exists, skipping seed.');
    }
}
