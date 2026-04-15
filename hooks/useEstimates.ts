import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ProjectEstimate } from '../types';

export const useEstimates = () => {
  const [estimates, setEstimates] = useState<ProjectEstimate[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    const q = query(collection(db, 'estimates'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const estimateData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ProjectEstimate[];
      
      setEstimates(estimateData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching project estimates:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deleteEstimate = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'estimates', id));
    } catch (error) {
      console.error("Error deleting estimate:", error);
    }
  };

  const updateEstimateStatus = async (id: string, status: ProjectEstimate['status']) => {
    try {
      await updateDoc(doc(db, 'estimates', id), { status });
    } catch (error) {
      console.error("Error updating estimate status:", error);
    }
  };

  return { estimates, loading, deleteEstimate, updateEstimateStatus };
};
