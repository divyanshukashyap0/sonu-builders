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
                        className="fixed sm:absolute inset-x-4 sm:inset-auto sm:right-0 top-20 sm:top-auto sm:mt-2 w-auto sm:w-96 bg-theme-card rounded-xl shadow-2xl border border-theme-border z-[70] overflow-hidden"
                    >
                        {/* Header */}
                        <div className="p-3 sm:p-4 border-b border-theme-border flex items-center justify-between bg-[var(--theme-accent)]/5">
                            <div className="flex items-center gap-2">
                                <Bell size={18} className="text-theme-accent" />
                                <h3 className="font-bold text-sm sm:text-base text-theme-text">Notifications</h3>
                                {notifications.length > 0 && (
                                    <span className="bg-theme-accent text-theme-buttonText text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                        {notifications.length}
                                    </span>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                {notifications.length > 0 && (
                                    <button 
                                        onClick={markAllAsRead}
                                        className="text-[10px] uppercase tracking-widest font-bold text-theme-accent hover:text-theme-text transition-colors"
                                    >
                                        Clear All
                                    </button>
                                )}
                                <button onClick={onClose} className="p-1 hover:bg-[var(--theme-secondary)] rounded-full">
                                    <X size={16} className="text-theme-muted" />
                                </button>
                            </div>
                        </div>

                        {/* List */}
                        <div className="max-h-[400px] overflow-y-auto premium-scroll">
                            {notifications.length === 0 ? (
                                <div className="p-10 text-center">
                                    <div className="w-12 h-12 bg-theme-secondary rounded-full flex items-center justify-center mx-auto mb-4 border border-theme-border">
                                        <Bell size={24} className="text-theme-muted" />
                                    </div>
                                    <p className="text-sm text-theme-muted italic">No new notifications</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-theme-border">
                                    {notifications.map((notif) => (
                                        <div 
                                            key={notif.id}
                                            className="p-4 hover:bg-[var(--theme-secondary)] transition-colors group relative"
                                        >
                                            <div className="flex gap-3">
                                                <div className="mt-1">
                                                    {getIcon(notif.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <p className="text-xs font-bold uppercase tracking-widest text-theme-accent">
                                                            {notif.title}
                                                        </p>
                                                        <span className="text-[10px] text-theme-muted">
                                                            {formatTime(notif.createdAt)}
                                                        </span>
                                                    </div>
                                                    <p className="text-sm font-medium text-theme-text truncate">
                                                        {notif.description}
                                                    </p>
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <button 
                                                            onClick={() => {
                                                                navigate(notif.path);
                                                                onClose();
                                                            }}
                                                            className="text-[10px] font-bold text-theme-muted hover:text-theme-accent flex items-center gap-1 uppercase tracking-tighter"
                                                        >
                                                            <ExternalLink size={10} />
                                                            View Details
                                                        </button>
                                                        <button 
                                                            onClick={() => markAsRead(notif)}
                                                            className="text-[10px] font-bold text-theme-muted hover:text-green-500 flex items-center gap-1 uppercase tracking-tighter"
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
                        <div className="p-3 bg-theme-secondary text-center border-t border-theme-border">
                            <p className="text-[10px] text-theme-muted font-medium">Real-time Admin Monitoring Enabled</p>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default NotificationPanel;
