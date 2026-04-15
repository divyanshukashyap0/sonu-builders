import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ChatInquiry } from '../types';

export const useChatInquiries = () => {
  const [inquiries, setInquiries] = useState<ChatInquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) return;

    const q = query(collection(db, 'chat_inquiries'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const inquiryData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as ChatInquiry[];
      
      setInquiries(inquiryData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching chat inquiries:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const deleteInquiry = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'chat_inquiries', id));
    } catch (error) {
      console.error("Error deleting inquiry:", error);
    }
  };

  const updateInquiryStatus = async (id: string, status: ChatInquiry['status']) => {
    try {
      await updateDoc(doc(db, 'chat_inquiries', id), { status });
    } catch (error) {
      console.error("Error updating inquiry status:", error);
    }
  };

  return { inquiries, loading, deleteInquiry, updateInquiryStatus };
};
