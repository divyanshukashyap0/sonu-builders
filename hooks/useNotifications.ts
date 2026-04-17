import { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot, doc, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface Notification {
    id: string;
    type: 'lead' | 'inquiry' | 'estimate';
    title: string;
    description: string;
    createdAt: Date;
    path: string;
}

export const useNotifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!db) return;

        // 1. Leads Listener
        const qLeads = query(collection(db, 'leads'), where('status', '==', 'New'));
        const unsubLeads = onSnapshot(qLeads, (snapshot) => updateList(snapshot, 'lead'));

        // 2. Chat Inquiries Listener
        const qInquiries = query(collection(db, 'chat_inquiries'), where('status', '==', 'New'));
        const unsubInquiries = onSnapshot(qInquiries, (snapshot) => updateList(snapshot, 'inquiry'));

        // 3. Estimates Listener
        const qEstimates = query(collection(db, 'estimates'), where('status', '==', 'New'));
        const unsubEstimates = onSnapshot(qEstimates, (snapshot) => updateList(snapshot, 'estimate'));

        const allDocs: Record<string, Notification[]> = { lead: [], inquiry: [], estimate: [] };

        const updateList = (snapshot: any, type: 'lead' | 'inquiry' | 'estimate') => {
            const items = snapshot.docs.map((doc: any) => {
                const data = doc.data();
                return {
                    id: doc.id,
                    type,
                    title: type === 'lead' ? 'New Lead' : type === 'inquiry' ? 'Chat Inquiry' : 'Project Estimate',
                    description: type === 'lead' ? data.name : type === 'inquiry' ? data.problem : `${data.userName} - ₹${data.totalBudget?.toLocaleString()}`,
                    createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
                    path: type === 'lead' ? '/admin/leads' : type === 'inquiry' ? '/admin/chat-inquiries' : '/admin/estimates'
                };
            });

            allDocs[type] = items;
            const combined = [...allDocs.lead, ...allDocs.inquiry, ...allDocs.estimate]
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
            
            setNotifications(combined);
            setLoading(false);
        };

        return () => {
            unsubLeads();
            unsubInquiries();
            unsubEstimates();
        };
    }, []);

    const markAsRead = async (notification: Notification) => {
        const collectionMap = {
            lead: 'leads',
            inquiry: 'chat_inquiries',
            estimate: 'estimates'
        };
        const statusMap = {
            lead: 'Contacted',
            inquiry: 'Responded',
            estimate: 'Quote Sent'
        };

        try {
            const ref = doc(db, collectionMap[notification.type], notification.id);
            await updateDoc(ref, { status: statusMap[notification.type] });
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const markAllAsRead = async () => {
        const batch = writeBatch(db);
        notifications.forEach(notif => {
            const collectionMap = { lead: 'leads', inquiry: 'chat_inquiries', estimate: 'estimates' };
            const statusMap = { lead: 'Contacted', inquiry: 'Responded', estimate: 'Quote Sent' };
            const ref = doc(db, collectionMap[notif.type], notif.id);
            batch.update(ref, { status: statusMap[notif.type] });
        });
        await batch.commit();
    };

    return { notifications, loading, markAsRead, markAllAsRead };
};
