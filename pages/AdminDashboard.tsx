import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, deleteDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Save, LogOut, Building, Phone, Mail, MapPin, Plus, Trash2, Edit2, Image as ImageIcon, LayoutDashboard, Settings, Folder, Star, Images, Inbox, Share2, ChevronLeft, ChevronRight, BarChart3 } from 'lucide-react';
import { CONTACT_INFO, COMPANY_NAME, SERVICES } from '../constants';
import { useProjects } from '../hooks/useProjects';
import { useTestimonials } from '../hooks/useTestimonials';
import { useImages } from '../hooks/useImages';
import { useGallery } from '../hooks/useGallery';
import { Project, Testimonial, ProjectCategory } from '../types';

import { useUsers } from '../hooks/useUsers';
import { Users as UsersIcon, Check, X } from 'lucide-react';

type Tab = 'overview' | 'general' | 'projects' | 'testimonials' | 'images' | 'gallery' | 'users' | 'leads' | 'social';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('overview');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const [isDark, setIsDark] = useState<boolean>(() => {
        const pref = localStorage.getItem('theme') || '';
        return pref === 'dark';
    });
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(() => {
        const pref = localStorage.getItem('adminSidebarCollapsed') || '';
        return pref === 'true';
    });

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
    const [leads, setLeads] = useState<any[]>([]);
    const [leadNotes, setLeadNotes] = useState<Record<string, string>>({});
    const [socialData, setSocialData] = useState<any>({ facebook: '', twitter: '', instagram: '', linkedin: '', whatsapp: '' });

    // Local state for forms
    const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
    const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);

    useEffect(() => {
        fetchGeneralData();
    }, []);

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

    useEffect(() => {
        const root = document.documentElement;
        if (isDark) {
            root.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            root.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);
    useEffect(() => {
        localStorage.setItem('adminSidebarCollapsed', String(isSidebarCollapsed));
    }, [isSidebarCollapsed]);

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsDark(d => !d)}
                                className="px-3 py-2 rounded border border-gray-300 dark:border-gray-600 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                                title="Toggle Dark Mode"
                            >
                                {isDark ? 'Light' : 'Dark'}
                            </button>
                            <button onClick={() => navigate('/')} className="text-sm text-blue-600 hover:underline">View Site</button>
                            <button
                                onClick={handleLogout}
                                className="flex items-center text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
                            >
                                <LogOut className="w-5 h-5 mr-2" />
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-6">
                    <aside className={`sticky top-16 md:top-20 z-30 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-all ${isSidebarCollapsed ? 'md:w-20' : 'md:w-64'} w-full md:block`}>
                        <div className="flex items-center justify-between p-3 border-b md:border-b-0 border-gray-200 dark:border-gray-700">
                            <span className={`text-sm font-semibold text-gray-700 dark:text-gray-200 transition-opacity ${isSidebarCollapsed ? 'md:opacity-0 md:pointer-events-none' : 'opacity-100'}`}>Navigation</span>
                            <button
                                onClick={() => setIsSidebarCollapsed(c => !c)}
                                className="hidden md:block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
                                title={isSidebarCollapsed ? 'Expand' : 'Collapse'}
                            >
                                {isSidebarCollapsed ? <ChevronRight className="w-4 h-4 text-gray-600" /> : <ChevronLeft className="w-4 h-4 text-gray-600" />}
                            </button>
                        </div>
                        <nav className="flex md:flex-col overflow-x-auto md:overflow-visible p-2 md:p-0 mt-0 md:mt-2 gap-2 md:gap-0 no-scrollbar">
                            {[
                                { key: 'overview', label: 'Overview', icon: LayoutDashboard },
                                { key: 'general', label: 'General', icon: Settings },
                                { key: 'projects', label: 'Projects', icon: Folder },
                                { key: 'testimonials', label: 'Testimonials', icon: Star },
                                { key: 'images', label: 'Images', icon: ImageIcon },
                                { key: 'gallery', label: 'Gallery', icon: Images },
                                { key: 'users', label: 'Users', icon: UsersIcon },
                                { key: 'leads', label: 'Leads', icon: Inbox },
                                { key: 'social', label: 'Social', icon: Share2 },
                            ].map((item: any) => {
                                const Icon = item.icon;
                                const active = activeTab === item.key;
                                return (
                                    <button
                                        key={item.key}
                                        onClick={() => setActiveTab(item.key)}
                                        className={`flex-shrink-0 md:w-full flex items-center gap-3 px-3 py-3 text-sm rounded-md transition-colors whitespace-nowrap ${active ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-200' : 'text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700'}`}
                                        title={item.label}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        <span className={`${isSidebarCollapsed ? 'md:hidden' : 'inline'}`}>{item.label}</span>
                                    </button>
                                );
                            })}
                        </nav>
                    </aside>
                    <section className="flex-1">

                        {/* General Info Tab */}
                        {activeTab === 'general' && (
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 max-w-4xl mx-auto">
                                <div className="mb-6">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Business Details</h2>
                                    <p className="text-sm text-gray-500">Manage your core contact info.</p>
                                </div>
                                {message && <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded">{message}</div>}

                                <form onSubmit={handleGeneralSubmit} className="space-y-6">
                                    {/* ... existing fields ... */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                                            <input type="text" value={generalData.name} onChange={e => setGeneralData({ ...generalData, name: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
                                            <input type="text" value={generalData.phone} onChange={e => setGeneralData({ ...generalData, phone: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                                            <input type="text" value={generalData.email} onChange={e => setGeneralData({ ...generalData, email: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Address</label>
                                            <textarea rows={3} value={generalData.address} onChange={e => setGeneralData({ ...generalData, address: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
                                        </div>
                                    </div>
                                    <div className="flex justify-end">
                                        <button type="submit" disabled={saving} className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                            <Save className="w-4 h-4 mr-2" /> Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm text-gray-500">Inquiries</p>
                                            <Inbox className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{leads.length}</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm text-gray-500">Projects</p>
                                            <Folder className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{projects.length}</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm text-gray-500">Gallery Images</p>
                                            <Images className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{galleryItems.length}</p>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-sm text-gray-500">Services</p>
                                            <Settings className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">{SERVICES.length}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-colors lg:col-span-2">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Inquiry Trends (7 days)</h3>
                                            <BarChart3 className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div className="h-32">
                                            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
                                                <polyline
                                                    points={inquiryTrend.points}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    className="text-blue-600"
                                                    strokeWidth="2"
                                                />
                                            </svg>
                                        </div>
                                        <div className="mt-2 flex justify-between text-xs text-gray-500">
                                            {inquiryTrend.labels.map((l, i) => <span key={i}>{l}</span>)}
                                        </div>
                                    </div>
                                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 border border-transparent hover:border-blue-200 dark:hover:border-blue-900 transition-colors">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Activity</h3>
                                        <div className="space-y-3">
                                            {leads.slice(0, 5).map(lead => (
                                                <div key={lead.id} className="flex items-start justify-between">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-900 dark:text-white">{lead.name || 'Unknown'}</p>
                                                        <p className="text-xs text-gray-500">{lead.subject || 'Inquiry'}</p>
                                                    </div>
                                                    <p className="text-xs text-gray-400">{lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : ''}</p>
                                                </div>
                                            ))}
                                            {leads.length === 0 && <p className="text-sm text-gray-500">No recent inquiries.</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Projects Tab */}
                        {activeTab === 'projects' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Projects</h2>
                                    <button
                                        onClick={() => setEditingProject({ title: '', location: '', category: ProjectCategory.RESIDENTIAL, description: '', image: '', gallery: [] })}
                                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Add Project
                                    </button>
                                </div>

                                {editingProject && (
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-blue-200 dark:border-blue-900 mb-8">
                                        <h3 className="text-lg font-bold mb-4 dark:text-white">{editingProject.id ? 'Edit Project' : 'New Project'}</h3>
                                        <form onSubmit={handleProjectSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input placeholder="Title" value={editingProject.title || ''} onChange={e => setEditingProject({ ...editingProject, title: e.target.value })} className="p-2 border rounded dark:bg-gray-700 dark:text-white" required />
                                                <input placeholder="Location" value={editingProject.location || ''} onChange={e => setEditingProject({ ...editingProject, location: e.target.value })} className="p-2 border rounded dark:bg-gray-700 dark:text-white" required />
                                                <select
                                                    value={editingProject.category || ProjectCategory.RESIDENTIAL}
                                                    onChange={e => setEditingProject({ ...editingProject, category: e.target.value as any })}
                                                    className="p-2 border rounded dark:bg-gray-700 dark:text-white"
                                                >
                                                    {Object.values(ProjectCategory).map(c => <option key={c} value={c}>{c}</option>)}
                                                </select>
                                                <input placeholder="Main Image URL" value={editingProject.image || ''} onChange={e => setEditingProject({ ...editingProject, image: e.target.value })} className="p-2 border rounded dark:bg-gray-700 dark:text-white" />
                                                <input placeholder="Completion Date" value={editingProject.completionDate || ''} onChange={e => setEditingProject({ ...editingProject, completionDate: e.target.value })} className="p-2 border rounded dark:bg-gray-700 dark:text-white" />
                                            </div>
                                            <textarea placeholder="Description" rows={3} value={editingProject.description || ''} onChange={e => setEditingProject({ ...editingProject, description: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" required />

                                            <div className="flex justify-end space-x-3">
                                                <button type="button" onClick={() => setEditingProject(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save Project</button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {projects.map(project => (
                                        <div key={project.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden group">
                                            <div className="h-48 bg-gray-200 relative">
                                                {project.image && <img src={project.image} alt={project.title} className="w-full h-full object-cover" />}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                                    <button onClick={() => setEditingProject(project)} className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50"><Edit2 className="w-4 h-4" /></button>
                                                    <button onClick={() => deleteProject(project.id)} className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-gray-900 dark:text-white">{project.title}</h3>
                                                <p className="text-sm text-gray-500">{project.category} • {project.location}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Testimonials Tab */}
                        {activeTab === 'testimonials' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Testimonials</h2>
                                    <button
                                        onClick={() => setEditingTestimonial({ name: '', role: '', content: '', rating: 5 })}
                                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Add Testimonial
                                    </button>
                                </div>

                                {editingTestimonial && (
                                    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-blue-200 dark:border-blue-900 mb-8">
                                        <h3 className="text-lg font-bold mb-4 dark:text-white">{editingTestimonial.id ? 'Edit Testimonial' : 'New Testimonial'}</h3>
                                        <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input placeholder="Client Name" value={editingTestimonial.name || ''} onChange={e => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })} className="p-2 border rounded dark:bg-gray-700 dark:text-white" required />
                                                <input placeholder="Role (e.g. Home Owner)" value={editingTestimonial.role || ''} onChange={e => setEditingTestimonial({ ...editingTestimonial, role: e.target.value })} className="p-2 border rounded dark:bg-gray-700 dark:text-white" required />
                                                <input type="number" min="1" max="5" placeholder="Rating (1-5)" value={editingTestimonial.rating || 5} onChange={e => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value) })} className="p-2 border rounded dark:bg-gray-700 dark:text-white" required />
                                            </div>
                                            <textarea placeholder="Feedback Content" rows={3} value={editingTestimonial.content || ''} onChange={e => setEditingTestimonial({ ...editingTestimonial, content: e.target.value })} className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white" required />

                                            <div className="flex justify-end space-x-3">
                                                <button type="button" onClick={() => setEditingTestimonial(null)} className="px-4 py-2 text-gray-600 hover:text-gray-800">Cancel</button>
                                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Save</button>
                                            </div>
                                        </form>
                                    </div>
                                )}

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {testimonials.map(t => (
                                        <div key={t.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 relative group">
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                                                <button onClick={() => setEditingTestimonial(t)} className="p-1 text-blue-600"><Edit2 className="w-4 h-4" /></button>
                                                <button onClick={() => deleteTestimonial(t.id)} className="p-1 text-red-600"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                            <div className="flex text-yellow-500 mb-2">
                                                {[...Array(t.rating)].map((_, i) => <span key={i}>★</span>)}
                                            </div>
                                            <p className="text-gray-600 dark:text-gray-300 mb-4 italic">"{t.content}"</p>
                                            <div>
                                                <p className="font-bold text-gray-900 dark:text-white">{t.name}</p>
                                                <p className="text-sm text-gray-500">{t.role}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Global Images Tab */}
                        {activeTab === 'images' && (
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 max-w-4xl mx-auto">
                                <div className="mb-6">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Global Images</h2>
                                    <p className="text-sm text-gray-500">Update key images across the site by providing direct URLs.</p>
                                </div>

                                <div className="space-y-6">
                                    <div className="border p-4 rounded-lg">
                                        <h3 className="font-medium mb-2 dark:text-white">Home Page Hero Background</h3>
                                        <div className="flex gap-4 items-start">
                                            <div className="w-32 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                                <img src={images.homeHero} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                            <input
                                                type="text"
                                                value={images.homeHero || ''}
                                                onChange={(e) => updateImage('homeHero', e.target.value)}
                                                className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
                                                placeholder="Enter image URL..."
                                            />
                                        </div>
                                    </div>

                                    <div className="border p-4 rounded-lg">
                                        <h3 className="font-medium mb-2 dark:text-white">About Us/Generic Banner</h3>
                                        <div className="flex gap-4 items-start">
                                            <div className="w-32 h-20 bg-gray-200 rounded overflow-hidden flex-shrink-0">
                                                <img src={images.aboutBanner} alt="Preview" className="w-full h-full object-cover" />
                                            </div>
                                            <input
                                                type="text"
                                                value={images.aboutBanner || ''}
                                                onChange={(e) => updateImage('aboutBanner', e.target.value)}
                                                className="flex-1 p-2 border rounded dark:bg-gray-700 dark:text-white"
                                                placeholder="Enter image URL..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'gallery' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center"><ImageIcon className="w-5 h-5 mr-2" /> Gallery</h2>
                                    <button
                                        onClick={() => setEditingProject({}) as any}
                                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                    >
                                        <Plus className="w-4 h-4 mr-2" /> Add Image
                                    </button>
                                </div>
                                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-blue-200 dark:border-blue-900">
                                    <form
                                        onSubmit={async (e) => {
                                            e.preventDefault();
                                            const form = e.target as HTMLFormElement;
                                            const url = (form.elements.namedItem('url') as HTMLInputElement).value;
                                            const title = (form.elements.namedItem('title') as HTMLInputElement).value;
                                            const category = (form.elements.namedItem('category') as HTMLInputElement).value;
                                            if (!url) return;
                                            await addGalleryItem({ url, title, category });
                                            form.reset();
                                        }}
                                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                                    >
                                        <input name="url" placeholder="Image URL" className="p-2 border rounded dark:bg-gray-700 dark:text-white md:col-span-2" required />
                                        <input name="title" placeholder="Title (optional)" className="p-2 border rounded dark:bg-gray-700 dark:text-white" />
                                        <input name="category" placeholder="Category (optional)" className="p-2 border rounded dark:bg-gray-700 dark:text-white md:col-span-3" />
                                        <div className="md:col-span-3 flex justify-end">
                                            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Add</button>
                                        </div>
                                    </form>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {galleryItems.map(item => (
                                        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden group">
                                            <div className="h-48 bg-gray-200 relative">
                                                {item.url && <img src={item.url} alt={item.title || 'Gallery'} className="w-full h-full object-cover" />}
                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                                                    <button onClick={() => deleteGalleryItem(item.id)} className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></button>
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                {item.title && <h3 className="font-bold text-gray-900 dark:text-white">{item.title}</h3>}
                                                <p className="text-sm text-gray-500">{item.category}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Social Links Tab */}
                        {activeTab === 'social' && (
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 max-w-4xl mx-auto">
                                <div className="mb-6">
                                    <h2 className="text-lg font-medium text-gray-900 dark:text-white">Social Links</h2>
                                    <p className="text-sm text-gray-500">Manage your social media and WhatsApp links.</p>
                                </div>
                                <form
                                    onSubmit={async (e) => {
                                        e.preventDefault();
                                        await setDoc(doc(db, 'settings', 'social'), socialData, { merge: true });
                                    }}
                                    className="space-y-4"
                                >
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <input placeholder="Facebook URL" value={socialData.facebook || ''} onChange={e => setSocialData({ ...socialData, facebook: e.target.value })} className="p-2 border rounded dark:bg-gray-700 dark:text-white" />
                                        <input placeholder="Twitter URL" value={socialData.twitter || ''} onChange={e => setSocialData({ ...socialData, twitter: e.target.value })} className="p-2 border rounded dark:bg-gray-700 dark:text-white" />
                                        <input placeholder="Instagram URL" value={socialData.instagram || ''} onChange={e => setSocialData({ ...socialData, instagram: e.target.value })} className="p-2 border rounded dark:bg-gray-700 dark:text-white" />
                                        <input placeholder="LinkedIn URL" value={socialData.linkedin || ''} onChange={e => setSocialData({ ...socialData, linkedin: e.target.value })} className="p-2 border rounded dark:bg-gray-700 dark:text-white" />
                                        <input placeholder="WhatsApp URL (wa.me link)" value={socialData.whatsapp || ''} onChange={e => setSocialData({ ...socialData, whatsapp: e.target.value })} className="p-2 border rounded dark:bg-gray-700 dark:text-white" />
                                    </div>
                                    <div className="flex justify-end">
                                        <button type="submit" className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                                            <Save className="w-4 h-4 mr-2" /> Save
                                        </button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Users Tab */}
                        {activeTab === 'users' && (
                            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
                                    <UsersIcon className="w-5 h-5 mr-2" /> User Management
                                </h3>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                        <thead className="bg-gray-50 dark:bg-gray-700">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                            {users.map((user) => (
                                                <tr key={user.email}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">{user.email}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 capitalize">{user.role}</td>
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        {user.role === 'pending' ? (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                                                        ) : (
                                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                        {user.role === 'pending' && (
                                                            <button onClick={() => approveUser(user.email)} className="text-green-600 hover:text-green-900 mr-4" title="Approve">
                                                                <Check className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                        {user.role === 'admin' && (
                                                            <button onClick={async () => { await setDoc(doc(db, 'admins', user.email), { role: 'pending' }, { merge: true }); }} className="text-yellow-600 hover:text-yellow-900 mr-4" title="Revoke Admin">
                                                                <X className="w-5 h-5" />
                                                            </button>
                                                        )}
                                                        <button onClick={() => deleteUser(user.email)} className="text-red-600 hover:text-red-900" title="Remove">
                                                            <Trash2 className="w-5 h-5" />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        {/* Leads Tab */}
                        {activeTab === 'leads' && (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">Leads</h2>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {leads.map((lead) => (
                                        <div key={lead.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 relative group">
                                            <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-2">
                                                <a
                                                    href={`mailto:${lead.email}?subject=${encodeURIComponent(`Re: ${lead.subject || 'Inquiry'}`)}&body=${encodeURIComponent(`Hi ${lead.name || ''},\n\nThanks for reaching out. Regarding your project:\n\n"${lead.message || ''}"\n\nWe would be happy to provide a quotation and next steps.\n\nBest regards,\n${COMPANY_NAME}`)}`}
                                                    className="p-2 bg-white rounded-full text-blue-600 hover:bg-blue-50"
                                                    title="Reply via Email"
                                                >
                                                    <Mail className="w-4 h-4" />
                                                </a>
                                                <a
                                                    href={`https://wa.me/${(lead.phone || '').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${lead.name || ''}, regarding your enquiry "${lead.subject || 'Project'}":\n\n${lead.message || ''}\n\n— ${COMPANY_NAME}`)}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    className="p-2 bg-white rounded-full text-green-600 hover:bg-green-50"
                                                    title="Reply via WhatsApp"
                                                >
                                                    <Phone className="w-4 h-4" />
                                                </a>
                                                <button onClick={() => deleteLead(lead.id)} className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50" title="Delete Lead"><Trash2 className="w-4 h-4" /></button>
                                            </div>
                                            <div className="space-y-1">
                                                <p className="font-bold text-gray-900 dark:text-white">{lead.name}</p>
                                                <p className="text-sm text-gray-500">{lead.email}</p>
                                                <p className="text-sm text-gray-500">{lead.phone}</p>
                                                <p className="text-sm text-gray-700 dark:text-gray-300">{lead.subject}</p>
                                            </div>
                                            <div className="mt-3">
                                                <p className="text-gray-600 dark:text-gray-300 italic">{lead.message}</p>
                                            </div>
                                            <div className="mt-4 flex items-center justify-between">
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs ${(() => {
                                                        const s = lead.status || 'New';
                                                        if (s === 'Contacted') return 'bg-blue-100 text-blue-800';
                                                        if (s === 'Closed') return 'bg-green-100 text-green-800';
                                                        return 'bg-yellow-100 text-yellow-800';
                                                    })()}`}>
                                                        {lead.status || 'New'}
                                                    </span>
                                                </div>
                                                <select
                                                    defaultValue={lead.status || 'New'}
                                                    onChange={(e) => setLeadStatus(lead.id, e.target.value as 'New' | 'Contacted' | 'Closed')}
                                                    className="p-2 border rounded text-sm dark:bg-gray-700 dark:text-white"
                                                >
                                                    <option value="New">New</option>
                                                    <option value="Contacted">Contacted</option>
                                                    <option value="Closed">Closed</option>
                                                </select>
                                            </div>
                                            <div className="mt-4">
                                                <textarea
                                                    placeholder="Notes"
                                                    value={leadNotes[lead.id] ?? lead.notes ?? ''}
                                                    onChange={(e) => setLeadNotes({ ...leadNotes, [lead.id]: e.target.value })}
                                                    className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
                                                    rows={3}
                                                />
                                                <div className="flex justify-end mt-2">
                                                    <button
                                                        onClick={() => saveLeadNotes(lead.id, leadNotes[lead.id] ?? '')}
                                                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                                    >
                                                        Save Notes
                                                    </button>
                                                </div>
                                            </div>
                                            {lead.createdAt && (
                                                <p className="mt-4 text-xs text-gray-400">Received: {new Date(lead.createdAt).toLocaleString()}</p>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                    </section>
                </div>
            </main>
        </div>
    );
}
