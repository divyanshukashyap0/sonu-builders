import { useEffect, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { GalleryItem } from '../types';

export const useGallery = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      if (!snap.empty) {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() })) as GalleryItem[];
        setItems(data);
      }
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const addItem = async (item: Omit<GalleryItem, 'id'>) => {
    await addDoc(collection(db, 'gallery'), { ...item, createdAt: Date.now() });
  };

  const deleteItem = async (id: string) => {
    await deleteDoc(doc(db, 'gallery', id));
  };

  return { items, loading, addItem, deleteItem };
};
