import React, { useState } from 'react';
import Sidebar from '../components/admin/Sidebar';
import NotificationPanel from '../components/admin/NotificationPanel';
import { Outlet } from 'react-router-dom';
import { Bell, Search, User, Sun, Moon } from 'lucide-react';
import { useCompanyData } from '../hooks/useCompanyData';
import { useNotifications } from '../hooks/useNotifications';
import { useTheme } from '../context/ThemeContext';
import { useSiteSettings } from '../hooks/useSiteSettings';

const AdminLayout: React.FC = () => {
    const { name } = useCompanyData();
    const { notifications, markAsRead, markAllAsRead } = useNotifications();
    const [isNotifOpen, setIsNotifOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);
    const { theme } = useTheme();
    const { settings, updateSettings } = useSiteSettings();

    React.useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const isDesktop = windowWidth >= 1024;

    const handleThemeToggle = async () => {
        if (!settings) return;
        const currentTheme = settings.activeTheme || 'dark-luxury';
        const newTheme = currentTheme === 'dark-luxury' ? 'luxury-white' : 'dark-luxury';
        await updateSettings({
            ...settings,
            activeTheme: newTheme
        });
    };

    const isDarkTheme = theme === 'dark-luxury' || theme === 'contemporary';
    
    // Theme-specific styles for the header navbar:
    const navBg = isDarkTheme 
        ? 'bg-stone-950/80 border-b border-white/5 backdrop-blur-3xl' 
        : 'bg-white/92 border-b border-black/[0.05] backdrop-blur-3xl';
        
    const navText = isDarkTheme ? 'text-white' : 'text-[#111827]';
    const navMuted = isDarkTheme ? 'text-stone-400' : 'text-[#6B7280]';
    const navInputPlaceholder = isDarkTheme ? 'placeholder-stone-500' : 'placeholder-[#9CA3AF]';
    
    const navSearchBg = isDarkTheme 
        ? 'bg-stone-900 border border-white/5 shadow-[0_4px_12px_rgba(0,0,0,0.2)] rounded-[16px]' 
        : 'bg-white border border-black/[0.08] shadow-[0_4px_12px_rgba(0,0,0,0.04)] rounded-[16px]';
        
    const navBtnHover = isDarkTheme 
        ? 'hover:bg-white/5 text-stone-300 hover:text-theme-accent' 
        : 'hover:bg-stone-100 text-stone-500 hover:text-theme-accent';
        
    const navProfileBorder = isDarkTheme ? 'border-white/10' : 'border-black/[0.08]';
    const navUserText = isDarkTheme ? 'text-stone-200' : 'text-stone-800';

    return (
        <div className="flex min-h-screen bg-theme-background overflow-x-hidden text-theme-text selection:bg-theme-accent selection:text-theme-background transition-colors duration-300">
            {/* Sidebar */}
            <Sidebar onCollapse={setIsSidebarCollapsed} />

            {/* Main Content Area */}
            <div 
                className="flex-1 flex flex-col transition-all duration-500 w-full min-w-0"
                style={{ marginLeft: isDesktop ? (isSidebarCollapsed ? '90px' : '300px') : 0 }}
            >

                {/* Top Header */}
                <header className={`h-24 backdrop-blur-3xl border-b flex items-center justify-between px-8 md:px-12 sticky top-0 z-30 shadow-2xl transition-all duration-300 ${navBg} ${navText}`}>

                    {/* Intelligence Search Bar */}
                    <div className={`hidden sm:flex items-center rounded-2xl px-5 py-3 w-64 md:w-96 border transition-all ${navSearchBg}`}>
                        <Search className={`w-4 h-4 mr-3 ${navMuted}`} />
                        <input
                            type="text"
                            placeholder="Scan masterpieces..."
                            className={`bg-transparent border-none outline-none text-[11px] font-bold w-full ${navText} ${navInputPlaceholder}`}
                        />
                    </div>

                    <div className="flex-1 lg:hidden">
                        {/* Empty space for sidebar toggle alignment */}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-2 md:space-x-4 pr-2 sm:pr-0">
                        {/* Theme Toggle Button */}
                        <button 
                            onClick={handleThemeToggle}
                            className={`p-2 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full ${navBtnHover}`}
                            title="Toggle Light/Dark Theme"
                        >
                            {theme === 'dark-luxury' || theme === 'contemporary' ? (
                                <Sun size={20} className="text-theme-accent animate-[spin_12s_linear_infinite]" />
                            ) : (
                                <Moon size={20} className={`${navMuted} hover:text-theme-accent`} />
                            )}
                        </button>

                        {/* Notification Bell */}
                        <div className="relative">
                            <button 
                                onClick={() => setIsNotifOpen(!isNotifOpen)}
                                className={`relative p-2 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full ${navBtnHover} ${isNotifOpen ? (isDarkTheme ? 'bg-stone-100 text-theme-accent' : 'bg-white/10 text-theme-accent') : ''}`}
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

                        <div className={`flex items-center space-x-2 md:space-x-3 pl-2 md:pl-4 border-l ${navProfileBorder}`}>
                            <div className="text-right hidden md:block">
                                <div className={`text-sm font-medium ${navUserText}`}>Admin User</div>
                                <div className="text-xs text-theme-accent">{name}</div>
                            </div>
                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-theme-accent/10 flex items-center justify-center border border-theme-accent/30">
                                <User size={16} className="text-theme-accent" />
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
