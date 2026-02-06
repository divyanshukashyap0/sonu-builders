import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Save, LogOut, Building, Phone, Mail, MapPin, Plus, Trash2, Edit2, Image as ImageIcon, LayoutDashboard, Settings, Folder, Star, Images, Inbox, Share2, ChevronLeft, ChevronRight, BarChart3, Palette } from 'lucide-react';
import { CONTACT_INFO, COMPANY_NAME, SERVICES } from '../constants';
import { useProjects } from '../hooks/useProjects';
import { useTestimonials } from '../hooks/useTestimonials';
import { useImages } from '../hooks/useImages';
import { useGallery } from '../hooks/useGallery';
import { Project, Testimonial, ProjectCategory, Service } from '../types';
import { useServices } from '../hooks/useServices';
import { useAboutPage } from '../hooks/useAboutPage';
import { usePageHeaders, HeadersData } from '../hooks/usePageHeaders';
import { Briefcase, BookOpen, Target, Eye, Award, Heading } from 'lucide-react';

import { useUsers } from '../hooks/useUsers';
import { Users as UsersIcon, Check, X } from 'lucide-react';
import ImageUploader from '../components/ImageUploader';
import DataSeeder from '../components/DataSeeder';
import LinkPreview from '../components/LinkPreview';
import { Database } from 'lucide-react';

