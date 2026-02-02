import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project } from '../types';
import { PROJECTS as DEFAULT_PROJECTS } from '../constants';

export const useProjects = () => {
    const [projects, setProjects] = useState<Project[]>(DEFAULT_PROJECTS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) {
            setLoading(false);
            return;
        }
        const q = query(collection(db, 'projects'), orderBy('title')); // You might want to order by ID or something else
        const unsubscribe = onSnapshot(q, (snapshot) => {
            if (!snapshot.empty) {
                const fetchedProjects = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as Project[];
                setProjects(fetchedProjects);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const addProject = async (project: Omit<Project, 'id'>) => {
        await addDoc(collection(db, 'projects'), project);
    };

    const updateProject = async (id: string, project: Partial<Project>) => {
        await updateDoc(doc(db, 'projects', id), project);
    };

    const deleteProject = async (id: string) => {
        await deleteDoc(doc(db, 'projects', id));
    };

    return { projects, loading, addProject, updateProject, deleteProject };
};
