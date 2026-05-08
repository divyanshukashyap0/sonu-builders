import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { 
    LogOut, Settings, Folder, Star, Images, 
    Inbox, Share2, Palette, Briefcase, BookOpen, 
    Heading, Database, LayoutDashboard, Search,
    Bell, User, ChevronRight, Menu, X, Shield,
    Eye, ExternalLink, Globe, Zap
} from 'lucide-react';

import DashboardOverview from '../components/admin/DashboardOverview';
import ProjectManager from '../components/admin/ProjectManager';
import LeadManager from '../components/admin/LeadManager';
import NotificationBar from '../components/admin/NotificationBar';

// Types from our existing system
import { Project, ProjectCategory } from '../types';
import { useProjects } from '../hooks/useProjects';

type Tab = 'dashboard' | 'projects' | 'gallery' | 'services' | 'testimonials' | 'leads' | 'settings' | 'about' | 'appearance' | 'access';

const AdminDashboard: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [leads, setLeads] = useState<any[]>([]);
    const { projects } = useProjects();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'leads'), (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setLeads(data);
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/admin-portal');
    };

    const sidebarItems = [
        { key: 'dashboard', label: 'Command Center', icon: LayoutDashboard },
        { key: 'leads', label: 'Client Inquiries', icon: Inbox, badge: leads.filter(l => l.status === 'New').length },
        { key: 'projects', label: 'Masterpiece Hub', icon: Folder },
        { key: 'gallery', label: 'Visual Archives', icon: Images },
        { key: 'services', label: 'Global Offerings', icon: Briefcase },
        { key: 'testimonials', label: 'Social Proof', icon: User },
        { key: 'about', label: 'Brand Story', icon: BookOpen },
        { key: 'appearance', label: 'Design System', icon: Palette },
        { key: 'settings', label: 'System Core', icon: Settings },
        { key: 'access', label: 'Intelligence Access', icon: Shield },
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-luxury-gold selection:text-black">
            {/* Ambient Background Engine */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-luxury-gold/5 blur-[150px] rounded-full animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/5 blur-[200px] rounded-full" />
            </div>

            <div className="flex h-screen overflow-hidden relative z-10">
                {/* Luxury Sidebar */}
                <motion.aside 
                    initial={false}
                    animate={{ width: isSidebarOpen ? '320px' : '90px' }}
                    className="h-full bg-black/40 backdrop-blur-3xl border-r border-white/5 flex flex-col relative"
                >
                    {/* Brand Identity */}
                    <div className="p-8 flex items-center gap-4 border-b border-white/5">
                        <div className="w-12 h-12 bg-luxury-gold rounded-2xl flex items-center justify-center font-serif font-black text-black text-2xl shadow-glow-gold flex-shrink-0">
                            S
                        </div>
                        <AnimatePresence>
                            {isSidebarOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, x: -10 }} 
                                    animate={{ opacity: 1, x: 0 }} 
                                    exit={{ opacity: 0, x: -10 }}
                                    className="overflow-hidden whitespace-nowrap"
                                >
                                    <h1 className="text-sm font-black uppercase tracking-[0.2em] leading-none">Sonu Enterprises</h1>
                                    <p className="text-[9px] text-luxury-gold font-black uppercase tracking-[0.4em] mt-2">Executive Admin</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Navigation Matrix */}
                    <nav className="flex-1 overflow-y-auto no-scrollbar p-4 space-y-2 mt-4">
                        {sidebarItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.key;
                            return (
                                <button
                                    key={item.key}
                                    onClick={() => setActiveTab(item.key as Tab)}
                                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-500 group relative ${
                                        isActive ? 'bg-luxury-gold text-black shadow-glow-gold' : 'text-stone-500 hover:bg-white/5 hover:text-white'
                                    }`}
                                >
                                    <Icon size={20} className={`flex-shrink-0 transition-transform ${isActive ? 'scale-110' : 'group-hover:scale-110 text-luxury-gold/60'}`} />
                                    {isSidebarOpen && (
                                        <div className="flex-1 flex items-center justify-between overflow-hidden">
                                            <span className="text-[10px] font-black uppercase tracking-widest">{item.label}</span>
                                            {item.badge ? (
                                                <span className={`px-2 py-1 rounded-lg text-[8px] font-black ${isActive ? 'bg-black/20 text-black' : 'bg-luxury-gold text-black shadow-glow-gold'}`}>
                                                    {item.badge}
                                                </span>
                                            ) : null}
                                        </div>
                                    )}
                                    {isActive && (
                                        <motion.div 
                                            layoutId="sidebar-active"
                                            className="absolute left-0 w-1 h-8 bg-black rounded-r-full"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </nav>

                    {/* Sidebar Footer */}
                    <div className="p-4 border-t border-white/5">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-4 px-5 py-4 text-stone-500 hover:text-red-500 transition-all group"
                        >
                            <LogOut size={20} />
                            {isSidebarOpen && <span className="text-[10px] font-black uppercase tracking-widest">Terminate Session</span>}
                        </button>
                    </div>

                    {/* Toggle Button */}
                    <button 
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="absolute -right-4 top-24 w-8 h-8 bg-luxury-gold text-black rounded-full flex items-center justify-center shadow-glow-gold z-50 hover:scale-110 transition-all"
                    >
                        {isSidebarOpen ? <X size={14} /> : <Menu size={14} />}
                    </button>
                </motion.aside>

                {/* Main Content Arena */}
                <main className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
                    {/* Top Orchestration Bar */}
                    <header className="sticky top-0 z-[60] bg-[#050505]/40 backdrop-blur-3xl border-b border-white/5 p-6 flex items-center justify-between px-12">
                        <div className="flex items-center gap-8 flex-1">
                            <div className="relative group max-w-md w-full">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-600 group-focus-within:text-luxury-gold transition-colors" size={16} />
                                <input 
                                    className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-6 text-[10px] font-bold text-white focus:outline-none focus:border-luxury-gold/50 transition-all" 
                                    placeholder="Search global intelligence..." 
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-8">
                            <button className="relative text-stone-500 hover:text-white transition-all">
                                <Bell size={20} />
                                {leads.some(l => l.status === 'New') && (
                                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-luxury-gold rounded-full border-2 border-[#050505]" />
                                )}
                            </button>
                            <div className="h-8 w-[1px] bg-white/10" />
                            <div className="flex items-center gap-4 group cursor-pointer">
                                <div className="text-right hidden sm:block">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white leading-none">Architect Prime</p>
                                    <p className="text-[8px] text-luxury-gold font-black uppercase tracking-widest mt-1">Status: Authorized</p>
                                </div>
                                <div className="w-10 h-10 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center group-hover:border-luxury-gold/50 transition-all">
                                    <User size={20} className="text-luxury-gold" />
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Content Section */}
                    <div className="p-8 md:p-12 flex-1">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.4 }}
                                className="max-w-[1600px] mx-auto"
                            >
                                {activeTab === 'dashboard' && <DashboardOverview leads={leads} setActiveTab={setActiveTab} />}
                                {activeTab === 'projects' && <ProjectManager />}
                                {activeTab === 'leads' && <LeadManager leads={leads} />}
                                
                                {activeTab === 'gallery' && (
                                    <div className="py-20 text-center space-y-6">
                                        <div className="w-20 h-20 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto text-luxury-gold border border-luxury-gold/20">
                                            <Images size={40} />
                                        </div>
                                        <h2 className="text-3xl font-serif font-bold text-white">Visual Archives</h2>
                                        <p className="text-stone-500 max-w-md mx-auto">The high-resolution media repository is being synchronized for premium delivery.</p>
                                        <button onClick={() => setActiveTab('projects')} className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-luxury-gold hover:text-black transition-all">Update Portfolios</button>
                                    </div>
                                )}

                                {activeTab === 'settings' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="bg-white/5 border border-white/10 rounded-[2.5rem] p-10 space-y-8">
                                            <h3 className="text-xl font-serif font-bold text-white flex items-center gap-3"><Globe size={20} className="text-luxury-gold" /> Site Intelligence</h3>
                                            <div className="space-y-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Platform Identity</label>
                                                    <input className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white" defaultValue="Sonu Enterprises" />
                                                </div>
                                                <div className="flex items-center justify-between p-6 bg-white/5 rounded-2xl">
                                                    <div>
                                                        <p className="text-xs font-bold text-white">Maintenance Mode</p>
                                                        <p className="text-[9px] text-stone-500 uppercase font-black">Restrict public access</p>
                                                    </div>
                                                    <div className="w-12 h-6 bg-stone-800 rounded-full relative cursor-pointer">
                                                        <div className="absolute left-1 top-1 w-4 h-4 bg-stone-500 rounded-full" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Global Orchestration Footer */}
                    <footer className="p-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 opacity-40 hover:opacity-100 transition-opacity">
                        <p className="text-[9px] font-black uppercase tracking-[0.4em] text-stone-500">© 2024 Sonu Enterprises | Premium Architectural Control Panel</p>
                        <div className="flex gap-8">
                            <span className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-stone-600"><Zap size={10} /> Latency: 24ms</span>
                            <span className="flex items-center gap-2 text-[8px] font-black uppercase tracking-widest text-stone-600"><Globe size={10} /> Region: Asia-West</span>
                        </div>
                    </footer>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;
