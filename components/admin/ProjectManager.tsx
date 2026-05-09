import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Trash2, Edit2, Search, Filter, 
    ChevronRight, ChevronLeft, MapPin, 
    Calendar, Maximize, Sparkles, Image as ImageIcon, 
    CheckCircle2, Trash, Save, Layout, Smartphone, Monitor,
    ExternalLink, Copy, TrendingUp, Award, Home, Eye, MessageCircle,
    Repeat, Hammer, Lightbulb, Palette, FileText, Target, 
    Zap, Rocket, Share2, Globe, MousePointer2, Library
} from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { Project, ProjectCategory } from '../../types';
import MediaRenderer from '../ui/MediaRenderer';
import CloudinaryImageInput from './media/CloudinaryImageInput';
import MediaLibraryModal from './media/MediaLibraryModal';
import { db } from '../../lib/firebase';
import { doc, updateDoc, increment } from 'firebase/firestore';

const PROJECT_CATEGORIES = [
    'Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'TV Unit', 'Wardrobe', 
    'False Ceiling', 'Balcony', 'Dining Room', 'Pooja Room', 'Home Office', 
    'Full Home Interior', 'Commercial Interior', 'Office Interior'
];

const PROJECT_TYPES = ['Residential', 'Commercial', 'Luxury Villa', 'Apartment', 'Office', 'Retail Space', 'Restaurant'];
const PROJECT_STATUSES = ['Ongoing', 'Completed', 'Upcoming', 'Featured'];
const DESIGN_STYLES = ['Modern Luxury', 'Minimal', 'Contemporary', 'Scandinavian', 'Industrial', 'Neo-Classical'];
const MATERIAL_OPTIONS = ['Marble', 'Veneer', 'Granite', 'Glass', 'Wooden Flooring', 'Acrylic', 'SPC Flooring', 'Italian Marble', 'PU Polish'];
const LIGHTING_OPTIONS = ['Ambient', 'Cove', 'Chandelier', 'Spotlights', 'Profile Lighting', 'Magnetic Tracks'];

