import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import dotenv from 'dotenv';
import path from 'path';

// Load .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const firebaseConfig = {
    apiKey: process.env.VITE_FIREBASE_API_KEY,
    authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.VITE_FIREBASE_APP_ID,
    measurementId: process.env.VITE_FIREBASE_MEASUREMENT_ID
};

console.log("Connecting to Firebase project:", firebaseConfig.projectId);
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
    try {
        const snap = await getDocs(collection(db, 'staff'));
        console.log(`Found ${snap.size} staff members in Firestore:`);
        snap.forEach((doc) => {
            const data = doc.data();
            console.log(`- Doc ID: ${doc.id}, Employee ID: "${data.employeeId}", Full Name: "${data.fullName}"`);
        });
    } catch (err) {
        console.error("Error:", err);
    }
}

run();
