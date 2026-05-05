import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Users,
    Briefcase,
    IndianRupee,
    FileText,
    Settings,
    LogOut,
    ChevronLeft,
    ChevronRight,
    Menu,
    Home,
    LayoutTemplate,
    MessageSquare,
    Calculator,
    PhoneCall,
    Image as ImageIcon,
    X
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

const Sidebar: React.FC = () => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleCollapse = () => setCollapsed(!collapsed);
    const toggleMobile = () => setMobileOpen(!mobileOpen);

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Users, label: 'Leads', path: '/admin/leads' },
        { icon: MessageSquare, label: 'Chat Inquiries', path: '/admin/chat-inquiries' },
        { icon: Calculator, label: 'Project Estimates', path: '/admin/estimates' },
        { icon: PhoneCall, label: 'Call tracking', path: '/admin/call-logs' },
        { icon: Briefcase, label: 'Projects', path: '/admin/projects' },
        { icon: LayoutTemplate, label: 'Services', path: '/admin/services' },
        { icon: ImageIcon, label: 'Media Library', path: '/admin/media' },
        { icon: IndianRupee, label: 'Financials', path: '/admin/financials' },
        { icon: FileText, label: 'Content', path: '/admin/content' },
        { icon: Users, label: 'Team', path: '/admin/team' }, // Changed Icon to Users for Team
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    const handleLogout = async () => {
        try {
            await signOut(auth);
            window.location.href = '/admin/login';
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="lg:hidden fixed top-3 left-4 z-[100] p-2.5 bg-luxury-gold text-luxury-charcoal rounded-full shadow-lg active:scale-90 transition-transform flex items-center justify-center border border-white/10"
                onClick={toggleMobile}
            >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Sidebar Container */}
            <div className={`fixed inset-y-0 left-0 z-40 bg-luxury-charcoal text-white transition-all duration-300 ease-in-out border-r border-luxury-gold/10 flex flex-col
        ${collapsed ? 'w-20' : 'w-64'} 
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>

                {/* Header / Logo */}
                <div className="h-16 flex items-center justify-center border-b border-luxury-gold/10 relative">
                    {!collapsed ? (
                        <h1 className="text-xl font-serif font-bold tracking-widest text-luxury-gold">SONU ADMIN</h1>
                    ) : (
                        <span className="text-xl font-bold text-luxury-gold">S</span>
                    )}

                    {/* Collapse Toggle (Desktop) */}
                    <button
                        onClick={toggleCollapse}
                        className="absolute -right-3 top-1/2 transform -translate-y-1/2 bg-luxury-gold text-luxury-charcoal rounded-full p-1 shadow-md hidden lg:block hover:scale-110 transition-transform"
                    >
                        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>

                {/* Navigation Items */}
                <div className="flex-1 overflow-y-auto py-6 space-y-2 px-3 scrollbar-thin scrollbar-thumb-luxury-gold/20">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                flex items-center px-3 py-3 rounded-lg transition-all duration-200 group
                ${isActive
                                    ? 'bg-luxury-gold text-luxury-charcoal font-bold shadow-glow-gold'
                                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                                }
              `}
                            onClick={() => setMobileOpen(false)} // Close on mobile click
                        >
                            <item.icon size={22} className={`min-w-[22px] ${collapsed ? 'mx-auto' : 'mr-3'}`} />
                            {!collapsed && (
                                <span className="truncate">{item.label}</span>
                            )}

                            {/* Tooltip for collapsed mode */}
                            {collapsed && (
                                <div className="absolute left-full ml-2 px-2 py-1 bg-luxury-charcoal text-luxury-gold text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-luxury-gold/20 z-50 pointer-events-none">
                                    {item.label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </div>

                {/* Footer / Actions */}
                <div className="p-4 border-t border-luxury-gold/10 space-y-2">
                    {/* Exit Admin Button */}
                    <button
                        onClick={() => navigate('/')}
                        className={`flex items-center w-full px-3 py-3 rounded-lg text-luxury-gold hover:bg-luxury-gold/10 hover:text-white transition-all duration-200 group
              ${collapsed ? 'justify-center' : ''}
            `}
                    >
                        <Home size={22} className={`min-w-[22px] ${collapsed ? '' : 'mr-3'}`} />
                        {!collapsed && <span>Exit Admin</span>}

                        {/* Tooltip for collapsed mode */}
                        {collapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-luxury-charcoal text-luxury-gold text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-luxury-gold/20 z-50 pointer-events-none">
                                Exit Admin
                            </div>
                        )}
                    </button>

                    {/* Logout Button */}
                    <button
                        onClick={handleLogout}
                        className={`flex items-center w-full px-3 py-3 rounded-lg text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200 group
              ${collapsed ? 'justify-center' : ''}
            `}
                    >
                        <LogOut size={22} className={`min-w-[22px] ${collapsed ? '' : 'mr-3'}`} />
                        {!collapsed && <span>Logout</span>}

                        {/* Tooltip for collapsed mode */}
                        {collapsed && (
                            <div className="absolute left-full ml-2 px-2 py-1 bg-luxury-charcoal text-red-400 text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-red-400/20 z-50 pointer-events-none">
                                Logout
                            </div>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-30 lg:hidden backdrop-blur-sm"
                    onClick={() => setMobileOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;
