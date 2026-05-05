import React, { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import NotificationPanel from '../components/admin/NotificationPanel';
import { Outlet } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { useCompanyData } from '../hooks/useCompanyData';
import { useNotifications } from '../hooks/useNotifications';

const AdminLayout: React.FC = () => {
    const { name } = useCompanyData();
    const { notifications, markAsRead, markAllAsRead } = useNotifications();
    const [isNotifOpen, setIsNotifOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#0a0a0a] overflow-x-hidden text-white">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 flex flex-col transition-all duration-300 w-full min-w-0">

                {/* Top Header */}
                <header className="h-16 bg-luxury-obsidian border-b border-luxury-gold/10 flex items-center justify-between px-4 sm:pr-6 md:px-6 sticky top-0 z-30 shadow-sm">

                    {/* PC/Tablet Search Bar */}
                    <div className="hidden sm:flex items-center bg-white/5 rounded-lg px-3 py-2 w-64 md:w-96 border border-transparent focus-within:border-luxury-gold/50 transition-colors">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search projects..."
                            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder-gray-400"
                        />
                    </div>

                    <div className="flex-1 lg:hidden">
                        {/* Empty space for sidebar toggle alignment */}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-2 md:space-x-4 pr-2 sm:pr-0">
                        {/* Notification Bell */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className={`relative p-2 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-white/5 ${isNotifOpen ? 'text-luxury-gold bg-gray-100 dark:bg-white/10' : 'text-gray-500'}`}
                            >
                                <Bell size={20} />
                                {notifications.length > 0 && (
                                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full border-2 border-white dark:border-luxury-obsidian flex items-center justify-center animate-pulse">
                                        {notifications.length}
                                    </span>
                                )}
                            </button>

                            <NotificationPanel 
                                isOpen={isNotifOpen}
                                onClose={() => setIsNotifOpen(false)}
                                notifications={notifications}
                                markAsRead={markAsRead}
                                markAllAsRead={markAllAsRead}
                            />
                        </div>

                        <div className="flex items-center space-x-2 md:space-x-3 pl-2 md:pl-4 border-l border-gray-200 dark:border-white/10">
                            <div className="text-right hidden md:block">
                                <div className="text-sm font-medium text-luxury-charcoal dark:text-white">Admin User</div>
                                <div className="text-xs text-luxury-gold">{name}</div>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center border border-luxury-gold/30">
                                <User size={16} className="text-luxury-gold" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto w-full min-w-0">
                    <div className="max-w-[1600px] mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
