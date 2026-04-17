import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Users, MessageSquare, Calculator, Check, X, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Notification } from '../../hooks/useNotifications';

interface NotificationPanelProps {
    isOpen: boolean;
    onClose: () => void;
    notifications: Notification[];
    markAsRead: (n: Notification) => Promise<void>;
    markAllAsRead: () => Promise<void>;
}

const NotificationPanel: React.FC<NotificationPanelProps> = ({
    isOpen,
    onClose,
    notifications,
    markAsRead,
    markAllAsRead
}) => {
    const navigate = useNavigate();

    const getIcon = (type: Notification['type']) => {
        switch (type) {
            case 'lead': return <Users size={16} className="text-blue-500" />;
            case 'inquiry': return <MessageSquare size={16} className="text-luxury-gold" />;
            case 'estimate': return <Calculator size={16} className="text-green-500" />;
        }
    };

    const formatTime = (date: Date) => {
        const now = new Date();
        const diff = Math.floor((now.getTime() - date.getTime()) / 60000); // mins
        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff}m ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)}h ago`;
        return date.toLocaleDateString();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop for mobile */}
                    <div className="fixed inset-0 z-[60] lg:hidden" onClick={onClose} />
                    
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className="fixed sm:absolute inset-x-4 sm:inset-auto sm:right-0 top-20 sm:top-auto sm:mt-2 w-auto sm:w-96 bg-white dark:bg-luxury-obsidian rounded-xl shadow-2xl border border-luxury-gold/20 z-[70] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-3 sm:p-4 border-b border-luxury-gold/10 flex items-center justify-between bg-luxury-gold/5">
                            <div className="flex items-center gap-2">
                                <Bell size={18} className="text-luxury-gold" />
                                <h3 className="font-bold text-sm sm:text-base text-luxury-charcoal dark:text-white">Notifications</h3>
                                {notifications.length > 0 && (
                                    <span className="bg-luxury-gold text-luxury-charcoal text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {notifications.length}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                {notifications.length > 0 && (
                                    <button 
                                        onClick={markAllAsRead}
                                        className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold hover:text-luxury-charcoal dark:hover:text-white transition-colors"
                                    >
                                        Clear All
                                    </button>
                                )}
                                <button onClick={onClose} className="p-1 hover:bg-gray-100 dark:hover:bg-white/10 rounded-full">
                                    <X size={16} className="text-gray-400" />
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-[400px] overflow-y-auto premium-scroll">
                            {notifications.length === 0 ? (
                                <div className="p-10 text-center">
                                    <div className="w-12 h-12 bg-gray-100 dark:bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Bell size={24} className="text-gray-300" />
                                    </div>
                                    <p className="text-sm text-gray-400 italic">No new notifications</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-white/5">
                                    {notifications.map((notif) => (
                                        <div 
                                            key={notif.id}
                                            className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group relative"
                                        >
                                            <div className="flex gap-3">
                                                <div className="mt-1">
                                                    {getIcon(notif.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className="text-xs font-bold uppercase tracking-widest text-luxury-gold">
                                                            {notif.title}
                                                        </p>
                                                        <span className="text-[10px] text-gray-400">
                                                            {formatTime(notif.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium text-luxury-charcoal dark:text-white truncate">
                                                        {notif.description}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <button 
                                                            onClick={() => {
                                                                navigate(notif.path);
                                                                onClose();
                                                            }}
                                                            className="text-[10px] font-bold text-gray-500 hover:text-luxury-gold flex items-center gap-1 uppercase tracking-tighter"
                                                        >
                                                            <ExternalLink size={10} />
                                                            View Details
                                                        </button>
                                                        <button 
                                                            onClick={() => markAsRead(notif)}
                                                            className="text-[10px] font-bold text-gray-500 hover:text-green-500 flex items-center gap-1 uppercase tracking-tighter"
                                                        >
                                                            <Check size={10} />
                                                            Done
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Footer */}
                        <div className="p-3 bg-gray-50 dark:bg-white/5 text-center border-t border-luxury-gold/10">
                            <p className="text-[10px] text-gray-400 font-medium">Real-time Admin Monitoring Enabled</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationPanel;