const ProjectManager: React.FC = () => {
    const { projects, addProject, updateProject, deleteProject, duplicateProject } = useProjects();
    const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
    const [currentStep, setCurrentStep] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
    const [isSaving, setIsSaving] = useState(false);
    const [showGalleryPicker, setShowGalleryPicker] = useState(false);

    const steps = [
        { id: 1, label: 'Identity', icon: FileText },
        { id: 2, label: 'Geography', icon: MapPin },
        { id: 3, label: 'Media', icon: ImageIcon },
        { id: 4, label: 'Architecture', icon: Hammer },
        { id: 5, label: 'Narrative', icon: Target },
        { id: 6, label: 'SEO & CTA', icon: Rocket }
    ];

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    };

    const handleTitleChange = (title: string) => {
        const slug = generateSlug(title);
        setEditingProject(prev => ({ ...prev, title, slug }));
    };

    const handleSave = async () => {
        if (!editingProject?.title) return;
        setIsSaving(true);
        try {
            if (editingProject.id) {
                await updateProject(editingProject.id, editingProject);
            } else {
                await addProject(editingProject as any);
            }
            setEditingProject(null);
            setCurrentStep(1);
        } catch (error) {
            console.error("Save failed:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
        return matchesSearch && matchesCat;
    });

    if (editingProject) {
        return (
            <div className="flex flex-col lg:flex-row gap-8 min-h-[85vh]">
                {/* Multi-Step Editor */}
                <div className="flex-1 bg-white/5 backdrop-blur-glass border border-white/10 rounded-[2.5rem] p-10 shadow-3xl flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <p className="text-luxury-gold font-black uppercase tracking-[0.4em] text-[10px] mb-2">Project Orchestrator</p>
                            <h2 className="text-3xl font-serif font-bold text-white tracking-tight">
                                {editingProject.id ? 'Refine Masterpiece' : 'Initialize Concept'}
                            </h2>
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setEditingProject(null)} className="px-6 py-3 text-stone-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-all">Discard</button>
                            <button 
                                onClick={handleSave} 
                                disabled={isSaving}
                                className="px-8 py-3 bg-luxury-gold text-stone-950 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-glow-gold hover:scale-105 active:scale-95 transition-all"
                            >
                                {isSaving ? 'Synchronizing...' : 'Publish Project'}
                            </button>
                        </div>
                    </div>

                    {/* Step Indicator */}
                    <div className="flex items-center justify-between mb-12 px-4">
                        {steps.map((step, idx) => {
                            const Icon = step.icon;
                            const isActive = currentStep === step.id;
                            const isCompleted = currentStep > step.id;
                            return (
                                <React.Fragment key={step.id}>
                                    <button 
                                        onClick={() => setCurrentStep(step.id)}
                                        className="flex flex-col items-center gap-3 group relative z-10"
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                                            isActive ? 'bg-luxury-gold border-luxury-gold text-stone-950 shadow-glow-gold scale-110' : 
                                            isCompleted ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-white/5 border-white/10 text-stone-500'
                                        }`}>
                                            <Icon size={20} />
                                        </div>
                                        <span className={`text-[8px] font-black uppercase tracking-widest transition-all ${isActive ? 'text-luxury-gold' : 'text-stone-600'}`}>{step.label}</span>
                                    </button>
                                    {idx < steps.length - 1 && (
                                        <div className={`flex-1 h-[2px] mx-4 -mt-6 transition-all duration-700 ${currentStep > step.id ? 'bg-green-500' : 'bg-white/5'}`} />
                                    )}
                                </React.Fragment>
                            );
                        })}
                    </div>

                    {/* Step Content */}
                    <div className="flex-1 overflow-y-auto no-scrollbar pr-4">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={currentStep}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-10"
                            >
                                {currentStep === 1 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Project Title</label>
                                            <input value={editingProject.title || ''} onChange={e => handleTitleChange(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-luxury-gold/50 transition-all font-serif text-xl" placeholder="The Glass Pavilion" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">SEO Slug (Auto)</label>
                                            <input value={editingProject.slug || ''} readOnly className="w-full bg-white/2 border border-white/5 rounded-2xl p-5 text-stone-500 focus:outline-none cursor-not-allowed italic" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Domain Classification</label>
                                            <select value={editingProject.category || ''} onChange={e => setEditingProject({...editingProject, category: e.target.value as any})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-luxury-gold/50 transition-all appearance-none">
                                                <option value="" className="bg-stone-900">Select Category</option>
                                                {PROJECT_CATEGORIES.map(c => <option key={c} value={c} className="bg-stone-900">{c}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Architectural Type</label>
                                            <select value={editingProject.type || ''} onChange={e => setEditingProject({...editingProject, type: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-luxury-gold/50 transition-all appearance-none">
                                                <option value="" className="bg-stone-900">Select Type</option>
                                                {PROJECT_TYPES.map(t => <option key={t} value={t} className="bg-stone-900">{t}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Current Status</label>
                                            <select value={editingProject.status || ''} onChange={e => setEditingProject({...editingProject, status: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-luxury-gold/50 transition-all appearance-none">
                                                {PROJECT_STATUSES.map(s => <option key={s} value={s} className="bg-stone-900">{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-8 p-5 bg-white/2 rounded-2xl border border-white/5">
                                            <div className="flex items-center gap-3">
                                                <input type="checkbox" checked={editingProject.featured || false} onChange={e => setEditingProject({...editingProject, featured: e.target.checked})} className="w-5 h-5 accent-luxury-gold" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Featured</span>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <input type="checkbox" checked={editingProject.showOnHome || false} onChange={e => setEditingProject({...editingProject, showOnHome: e.target.checked})} className="w-5 h-5 accent-luxury-gold" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-white">Homepage</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 2 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">City</label>
                                            <input value={editingProject.city || ''} onChange={e => setEditingProject({...editingProject, city: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-luxury-gold/50 transition-all" placeholder="South Mumbai" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">State</label>
                                            <input value={editingProject.state || ''} onChange={e => setEditingProject({...editingProject, state: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-luxury-gold/50 transition-all" placeholder="Maharashtra" />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Full Address (Internal Reference)</label>
                                            <textarea value={editingProject.location || ''} onChange={e => setEditingProject({...editingProject, location: e.target.value})} rows={2} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none focus:border-luxury-gold/50 transition-all resize-none" placeholder="12th Floor, Omkar 1973, Worli..." />
                                        </div>
                                        <div className="md:col-span-2 space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Google Maps Intelligence Link</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 text-luxury-gold" size={18} />
                                                <input value={editingProject.googleMapsLink || ''} onChange={e => setEditingProject({...editingProject, googleMapsLink: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 pl-14 text-white focus:outline-none focus:border-luxury-gold/50 transition-all" placeholder="Paste Embed URL" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 3 && (
                                    <div className="space-y-12">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                            <div className="space-y-4">
                                                <CloudinaryImageInput
                                                    label="Cinematic Hero Banner"
                                                    value={editingProject.heroImage || ''}
                                                    onChange={url => setEditingProject({...editingProject, heroImage: url})}
                                                    folder="projects"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <CloudinaryImageInput
                                                    label="Discovery Thumbnail"
                                                    value={editingProject.image || ''}
                                                    onChange={url => setEditingProject({...editingProject, image: url})}
                                                    folder="projects"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-6">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-luxury-gold ml-1">Visual Exhibition Gallery</label>
                                                <button 
                                                    onClick={() => setShowGalleryPicker(true)}
                                                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-luxury-gold text-[10px] font-black uppercase tracking-widest hover:bg-luxury-gold hover:text-stone-950 transition-all"
                                                >
                                                    <Library size={14} /> Browse Library
                                                </button>
                                            </div>
                                            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                                {(editingProject.gallery || []).map((url, idx) => (
                                                    <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group">
                                                        <img src={url} className="w-full h-full object-cover" alt="" />
                                                        <button 
                                                            onClick={() => setEditingProject({...editingProject, gallery: editingProject.gallery?.filter((_, i) => i !== idx)})}
                                                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 transition-all backdrop-blur-sm"
                                                        >
                                                            <Trash size={20} />
                                                        </button>
                                                    </div>
                                                ))}
                                                <div className="aspect-square">
                                                    <CloudinaryImageInput 
                                                        label="Add to Gallery"
                                                        value=""
                                                        onChange={url => setEditingProject({...editingProject, gallery: [...(editingProject.gallery || []), url]})}
                                                        folder="projects"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-white/5">
                                            <div className="space-y-4">
                                                <CloudinaryImageInput 
                                                    label="Transformation: Before"
                                                    value={editingProject.beforeImages?.[0] || ''}
                                                    onChange={url => setEditingProject({...editingProject, beforeImages: [url]})}
                                                    folder="projects"
                                                />
                                            </div>
                                            <div className="space-y-4">
                                                <CloudinaryImageInput 
                                                    label="Transformation: After"
                                                    value={editingProject.afterImages?.[0] || ''}
                                                    onChange={url => setEditingProject({...editingProject, afterImages: [url]})}
                                                    folder="projects"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 4 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-6">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold mb-4 flex items-center gap-2"><Hammer size={12} /> Interior Specifications</h4>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Design Style</label>
                                                <select value={editingProject.style?.[0] || ''} onChange={e => setEditingProject({...editingProject, style: [e.target.value]})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none appearance-none">
                                                    {DESIGN_STYLES.map(s => <option key={s} value={s} className="bg-stone-900">{s}</option>)}
                                                </select>
                                            </div>
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Premium Materials</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {MATERIAL_OPTIONS.map(m => (
                                                        <button 
                                                            key={m}
                                                            onClick={() => {
                                                                const current = editingProject.materialsUsed || [];
                                                                const updated = current.includes(m) ? current.filter(x => x !== m) : [...current, m];
                                                                setEditingProject({...editingProject, materialsUsed: updated});
                                                            }}
                                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                                (editingProject.materialsUsed || []).includes(m) ? 'bg-luxury-gold text-stone-950' : 'bg-white/5 text-stone-500 hover:text-white border border-white/5'
                                                            }`}
                                                        >
                                                            {m}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-8">
                                            <div className="space-y-4">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Lighting Strategy</label>
                                                <div className="flex flex-wrap gap-2">
                                                    {LIGHTING_OPTIONS.map(l => (
                                                        <button 
                                                            key={l}
                                                            onClick={() => {
                                                                const current = editingProject.lightingType || [];
                                                                const updated = current.includes(l) ? current.filter(x => x !== l) : [...current, l];
                                                                setEditingProject({...editingProject, lightingType: updated});
                                                            }}
                                                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                                (editingProject.lightingType || []).includes(l) ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 'bg-white/5 text-stone-500 border border-white/5'
                                                            }`}
                                                        >
                                                            {l}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Area (SQ.FT)</label>
                                                    <input value={editingProject.area || ''} onChange={e => setEditingProject({...editingProject, area: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none" placeholder="2,500" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Duration</label>
                                                    <input value={editingProject.duration || ''} onChange={e => setEditingProject({...editingProject, duration: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none" placeholder="90 Days" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 5 && (
                                    <div className="space-y-10">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Executive Summary (Short)</label>
                                            <input value={editingProject.description || ''} onChange={e => setEditingProject({...editingProject, description: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none" placeholder="A brief hook for project cards..." />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Client Vision & Requirements</label>
                                                <textarea value={editingProject.problem || ''} onChange={e => setEditingProject({...editingProject, problem: e.target.value})} rows={5} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none resize-none" placeholder="What was the client looking for?" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Architectural Solution</label>
                                                <textarea value={editingProject.designGoal || ''} onChange={e => setEditingProject({...editingProject, designGoal: e.target.value})} rows={5} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none resize-none" placeholder="How did we solve the design challenges?" />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Signature Features (List)</label>
                                            <div className="space-y-3">
                                                {(editingProject.keyFeatures || []).map((f, i) => (
                                                    <div key={i} className="flex gap-3">
                                                        <input value={f} onChange={e => {
                                                            const updated = [...(editingProject.keyFeatures || [])];
                                                            updated[i] = e.target.value;
                                                            setEditingProject({...editingProject, keyFeatures: updated});
                                                        }} className="flex-1 bg-white/5 border border-white/10 rounded-xl p-4 text-white focus:outline-none" />
                                                        <button onClick={() => setEditingProject({...editingProject, keyFeatures: editingProject.keyFeatures?.filter((_, idx) => idx !== i)})} className="p-4 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all"><Trash size={18} /></button>
                                                    </div>
                                                ))}
                                                <button onClick={() => setEditingProject({...editingProject, keyFeatures: [...(editingProject.keyFeatures || []), '']})} className="w-full py-4 border border-dashed border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-stone-500 hover:text-luxury-gold hover:border-luxury-gold/50 transition-all">+ Add Feature Bullet</button>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {currentStep === 6 && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                        <div className="space-y-10">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold mb-4 flex items-center gap-2"><Globe size={12} /> Search Engine Configuration</h4>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Optimized SEO Title</label>
                                                <input value={editingProject.seoTitle || ''} onChange={e => setEditingProject({...editingProject, seoTitle: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none" placeholder="Luxury Interior Design Mumbai | Project Title" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Meta Description</label>
                                                <textarea value={editingProject.metaDescription || ''} onChange={e => setEditingProject({...editingProject, metaDescription: e.target.value})} rows={4} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none resize-none" placeholder="Detailed description for Google snippets..." />
                                            </div>
                                        </div>
                                        <div className="space-y-10">
                                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold mb-4 flex items-center gap-2"><Zap size={12} /> Conversion Mechanics</h4>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">CTA Button Narrative</label>
                                                <input value={editingProject.ctaText || ''} onChange={e => setEditingProject({...editingProject, ctaText: e.target.value})} className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-white focus:outline-none" placeholder="Initiate Design Session" />
                                            </div>
                                            <div className="flex flex-col gap-6 p-8 bg-luxury-gold/5 rounded-3xl border border-luxury-gold/10">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <Award className="text-luxury-gold" size={20} />
                                                        <span className="text-xs font-black uppercase tracking-widest text-white">Luxury Badge</span>
                                                    </div>
                                                    <input type="checkbox" checked={editingProject.luxuryBadge || false} onChange={e => setEditingProject({...editingProject, luxuryBadge: e.target.checked})} className="w-6 h-6 accent-luxury-gold" />
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-3">
                                                        <TrendingUp className="text-blue-400" size={20} />
                                                        <span className="text-xs font-black uppercase tracking-widest text-white">Trending Project</span>
                                                    </div>
                                                    <input type="checkbox" checked={editingProject.trending || false} onChange={e => setEditingProject({...editingProject, trending: e.target.checked})} className="w-6 h-6 accent-blue-500" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Step Navigation */}
                    <div className="mt-12 flex justify-between pt-8 border-t border-white/5">
                        <button 
                            onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                            disabled={currentStep === 1}
                            className={`flex items-center gap-3 px-8 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${currentStep === 1 ? 'opacity-30 cursor-not-allowed' : 'bg-white/5 text-white hover:bg-white/10'}`}
                        >
                            <ChevronLeft size={16} /> Backwards
                        </button>
                        {currentStep < steps.length ? (
                            <button 
                                onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
                                className="flex items-center gap-3 px-10 py-4 bg-white text-stone-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-luxury-gold transition-all shadow-xl"
                            >
                                Forward Path <ChevronRight size={16} />
                            </button>
                        ) : (
                            <button 
                                onClick={handleSave}
                                disabled={isSaving}
                                className="flex items-center gap-3 px-12 py-4 bg-luxury-gold text-stone-950 rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-glow-gold"
                            >
                                Finalize Publication <Zap size={16} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Live Preview Side Panel (Desktop only) */}
                <div className="hidden xl:flex w-[400px] flex-col gap-6">
                    <div className="bg-stone-950 border border-white/10 rounded-[2.5rem] p-6 shadow-3xl h-[80vh] flex flex-col relative overflow-hidden group">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                                <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Live Render</span>
                            </div>
                            <div className="flex bg-white/5 p-1 rounded-lg">
                                <button onClick={() => setPreviewDevice('desktop')} className={`p-2 rounded-md transition-all ${previewDevice === 'desktop' ? 'bg-luxury-gold text-stone-950' : 'text-stone-500'}`}><Monitor size={14} /></button>
                                <button onClick={() => setPreviewDevice('mobile')} className={`p-2 rounded-md transition-all ${previewDevice === 'mobile' ? 'bg-luxury-gold text-stone-950' : 'text-stone-500'}`}><Smartphone size={14} /></button>
                            </div>
                        </div>

                        {/* Preview Screen */}
                        <div className={`flex-1 bg-white dark:bg-stone-950 rounded-2xl overflow-y-auto no-scrollbar border border-white/5 transition-all duration-500 ${previewDevice === 'mobile' ? 'mx-auto w-[280px] scale-95 origin-top' : 'w-full'}`}>
                            {/* Mock Project Detail Render */}
                            <div className="relative h-48 w-full bg-neutral-900">
                                <img src={editingProject.heroImage || editingProject.image} className="w-full h-full object-cover opacity-60" />
                                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 to-transparent" />
                                <div className="absolute bottom-4 left-4 right-4">
                                    <p className="text-[6px] font-black uppercase tracking-widest text-luxury-gold mb-1">{editingProject.category}</p>
                                    <h5 className="text-sm font-serif font-bold text-white leading-tight">{editingProject.title || 'Untitled Space'}</h5>
                                </div>
                            </div>
                            <div className="p-6 space-y-4">
                                <div className="flex gap-2">
                                    <div className="h-6 w-12 bg-white/5 rounded-full" />
                                    <div className="h-6 w-12 bg-white/5 rounded-full" />
                                    <div className="h-6 w-12 bg-white/5 rounded-full" />
                                </div>
                                <div className="space-y-2">
                                    <div className="h-2 w-full bg-white/5 rounded" />
                                    <div className="h-2 w-5/6 bg-white/5 rounded" />
                                    <div className="h-2 w-4/6 bg-white/5 rounded" />
                                </div>
                                <div className="aspect-video bg-white/5 rounded-xl flex items-center justify-center text-stone-700 font-black text-[8px] uppercase tracking-widest border border-dashed border-white/10">Gallery Render Space</div>
                            </div>
                        </div>

                        <div className="absolute inset-0 pointer-events-none border-[12px] border-stone-900 rounded-[2.5rem] opacity-40" />
                    </div>
                    
                    <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                        <div className="flex items-center gap-4 text-stone-500">
                            <Zap size={18} className="text-luxury-gold" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Publishing ready</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-12 animate-fadeIn">
            {/* Header / Stats Overlay */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 relative">
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-12 bg-luxury-gold rounded-full" />
                        <div>
                            <p className="text-luxury-gold font-black uppercase tracking-[0.4em] text-[10px] mb-1">Global Inventory</p>
                            <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tighter">Project Hub</h2>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4">
                    <div className="relative group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-600 group-focus-within:text-luxury-gold transition-colors" size={18} />
                        <input 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold text-white focus:outline-none focus:border-luxury-gold/50 transition-all w-64" 
                            placeholder="Scan masterpieces..." 
                        />
                    </div>
                    <button 
                        onClick={() => setEditingProject({ title: '', status: 'Completed', featured: false, showOnHome: true, gallery: [], keyFeatures: [], materialsUsed: [], lightingType: [], style: [] })}
                        className="flex items-center gap-3 px-8 py-4 bg-luxury-gold text-stone-950 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-glow-gold hover:scale-105 active:scale-95 transition-all"
                    >
                        <Plus size={18} /> Orchestrate New
                    </button>
                </div>
            </div>

            {/* Filters Row */}
            <div className="flex flex-wrap gap-3">
                {['All', ...PROJECT_CATEGORIES.slice(0, 8)].map(cat => (
                    <button 
                        key={cat}
                        onClick={() => setCategoryFilter(cat)}
                        className={`px-6 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                            categoryFilter === cat ? 'bg-luxury-gold border-luxury-gold text-stone-950 shadow-glow-gold' : 'bg-white/5 border-white/10 text-stone-500 hover:text-white hover:border-white/30'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* List View (Premium Table Style) */}
            <div className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-[2.5rem] overflow-hidden shadow-3xl">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-white/5">
                                <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">Masterpiece / Category</th>
                                <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">Geography</th>
                                <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">Vitals</th>
                                <th className="px-10 py-8 text-left text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">Exposure</th>
                                <th className="px-10 py-8 text-right text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">Interventions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {filteredProjects.map((project, idx) => (
                                <motion.tr 
                                    key={project.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="group hover:bg-white/[0.03] transition-all cursor-default"
                                >
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="relative w-16 h-16 rounded-2xl overflow-hidden border border-white/10 group-hover:border-luxury-gold/50 transition-all">
                                                <img src={project.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-125" alt="" />
                                                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MousePointer2 size={16} className="text-luxury-gold" />
                                                </div>
                                            </div>
                                            <div>
                                                <h4 className="text-base font-serif font-bold text-white group-hover:text-luxury-gold transition-colors">{project.title}</h4>
                                                <p className="text-[10px] text-stone-500 uppercase tracking-widest font-black mt-1">{project.category}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-3 text-stone-400">
                                            <MapPin size={16} className="text-luxury-gold/60" />
                                            <span className="text-xs font-medium">{project.city || 'Pan-India'}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex flex-col gap-2">
                                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest w-fit ${
                                                project.status === 'Completed' ? 'bg-green-500/10 text-green-500' : 'bg-luxury-gold/10 text-luxury-gold'
                                            }`}>
                                                {project.status}
                                            </span>
                                            <span className="text-[9px] text-stone-600 font-bold uppercase tracking-widest">
                                                {project.type || 'Residential'}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center gap-6">
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-black text-white">{project.views || 0}</span>
                                                <span className="text-[8px] text-stone-600 uppercase font-black">Views</span>
                                            </div>
                                            <div className="flex flex-col items-center">
                                                <span className="text-xs font-black text-luxury-gold">{project.inquiryCount || 0}</span>
                                                <span className="text-[8px] text-stone-600 uppercase font-black">Leads</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-8">
                                        <div className="flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-all translate-x-4 group-hover:translate-x-0">
                                            <button 
                                                onClick={() => duplicateProject(project.id)}
                                                title="Replicate Concept"
                                                className="p-3 bg-white/5 text-stone-400 hover:text-blue-400 rounded-xl transition-all"
                                            >
                                                <Copy size={18} />
                                            </button>
                                            <button 
                                                onClick={() => setEditingProject(project)}
                                                title="Refine Essence"
                                                className="p-3 bg-white/5 text-stone-400 hover:text-luxury-gold rounded-xl transition-all"
                                            >
                                                <Edit2 size={18} />
                                            </button>
                                            <button 
                                                onClick={() => deleteProject(project.id)}
                                                title="Obliterate Asset"
                                                className="p-3 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-xl transition-all"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <MediaLibraryModal 
                isOpen={showGalleryPicker}
                onClose={() => setShowGalleryPicker(false)}
                multiple={true}
                onSelectMultiple={(urls) => {
                    setEditingProject(prev => prev ? ({
                        ...prev,
                        gallery: [...(prev.gallery || []), ...urls]
                    }) : null);
                    setShowGalleryPicker(false);
                }}
                title="Select Project Gallery Images"
                subtitle="Select multiple existing renders for your project exhibition."
            />
        </div>
    );
};

export default ProjectManager;