type Tab = 'overview' | 'general' | 'projects' | 'testimonials' | 'images' | 'gallery' | 'users' | 'leads' | 'social' | 'branding' | 'data' | 'master' | 'appearance' | 'services_mgr' | 'about_mgr' | 'headers_mgr';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    // General Info State
    const [generalData, setGeneralData] = useState({
        name: COMPANY_NAME,
        phone: CONTACT_INFO.phone,
        email: CONTACT_INFO.email,
        address: CONTACT_INFO.address
    });

    // Hooks
    const { projects, addProject, updateProject, deleteProject } = useProjects();
    const { testimonials, addTestimonial, updateTestimonial, deleteTestimonial } = useTestimonials();
    const { images, updateImage } = useImages();
    const { items: galleryItems, addItem: addGalleryItem, deleteItem: deleteGalleryItem } = useGallery();
    const { users, approveUser, deleteUser } = useUsers();
    const { services: dbServices, addService, updateService, deleteService } = useServices();
    const { content: aboutContent, updateAbout } = useAboutPage();
    const { headers: pageHeaders, updateHeader } = usePageHeaders();
    const [leads, setLeads] = useState<any[]>([]);
    const [leadNotes, setLeadNotes] = useState<Record<string, string>>({});
    const [socialData, setSocialData] = useState<any>({ facebook: '', twitter: '', instagram: '', linkedin: '', whatsapp: '' });

    // Local state for forms
    const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
    const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
    const [editingService, setEditingService] = useState<Partial<Service> | null>(null);
    const [brandingData, setBrandingData] = useState({
        title: 'Designing Spaces That Define',
        emphasisText: 'How You Live',
        subtitle: 'Our Vision',
        description: 'Luxury interiors & turnkey construction crafted with precision, trust, and timeless design.',
        imageUrl: '',
        buttonText: 'Export Our Philosophy',
        buttonLink: '/about',
        titleColor: '#FFFFFF',
        emphasisColor: '#000000',
        subtextColor: '#FFFFFF'
    });

    const [masterData, setMasterData] = useState({
        siteTitle: COMPANY_NAME,
        maintenanceMode: false,
        themeOverride: 'auto', // 'auto' | 'light' | 'dark'
        announcement: '',
        showAnnouncement: false
    });

    const [appearanceData, setAppearanceData] = useState({
        luxuryWhite: '#FCFBFA',
        warmBeige: '#F8F5F2',
        charcoal: '#1A1A1A',
        goldAccent: '#D4AF37',
        bronze: '#8E6D45',
        obsidian: '#0A0A0A',
        champagne: '#E5D1B8',
        premiumStone: '#F5F2EF',
        ivoryPearl: '#FDFBFA',
        glassBlur: 8,
        glassOpacity: 0.03
    });

    useEffect(() => {
        fetchGeneralData();
    }, []);

    // Live Preview Engine: Sync local appearance state to CSS variables instantly
    useEffect(() => {
        if (activeTab === 'appearance') {
            const root = document.documentElement;
            // Colors
            root.style.setProperty('--gold-accent', appearanceData.goldAccent);
            root.style.setProperty('--charcoal', appearanceData.charcoal);
            root.style.setProperty('--obsidian', appearanceData.obsidian);

            // Glass
            root.style.setProperty('--glass-blur', `${appearanceData.glassBlur}px`);
            root.style.setProperty('--glass-opacity', appearanceData.glassOpacity.toString());
        }
    }, [appearanceData, activeTab]);

    useEffect(() => {
        const unsub = onSnapshot(collection(db, 'leads'), (snapshot) => {
            const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setLeads(data as any[]);
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'social'), (docSnap) => {
            if (docSnap.exists()) {
                setSocialData(docSnap.data());
            }
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'master'), (docSnap) => {
            if (docSnap.exists()) {
                setMasterData(docSnap.data() as any);
            }
        });
        return () => unsub();
    }, []);

    useEffect(() => {
        const unsub = onSnapshot(doc(db, 'settings', 'appearance'), (docSnap) => {
            if (docSnap.exists()) {
                setAppearanceData(prev => ({ ...prev, ...docSnap.data() }));
            }
        });
        return () => unsub();
    }, []);

    const deleteLead = async (id: string) => {
        await deleteDoc(doc(db, 'leads', id));
    };

    const setLeadStatus = async (id: string, status: 'New' | 'Contacted' | 'Closed') => {
        await updateDoc(doc(db, 'leads', id), { status });
    };

    const saveLeadNotes = async (id: string, notes: string) => {
        await updateDoc(doc(db, 'leads', id), { notes });
    };

    const fetchGeneralData = async () => {
        try {
            const docRef = doc(db, 'settings', 'general');
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                setGeneralData(docSnap.data() as any);
            }
        } catch (error) {
            console.error("Error fetching settings:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = async () => {
        await signOut(auth);
        navigate('/admin-portal');
    };


    const handleGeneralSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            await setDoc(doc(db, 'settings', 'general'), generalData);
            setMessage('Settings saved successfully!');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error("Error saving settings:", error);
            setMessage('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    const handleSeedServices = async () => {
        const defaults = [
            { title: 'Full Home Interiors', description: 'Complete turnkey interior solutions for your luxury home.', icon: 'Home' },
            { title: 'Modular Kitchens', description: 'Ergonomic and stylish modular kitchen designs.', icon: 'ChefHat' },
            { title: 'Living Room Design', description: 'Bespoke living room interiors and furniture.', icon: 'Sofa' },
            { title: 'Wardrobe & Storage', description: 'Custom storage solutions and walk-in closets.', icon: 'Box' },
            { title: 'False Ceiling', description: 'Premium false ceiling and specialized lighting.', icon: 'Lightbulb' },
            { title: 'Bathroom Interiors', description: 'Modern and functional bathroom renovations.', icon: 'Droplets' }
        ];

        setSaving(true);
        try {
            for (const s of defaults) {
                await addService(s as any);
            }
            setMessage('Default catalog orchestrated.');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setMessage('Seeding failed.');
        } finally {
            setSaving(false);
        }
    };

    const handleProjectSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProject) return;

        try {
            if (editingProject.id) {
                await updateProject(editingProject.id, editingProject);
            } else {
                await addProject(editingProject as any);
            }
            setEditingProject(null);
        } catch (error) {
            console.error("Error saving project:", error);
        }
    };

    const handleTestimonialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingTestimonial) return;

        try {
            if (editingTestimonial.id) {
                await updateTestimonial(editingTestimonial.id, editingTestimonial);
            } else {
                await addTestimonial(editingTestimonial as any);
            }
            setEditingTestimonial(null);
        } catch (error) {
            console.error("Error saving testimonial:", error);
        }
    };

    const handleSocialSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await setDoc(doc(db, 'settings', 'social'), socialData, { merge: true });
            setMessage('Connectivity ecosystem synchronized.');
            setTimeout(() => setMessage(''), 3000);
        } catch (error) {
            console.error(error);
            setMessage('Synchronization failed.');
        } finally {
            setSaving(false);
        }
    };

    const inquiryTrend = React.useMemo(() => {
        const days = 7;
        const now = new Date();
        const buckets = Array.from({ length: days }, (_, i) => {
            const d = new Date(now);
            d.setDate(now.getDate() - (days - 1 - i));
            const key = d.toISOString().slice(0, 10);
            return { key, date: d, count: 0 };
        });
        leads.forEach((lead) => {
            const k = (lead.createdAt ? new Date(lead.createdAt) : new Date()).toISOString().slice(0, 10);
            const b = buckets.find(b => b.key === k);
            if (b) b.count += 1;
        });
        const max = Math.max(1, ...buckets.map(b => b.count));
        const points = buckets.map((b, i) => {
            const x = (i / (days - 1)) * 100;
            const y = 100 - (b.count / max) * 100;
            return `${x},${y}`;
        }).join(' ');
        const labels = buckets.map(b => b.key.slice(5));
        return { buckets, points, labels, max };
    }, [leads]);

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-stone-950 text-stone-200">
            {/* Custom Background Ambient Glow */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-luxury-gold/5 blur-[120px] rounded-full" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-luxury-gold/5 blur-[120px] rounded-full" />
            </div>

            <nav className="bg-stone-950/30 backdrop-blur-glass border-b border-white/5 sticky top-0 z-50">
                <div className="max-w-[1600px] mx-auto px-6 sm:px-8">
                    <div className="flex justify-between h-20 items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-luxury-gold rounded-sm flex items-center justify-center font-serif font-black text-stone-950 text-xl tracking-tighter">
                                S
                            </div>
                            <div>
                                <h1 className="text-lg font-serif font-bold text-white leading-none">Management Console</h1>
                                <p className="text-[10px] uppercase tracking-[0.3em] text-luxury-gold font-bold mt-1">Sonu Enterprises Admin</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-8">
                            <button onClick={() => navigate('/')} className="text-[10px] font-bold text-luxury-gold hover:text-white uppercase tracking-[0.3em] transition-all border-b border-luxury-gold/0 hover:border-luxury-gold pb-1">Live Site</button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-stone-400 hover:text-red-400 transition-all uppercase tracking-[0.3em] text-[10px] font-bold"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-[1600px] mx-auto py-10 px-6 sm:px-8 relative z-10">
                <div className="flex flex-col lg:flex-row gap-10">
                    <aside className={`sticky top-28 z-30 transition-all duration-500 lg:w-80 w-full lg:block`}>
                        <div className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl overflow-hidden shadow-2xl p-3">
                            <div className="flex items-center justify-between p-4 mb-4 border-b border-white/5">
                                <span className={`text-[10px] items-center uppercase tracking-[0.3em] font-bold text-stone-500 transition-opacity whitespace-nowrap opacity-100`}>Control Center</span>
                            </div>
                            <nav className="flex lg:flex-col overflow-x-auto lg:overflow-visible gap-2 no-scrollbar">
                                {[
                                    { key: 'overview', label: 'Dashboard', icon: LayoutDashboard },
                                    { key: 'leads', label: 'Inquiries', icon: Inbox },
                                    { key: 'projects', label: 'Portfolio', icon: Folder },
                                    { key: 'services_mgr', label: 'Service Catalog', icon: Briefcase },
                                    { key: 'about_mgr', label: 'About Narrative', icon: BookOpen },
                                    { key: 'headers_mgr', label: 'Page Headers', icon: Heading },
                                    { key: 'gallery', label: 'Visual Media', icon: Images },
                                    { key: 'branding', label: 'Hero Config', icon: Star },
                                    { key: 'appearance', label: 'Design System', icon: Palette },
                                    { key: 'general', label: 'Business Profile', icon: Settings },
                                    { key: 'testimonials', label: 'Testimonials', icon: UsersIcon },
                                    { key: 'social', label: 'Social Assets', icon: Share2 },
                                    { key: 'users', label: 'System Access', icon: Database },
                                ].map((item: any) => {
                                    const Icon = item.icon;
                                    const active = activeTab === item.key;
                                    return (
                                        <button
                                            key={item.key}
                                            onClick={() => setActiveTab(item.key)}
                                            className={`flex-shrink-0 lg:w-full flex items-center gap-4 px-5 py-4 text-[10px] rounded-xl transition-all duration-500 whitespace-nowrap uppercase tracking-[0.2em] font-bold group ${active
                                                ? 'bg-luxury-gold text-stone-950 shadow-[0_0_30px_rgba(212,175,55,0.2)]'
                                                : 'text-stone-400 hover:bg-white/5 hover:text-white'
                                                }`}
                                        >
                                            <Icon className={`w-5 h-5 flex-shrink-0 transition-transform duration-500 ${active ? 'scale-110' : 'group-hover:scale-110 text-luxury-gold/60'}`} />
                                            <span>{item.label}</span>
                                        </button>
                                    );
                                })}
                            </nav>
                        </div>
                    </aside>
                    <section className="flex-1 min-w-0">

                        {/* Business Profile Tab */}
                        {activeTab === 'general' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/5 backdrop-blur-glass border border-white/10 shadow-2xl rounded-3xl p-8 sm:p-12 max-w-5xl mx-auto"
                            >
                                <div className="mb-10">
                                    <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-3">Settings</p>
                                    <h2 className="text-3xl font-serif font-bold text-white mb-2">Business Profile</h2>
                                    <p className="text-stone-500 text-sm italic">Define your premium brand identity across the platform.</p>
                                </div>

                                {message && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold rounded-xl text-sm flex items-center">
                                        <div className="w-2 h-2 bg-luxury-gold rounded-full mr-3 animate-pulse" />
                                        {message}
                                    </motion.div>
                                )}

                                <form onSubmit={handleGeneralSubmit} className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="group">
                                            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-3 group-hover:text-luxury-gold transition-colors">Company Name</label>
                                            <input type="text" value={generalData.name} onChange={e => setGeneralData({ ...generalData, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all font-serif text-lg" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-3 group-hover:text-luxury-gold transition-colors">Contact Number</label>
                                            <input type="text" value={generalData.phone} onChange={e => setGeneralData({ ...generalData, phone: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all" />
                                        </div>
                                        <div className="group">
                                            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-3 group-hover:text-luxury-gold transition-colors">Email Address</label>
                                            <input type="email" value={generalData.email} onChange={e => setGeneralData({ ...generalData, email: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all" />
                                        </div>
                                        <div className="group md:col-span-2">
                                            <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-3 group-hover:text-luxury-gold transition-colors">Headquarters Address</label>
                                            <textarea rows={3} value={generalData.address} onChange={e => setGeneralData({ ...generalData, address: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all resize-none" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-8 py-4 bg-luxury-gold text-stone-950 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all flex items-center group"
                                        >
                                            {saving ? 'Processing...' : (
                                                <>
                                                    <Save className="w-4 h-4 mr-3 transition-transform group-hover:scale-125" />
                                                    Commit Changes
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Dashboard Overview Tab */}
                        {activeTab === 'overview' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-10"
                            >
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {[
                                        { label: 'Inquiries', val: leads.length, icon: Inbox, trend: '+12% this week' },
                                        { label: 'Projects', val: projects.length, icon: Folder, trend: 'Premium Active' },
                                        { label: 'Visual Media', val: galleryItems.length, icon: Images, trend: 'High Res' },
                                        { label: 'Global Services', val: SERVICES.length, icon: Settings, trend: 'Optimized' }
                                    ].map((stat, i) => (
                                        <div key={i} className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-all group border-b-2 border-b-transparent hover:border-b-luxury-gold shadow-xl">
                                            <div className="flex items-center justify-between mb-6">
                                                <div className="p-3 bg-luxury-gold/10 rounded-lg group-hover:bg-luxury-gold/20 transition-colors">
                                                    <stat.icon className="w-5 h-5 text-luxury-gold" />
                                                </div>
                                                <span className="text-[10px] text-stone-500 font-bold uppercase tracking-widest">{stat.label}</span>
                                            </div>
                                            <div className="flex items-end justify-between">
                                                <p className="text-4xl font-serif font-black text-white">{stat.val}</p>
                                                <p className="text-[8px] uppercase tracking-widest text-luxury-gold font-bold opacity-0 group-hover:opacity-100 transition-opacity translate-y-2 group-hover:translate-y-0 duration-500">{stat.trend}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                                    <div className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-3xl p-8 lg:col-span-2 shadow-2xl">
                                        <div className="flex items-center justify-between mb-8">
                                            <div>
                                                <h3 className="text-xl font-serif font-bold text-white">Analytics Performance</h3>
                                                <p className="text-[10px] uppercase tracking-[0.2em] text-stone-500 mt-1">Inquiry Velocity (Last 7 Days)</p>
                                            </div>
                                            <BarChart3 className="w-6 h-6 text-luxury-gold" />
                                        </div>
                                        <div className="h-48 relative">
                                            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                                                <defs>
                                                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                                        <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                                                        <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
                                                    </linearGradient>
                                                </defs>
                                                <path
                                                    d={`M ${inquiryTrend.points} L 100 100 L 0 100 Z`}
                                                    fill="url(#chartGradient)"
                                                />
                                                <polyline
                                                    points={inquiryTrend.points}
                                                    fill="none"
                                                    stroke="#D4AF37"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    className="drop-shadow-[0_0_10px_rgba(212,175,55,0.5)]"
                                                />
                                                {inquiryTrend.points.split(' ').map((p, idx) => {
                                                    const [x, y] = p.split(',').map(Number);
                                                    return <circle key={idx} cx={x} cy={y} r="1" fill="white" className="drop-shadow-[0_0_5px_white]" />;
                                                })}
                                            </svg>
                                        </div>
                                        <div className="mt-6 flex justify-between px-2">
                                            {inquiryTrend.labels.map((l, i) => (
                                                <span key={i} className="text-[9px] uppercase tracking-widest text-stone-500 font-bold">{l}</span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-3xl p-8 shadow-2xl">
                                        <h3 className="text-xl font-serif font-bold text-white mb-8 border-b border-white/5 pb-4">Live Activity</h3>
                                        <div className="space-y-6">
                                            {leads.slice(0, 5).map((lead, idx) => (
                                                <div key={lead.id} className="flex items-center justify-between group cursor-default">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold text-luxury-gold border border-white/10 group-hover:bg-luxury-gold group-hover:text-stone-950 transition-all">
                                                            {lead.name ? lead.name[0] : '?'}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-stone-200 group-hover:text-white transition-colors">{lead.name || 'Anonymous'}</p>
                                                            <p className="text-[10px] text-stone-500 uppercase tracking-tighter">{lead.subject || 'General Inquiry'}</p>
                                                        </div>
                                                    </div>
                                                    <p className="text-[8px] font-bold text-stone-600 uppercase tracking-widest">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : ''}</p>
                                                </div>
                                            ))}
                                            {leads.length === 0 && <p className="text-sm text-stone-500 italic">Static silence.</p>}
                                        </div>
                                        <button onClick={() => setActiveTab('leads')} className="w-full mt-10 py-3 border border-white/5 rounded-xl text-[10px] uppercase tracking-[0.3em] text-stone-500 font-bold hover:bg-white/5 hover:text-luxury-gold transition-all">View Intelligence</button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Portfolio Management Tab */}
                        {activeTab === 'projects' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-10"
                            >
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-2">Inventory</p>
                                        <h2 className="text-3xl font-serif font-bold text-white">Portfolio Collection</h2>
                                    </div>
                                    <button
                                        onClick={() => setEditingProject({ title: '', location: '', category: ProjectCategory.RESIDENTIAL, description: '', image: '', gallery: [] })}
                                        className="flex items-center px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-luxury-gold hover:text-stone-950 transition-all uppercase tracking-widest text-[10px] font-bold group"
                                    >
                                        <Plus className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90" /> New Masterpiece
                                    </button>
                                </div>

                                {editingProject && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white/5 backdrop-blur-glass border border-white/10 p-8 rounded-3xl shadow-2xl mb-12 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-2 h-full bg-luxury-gold" />
                                        <h3 className="text-xl font-serif font-bold text-white mb-8 flex items-center gap-3">
                                            {editingProject.id ? <Edit2 className="w-5 h-5 text-luxury-gold" /> : <Plus className="w-5 h-5 text-luxury-gold" />}
                                            {editingProject.id ? 'Refine Project Details' : 'Initialize New Project'}
                                        </h3>
                                        <form onSubmit={handleProjectSubmit} className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Project Title</label>
                                                    <input placeholder="Ex: Regal Heights Residency" value={editingProject.title || ''} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Location</label>
                                                    <input placeholder="Ex: Jubilee Hills, Hyderabad" value={editingProject.location || ''} onChange={e => setEditingProject({ ...editingProject, location: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Classification</label>
                                                    <select
                                                        value={editingProject.category || ProjectCategory.RESIDENTIAL}
                                                        onChange={e => setEditingProject({ ...editingProject, category: e.target.value as any })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all appearance-none"
                                                    >
                                                        {Object.values(ProjectCategory).map(c => <option key={c} value={c} className="bg-stone-900">{c}</option>)}
                                                    </select>
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Completion Year</label>
                                                    <input placeholder="Ex: 2024" value={editingProject.completionDate || ''} onChange={e => setEditingProject({ ...editingProject, completionDate: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all" />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1 mb-3 block">Primary Cinematic Visual</label>
                                                    <ImageUploader
                                                        label=""
                                                        existingUrl={editingProject.image}
                                                        onUpload={(url: string) => setEditingProject({ ...editingProject, image: url })}
                                                        path="projects"
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Executive Summary</label>
                                                <textarea placeholder="Describe the architectural narrative..." rows={4} value={editingProject.description || ''} onChange={e => setEditingProject({ ...editingProject, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all resize-none" required />
                                            </div>

                                            <div className="flex justify-end space-x-6 pt-4 border-t border-white/5">
                                                <button type="button" onClick={() => setEditingProject(null)} className="px-6 py-3 text-stone-500 hover:text-white uppercase tracking-widest text-[10px] font-bold transition-colors">Discard</button>
                                                <button type="submit" className="px-10 py-4 bg-luxury-gold text-stone-950 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-xl">Archive Project</button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {projects.map(project => (
                                        <motion.div
                                            key={project.id}
                                            whileHover={{ y: -10 }}
                                            className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden group shadow-2xl"
                                        >
                                            <div className="h-64 bg-stone-900 relative overflow-hidden">
                                                {project.image ? (
                                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-stone-700">No Image</div>
                                                )}
                                                <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center gap-4 backdrop-blur-sm">
                                                    <button onClick={() => setEditingProject(project)} className="w-12 h-12 bg-white rounded-full text-stone-950 flex items-center justify-center hover:bg-luxury-gold transition-colors shadow-xl"><Edit2 className="w-5 h-5" /></button>
                                                    <button onClick={() => deleteProject(project.id)} className="w-12 h-12 bg-red-600/20 text-red-400 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors border border-red-600/30"><Trash2 className="w-5 h-5" /></button>
                                                </div>
                                                <div className="absolute top-4 right-4 px-3 py-1 bg-luxury-gold text-stone-950 text-[8px] font-black uppercase tracking-widest rounded-sm">
                                                    {project.category}
                                                </div>
                                            </div>
                                            <div className="p-6">
                                                <h3 className="font-serif font-bold text-white text-lg group-hover:text-luxury-gold transition-colors">{project.title}</h3>
                                                <div className="flex items-center gap-2 mt-2 text-stone-500 text-[10px] uppercase tracking-widest font-bold">
                                                    <MapPin className="w-3 h-3 text-luxury-gold" />
                                                    {project.location}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Service Catalog Tab */}
                        {activeTab === 'services_mgr' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-10"
                            >
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-2">Offerings</p>
                                        <h2 className="text-3xl font-serif font-bold text-white">Service Catalog</h2>
                                    </div>
                                    <div className="flex gap-4">
                                        {dbServices.length === 0 && (
                                            <button
                                                onClick={handleSeedServices}
                                                disabled={saving}
                                                className="px-8 py-3 bg-luxury-gold/10 hover:bg-luxury-gold text-luxury-gold hover:text-stone-950 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 border border-luxury-gold/20"
                                            >
                                                <Database className="w-4 h-4" /> Seed Catalog
                                            </button>
                                        )}
                                        <button onClick={() => setEditingService({ title: '', description: '', icon: 'Home' })} className="px-8 py-3 bg-white/10 hover:bg-luxury-gold text-white hover:text-stone-950 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center gap-2 border border-white/10">
                                            <Plus className="w-4 h-4" /> Orchestrate Service
                                        </button>
                                    </div>
                                </div>
                                <div className="h-px bg-white/5 mb-10" />

                                {editingService && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white/5 backdrop-blur-glass border border-white/10 p-8 rounded-3xl shadow-2xl mb-12 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-2 h-full bg-luxury-gold" />
                                        <h3 className="text-xl font-serif font-bold text-white mb-8 flex items-center gap-3">
                                            {editingService.id ? <Edit2 className="w-5 h-5 text-luxury-gold" /> : <Plus className="w-5 h-5 text-luxury-gold" />}
                                            {editingService.id ? 'Refine Service Architecture' : 'Initialize New Service'}
                                        </h3>
                                        <form
                                            onSubmit={async (e) => {
                                                e.preventDefault();
                                                setSaving(true);
                                                try {
                                                    if (editingService.id) {
                                                        await updateService(editingService.id, editingService);
                                                    } else {
                                                        await addService(editingService as any);
                                                    }
                                                    setEditingService(null);
                                                    setMessage('Service catalog synchronized.');
                                                    setTimeout(() => setMessage(''), 3000);
                                                } catch (err) {
                                                    console.error(err);
                                                    setMessage('Catalog update failed.');
                                                } finally {
                                                    setSaving(false);
                                                }
                                            }}
                                            className="space-y-8"
                                        >
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Service Title</label>
                                                    <input placeholder="Ex: Bespoke Modular Kitchens" value={editingService.title || ''} onChange={e => setEditingService({ ...editingService, title: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all font-bold" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Icon Selection</label>
                                                    <select
                                                        value={editingService.icon || 'Home'}
                                                        onChange={e => setEditingService({ ...editingService, icon: e.target.value })}
                                                        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all appearance-none"
                                                    >
                                                        <option value="Home" className="bg-stone-900">Home</option>
                                                        <option value="PaintBucket" className="bg-stone-900">Paint Bucket</option>
                                                        <option value="Building2" className="bg-stone-900">Building</option>
                                                        <option value="Ruler" className="bg-stone-900">Ruler</option>
                                                        <option value="Key" className="bg-stone-900">Key</option>
                                                        <option value="HardHat" className="bg-stone-900">Hard Hat</option>
                                                        <option value="Brush" className="bg-stone-900">Brush</option>
                                                        <option value="Layout" className="bg-stone-900">Layout</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Service Narrative</label>
                                                <textarea placeholder="Describe the service in detail..." rows={3} value={editingService.description || ''} onChange={e => setEditingService({ ...editingService, description: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all resize-none" required />
                                            </div>

                                            <div className="flex justify-end space-x-6 pt-4 border-t border-white/5">
                                                <button type="button" onClick={() => setEditingService(null)} className="px-6 py-3 text-stone-500 hover:text-white uppercase tracking-widest text-[10px] font-bold transition-colors">Abort</button>
                                                <button type="submit" disabled={saving} className="px-10 py-4 bg-luxury-gold text-stone-950 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-xl">Commit Service</button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {dbServices.map(service => (
                                        <motion.div
                                            key={service.id}
                                            whileHover={{ y: -5 }}
                                            className="bg-white/5 border border-white/10 p-8 rounded-2xl group relative overflow-hidden shadow-2xl transition-all"
                                        >
                                            <div className="absolute top-0 right-0 w-16 h-16 bg-luxury-gold/5 rounded-bl-3xl -mr-8 -mt-8 transition-all group-hover:bg-luxury-gold/20" />
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-luxury-gold group-hover:bg-luxury-gold group-hover:text-stone-950 transition-all">
                                                    <Briefcase className="w-6 h-6" />
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setEditingService(service)} className="text-stone-500 hover:text-white transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                    <button onClick={() => deleteService(service.id)} className="text-stone-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                            <h3 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-luxury-gold transition-colors">{service.title}</h3>
                                            <p className="text-stone-500 text-xs leading-relaxed line-clamp-2">{service.description}</p>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* About Us Content Manager Tab */}
                        {activeTab === 'about_mgr' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/5 backdrop-blur-glass border border-white/10 shadow-2xl rounded-3xl p-8 sm:p-12 max-w-5xl mx-auto"
                            >
                                <div className="mb-10">
                                    <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-3">Narrative</p>
                                    <h2 className="text-3xl font-serif font-bold text-white mb-2">About Us Content</h2>
                                    <p className="text-stone-500 text-sm italic">Sculpt the history and vision of your brand.</p>
                                </div>

                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        setSaving(true);
                                        try {
                                            await updateAbout(aboutContent);
                                            setMessage('About narrative synchronized.');
                                            setTimeout(() => setMessage(''), 3000);
                                        } catch (error) {
                                            console.error(error);
                                            setMessage('Synchronization failed.');
                                        } finally {
                                            setSaving(false);
                                        }
                                    }}
                                    className="space-y-12"
                                >
                                    {/* Header & Narrative Group */}
                                    <div className="space-y-8">
                                        <h3 className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-black border-b border-white/5 pb-4">Narrative & Vision</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Page Header Title</label>
                                                <input value={aboutContent.headerTitle} onChange={e => updateAbout({ ...aboutContent, headerTitle: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all font-bold" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Hero Subtitle</label>
                                                <input value={aboutContent.headerSubtitle} onChange={e => updateAbout({ ...aboutContent, headerSubtitle: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all" />
                                            </div>
                                            <div className="md:col-span-2 space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Main Section Title</label>
                                                <input value={aboutContent.mainTitle} onChange={e => updateAbout({ ...aboutContent, mainTitle: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all font-serif font-bold text-xl" />
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Brand Story (Paragraphs)</label>
                                            {aboutContent.paragraphs.map((p, idx) => (
                                                <textarea
                                                    key={idx}
                                                    value={p}
                                                    rows={3}
                                                    onChange={e => {
                                                        const newParas = [...aboutContent.paragraphs];
                                                        newParas[idx] = e.target.value;
                                                        updateAbout({ ...aboutContent, paragraphs: newParas });
                                                    }}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-stone-300 focus:outline-none focus:border-luxury-gold/50 transition-all resize-none shadow-inner text-sm"
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    {/* Mission, Vision, Values Group */}
                                    <div className="space-y-8">
                                        <h3 className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-black border-b border-white/5 pb-4">Brand Pillars</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                            {['mission', 'vision', 'values'].map((key) => (
                                                <div key={key} className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-luxury-gold/10 rounded-lg flex items-center justify-center text-luxury-gold">
                                                            {key === 'mission' && <Target className="w-5 h-5" />}
                                                            {key === 'vision' && <Eye className="w-5 h-5" />}
                                                            {key === 'values' && <Award className="w-5 h-5" />}
                                                        </div>
                                                        <input
                                                            value={(aboutContent as any)[key].title}
                                                            onChange={e => updateAbout({ ...aboutContent, [key]: { ...(aboutContent as any)[key], title: e.target.value } })}
                                                            className="bg-transparent border-0 text-white font-serif font-bold focus:outline-none w-full"
                                                        />
                                                    </div>
                                                    <textarea
                                                        value={(aboutContent as any)[key].content}
                                                        rows={4}
                                                        onChange={e => updateAbout({ ...aboutContent, [key]: { ...(aboutContent as any)[key], content: e.target.value } })}
                                                        className="w-full bg-transparent border-0 text-stone-400 text-xs focus:outline-none resize-none leading-relaxed"
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-6 border-t border-white/5">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-12 py-5 bg-luxury-gold text-stone-950 rounded-xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-2xl disabled:opacity-50"
                                        >
                                            {saving ? 'Synchronizing Archive...' : 'Commit Narrative Changes'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Page Headers Content Manager Tab */}
                        {activeTab === 'headers_mgr' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/5 backdrop-blur-glass border border-white/10 shadow-2xl rounded-3xl p-8 sm:p-12 max-w-5xl mx-auto"
                            >
                                <div className="mb-10">
                                    <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-3">Governance</p>
                                    <h2 className="text-3xl font-serif font-bold text-white mb-2">Page Architecture</h2>
                                    <p className="text-stone-500 text-sm italic">Define the thematic intros for your executive pages.</p>
                                </div>

                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        setSaving(true);
                                        try {
                                            // Since we use updateHeader, we don't have a single "updateAll" but the state is already syncing
                                            // We'll just trigger a save confirmation
                                            setMessage('Headers architecture committed.');
                                            setTimeout(() => setMessage(''), 3000);
                                        } catch (error) {
                                            console.error(error);
                                            setMessage('Commitment failed.');
                                        } finally {
                                            setSaving(false);
                                        }
                                    }}
                                    className="space-y-12"
                                >
                                    <div className="grid grid-cols-1 gap-12">
                                        {(Object.keys(pageHeaders) as Array<keyof HeadersData>).map((pageKey) => (
                                            <div key={pageKey} className="space-y-6 bg-black/20 p-8 rounded-2xl border border-white/5 relative overflow-hidden group">
                                                <div className="absolute top-0 left-0 w-1 h-full bg-luxury-gold opacity-30 group-hover:opacity-100 transition-opacity" />
                                                <div className="flex items-center justify-between mb-2">
                                                    <h3 className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-black">{String(pageKey).replace(/([A-Z])/g, ' $1').trim()} Page</h3>
                                                    <Heading className="w-4 h-4 text-stone-600" />
                                                </div>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    <div className="md:col-span-1 space-y-2">
                                                        <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Title</label>
                                                        <input
                                                            value={pageHeaders[pageKey].title}
                                                            onChange={e => updateHeader(pageKey, { ...pageHeaders[pageKey], title: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all font-serif font-bold"
                                                        />
                                                    </div>
                                                    <div className="md:col-span-2 space-y-2">
                                                        <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Subtitle / Descriptor</label>
                                                        <textarea
                                                            value={pageHeaders[pageKey].subtitle}
                                                            rows={2}
                                                            onChange={e => updateHeader(pageKey, { ...pageHeaders[pageKey], subtitle: e.target.value })}
                                                            className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-stone-300 focus:outline-none focus:border-luxury-gold/50 transition-all resize-none text-sm"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="flex justify-end pt-6 border-t border-white/5">
                                        <div className="flex items-center gap-4">
                                            <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold">Changes sync automatically</p>
                                            <button
                                                type="submit"
                                                className="px-10 py-4 bg-luxury-gold text-stone-950 rounded-xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-2xl"
                                            >
                                                Finalize Architecture
                                            </button>
                                        </div>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Client Testimonials Tab */}
                        {activeTab === 'testimonials' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-10"
                            >
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-2">Social Proof</p>
                                        <h2 className="text-3xl font-serif font-bold text-white">Client Testimonials</h2>
                                    </div>
                                    <button
                                        onClick={() => setEditingTestimonial({ name: '', role: '', content: '', rating: 5 })}
                                        className="flex items-center px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-luxury-gold hover:text-stone-950 transition-all uppercase tracking-widest text-[10px] font-bold group"
                                    >
                                        <Plus className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90" /> Register Feedback
                                    </button>
                                </div>

                                {editingTestimonial && (
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-white/5 backdrop-blur-glass border border-white/10 p-8 rounded-3xl shadow-2xl mb-12 relative overflow-hidden"
                                    >
                                        <div className="absolute top-0 left-0 w-2 h-full bg-luxury-gold" />
                                        <h3 className="text-xl font-serif font-bold text-white mb-8">Refine Testimonial</h3>
                                        <form onSubmit={handleTestimonialSubmit} className="space-y-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Client Name</label>
                                                    <input placeholder="Ex: Rahul Sharma" value={editingTestimonial.name || ''} onChange={e => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Client Persona/Role</label>
                                                    <input placeholder="Ex: Luxury Homeowner" value={editingTestimonial.role || ''} onChange={e => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all" required />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Quality Rating (1-5)</label>
                                                    <div className="flex gap-4">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <button
                                                                type="button"
                                                                key={star}
                                                                onClick={() => setEditingTestimonial({ ...editingTestimonial, rating: star })}
                                                                className={`w-10 h-10 rounded-lg flex items-center justify-center border transition-all ${editingTestimonial.rating >= star ? 'bg-luxury-gold/20 border-luxury-gold text-luxury-gold' : 'bg-white/5 border-white/10 text-stone-500'}`}
                                                            >
                                                                {star}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold">Feedback Narrative</label>
                                                <textarea placeholder="Share the client's experience..." rows={4} value={editingTestimonial.content || ''} onChange={e => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })} className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-luxury-gold/50 transition-all resize-none font-serif italic text-lg" required />
                                            </div>

                                            <div className="flex justify-end space-x-6 pt-4 border-t border-white/5">
                                                <button type="button" onClick={() => setEditingTestimonial(null)} className="px-6 py-3 text-stone-500 hover:text-white uppercase tracking-widest text-[10px] font-bold transition-colors">Discard</button>
                                                <button type="submit" className="px-10 py-4 bg-luxury-gold text-stone-950 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-xl">Commit Feedback</button>
                                            </div>
                                        </form>
                                    </motion.div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {testimonials.map(t => (
                                        <motion.div
                                            key={t.id}
                                            whileHover={{ scale: 1.02 }}
                                            className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-3xl p-8 relative group shadow-2xl"
                                        >
                                            <div className="absolute top-8 right-8 flex gap-1">
                                                {[...Array(5)].map((_, i) => (
                                                    <Star key={i} className={`w-3 h-3 ${i < (t.rating || 5) ? 'text-luxury-gold fill-luxury-gold' : 'text-stone-700'}`} />
                                                ))}
                                            </div>
                                            <div className="h-10 w-10 bg-white/5 rounded-full flex items-center justify-center text-luxury-gold mb-6 border border-white/10">
                                                <Star className="w-5 h-5 fill-luxury-gold" />
                                            </div>
                                            <p className="text-stone-100 font-serif italic leading-relaxed mb-8 text-lg">"{t.content}"</p>
                                            <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                                <div>
                                                    <p className="font-bold text-white text-sm">{t.name}</p>
                                                    <p className="text-[10px] text-stone-500 uppercase tracking-widest font-bold mt-1">{t.role}</p>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button onClick={() => setEditingTestimonial(t)} className="p-2 text-stone-500 hover:text-luxury-gold transition-colors"><Edit2 className="w-4 h-4" /></button>
                                                    <button onClick={() => deleteTestimonial(t.id)} className="p-2 text-stone-500 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Global Assets Tab */}
                        {activeTab === 'images' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/5 backdrop-blur-glass border border-white/10 shadow-2xl rounded-3xl p-8 sm:p-12 max-w-5xl mx-auto"
                            >
                                <div className="mb-10">
                                    <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-3">Global Media</p>
                                    <h2 className="text-3xl font-serif font-bold text-white mb-2">Cinematic Assets</h2>
                                    <p className="text-stone-500 text-sm italic">Update high-impact visual components across the platform.</p>
                                </div>

                                <div className="space-y-12">
                                    <div className="group bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-luxury-gold/30 transition-all">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-10 h-10 bg-luxury-gold/10 rounded-lg flex items-center justify-center text-luxury-gold">
                                                <ImageIcon className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-serif font-bold text-white text-lg">Home Cinematic Backdrop</h3>
                                        </div>
                                        <ImageUploader
                                            existingUrl={images.homeHero}
                                            onUpload={(url) => updateImage('homeHero', url)}
                                            path="homepage"
                                        />
                                    </div>

                                    <div className="group bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-luxury-gold/30 transition-all">
                                        <div className="flex items-center gap-4 mb-6">
                                            <div className="w-10 h-10 bg-luxury-gold/10 rounded-lg flex items-center justify-center text-luxury-gold">
                                                <ImageIcon className="w-5 h-5" />
                                            </div>
                                            <h3 className="font-serif font-bold text-white text-lg">Editorial Banner</h3>
                                        </div>
                                        <ImageUploader
                                            existingUrl={images.aboutBanner}
                                            onUpload={(url) => updateImage('aboutBanner', url)}
                                            path="banners"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Gallery Management Tab */}
                        {activeTab === 'gallery' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-10"
                            >
                                <div className="flex justify-between items-end mb-4">
                                    <div>
                                        <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-2">Visual Vault</p>
                                        <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-4">
                                            <ImageIcon className="w-8 h-8 text-luxury-gold" /> Gallery Archive
                                        </h2>
                                    </div>
                                    <button
                                        onClick={() => setEditingProject({}) as any}
                                        className="flex items-center px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl hover:bg-luxury-gold hover:text-stone-950 transition-all uppercase tracking-widest text-[10px] font-bold group"
                                    >
                                        <Plus className="w-4 h-4 mr-2 transition-transform group-hover:rotate-90" /> Add Masterpiece
                                    </button>
                                </div>

                                <div className="bg-white/5 backdrop-blur-glass border border-white/10 p-8 rounded-3xl shadow-2xl">
                                    <p className="text-stone-500 italic text-sm mb-8">Curate the visual narrative for the public showcase.</p>
                                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                                        {galleryItems.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                whileHover={{ scale: 1.05 }}
                                                className="aspect-square bg-stone-900 rounded-xl overflow-hidden relative group border border-white/5 shadow-xl"
                                            >
                                                {item.url ? (
                                                    <img src={item.url} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-stone-700 text-[10px]">No Content</div>
                                                )}
                                                <div className="absolute inset-0 bg-stone-950/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                                    <button onClick={() => deleteDoc(doc(db, 'gallery', item.id))} className="w-10 h-10 bg-red-600/20 text-red-400 border border-red-600/30 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                                {item.category && (
                                                    <div className="absolute bottom-2 left-2 px-2 py-0.5 bg-black/50 backdrop-blur-glass rounded text-[8px] uppercase tracking-widest text-white border border-white/10">
                                                        {item.category}
                                                    </div>
                                                )}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Social Connectivity Tab */}
                        {activeTab === 'social' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/5 backdrop-blur-glass border border-white/10 shadow-2xl rounded-3xl p-8 sm:p-12 max-w-5xl mx-auto"
                            >
                                <div className="mb-10">
                                    <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-3">Connectivity</p>
                                    <h2 className="text-3xl font-serif font-bold text-white mb-2">Social Ecosystem</h2>
                                    <p className="text-stone-500 text-sm italic">Manage your digital footprint across premium networks.</p>
                                </div>

                                <form onSubmit={handleSocialSubmit} className="space-y-10">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        {[
                                            { label: 'Facebook Horizon', key: 'facebook', icon: Share2 },
                                            { label: 'Twitter/X Executive', key: 'twitter', icon: Share2 },
                                            { label: 'Instagram Visuals', key: 'instagram', icon: Star },
                                            { label: 'LinkedIn Professional', key: 'linkedin', icon: Building },
                                            { label: 'WhatsApp Concierge', key: 'whatsapp', icon: Phone }
                                        ].map((item) => (
                                            <div key={item.key} className="space-y-2 group">
                                                <label className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1 group-hover:text-luxury-gold transition-colors">
                                                    <item.icon className="w-3 h-3" /> {item.label}
                                                </label>
                                                <input
                                                    placeholder="URL link..."
                                                    value={(socialData as any)[item.key] || ''}
                                                    onChange={e => setSocialData({ ...socialData, [item.key]: e.target.value })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-stone-300 focus:outline-none focus:border-luxury-gold/50 transition-all font-mono text-xs"
                                                />
                                                <LinkPreview url={(socialData as any)[item.key]} showPreview={false} />
                                            </div>
                                        ))}
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button type="submit" className="px-10 py-4 bg-luxury-gold text-stone-950 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-xl">Update Connectivity</button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Branding Controls Tab */}
                        {activeTab === 'branding' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/5 backdrop-blur-glass border border-white/10 shadow-2xl rounded-3xl p-8 sm:p-12 max-w-5xl mx-auto"
                            >
                                <div className="mb-10">
                                    <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-3">Identity</p>
                                    <h2 className="text-3xl font-serif font-bold text-white mb-2">Home Branding</h2>
                                    <p className="text-stone-500 text-sm italic">Sculpt the primary architectural narrative of your home page.</p>
                                </div>

                                {message && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold rounded-xl text-sm flex items-center">
                                        <div className="w-2 h-2 bg-luxury-gold rounded-full mr-3 animate-pulse" />
                                        {message}
                                    </motion.div>
                                )}

                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        setSaving(true);
                                        try {
                                            await setDoc(doc(db, 'settings', 'branding'), brandingData);
                                            setMessage('Executive branding synchronized.');
                                            setTimeout(() => setMessage(''), 3000);
                                        } catch (error) {
                                            console.error(error);
                                            setMessage('Synchronization failed.');
                                        } finally {
                                            setSaving(false);
                                        }
                                    }}
                                    className="space-y-10"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Hero Proclamation (Title)</label>
                                            <input
                                                type="text"
                                                value={brandingData.title}
                                                onChange={e => setBrandingData({ ...brandingData, title: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-white focus:outline-none focus:border-luxury-gold/50 transition-all font-serif text-2xl font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Emphasis Phrase</label>
                                            <input
                                                type="text"
                                                value={brandingData.emphasisText}
                                                onChange={e => setBrandingData({ ...brandingData, emphasisText: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-stone-300 focus:outline-none focus:border-luxury-gold/50 transition-all font-bold"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Premium Badge (Subtitle)</label>
                                            <input
                                                type="text"
                                                value={brandingData.subtitle}
                                                onChange={e => setBrandingData({ ...brandingData, subtitle: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-stone-300 focus:outline-none focus:border-luxury-gold/50 transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Call to Action Label</label>
                                            <input
                                                type="text"
                                                value={brandingData.buttonText}
                                                onChange={e => setBrandingData({ ...brandingData, buttonText: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-stone-300 focus:outline-none focus:border-luxury-gold/50 transition-all"
                                            />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Archival Narrative (Description)</label>
                                            <textarea
                                                rows={4}
                                                value={brandingData.description}
                                                onChange={e => setBrandingData({ ...brandingData, description: e.target.value })}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl p-5 text-stone-300 focus:outline-none focus:border-luxury-gold/50 transition-all resize-none shadow-inner"
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:col-span-2">
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Headline Color</label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="color"
                                                        value={brandingData.titleColor}
                                                        onChange={e => setBrandingData({ ...brandingData, titleColor: e.target.value })}
                                                        className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg cursor-pointer transition-all"
                                                    />
                                                    <span className="text-xs font-mono text-stone-400">{brandingData.titleColor}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Emphasis Color (Badge Text)</label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="color"
                                                        value={brandingData.emphasisColor}
                                                        onChange={e => setBrandingData({ ...brandingData, emphasisColor: e.target.value })}
                                                        className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg cursor-pointer transition-all"
                                                    />
                                                    <span className="text-xs font-mono text-stone-400">{brandingData.emphasisColor}</span>
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Subtext Color</label>
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="color"
                                                        value={brandingData.subtextColor}
                                                        onChange={e => setBrandingData({ ...brandingData, subtextColor: e.target.value })}
                                                        className="w-12 h-12 bg-white/5 border border-white/10 rounded-lg cursor-pointer transition-all"
                                                    />
                                                    <span className="text-xs font-mono text-stone-400">{brandingData.subtextColor}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="md:col-span-2 space-y-3">
                                            <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">Hero Signature Visual</label>
                                            <ImageUploader
                                                existingUrl={brandingData.imageUrl}
                                                onUpload={(url) => setBrandingData({ ...brandingData, imageUrl: url })}
                                                path="branding"
                                            />
                                        </div>
                                    </div>
                                    <div className="flex justify-end pt-4">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-10 py-4 bg-luxury-gold text-stone-950 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-white transition-all shadow-xl"
                                        >
                                            Synchronize Identity
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Design System (Appearance) Tab */}
                        {activeTab === 'appearance' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/5 backdrop-blur-glass border border-white/10 shadow-2xl rounded-3xl p-8 sm:p-12 max-w-5xl mx-auto"
                            >
                                <div className="mb-10">
                                    <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-3">Aesthetics</p>
                                    <h2 className="text-3xl font-serif font-bold text-white mb-2">Global Design System</h2>
                                    <p className="text-stone-500 text-sm italic">Orchestrate the visual DNA of the entire digital experience.</p>
                                </div>

                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        setSaving(true);
                                        try {
                                            await setDoc(doc(db, 'settings', 'appearance'), appearanceData);
                                            setMessage('Design system synchronized.');
                                            setTimeout(() => setMessage(''), 3000);
                                        } catch (error) {
                                            console.error(error);
                                            setMessage('Synchronization failed.');
                                        } finally {
                                            setSaving(false);
                                        }
                                    }}
                                    className="space-y-12"
                                >
                                    {/* Core Colors Group */}
                                    <div className="space-y-8">
                                        <h3 className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-black border-b border-white/5 pb-4">Core Palette</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {[
                                                { label: 'Gold Accent', key: 'goldAccent' },
                                                { label: 'Obsidian Black', key: 'obsidian' },
                                                { label: 'Charcoal Grey', key: 'charcoal' },
                                                { label: 'Bronze Material', key: 'bronze' },
                                                { label: 'Champagne Finish', key: 'champagne' },
                                                { label: 'Luxury White', key: 'luxuryWhite' }
                                            ].map((color) => (
                                                <div key={color.key} className="space-y-3">
                                                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">{color.label}</label>
                                                    <div className="flex items-center gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
                                                        <input
                                                            type="color"
                                                            value={(appearanceData as any)[color.key]}
                                                            onChange={e => setAppearanceData({ ...appearanceData, [color.key]: e.target.value })}
                                                            className="w-10 h-10 bg-transparent border-0 cursor-pointer rounded-lg"
                                                            title={color.label}
                                                        />
                                                        <span className="text-xs font-mono text-stone-400">{(appearanceData as any)[color.key]}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Ambient & Foundation Group */}
                                    <div className="space-y-8">
                                        <h3 className="text-xs uppercase tracking-[0.3em] text-luxury-gold font-black border-b border-white/5 pb-4">Ambient Stones & Foundations</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {[
                                                { label: 'Ivory Pearl (Body BG)', key: 'ivoryPearl' },
                                                { label: 'Premium Stone', key: 'premiumStone' },
                                                { label: 'Warm Beige', key: 'warmBeige' }
                                            ].map((color) => (
                                                <div key={color.key} className="space-y-3">
                                                    <label className="text-[10px] uppercase tracking-widest text-stone-500 font-bold ml-1">{color.label}</label>
                                                    <div className="flex items-center gap-4 bg-black/20 p-3 rounded-xl border border-white/5">
                                                        <input
                                                            type="color"
                                                            value={(appearanceData as any)[color.key]}
                                                            onChange={e => setAppearanceData({ ...appearanceData, [color.key]: e.target.value })}
                                                            className="w-10 h-10 bg-transparent border-0 cursor-pointer rounded-lg"
                                                            title={color.label}
                                                        />
                                                        <span className="text-xs font-mono text-stone-400">{(appearanceData as any)[color.key]}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-6 border-t border-white/5">
                                        <button
                                            type="submit"
                                            disabled={saving}
                                            className="px-12 py-5 bg-luxury-gold text-stone-950 rounded-xl font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-white transition-all shadow-2xl disabled:opacity-50"
                                        >
                                            {saving ? 'Synchronizing Design...' : 'Commit Design Changes'}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        )}

                        {/* Data Integrity Tab */}
                        {activeTab === 'data' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="space-y-10"
                            >
                                <div className="mb-6">
                                    <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-2">Systems</p>
                                    <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-4">
                                        <Database className="w-8 h-8 text-luxury-gold" /> Data Infrastructure
                                    </h2>
                                    <p className="text-stone-500 text-sm italic mt-2">Manage bulk operations and architectural stability.</p>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
                                    {[
                                        { type: 'projects', label: 'Portfolio Synchronization' },
                                        { type: 'testimonials', label: 'Feedback Archival' },
                                        { type: 'gallery', label: 'Media Vault Management' }
                                    ].map((sync) => (
                                        <div key={sync.type} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/[0.08] transition-all">
                                            <h3 className="text-lg font-serif font-bold text-white mb-6 border-b border-white/5 pb-4">{sync.label}</h3>
                                            <DataSeeder
                                                collectionType={sync.type as any}
                                                onDataChanged={() => {
                                                    setMessage(`${sync.label} updated.`);
                                                    setTimeout(() => setMessage(''), 3000);
                                                }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Access Control Tab */}
                        {activeTab === 'users' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/5 backdrop-blur-glass border border-white/10 shadow-2xl rounded-3xl p-8 lg:p-12"
                            >
                                <div className="flex items-center justify-between mb-12">
                                    <div>
                                        <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-3">Security</p>
                                        <h2 className="text-3xl font-serif font-bold text-white mb-2">System Access</h2>
                                        <p className="text-stone-500 text-sm italic">Define administrative privileges and security tiers.</p>
                                    </div>
                                    <div className="p-4 bg-luxury-gold/5 rounded-2xl border border-luxury-gold/10">
                                        <UsersIcon className="w-8 h-8 text-luxury-gold" />
                                    </div>
                                </div>

                                <div className="overflow-x-auto no-scrollbar">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="border-b border-white/5">
                                                <th className="pb-6 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Identity</th>
                                                <th className="pb-6 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Tier</th>
                                                <th className="pb-6 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Protocol</th>
                                                <th className="pb-6 text-right text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Authorization</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-white/5">
                                            {users.map((user) => (
                                                <tr key={user.email} className="group hover:bg-white/[0.02] transition-colors">
                                                    <td className="py-6 whitespace-nowrap">
                                                        <div className="flex items-center gap-4">
                                                            <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-luxury-gold border border-white/10 group-hover:bg-luxury-gold group-hover:text-stone-950 transition-all font-bold">
                                                                {user.email[0].toUpperCase()}
                                                            </div>
                                                            <span className="text-stone-200 font-medium group-hover:text-white transition-colors">{user.email}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-6 whitespace-nowrap">
                                                        <span className="text-[10px] uppercase tracking-widest font-black text-stone-400">{user.role}</span>
                                                    </td>
                                                    <td className="py-6 whitespace-nowrap">
                                                        {user.role === 'pending' ? (
                                                            <span className="px-3 py-1 text-[8px] font-black uppercase tracking-tighter rounded-full bg-yellow-500/10 text-yellow-500 border border-yellow-500/20">Pending Audit</span>
                                                        ) : (
                                                            <span className="px-3 py-1 text-[8px] font-black uppercase tracking-tighter rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Active Access</span>
                                                        )}
                                                    </td>
                                                    <td className="py-6 whitespace-nowrap text-right">
                                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                                            {user.role === 'pending' && (
                                                                <button onClick={() => approveUser(user.email)} className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all">
                                                                    <Check className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            {user.role === 'admin' && (
                                                                <button onClick={async () => { await setDoc(doc(db, 'admins', user.email), { role: 'pending' }, { merge: true }); }} className="w-8 h-8 rounded-lg bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 flex items-center justify-center hover:bg-yellow-500 hover:text-white transition-all">
                                                                    <X className="w-4 h-4" />
                                                                </button>
                                                            )}
                                                            <button onClick={() => deleteUser(user.email)} className="w-8 h-8 rounded-lg bg-red-600/10 text-red-400 border border-red-600/20 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}
                        {/* Executive Leads Tab */}
                        {activeTab === 'leads' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-10"
                            >
                                <div className="mb-6">
                                    <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-2">Acquisition</p>
                                    <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-4">
                                        <Inbox className="w-8 h-8 text-luxury-gold" /> Inquiry Intelligence
                                    </h2>
                                    <p className="text-stone-500 text-sm italic mt-2">Oversee client interactions and acquisition velocity.</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {leads.map((lead) => (
                                        <motion.div
                                            key={lead.id}
                                            whileHover={{ y: -5 }}
                                            className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-3xl p-8 relative group shadow-2xl overflow-hidden"
                                        >
                                            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                                                <a
                                                    href={`mailto:${lead.email}?subject=${encodeURIComponent(`Executive Response: ${lead.subject || 'Inquiry'}`)}&body=${encodeURIComponent(`Dear ${lead.name || ''},\n\nWe appreciate your interest in Sonu Enterprises. Regarding your vision for:\n\n"${lead.message || ''}"\n\nOur consultancy team is reviewing your requirements. We aim for architectural excellence in every detail.\n\nWarm regards,\nManagement Team\n${COMPANY_NAME}`)}`}
                                                    className="w-10 h-10 bg-white/10 backdrop-blur-glass rounded-full text-white flex items-center justify-center hover:bg-luxury-gold hover:text-stone-950 transition-all border border-white/10"
                                                    title="Formal Response"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                </a>
                                                <a
                                                    href={`https://wa.me/${(lead.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${lead.name || ''}, Sonu Enterprises here. We've received your inquiry regarding "${lead.subject || 'Architectural Design'}". How may we assist you today?`)}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="w-10 h-10 bg-emerald-500/20 backdrop-blur-glass rounded-full text-emerald-400 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all border border-emerald-500/30"
                                                    title="WhatsApp Concierge"
                                                >
                                                    <Phone className="w-4 h-4" />
                                                </a>
                                                <button onClick={() => deleteLead(lead.id)} className="w-10 h-10 bg-red-500/20 backdrop-blur-glass rounded-full text-red-400 flex items-center justify-center hover:bg-red-50 hover:text-white transition-all border border-red-500/30" title="Archive Inquiry">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <div className="mb-6">
                                                <h3 className="text-xl font-serif font-bold text-white mb-1">{lead.name}</h3>
                                                <p className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">{lead.subject || 'General Inquiry'}</p>
                                            </div>

                                            <div className="space-y-4 mb-8">
                                                <div className="flex items-center gap-3 text-stone-400">
                                                    <Mail className="w-3 h-3 text-luxury-gold/60" />
                                                    <span className="text-xs truncate">{lead.email}</span>
                                                </div>
                                                <div className="flex items-center gap-3 text-stone-400">
                                                    <Phone className="w-3 h-3 text-luxury-gold/60" />
                                                    <span className="text-xs">{lead.phone}</span>
                                                </div>
                                            </div>

                                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 mb-6">
                                                <p className="text-stone-300 text-sm italic font-serif leading-relaxed line-clamp-3">"{lead.message}"</p>
                                            </div>

                                            <div className="flex items-center justify-between mb-6">
                                                <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] ${(() => {
                                                    const s = lead.status || 'New';
                                                    if (s === 'Contacted') return 'bg-blue-500/10 text-blue-400 border border-blue-500/20';
                                                    if (s === 'Closed') return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20';
                                                    return 'bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20';
                                                })()}`}>
                                                    {lead.status || 'Archived'}
                                                </div>
                                                <select
                                                    defaultValue={lead.status || 'New'}
                                                    onChange={(e) => setLeadStatus(lead.id, e.target.value as any)}
                                                    className="bg-transparent text-[10px] uppercase tracking-widest font-bold text-stone-500 focus:outline-none cursor-pointer hover:text-luxury-gold transition-colors"
                                                >
                                                    <option value="New" className="bg-stone-900">Tier: New</option>
                                                    <option value="Contacted" className="bg-stone-900">Tier: Contacted</option>
                                                    <option value="Closed" className="bg-stone-900">Tier: Closed</option>
                                                </select>
                                            </div>

                                            <div className="space-y-3">
                                                <textarea
                                                    placeholder="Executive annotations..."
                                                    value={leadNotes[lead.id] ?? lead.notes ?? ''}
                                                    onChange={(e) => setLeadNotes({ ...leadNotes, [lead.id]: e.target.value })}
                                                    className="w-full bg-black/20 border border-white/5 rounded-xl p-4 text-xs text-stone-400 focus:outline-none focus:border-luxury-gold/30 transition-all resize-none h-24 shadow-inner"
                                                />
                                                <button
                                                    onClick={() => saveLeadNotes(lead.id, leadNotes[lead.id] ?? '')}
                                                    className="w-full py-3 bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.2em] font-bold text-stone-400 rounded-xl hover:bg-luxury-gold hover:text-stone-950 transition-all"
                                                >
                                                    Save Annotations
                                                </button>
                                            </div>

                                            {lead.createdAt && (
                                                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                                                    <span className="text-[9px] text-stone-600 uppercase tracking-widest font-bold">Logged: {new Date(lead.createdAt).toLocaleDateString()}</span>
                                                    <div className="w-1.5 h-1.5 rounded-full bg-luxury-gold shadow-[0_0_10px_rgba(212,175,55,0.5)] anim-pulse" />
                                                </div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Master Settings Tab */}
                        {activeTab === 'master' && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="space-y-10"
                            >
                                <div className="mb-6">
                                    <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-2">System Control</p>
                                    <h2 className="text-3xl font-serif font-bold text-white flex items-center gap-4">
                                        <Settings className="w-8 h-8 text-luxury-gold" /> Master Configuration
                                    </h2>
                                    <p className="text-stone-500 text-sm italic mt-2">Manage global ecosystem parameters and system health.</p>
                                </div>

                                <div className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-3xl p-10 shadow-2xl space-y-12">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-4">
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-gold">Platform Title</label>
                                            <input
                                                type="text"
                                                value={masterData.siteTitle}
                                                onChange={(e) => setMasterData({ ...masterData, siteTitle: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-stone-200 focus:outline-none focus:border-luxury-gold/50 transition-all font-serif"
                                            />
                                        </div>

                                        <div className="space-y-4">
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-gold">Global Theme Override</label>
                                            <select
                                                value={masterData.themeOverride}
                                                onChange={(e) => setMasterData({ ...masterData, themeOverride: e.target.value })}
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-stone-200 focus:outline-none focus:border-luxury-gold/50 transition-all"
                                            >
                                                <option value="auto" className="bg-stone-900">Adaptive (User Choice)</option>
                                                <option value="light" className="bg-stone-900">Enforced: Light</option>
                                                <option value="dark" className="bg-stone-900">Enforced: Dark</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="space-y-6 pt-6 border-t border-white/5">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-white font-bold">Stewardship Mode</h4>
                                                <p className="text-xs text-stone-500">Enable maintenance restrictions for public terminals.</p>
                                            </div>
                                            <button
                                                onClick={() => setMasterData({ ...masterData, maintenanceMode: !masterData.maintenanceMode })}
                                                className={`w-14 h-8 rounded-full transition-all duration-500 relative ${masterData.maintenanceMode ? 'bg-luxury-gold' : 'bg-stone-800'}`}
                                            >
                                                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-500 ${masterData.maintenanceMode ? 'right-1' : 'left-1'}`} />
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h4 className="text-white font-bold">Announcement Broadcast</h4>
                                                <p className="text-xs text-stone-500">Toggle site-wide notification bar visibility.</p>
                                            </div>
                                            <button
                                                onClick={() => setMasterData({ ...masterData, showAnnouncement: !masterData.showAnnouncement })}
                                                className={`w-14 h-8 rounded-full transition-all duration-500 relative ${masterData.showAnnouncement ? 'bg-luxury-gold' : 'bg-stone-800'}`}
                                            >
                                                <div className={`absolute top-1 w-6 h-6 rounded-full bg-white transition-all duration-500 ${masterData.showAnnouncement ? 'right-1' : 'left-1'}`} />
                                            </button>
                                        </div>
                                    </div>

                                    {masterData.showAnnouncement && (
                                        <motion.div
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="space-y-4 pt-6 border-t border-white/5"
                                        >
                                            <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-luxury-gold">Broadcast Message</label>
                                            <textarea
                                                value={masterData.announcement}
                                                onChange={(e) => setMasterData({ ...masterData, announcement: e.target.value })}
                                                placeholder="Enter the executive decree..."
                                                className="w-full bg-black/20 border border-white/10 rounded-xl px-5 py-4 text-stone-200 focus:outline-none focus:border-luxury-gold/50 transition-all h-24 resize-none"
                                            />
                                        </motion.div>
                                    )}

                                    <div className="pt-10 flex justify-end">
                                        <button
                                            onClick={async () => {
                                                setSaving(true);
                                                try {
                                                    await setDoc(doc(db, 'settings', 'master'), masterData);
                                                    setMessage('Master configurations synchronized.');
                                                    setTimeout(() => setMessage(''), 3000);
                                                } catch (e) {
                                                    setMessage('Synchronization failed.');
                                                } finally {
                                                    setSaving(false);
                                                }
                                            }}
                                            className="px-12 py-5 bg-luxury-gold text-stone-950 text-[10px] uppercase tracking-[0.3em] font-black rounded-xl hover:scale-105 transition-all shadow-2xl flex items-center gap-3 disabled:opacity-50"
                                            disabled={saving}
                                        >
                                            {saving ? (
                                                <div className="w-4 h-4 border-2 border-stone-900 border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4" />
                                            )}
                                            {saving ? 'Syncing...' : 'Apply Global Override'}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Design System Tab */}
                        {activeTab === 'appearance' && (
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="bg-white/5 backdrop-blur-glass border border-white/10 shadow-2xl rounded-3xl p-8 sm:p-12 max-w-5xl mx-auto"
                            >
                                <div className="mb-10">
                                    <p className="text-luxury-gold font-bold uppercase tracking-[0.4em] text-[10px] mb-3">System</p>
                                    <h2 className="text-3xl font-serif font-bold text-white mb-2">Design System</h2>
                                    <p className="text-stone-500 text-sm italic">Control the global visual language of your digital estate.</p>
                                </div>

                                {message && (
                                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-luxury-gold/10 border border-luxury-gold/20 text-luxury-gold rounded-xl text-sm flex items-center">
                                        <div className="w-2 h-2 bg-luxury-gold rounded-full mr-3 animate-pulse" />
                                        {message}
                                    </motion.div>
                                )}

                                <div className="space-y-12">
                                    {/* Color Palette */}
                                    <div className="p-8 bg-white/5 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                            <Palette className="w-5 h-5 text-luxury-gold" />
                                            <span>Color Palette</span>
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                            {/* Presets Helper */}
                                            {[
                                                { label: 'Gold Accent', key: 'goldAccent', presets: ['#D4AF37', '#C5A028', '#E5D1B8', '#8E6D45'] },
                                                { label: 'Charcoal Surface', key: 'charcoal', presets: ['#1A1A1A', '#2D2D2D', '#333333', '#1F1F1F'] },
                                                { label: 'Obsidian Base', key: 'obsidian', presets: ['#0A0A0A', '#000000', '#0F0F0F', '#050505'] },
                                                { label: 'Light Theme Base', key: 'luxuryWhite', presets: ['#FDFBFA', '#F5F5F4', '#F0F0F0', '#FFFFFF'] }
                                            ].map((group) => (
                                                <div key={group.key} className="group">
                                                    <label className="block text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500 mb-3">{group.label}</label>
                                                    <div className="flex items-center gap-4 mb-3">
                                                        <div className="relative overflow-hidden w-12 h-12 rounded-xl border border-white/10 shadow-lg">
                                                            <input
                                                                type="color"
                                                                value={(appearanceData as any)[group.key] || '#000000'}
                                                                onChange={e => setAppearanceData({ ...appearanceData, [group.key]: e.target.value })}
                                                                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[150%] h-[150%] p-0 border-0 cursor-pointer"
                                                            />
                                                        </div>
                                                        <input
                                                            type="text"
                                                            value={(appearanceData as any)[group.key] || '#000000'}
                                                            onChange={e => setAppearanceData({ ...appearanceData, [group.key]: e.target.value })}
                                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-white font-mono text-sm uppercase focus:border-luxury-gold outline-none transition-colors"
                                                        />
                                                    </div>
                                                    <div className="flex gap-2">
                                                        {group.presets.map(color => (
                                                            <button
                                                                key={color}
                                                                onClick={() => setAppearanceData({ ...appearanceData, [group.key]: color })}
                                                                className="w-6 h-6 rounded-full border border-white/10 hover:scale-110 transition-transform shadow-sm"
                                                                style={{ backgroundColor: color }}
                                                                title={color}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Glassmorphism Controls */}
                                    <div className="p-8 bg-white/5 rounded-2xl border border-white/5">
                                        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-3">
                                            <div className="w-5 h-5 rounded border border-white/20 bg-white/10 backdrop-blur-glass" />
                                            <span>Glassmorphism Engine</span>
                                        </h3>
                                        <div className="space-y-8">
                                            <div>
                                                <div className="flex justify-between mb-3">
                                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Blur Intensity</label>
                                                    <span className="text-xs font-mono text-luxury-gold">{(appearanceData as any).glassBlur ?? 8}px</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="40"
                                                    value={(appearanceData as any).glassBlur ?? 8}
                                                    onChange={(e) => setAppearanceData({ ...appearanceData, glassBlur: parseInt(e.target.value) } as any)}
                                                    className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-luxury-gold"
                                                />
                                            </div>
                                            <div>
                                                <div className="flex justify-between mb-3">
                                                    <label className="text-[10px] uppercase tracking-[0.2em] font-bold text-stone-500">Opacity Level</label>
                                                    <span className="text-xs font-mono text-luxury-gold">{Math.round(((appearanceData as any).glassOpacity ?? 0.03) * 100)}%</span>
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="100"
                                                    value={((appearanceData as any).glassOpacity ?? 0.03) * 100}
                                                    onChange={(e) => setAppearanceData({ ...appearanceData, glassOpacity: parseInt(e.target.value) / 100 } as any)}
                                                    className="w-full h-2 bg-stone-800 rounded-lg appearance-none cursor-pointer accent-luxury-gold"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-end pt-4">
                                        <button
                                            onClick={async () => {
                                                setSaving(true);
                                                try {
                                                    // Save to Firestore 'settings/ui' which UIProvider listens to
                                                    await setDoc(doc(db, 'settings', 'ui'), {
                                                        luxuryGold: appearanceData.goldAccent,
                                                        luxuryCharcoal: appearanceData.charcoal,
                                                        luxuryObsidian: appearanceData.obsidian,
                                                        luxuryWhite: appearanceData.luxuryWhite,
                                                        glassBlur: (appearanceData as any).glassBlur || 8,
                                                        glassOpacity: (appearanceData as any).glassOpacity || 0.03
                                                    }, { merge: true });

                                                    // Also save to 'appearance' for legacy compatibility or dashboard state
                                                    await setDoc(doc(db, 'settings', 'appearance'), appearanceData, { merge: true });

                                                    setMessage('Design system synchronized globally.');
                                                    setTimeout(() => setMessage(''), 3000);
                                                } catch (err) {
                                                    console.error(err);
                                                    setMessage('Failed to sync design system.');
                                                } finally {
                                                    setSaving(false);
                                                }
                                            }}
                                            disabled={saving}
                                            className="px-8 py-4 bg-luxury-gold text-stone-950 rounded-xl font-bold uppercase tracking-[0.2em] text-xs hover:bg-white hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] transition-all flex items-center group"
                                        >
                                            {saving ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin mr-3" />
                                                    Propagating...
                                                </>
                                            ) : (
                                                <>
                                                    <span className="mr-3">Publish System</span>
                                                    <Check className="w-4 h-4" />
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </section>
                </div>
            </main>
        </div>
    );
}
