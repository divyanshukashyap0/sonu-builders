import React, { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot, collection, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { useNavigate } from 'react-router-dom';
import { Save, LogOut, Building, Phone, Mail, MapPin, Plus, Trash2, Edit2, Image as ImageIcon } from 'lucide-react';
import { CONTACT_INFO, COMPANY_NAME } from '../constants';
import { useProjects } from '../hooks/useProjects';
import { useTestimonials } from '../hooks/useTestimonials';
import { useImages } from '../hooks/useImages';
import { Project, Testimonial, ProjectCategory } from '../types';

import { useUsers } from '../hooks/useUsers';
import { Users as UsersIcon, Check, X } from 'lucide-react';

type Tab = 'general' | 'projects' | 'testimonials' | 'images' | 'users' | 'leads' | 'social';

export default function AdminDashboard() {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<Tab>('general');
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
    const { users, approveUser, deleteUser } = useUsers();
    const [leads, setLeads] = useState<any[]>([]);
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

    if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20">
            <nav className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">
                        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
                        <div className="flex items-center space-x-4">
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
                    {/* Tabs */}
                    <div className="flex space-x-8 overflow-x-auto">
                        {(['general', 'projects', 'testimonials', 'images', 'users', 'leads', 'social'] as Tab[]).map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-3 px-1 border-b-2 text-sm font-medium capitalize whitespace-nowrap ${activeTab === tab
                                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            </nav>

            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

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
                                    {lead.createdAt && (
                                        <p className="mt-4 text-xs text-gray-400">Received: {new Date(lead.createdAt).toLocaleString()}</p>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}
