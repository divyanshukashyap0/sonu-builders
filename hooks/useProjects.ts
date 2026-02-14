import { useState, useEffect } from 'react';
import {
    collection,
    query,
    orderBy,
    onSnapshot,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    where
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project, ProjectCategory } from '../types';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        // Fetch projects ordered by creation time (assuming we add a createdAt field, or fallback to title)
        const q = query(collection(db, 'projects'));

        // Real-time listener
        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const projectsData: Project[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Project));

                setProjects(projectsData);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching projects:", err);
                setError("Failed to fetch projects.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    const addProject = async (projectData: Omit<Project, 'id'>) => {
        try {
            await addDoc(collection(db, 'projects'), {
                ...projectData,
                createdAt: serverTimestamp()
            });
            return true;
        } catch (err) {
            console.error("Error adding project:", err);
            throw err;
        }
    };

    const updateProject = async (id: string, projectData: Partial<Project>) => {
        try {
            const projectRef = doc(db, 'projects', id);
            await updateDoc(projectRef, projectData);
            return true;
        } catch (err) {
            console.error("Error updating project:", err);
            throw err;
        }
    };

    const deleteProject = async (id: string) => {
        try {
            await deleteDoc(doc(db, 'projects', id));
            return true;
        } catch (err) {
            console.error("Error deleting project:", err);
            throw err;
        }
    };

    return { projects, loading, error, addProject, updateProject, deleteProject };
};
