import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard, Users, Briefcase, IndianRupee,
    FileText, Settings, LogOut, ChevronLeft, ChevronRight,
    Menu, Home, LayoutTemplate, MessageSquare, PhoneCall,
    Image as ImageIcon, Palette, X, Shield, Star, Bell,
    Zap, Globe, Box, Target, Layers, Sparkles
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../../lib/firebase';

interface SidebarProps {
    onCollapse?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCollapse }) => {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    const toggleCollapse = () => {
        const next = !collapsed;
        setCollapsed(next);
        onCollapse?.(next);
    };

    const menuItems = [
        { icon: LayoutDashboard, label: 'Orchestration', path: '/admin/dashboard', desc: 'Global Intelligence' },
        { icon: Users, label: 'Client Leads', path: '/admin/leads', desc: 'Conversion Matrix' },
        { icon: MessageSquare, label: 'Chat Intel', path: '/admin/chat-inquiries', desc: 'Direct Signal' },
        { icon: PhoneCall, label: 'Voice Tracking', path: '/admin/call-logs', desc: 'Audio Records' },
        { icon: Briefcase, label: 'Masterpieces', path: '/admin/projects', desc: 'Portfolio Core' },
        { icon: LayoutTemplate, label: 'Offerings', path: '/admin/services', desc: 'Global Solutions' },
        { icon: Palette, label: 'Gallery Hub', path: '/admin/inspirations', desc: 'Visual Curation' },
        { icon: ImageIcon, label: 'Asset Library', path: '/admin/media', desc: 'Media Repository' },
        { icon: IndianRupee, label: 'Financials', path: '/admin/financials', desc: 'Economic Flow' },
        { icon: FileText, label: 'Core Content', path: '/admin/content', desc: 'Brand Narrative' },
        { icon: Star, label: 'Design Team', path: '/admin/team', desc: 'Artistic Talents' },
        { icon: Sparkles, label: 'Appearance', path: '/admin/appearance', desc: 'System Aesthetics' },
        { icon: Settings, label: 'System Logic', path: '/admin/settings', desc: 'Global Config' },
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
            {/* Mobile Intelligence Trigger */}
            <button
                className="lg:hidden fixed top-4 left-4 z-[100] w-12 h-12 bg-luxury-gold text-stone-950 rounded-2xl shadow-glow-gold flex items-center justify-center transition-all active:scale-90 border border-white/20"
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Cinematic Sidebar */}
            <motion.div
                initial={false}
                animate={{
                    width: collapsed ? '90px' : '300px',
                    x: mobileOpen ? 0 : (window.innerWidth < 1024 ? -300 : 0)
                }}
                className={`fixed inset-y-0 left-0 z-40 bg-[#050505] border-r border-white/5 flex flex-col transition-all duration-500 ease-in-out shadow-3xl`}
            >
                {/* Brand Identity */}
                <div className="h-24 flex items-center px-6 border-b border-white/5 relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-luxury-gold/5 to-transparent pointer-events-none" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-35 h-35 bg-white/5 rounded-2xl flex items-center justify-center shadow-glow-gold flex-shrink-0 overflow-hidden border border-white/10">
                            <img src="/logo.png" alt="Sonu Enterprises" className="w-full h-full object-contain p-1" />
                        </div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="whitespace-nowrap"
                                >
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-white"><span className="text-luxury-gold"></span></h2>
                                    <p className="text-[20px] text-stone-500 font-black uppercase tracking-[0.4em] mt-1">Prime</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Collapse Orchestrator */}
                    <button
                        onClick={toggleCollapse}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-luxury-gold text-stone-950 rounded-full flex items-center justify-center shadow-glow-gold hidden lg:flex hover:scale-110 transition-all z-50 border-4 border-[#050505]"
                    >
                        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>

                {/* Return Path */}
                <div className="px-5 mt-8 mb-4">
                    <button
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-luxury-gold hover:bg-luxury-gold/10 transition-all group border border-luxury-gold/10 ${collapsed ? 'justify-center' : ''}`}
                    >
                        <Home size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
                        {!collapsed && <span className="text-[10px] font-black uppercase tracking-[0.3em]">Exit Command</span>}
                    </button>
                </div>

                {/* Intelligence Matrix (Nav) */}
                <nav className="flex-1 overflow-y-auto no-scrollbar py-6 px-4 space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) => `
                                flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-500 group relative
                                ${isActive
                                    ? 'bg-luxury-gold text-stone-950 shadow-glow-gold'
                                    : 'text-stone-500 hover:bg-white/5 hover:text-white'
                                }
                            `}
                            onClick={() => setMobileOpen(false)}
                        >
                            <item.icon size={20} className={`flex-shrink-0 transition-transform duration-500 ${collapsed ? 'mx-auto' : ''} group-hover:scale-110`} />
                            <AnimatePresence>
                                {!collapsed && (
                                    <motion.div
                                        initial={{ opacity: 0, x: -10 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -10 }}
                                        className="flex flex-col overflow-hidden"
                                    >
                                        <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">{item.label}</span>
                                        <span className={`text-[8px] font-bold uppercase tracking-widest opacity-40 whitespace-nowrap mt-0.5`}>{item.desc}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            {/* Collapse Tooltip */}
                            {collapsed && (
                                <div className="absolute left-full ml-4 px-4 py-2 bg-[#050505] text-luxury-gold text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-3xl border border-white/5 pointer-events-none whitespace-nowrap z-[100]">
                                    {item.label}
                                </div>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Session Termination */}
                <div className="p-6 border-t border-white/5 mt-auto">
                    <button
                        onClick={handleLogout}
                        className={`flex items-center gap-5 w-full px-5 py-4 rounded-2xl text-red-500 hover:bg-red-500/10 transition-all group ${collapsed ? 'justify-center' : ''}`}
                    >
                        <LogOut size={20} className="flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
                        {!collapsed && <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>}
                    </button>
                </div>
            </motion.div>

            {/* Mobile Background Fade */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-30 lg:hidden"
                        onClick={() => setMobileOpen(false)}
                    />
                )}
            </AnimatePresence>
        </>
    );
};

export default Sidebar;
