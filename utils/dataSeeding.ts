import { collection, getDocs, doc, setDoc, deleteDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project, Testimonial, ProjectCategory } from '../types';

export type SeedDataType = 'projects' | 'testimonials' | 'gallery';

export interface GalleryItem {
    id: string;
    url: string;
    title?: string;
    category?: string;
}

/**
 * Exports data from a Firestore collection to JSON
 * @param collectionName - Name of the collection to export
 * @returns JSON string of the collection data
 */
export const exportToJSON = async (collectionName: string): Promise<string> => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const data = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));

        return JSON.stringify(data, null, 2);
    } catch (error) {
        console.error('Export failed:', error);
        throw new Error(`Failed to export ${collectionName}`);
    }
};

/**
 * Imports data from JSON to a Firestore collection
 * @param collectionName - Name of the collection to import to
 * @param jsonData - JSON string or parsed array of data
 * @param merge - Whether to merge with existing data (default: false)
 */
export const importFromJSON = async (
    collectionName: string,
    jsonData: string | any[],
    merge: boolean = false
): Promise<void> => {
    try {
        // Parse JSON if it's a string
        const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

        if (!Array.isArray(data)) {
            throw new Error('Invalid data format: expected an array');
        }

        // Validate data structure based on collection
        validateDataStructure(collectionName, data);

        // Use batch writes for better performance
        const batch = writeBatch(db);

        data.forEach((item) => {
            const { id, ...itemData } = item;
            const docId = id || doc(collection(db, collectionName)).id;
            const docRef = doc(db, collectionName, docId);
            batch.set(docRef, itemData, { merge });
        });

        await batch.commit();
        console.log(`Successfully imported ${data.length} items to ${collectionName}`);
    } catch (error) {
        console.error('Import failed:', error);
        throw new Error(`Failed to import to ${collectionName}: ${error}`);
    }
};

/**
 * Validates data structure before import
 * @param collectionName - Collection name
 * @param data - Data array to validate
 */
const validateDataStructure = (collectionName: string, data: any[]): void => {
    if (data.length === 0) return;

    const sample = data[0];

    switch (collectionName) {
        case 'projects':
            if (!sample.title || !sample.description || !sample.category) {
                throw new Error('Projects must have title, description, and category fields');
            }
            break;
        case 'testimonials':
            if (!sample.name || !sample.content || !sample.rating) {
                throw new Error('Testimonials must have name, content, and rating fields');
            }
            break;
        case 'gallery':
            if (!sample.url) {
                throw new Error('Gallery items must have a url field');
            }
            break;
    }
};

/**
 * Generates a template object for seeding
 * @param type - Type of data to generate template for
 * @returns Template object
 */
export const generateSeedTemplate = (type: SeedDataType): object => {
    const templates = {
        projects: {
            title: 'Example Project',
            location: 'City, State',
            category: ProjectCategory.RESIDENTIAL,
            description: 'Project description goes here',
            image: 'https://example.com/image.jpg',
            gallery: [],
            completionDate: '2024',
        },
        testimonials: {
            name: 'Client Name',
            role: 'Home Owner',
            content: 'Testimonial content goes here',
            rating: 5,
        },
        gallery: {
            url: 'https://example.com/image.jpg',
            title: 'Image Title',
            category: 'Category Name',
        },
    };

    return templates[type];
};

/**
 * Generates an array of template objects
 * @param type - Type of data
 * @param count - Number of templates to generate
 * @returns Array of template objects
 */
export const generateSeedTemplates = (type: SeedDataType, count: number = 3): object[] => {
    const templates = [];
    for (let i = 0; i < count; i++) {
        templates.push(generateSeedTemplate(type));
    }
    return templates;
};

/**
 * Downloads data as a JSON file
 * @param data - Data to download
 * @param filename - Name of the file
 */
export const downloadJSON = (data: string, filename: string): void => {
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};

/**
 * Reads a JSON file from user upload
 * @param file - File object from input
 * @returns Promise with parsed JSON data
 */
export const readJSONFile = (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target?.result as string);
                resolve(data);
            } catch (error) {
                reject(new Error('Invalid JSON file'));
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
};

/**
 * Clears all documents from a collection
 * @param collectionName - Collection to clear
 */
export const clearCollection = async (collectionName: string): Promise<void> => {
    try {
        const querySnapshot = await getDocs(collection(db, collectionName));
        const batch = writeBatch(db);

        querySnapshot.docs.forEach((document) => {
            batch.delete(document.ref);
        });

        await batch.commit();
        console.log(`Cleared ${querySnapshot.size} items from ${collectionName}`);
    } catch (error) {
        console.error('Clear collection failed:', error);
        throw new Error(`Failed to clear ${collectionName}`);
    }
};

/**
 * Duplicates a document within a collection
 * @param collectionName - Collection name
 * @param docId - Document ID to duplicate
 * @returns New document ID
 */
export const duplicateDocument = async (
    collectionName: string,
    docId: string
): Promise<string> => {
    try {
        const docRef = doc(db, collectionName, docId);
        const docSnap = await getDocs(collection(db, collectionName));
        const originalDoc = docSnap.docs.find(d => d.id === docId);

        if (!originalDoc) {
            throw new Error('Document not found');
        }

        const newDocRef = doc(collection(db, collectionName));
        const data = originalDoc.data();

        // Add " (Copy)" to title/name field if it exists
        if (data.title) data.title += ' (Copy)';
        if (data.name) data.name += ' (Copy)';

        await setDoc(newDocRef, data);
        return newDocRef.id;
    } catch (error) {
        console.error('Duplicate failed:', error);
        throw new Error('Failed to duplicate document');
    }
};
