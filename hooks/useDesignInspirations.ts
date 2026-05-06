import { useState, useEffect } from 'react';
import { 
  collection, 
  query, 
  onSnapshot, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface DesignInspiration {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  gallery?: string[];
  style?: string;
  tags?: string[];
  createdAt?: any;
}

export const useDesignInspirations = () => {
  const [inspirations, setInspirations] = useState<DesignInspiration[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(collection(db, 'design_inspirations'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as DesignInspiration[];
        setInspirations(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching inspirations:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const addInspiration = async (data: Omit<DesignInspiration, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'design_inspirations'), {
        ...data,
        createdAt: serverTimestamp()
      });
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const updateInspiration = async (id: string, data: Partial<DesignInspiration>) => {
    try {
      const docRef = doc(db, 'design_inspirations', id);
      await updateDoc(docRef, data);
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const deleteInspiration = async (id: string) => {
    try {
      const docRef = doc(db, 'design_inspirations', id);
      await deleteDoc(docRef);
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  return {
    inspirations,
    loading,
    error,
    addInspiration,
    updateInspiration,
    deleteInspiration
  };
};
