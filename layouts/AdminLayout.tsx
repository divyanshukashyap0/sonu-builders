import React from 'react';
import Sidebar from '../components/admin/Sidebar';
import { Outlet } from 'react-router-dom';
import { Bell, Search, User } from 'lucide-react';
import { useCompanyData } from '../hooks/useCompanyData';

const AdminLayout: React.FC = () => {
    const { name } = useCompanyData();

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-[#0f0f0f]">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content Area */}
            <div className="flex-1 lg:ml-64 flex flex-col transition-all duration-300">

                {/* Top Header */}
                <header className="h-16 bg-white dark:bg-luxury-obsidian border-b border-luxury-gold/10 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">

                    {/* Search Bar (Placeholder) */}
                    <div className="hidden md:flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg px-3 py-2 w-96 border border-transparent focus-within:border-luxury-gold/50 transition-colors">
                        <Search className="w-4 h-4 text-gray-400 mr-2" />
                        <input
                            type="text"
                            placeholder="Search projects, leads, or clients..."
                            className="bg-transparent border-none outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder-gray-400"
                        />
                    </div>
                    <div className="md:hidden">
                        {/* Spacer for mobile menu button area */}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center space-x-4">
                        <button className="relative p-2 text-gray-500 hover:text-luxury-gold transition-colors">
                            <Bell size={20} />
                            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-luxury-obsidian"></span>
                        </button>

                        <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-white/10">
                            <div className="text-right hidden sm:block">
                                <div className="text-sm font-medium text-luxury-charcoal dark:text-white">Admin User</div>
                                <div className="text-xs text-luxury-gold">{name}</div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-luxury-gold/10 flex items-center justify-center border border-luxury-gold/30">
                                <User size={16} className="text-luxury-gold" />
                            </div>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
