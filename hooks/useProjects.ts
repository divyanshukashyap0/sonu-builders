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
import { PROJECTS } from '../constants';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>(PROJECTS);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'projects'));

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const projectsData: Project[] = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                } as Project));

                if (projectsData.length > 0) {
                    setProjects(projectsData);
                } else {
                    setProjects(PROJECTS);
                }
                setLoading(false);
            },
            (err) => {
                console.warn("Firestore projects unavailable, using constants fallback:", err);
                setProjects(PROJECTS);
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

    const incrementViewCount = async (id: string) => {
        try {
            const projectRef = doc(db, 'projects', id);
            await updateDoc(projectRef, {
                views: (projects.find(p => p.id === id)?.views || 0) + 1
            });
        } catch (err) {
            // Non-critical, ignore
        }
    };

    const incrementInquiryCount = async (id: string) => {
        try {
            const projectRef = doc(db, 'projects', id);
            await updateDoc(projectRef, {
                inquiryCount: (projects.find(p => p.id === id)?.inquiryCount || 0) + 1
            });
        } catch (err) {
            // Non-critical, ignore
        }
    };

    const duplicateProject = async (id: string) => {
        try {
            const original = projects.find(p => p.id === id);
            if (!original) return;
            
            const { id: _, ...rest } = original;
            await addDoc(collection(db, 'projects'), {
                ...rest,
                title: `${original.title} (Copy)`,
                slug: `${original.slug}-copy`,
                createdAt: serverTimestamp(),
                views: 0,
                inquiryCount: 0
            });
            return true;
        } catch (err) {
            console.error("Error duplicating project:", err);
            throw err;
        }
    };

    return { projects, loading, error, addProject, updateProject, deleteProject, incrementViewCount, incrementInquiryCount, duplicateProject };
};

export const useProject = (idOrSlug: string | undefined) => {
    const fallback = idOrSlug ? (PROJECTS.find(p => p.id === idOrSlug || p.slug === idOrSlug) || null) : null;
    const [project, setProject] = useState<Project | null>(fallback);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!idOrSlug) {
            setLoading(false);
            return;
        }

        setLoading(true);

        // First try fetching by ID
        const unsubscribe = onSnapshot(doc(db, 'projects', idOrSlug), (docSnap) => {
            if (docSnap.exists()) {
                setProject({ id: docSnap.id, ...docSnap.data() } as Project);
                setLoading(false);
            } else {
                // If ID lookup fails, try fetching by slug
                const q = query(collection(db, 'projects'), where('slug', '==', idOrSlug));
                const unsubSlug = onSnapshot(q, (snapshot) => {
                    if (!snapshot.empty) {
                        const docData = snapshot.docs[0];
                        setProject({ id: docData.id, ...docData.data() } as Project);
                    } else {
                        setProject(fallback);
                    }
                    setLoading(false);
                }, (err) => {
                    console.warn("Firestore slug query failed, falling back to local constants:", err);
                    setProject(fallback);
                    setLoading(false);
                });
                return () => unsubSlug();
            }
        }, (err) => {
            console.warn("Firestore project ID failed, falling back to local constants:", err);
            setProject(fallback);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [idOrSlug]);

    return { project, loading };
};
