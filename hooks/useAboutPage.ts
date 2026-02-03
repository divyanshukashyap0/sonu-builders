import { useState, useEffect } from 'react';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface AboutContent {
    headerTitle: string;
    headerSubtitle: string;
    mainTitle: string;
    paragraphs: string[];
    images: string[];
    mission: { title: string; content: string; icon: string };
    vision: { title: string; content: string; icon: string };
    values: { title: string; content: string; icon: string };
}

const defaultAbout: AboutContent = {
    headerTitle: 'About Us',
    headerSubtitle: 'Transforming houses into beautiful homes with thoughtful design and exceptional craftsmanship.',
    mainTitle: 'Creating Dream Interiors Since 2008',
    paragraphs: [
        'Sonu Interiors & Home Design is a trusted name in the interior design industry, specializing in residential and commercial interior solutions that blend functionality with aesthetics.',
        'With a passion for creating beautiful living spaces, we offer complete home interior packages, modular kitchens, custom wardrobes, false ceiling designs, and much more.',
        'From contemporary minimalist apartments to traditional Indian homes, we bring your vision to life with premium materials, expert craftsmanship, and meticulous attention to detail.'
    ],
    images: [
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400',
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400'
    ],
    mission: {
        title: 'Our Mission',
        content: 'To deliver exceptional interior design solutions that exceed client expectations while creating spaces that inspire, comfort, and reflect individual personalities.',
        icon: 'Target'
    },
    vision: {
        title: 'Our Vision',
        content: 'To be the leading interior design company in the region, recognized for transforming ordinary spaces into extraordinary homes with innovative designs, sustainable practices, and unmatched customer satisfaction.',
        icon: 'Eye'
    },
    values: {
        title: 'Core Values',
        content: 'Quality Craftsmanship, Customer Satisfaction, Creative Innovation, and Timely Delivery. We believe in ethical business practices and creating designs that stand the test of time.',
        icon: 'Award'
    }
};

export function useAboutPage() {
    const [content, setContent] = useState<AboutContent>(defaultAbout);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, 'settings', 'about'), (docSnap) => {
            if (docSnap.exists()) {
                setContent(docSnap.data() as AboutContent);
            }
            setLoading(false);
        }, (error) => {
            console.error("Error fetching about content:", error);
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateAbout = async (newContent: AboutContent) => {
        try {
            await setDoc(doc(db, 'settings', 'about'), newContent);
        } catch (error) {
            console.error("Error updating about content:", error);
            throw error;
        }
    };

    return { content, loading, updateAbout };
}
