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
    getDocs
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { SiteAllocation, Project } from '../types';

export const useSiteAllocations = () => {
    const [allocations, setAllocations] = useState<SiteAllocation[]>([]);
    const [activeSites, setActiveSites] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 1. Fetch site allocations
    useEffect(() => {
        setLoading(true);
        const q = query(collection(db, 'siteAllocations'), orderBy('createdAt', 'desc'));

        const unsubscribe = onSnapshot(q,
            (snapshot) => {
                const data = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                })) as SiteAllocation[];
                setAllocations(data);
                setLoading(false);
            },
            (err) => {
                console.error("Error fetching site allocations:", err);
                setError("Failed to fetch site allocations.");
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, []);

    // 2. Fetch list of projects to act as active sites
    useEffect(() => {
        const fetchSites = async () => {
            try {
                const projectsSnap = await getDocs(collection(db, 'projects'));
                const sites: string[] = [];
                projectsSnap.forEach((doc) => {
                    const proj = doc.data() as Project;
                    if (proj.title) {
                        sites.push(proj.title);
                    }
                });
                // Ensure some default fallback active sites if empty
                if (sites.length === 0) {
                    sites.push("Luxury Villa, Jubilee Hills", "Skyline Apartment, Gachibowli", "Sonu Headquarters");
                }
                setActiveSites(sites);
            } catch (err) {
                console.error("Error fetching active projects for sites:", err);
            }
        };

        fetchSites();
    }, []);

    const addAllocation = async (data: Omit<SiteAllocation, 'id' | 'createdAt'>) => {
        try {
            const docRef = await addDoc(collection(db, 'siteAllocations'), {
                ...data,
                createdAt: serverTimestamp()
            });
            
            // Update staff document's current site assigned as well
            if (data.employeeId) {
                const staffRef = doc(db, 'staff', data.employeeId);
                await updateDoc(staffRef, {
                    siteAssigned: data.siteName
                });
            }
            return docRef.id;
        } catch (err) {
            console.error("Error adding site allocation:", err);
            throw err;
        }
    };

    const updateAllocationStatus = async (id: string, status: SiteAllocation['status'], employeeId?: string, siteName?: string) => {
        try {
            const docRef = doc(db, 'siteAllocations', id);
            await updateDoc(docRef, { status });

            // If completed, clear staff's assigned site
            if (status === 'Completed' && employeeId) {
                const staffRef = doc(db, 'staff', employeeId);
                await updateDoc(staffRef, {
                    siteAssigned: ''
                });
            } else if (status === 'Ongoing' && employeeId && siteName) {
                const staffRef = doc(db, 'staff', employeeId);
                await updateDoc(staffRef, {
                    siteAssigned: siteName
                });
            }

            return true;
        } catch (err) {
            console.error("Error updating site allocation:", err);
            throw err;
        }
    };

    const deleteAllocation = async (id: string, employeeId?: string) => {
        try {
            await deleteDoc(doc(db, 'siteAllocations', id));
            
            // Clear staff's assigned site
            if (employeeId) {
                const staffRef = doc(db, 'staff', employeeId);
                await updateDoc(staffRef, {
                    siteAssigned: ''
                });
            }
            return true;
        } catch (err) {
            console.error("Error deleting site allocation:", err);
            throw err;
        }
    };

    return { allocations, activeSites, loading, error, addAllocation, updateAllocationStatus, deleteAllocation };
};
