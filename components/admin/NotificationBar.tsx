import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Bell, X, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface NotificationBarProps {
    onViewLeads: () => void;
}

const NotificationBar: React.FC<NotificationBarProps> = ({ onViewLeads }) => {
    const [newLeadsCount, setNewLeadsCount] = useState(0);
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // Query for leads with status 'New'
        const q = query(collection(db, 'leads'), where('status', '==', 'New'));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setNewLeadsCount(snapshot.docs.length);
            if (snapshot.docs.length > 0) {
                setIsVisible(true);
            }
        });

        return () => unsubscribe();
    }, []);

    if (newLeadsCount === 0 || !isVisible) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-gradient-to-r from-luxury-gold via-[#D4AF37] to-[#B08D57] relative z-[60]"
            >
                <div className="max-w-[1600px] mx-auto px-6 py-3 flex items-center justify-between text-neutral-900">
                    <div className="flex items-center gap-3">
                        <div className="bg-white/20 p-1.5 rounded-full animate-pulse">
                            <Bell className="w-4 h-4" />
                        </div>
                        <p className="text-xs font-bold uppercase tracking-wider">
                            Action Required: <span className="text-white bg-black/20 px-2 py-0.5 rounded-md mx-1">{newLeadsCount}</span> New Inquiries Awaiting Response
                        </p>
                    </div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={onViewLeads}
                            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black/10 px-3 py-1.5 rounded-lg transition-colors"
                        >
                            View Leads <ArrowRight className="w-3 h-3" />
                        </button>
                        <button
                            onClick={() => setIsVisible(false)}
                            className="text-neutral-900/50 hover:text-neutral-900 transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default NotificationBar;
