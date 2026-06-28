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
import { db } from '../firebase';
import type { SiteAllocation, Project } from '../types';

// Global cache variables to persist across navigation remounts
let allocationsCache: SiteAllocation[] | null = null;
let activeSitesCache: string[] | null = null;
const allocationsListeners: Set<(data: SiteAllocation[]) => void> = new Set();
let unsubscribeAllocations: (() => void) | null = null;
let isLoadingAllocations = false;
let allocationsError: string | null = null;

export const clearSiteAllocationsCache = () => {
    if (unsubscribeAllocations) {
        unsubscribeAllocations();
        unsubscribeAllocations = null;
    }
    allocationsCache = null;
    activeSitesCache = null;
    allocationsListeners.clear();
    isLoadingAllocations = false;
    allocationsError = null;
};

export const useSiteAllocations = () => {
    const [allocations, setAllocations] = useState<SiteAllocation[]>(allocationsCache || []);
    const [activeSites, setActiveSites] = useState<string[]>(activeSitesCache || []);
    const [loading, setLoading] = useState(allocationsCache === null);
    const [error, setError] = useState<string | null>(allocationsError);

    // 1. Fetch site allocations
    useEffect(() => {
        const listener = (data: SiteAllocation[]) => {
            setAllocations(data);
            setLoading(false);
            setError(null);
        };
        allocationsListeners.add(listener);

        if (allocationsCache) {
            setAllocations(allocationsCache);
            setLoading(false);
        }

        if (!unsubscribeAllocations && !isLoadingAllocations) {
            isLoadingAllocations = true;
            const q = query(collection(db, 'siteAllocations'), orderBy('createdAt', 'desc'));

            unsubscribeAllocations = onSnapshot(q,
                (snapshot) => {
                    const data = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    })) as SiteAllocation[];
                    allocationsCache = data;
                    isLoadingAllocations = false;
                    allocationsError = null;
                    allocationsListeners.forEach(l => l(data));
                },
                (err) => {
                    console.error("Error fetching site allocations:", err);
                    allocationsError = "Failed to fetch site allocations.";
                    isLoadingAllocations = false;
                    setError("Failed to fetch site allocations.");
                    setLoading(false);
                }
            );
        }

        return () => {
            allocationsListeners.delete(listener);
        };
    }, []);

    // 2. Fetch list of projects to act as active sites
    useEffect(() => {
        if (activeSitesCache) {
            setActiveSites(activeSitesCache);
            return;
        }

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
                if (sites.length === 0) {
                    sites.push("Luxury Villa, Jubilee Hills", "Skyline Apartment, Gachibowli", "Sonu Headquarters");
                }
                activeSitesCache = sites;
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
