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
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import {
    Calendar, MapPin, CreditCard, ClipboardList, ChevronDown, ChevronUp, Users2
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface SidebarProps {
    onCollapse?: (collapsed: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onCollapse }) => {
    const navigate = useNavigate();
    const { theme, definition } = useTheme();
    const [collapsed, setCollapsed] = useState(false);

    const getActiveLinkStyle = (isActive: boolean) => {
        if (!isActive) return undefined;
        const isDarkTheme = theme === 'dark-luxury' || theme === 'contemporary';
        if (isDarkTheme) {
            return {
                boxShadow: `0 0 20px ${definition.colors.accent}40`,
                backgroundColor: 'var(--theme-accent)',
                color: 'var(--theme-buttonText)'
            };
        } else {
            return {
                background: 'linear-gradient(135deg, #E7D8BD, #D8C2A0)',
                border: '1px solid rgba(184,134,11,0.15)',
                boxShadow: '0 8px 20px rgba(184,134,11,0.12)',
                color: '#111827'
            };
        }
    };
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isStaff, setIsStaff] = useState(false);
    const [checkingRole, setCheckingRole] = useState(true);
    const [staffMenuOpen, setStaffMenuOpen] = useState(false);
    const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1200);

    useEffect(() => {
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const checkRole = async () => {
            const user = auth.currentUser;
            if (!user || !user.email) {
                setCheckingRole(false);
                return;
            }
            try {
                const adminDoc = await getDoc(doc(db, 'admins', user.email));
                if (adminDoc.exists() && adminDoc.data()?.role === 'admin') {
                    setIsAdmin(true);
                    setCheckingRole(false);
                    return;
                }

                const q = query(collection(db, 'staff'), where('email', '==', user.email), where('status', '==', 'active'));
                const staffSnap = await getDocs(q);
                if (!staffSnap.empty) {
                    setIsStaff(true);
                }
            } catch (err) {
                console.error("Error checking role in sidebar:", err);
            }
            setCheckingRole(false);
        };

        checkRole();
    }, []);

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

    const staffSubItems = [
        { icon: Users2, label: 'Directory', path: '/admin/staff', desc: 'Roster Management' },
        { icon: Calendar, label: 'Attendance', path: '/admin/staff/attendance', desc: 'Shift Matrix' },
        { icon: IndianRupee, label: 'Salary Slips', path: '/admin/staff/salary', desc: 'Payroll Matrix' },
        { icon: CreditCard, label: 'Advances', path: '/admin/staff/advances', desc: 'Economic Ledger' },
        { icon: Layers, label: 'Expenses', path: '/admin/staff/expenses', desc: 'sonu Ledger' },
        { icon: MapPin, label: 'Site Allocations', path: '/admin/staff/site-allocation', desc: 'Labor Distribution' },
        { icon: ClipboardList, label: 'Reports Hub', path: '/admin/staff/reports', desc: 'Intelligence Summary' },
        { icon: Zap, label: 'Bulk Import', path: '/admin/staff/import', desc: 'Excel Seeder' },
    ];

    const staffOnlyItems = [
        { icon: Calendar, label: 'My Attendance', path: '/admin/staff/attendance', desc: 'My Shift History' },
        { icon: IndianRupee, label: 'My Payroll', path: '/admin/staff/salary', desc: 'My Salary Slips' },
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
                className="lg:hidden fixed top-4 left-4 z-[100] w-12 h-12 bg-theme-accent text-theme-buttonText rounded-2xl flex items-center justify-center transition-all active:scale-90 border border-theme-border"
                style={{ boxShadow: `0 0 20px ${definition.colors.accent}40` }}
                onClick={() => setMobileOpen(!mobileOpen)}
            >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Cinematic Sidebar */}
            <motion.div
                initial={false}
                animate={{
                    width: collapsed ? '90px' : '300px',
                    x: mobileOpen ? 0 : (windowWidth < 1024 ? -300 : 0)
                }}
                className={`fixed inset-y-0 left-0 z-40 bg-[var(--theme-secondary)] border-r border-theme-border flex flex-col transition-all duration-500 ease-in-out shadow-3xl`}
                data-lenis-prevent
            >
                {/* Brand Identity */}
                <div className="h-24 flex items-center px-6 border-b border-theme-border relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[var(--theme-accent)]/5 to-transparent pointer-events-none" />
                    <div className="flex items-center gap-4 relative z-10">
                        <div className="w-35 h-35 bg-theme-background rounded-2xl flex items-center justify-center flex-shrink-0 overflow-hidden border border-theme-border">
                            <img src="/logo.png" alt="Sonu Enterprises" className="w-full h-full object-contain p-1 filter brightness-110" />
                        </div>
                        <AnimatePresence>
                            {!collapsed && (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    className="whitespace-nowrap"
                                >
                                    <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-text"><span className="text-theme-accent"></span></h2>
                                    <p className="text-[20px] text-theme-muted font-black uppercase tracking-[0.4em] mt-1">Prime</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Collapse Orchestrator */}
                    <button
                        onClick={toggleCollapse}
                        className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-theme-accent text-theme-buttonText rounded-full flex items-center justify-center hidden lg:flex hover:scale-110 transition-all z-50 border-4 border-theme-card"
                        style={{ boxShadow: `0 0 15px ${definition.colors.accent}40` }}
                    >
                        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>

                {/* Return Path */}
                <div className="px-5 mt-8 mb-4">
                    <button
                        onClick={() => navigate('/')}
                        className={`flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-theme-accent hover:bg-[var(--theme-accent)]/10 transition-all group border border-theme-border ${collapsed ? 'justify-center' : ''}`}
                    >
                        <Home size={20} className="flex-shrink-0 group-hover:scale-110 transition-transform" />
                        {!collapsed && <span className="text-[10px] font-black uppercase tracking-[0.3em]">Exit Command</span>}
                    </button>
                </div>

                {/* Intelligence Matrix (Nav) */}
                <nav className={`flex-1 ${collapsed ? 'overflow-y-visible' : 'overflow-y-auto'} no-scrollbar py-6 px-4 space-y-2`}>
                    {checkingRole ? (
                        <div className="flex items-center justify-center py-8">
                            <span className="w-4 h-4 border-2 border-[var(--theme-accent)]/30 border-t-theme-accent rounded-full animate-spin"></span>
                        </div>
                    ) : isStaff && !isAdmin ? (
                        // Staff-only view
                        staffOnlyItems.map((item) => (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) => `
                                    flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-500 group relative
                                    ${isActive
                                        ? 'font-bold'
                                        : '!text-stone-700 hover:bg-stone-500/8 hover:!text-stone-900 dark:!text-stone-400 dark:hover:bg-white/5 dark:hover:!text-white'
                                    }
                                `}
                                style={({ isActive }) => getActiveLinkStyle(isActive)}
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
                                            <span className={`text-[8px] font-bold uppercase tracking-widest !text-stone-500 dark:!text-stone-500 whitespace-nowrap mt-0.5`}>{item.desc}</span>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                                {collapsed && (
                                    <div className="absolute left-full ml-4 px-4 py-2 bg-theme-card text-theme-accent text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-3xl border border-theme-border pointer-events-none whitespace-nowrap z-[100]">
                                        {item.label}
                                    </div>
                                )}
                            </NavLink>
                        ))
                    ) : (
                        // Full Admin view
                        <>
                            {/* Collapsible Staff Core Menu */}
                            <div className="relative group">
                                <button
                                    onClick={() => setStaffMenuOpen(!staffMenuOpen)}
                                    className={`
                                        flex items-center justify-between w-full gap-5 px-5 py-4 rounded-2xl transition-all duration-500 relative
                                        ${staffMenuOpen || window.location.pathname.includes('/admin/staff')
                                            ? 'bg-theme-secondary text-theme-text border border-theme-border'
                                            : '!text-stone-700 hover:bg-stone-500/8 hover:!text-stone-900 dark:!text-stone-400 dark:hover:bg-white/5 dark:hover:!text-white'
                                        }
                                    `}
                                >
                                    <div className="flex items-center gap-5">
                                        <Users2 size={20} className={`flex-shrink-0 transition-transform duration-500 ${collapsed ? 'mx-auto' : ''}`} />
                                        {!collapsed && (
                                            <div className="flex flex-col text-left overflow-hidden">
                                                <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">Staff Core</span>
                                                <span className="text-[8px] font-bold uppercase tracking-widest opacity-60 whitespace-nowrap mt-0.5">Payroll & Shifts</span>
                                            </div>
                                        )}
                                    </div>
                                    {!collapsed && (staffMenuOpen ? <ChevronUp size={14} className="text-theme-accent" /> : <ChevronDown size={14} className="text-theme-muted" />)}
                                </button>

                                {collapsed && (
                                    <div className="absolute left-full top-0 pl-4 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[100] pointer-events-none group-hover:pointer-events-auto">
                                        <div className="py-3 bg-theme-card rounded-2xl shadow-3xl border border-theme-border min-w-[220px]">
                                            <div className="px-5 pb-2 mb-2 border-b border-theme-border">
                                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-theme-text">Staff Core</span>
                                                <p className="text-[7px] font-bold uppercase tracking-widest text-theme-muted mt-0.5">Payroll & Shifts</p>
                                            </div>
                                            <div className="max-h-[350px] overflow-y-auto no-scrollbar space-y-1 px-2">
                                                {staffSubItems.map((subItem) => (
                                                    <NavLink
                                                        key={subItem.path}
                                                        to={subItem.path}
                                                        className={({ isActive }) => `
                                                            flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-300
                                                             ${isActive
                                                                ? 'text-theme-accent bg-[var(--theme-accent)]/10 font-bold'
                                                                : '!text-stone-700 hover:!text-stone-900 hover:bg-stone-500/8 dark:!text-stone-400 dark:hover:!text-white dark:hover:bg-white/5'
                                                            }
                                                        `}
                                                        onClick={() => setMobileOpen(false)}
                                                    >
                                                        <subItem.icon size={14} className="flex-shrink-0" />
                                                        <div className="flex flex-col text-left">
                                                            <span className="text-[9px] font-bold uppercase tracking-wider">{subItem.label}</span>
                                                        </div>
                                                    </NavLink>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <AnimatePresence>
                                    {(staffMenuOpen || (collapsed && false)) && !collapsed && (
                                        <motion.div
                                            initial={{ height: 0, opacity: 0 }}
                                            animate={{ height: 'auto', opacity: 1 }}
                                            exit={{ height: 0, opacity: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="overflow-hidden pl-4 pr-1 mt-2 space-y-1.5 border-l border-[var(--theme-accent)]/20 ml-7"
                                        >
                                            {staffSubItems.map((subItem) => (
                                                <NavLink
                                                    key={subItem.path}
                                                    to={subItem.path}
                                                    className={({ isActive }) => `
                                                        flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-300
                                                        ${isActive
                                                            ? 'text-theme-accent bg-[var(--theme-accent)]/10 font-bold'
                                                            : '!text-stone-700 hover:!text-stone-900 hover:bg-stone-500/8 dark:!text-stone-400 dark:hover:!text-white dark:hover:bg-white/5'
                                                        }
                                                    `}
                                                    onClick={() => setMobileOpen(false)}
                                                >
                                                    <subItem.icon size={16} className="flex-shrink-0" />
                                                    <div className="flex flex-col">
                                                        <span className="text-[9px] font-bold uppercase tracking-wider">{subItem.label}</span>
                                                    </div>
                                                </NavLink>
                                            ))}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) => `
                                        flex items-center gap-5 px-5 py-4 rounded-2xl transition-all duration-500 group relative
                                        ${isActive
                                            ? 'font-bold'
                                            : '!text-stone-700 hover:bg-stone-500/8 hover:!text-stone-900 dark:!text-stone-400 dark:hover:bg-white/5 dark:hover:!text-white'
                                        }
                                    `}
                                    style={({ isActive }) => getActiveLinkStyle(isActive)}
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
                                                <span className={`text-[8px] font-bold uppercase tracking-widest !text-stone-500 dark:!text-stone-500 whitespace-nowrap mt-0.5`}>{item.desc}</span>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                    {collapsed && (
                                        <div className="absolute left-full ml-4 px-4 py-2 bg-theme-card text-theme-accent text-[10px] font-black uppercase tracking-widest rounded-xl opacity-0 group-hover:opacity-100 transition-all shadow-3xl border border-theme-border pointer-events-none whitespace-nowrap z-[100]">
                                            {item.label}
                                        </div>
                                    )}
                                </NavLink>
                            ))}
                        </>
                    )}
                </nav>

                {/* Session Termination */}
                <div className="p-6 border-t border-theme-border mt-auto">
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
