import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    ChevronLeft, ChevronRight, Save, Loader2, 
    Image as ImageIcon, MapPin, Hammer, Target, 
    Rocket, FileText, Zap, Sparkles, Trash,
    Plus, Smartphone, Monitor, Globe, Award, TrendingUp
} from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { Project, ProjectCategory } from '../../types';
import { db } from '../../lib/firebase';
import CloudinaryImageInput from '../../components/admin/media/CloudinaryImageInput';
import MediaLibraryModal from '../../components/admin/media/MediaLibraryModal';
import { useToast } from '../../context/ToastContext';
import { increment, updateDoc, query, collection, where, getDocs, arrayRemove, doc } from 'firebase/firestore';

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

const ProjectForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addProject, updateProject } = useProjects();

    const [formData, setFormData] = useState<Partial<Project>>({
        title: '',
        category: ProjectCategory.RESIDENTIAL,
        status: 'Completed',
        featured: false,
        showOnHome: true,
        gallery: [],
        keyFeatures: [],
        materialsUsed: [],
        lightingType: [],
        style: [],
        beforeImages: [],
        afterImages: []
    });
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!id);
    const [previewDevice, setPreviewDevice] = useState<'desktop' | 'mobile'>('desktop');
    const [showGalleryPicker, setShowGalleryPicker] = useState(false);
    const [isDirty, setIsDirty] = useState(false);
    const [cancelStep, setCancelStep] = useState(0);
    const { showToast } = useToast();

    useEffect(() => {
        if (id) {
            const fetchProject = async () => {
                try {
                    const docRef = doc(db, 'projects', id);
                    const docSnap = await getDoc(docRef);
                    if (docSnap.exists()) {
                        setFormData({ id: docSnap.id, ...docSnap.data() } as Project);
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setFetching(false);
                }
            };
            fetchProject();
        }
    }, [id]);

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    };

    const handleTitleChange = (title: string) => {
        const slug = generateSlug(title);
        updateFormData({ title, slug });
    };

    const updateFormData = (newData: Partial<Project>) => {
        setFormData(prev => ({ ...prev, ...newData }));
        setIsDirty(true);
        setCancelStep(0);
    };

    const handleCancel = () => {
        if (!isDirty) {
            navigate('/admin/projects');
            return;
        }

        if (cancelStep === 0) {
            setCancelStep(1);
            showToast('Unsaved changes! Click back again to confirm abandonment.', 'warning');
        } else if (cancelStep === 1) {
            setCancelStep(2);
            showToast('FINAL WARNING: All architectural progress will be lost. Click one last time to exit.', 'error');
        } else {
            navigate('/admin/projects');
        }
    };

    const handleSubmit = async () => {
        if (!formData.title) return;
        setLoading(true);
        try {
            if (id) {
                await updateProject(id, formData);
            } else {
                await addProject(formData as Omit<Project, 'id'>);
            }
            setIsDirty(false);
            navigate('/admin/projects');
        } catch (error) {
            console.error("Error saving project:", error);
        } finally {
            setLoading(false);
        }
    };

    const steps = [
        { id: 1, label: 'Identity', icon: FileText },
        { id: 2, label: 'Geography', icon: MapPin },
        { id: 3, label: 'Media', icon: ImageIcon },
        { id: 4, label: 'Architecture', icon: Hammer },
        { id: 5, label: 'Narrative', icon: Target },
        { id: 6, label: 'SEO & CTA', icon: Rocket }
    ];

    if (fetching) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="w-12 h-12 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="flex flex-col lg:flex-row gap-8 max-w-[1600px] mx-auto min-h-screen pb-20">
            {/* Editor Panel */}
            <div className="flex-1 bg-white dark:bg-stone-950/40 backdrop-blur-glass border border-stone-200 dark:border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-glass flex flex-col relative overflow-hidden text-stone-900 dark:text-white">
                <div className="absolute top-0 left-0 w-2 h-full bg-luxury-gold opacity-50" />
                
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleCancel} 
                            className={`p-3 rounded-full transition-all cursor-pointer ${
                                cancelStep === 1 ? 'bg-yellow-500/10 text-yellow-600 border border-yellow-500/20' : 
                                cancelStep === 2 ? 'bg-red-500 text-white border border-red-650' : 
                                'bg-stone-100 hover:bg-luxury-gold hover:text-stone-950 dark:bg-white/5 dark:hover:bg-luxury-gold dark:hover:text-black text-stone-700 dark:text-stone-300'
                            }`}
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <div>
                            <p className="text-luxury-gold font-black uppercase tracking-[0.4em] text-[10px] mb-1">Architectural Orchestrator</p>
                            <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-white tracking-tight">
                                {id ? 'Refine Masterpiece' : 'Create Concept'}
                            </h2>
                        </div>
                    </div>
                    <div className="flex gap-4">
                        <button 
                            onClick={handleSubmit} 
                            disabled={loading}
                            className="px-10 py-4 bg-luxury-gold text-stone-950 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-glow-gold hover:scale-105 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />}
                            {id ? 'Update Project' : 'Publish Project'}
                        </button>
                    </div>
                </div>

                {/* Step Matrix */}
                <div className="flex items-center justify-between mb-16 px-4">
                    {steps.map((step, idx) => {
                        const Icon = step.icon;
                        const isActive = currentStep === step.id;
                        const isCompleted = currentStep > step.id;
                        return (
                            <React.Fragment key={step.id}>
                                <button 
                                    onClick={() => setCurrentStep(step.id)}
                                    className="flex flex-col items-center gap-3 group relative z-10 cursor-pointer"
                                >
                                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-2 ${
                                        isActive ? 'bg-luxury-gold border-luxury-gold text-stone-950 shadow-glow-gold scale-110' : 
                                        isCompleted ? 'bg-green-500/20 border-green-500 text-green-500' : 'bg-stone-100 dark:bg-white/5 border-stone-200 dark:border-white/10 text-stone-500'
                                    }`}>
                                        <Icon size={22} />
                                    </div>
                                    <span className={`text-[8px] font-black uppercase tracking-widest transition-all ${isActive ? 'text-luxury-gold font-bold' : 'text-stone-500'}`}>{step.label}</span>
                                </button>
                                {idx < steps.length - 1 && (
                                    <div className={`flex-1 h-[2px] mx-4 -mt-7 transition-all duration-700 ${currentStep > step.id ? 'bg-green-500' : 'bg-stone-200 dark:bg-white/5'}`} />
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>

                <div className="flex-1 overflow-y-auto no-scrollbar pr-2" data-lenis-prevent>
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentStep}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="space-y-12"
                        >
                            {currentStep === 1 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Project Title</label>
                                        <input value={formData.title || ''} onChange={e => handleTitleChange(e.target.value)} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-6 text-stone-900 dark:text-white focus:outline-none focus:border-luxury-gold/50 transition-all font-serif text-2xl shadow-sm" placeholder="E.g. Penthouse in the Clouds" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">SEO Slug (Auto)</label>
                                        <input value={formData.slug || ''} readOnly className="w-full bg-stone-100/50 dark:bg-white/2 border border-stone-200 dark:border-white/5 rounded-2xl p-6 text-stone-500 italic cursor-not-allowed" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Domain Classification</label>
                                        <select value={formData.category || ''} onChange={e => updateFormData({ category: e.target.value as any})} className="w-full bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/10 rounded-2xl p-6 text-stone-900 dark:text-white focus:outline-none appearance-none cursor-pointer">
                                            {PROJECT_CATEGORIES.map(c => <option key={c} value={c} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Architectural Type</label>
                                        <select value={formData.type || ''} onChange={e => updateFormData({ type: e.target.value})} className="w-full bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/10 rounded-2xl p-6 text-stone-900 dark:text-white focus:outline-none appearance-none cursor-pointer">
                                            {PROJECT_TYPES.map(t => <option key={t} value={t} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">{t}</option>)}
                                        </select>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Current Status</label>
                                        <select value={formData.status || ''} onChange={e => updateFormData({ status: e.target.value})} className="w-full bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/10 rounded-2xl p-6 text-stone-900 dark:text-white focus:outline-none appearance-none cursor-pointer">
                                            {PROJECT_STATUSES.map(s => <option key={s} value={s} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">{s}</option>)}
                                        </select>
                                    </div>
                                    <div className="flex items-center gap-10 p-6 bg-stone-50 dark:bg-white/2 rounded-2xl border border-stone-200 dark:border-white/5">
                                        <div className="flex items-center gap-4">
                                            <input type="checkbox" checked={formData.featured || false} onChange={e => updateFormData({ featured: e.target.checked})} className="w-6 h-6 accent-luxury-gold cursor-pointer" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-900 dark:text-white">Featured Project</span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <input type="checkbox" checked={formData.showOnHome || false} onChange={e => updateFormData({ showOnHome: e.target.checked})} className="w-6 h-6 accent-luxury-gold cursor-pointer" />
                                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-900 dark:text-white">Homepage Display</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 2 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">City</label>
                                        <input value={formData.city || ''} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-6 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-luxury-gold/50 shadow-sm" placeholder="Kalyan / Mumbai" />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">State</label>
                                        <input value={formData.state || ''} onChange={e => setFormData({...formData, state: e.target.value})} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-6 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-luxury-gold/50 shadow-sm" placeholder="Maharashtra" />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Full Internal Address</label>
                                        <textarea value={formData.location || ''} onChange={e => setFormData({...formData, location: e.target.value})} rows={2} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-6 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-luxury-gold/50 resize-none shadow-sm" placeholder="Plot No 4, Sector 12..." />
                                    </div>
                                    <div className="md:col-span-2 space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Google Maps Embed Intel</label>
                                        <div className="relative">
                                            <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 text-luxury-gold" size={20} />
                                            <input value={formData.googleMapsLink || ''} onChange={e => updateFormData({ googleMapsLink: e.target.value})} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-6 pl-16 text-stone-900 dark:text-white placeholder-stone-450 dark:placeholder-stone-500 focus:outline-none focus:border-luxury-gold/50 shadow-sm" placeholder="https://www.google.com/maps/embed?..." />
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
                                                value={formData.heroImage || ''}
                                                onChange={url => updateFormData({ heroImage: url })}
                                                folder="projects"
                                                usageContext={{ id: id || 'new', type: 'project', title: formData.title || 'Untitled Project' }}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <CloudinaryImageInput 
                                                label="Primary Thumbnail"
                                                value={formData.image || ''}
                                                onChange={url => updateFormData({ image: url })}
                                                folder="projects"
                                                usageContext={{ id: id || 'new', type: 'project', title: formData.title || 'Untitled Project' }}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="flex justify-between items-center mb-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-luxury-gold ml-1">Visual Exhibition Gallery</label>
                                            <button 
                                                onClick={() => setShowGalleryPicker(true)}
                                                className="px-6 py-2 bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-luxury-gold hover:bg-luxury-gold hover:text-stone-950 dark:hover:text-black transition-all cursor-pointer shadow-sm"
                                            >
                                                Browse Library
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                                            {(formData.gallery || []).map((url, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden group border border-stone-200 dark:border-white/10 shadow-sm">
                                                    <img src={url} className="w-full h-full object-cover" alt="" />
                                                    <button 
                                                        onClick={async () => {
                                                            const newGallery = formData.gallery?.filter((_, i) => i !== idx);
                                                            updateFormData({ gallery: newGallery });
                                                            
                                                            // Decrement usage in media lib
                                                            try {
                                                                const q = query(collection(db, 'media'), where('url', '==', url));
                                                                const snapshot = await getDocs(q);
                                                                snapshot.forEach(async (mediaDoc) => {
                                                                    await updateDoc(doc(db, 'media', mediaDoc.id), {
                                                                        usageCount: increment(-1),
                                                                        usedIn: arrayRemove({ id: id || 'new', type: 'project', title: formData.title || 'Untitled Project' })
                                                                    });
                                                                });
                                                            } catch (err) {
                                                                console.error("Usage decrement error:", err);
                                                            }
                                                        }} 
                                                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-red-500 backdrop-blur-sm transition-all cursor-pointer"
                                                    >
                                                        <Trash size={24} />
                                                    </button>
                                                </div>
                                            ))}
                                            <div className="aspect-square">
                                                <CloudinaryImageInput 
                                                    label="Add Shot" 
                                                    value=""
                                                    onChange={url => updateFormData({ gallery: [...(formData.gallery || []), url] })} 
                                                    folder="projects" 
                                                    usageContext={{ id: id || 'new', type: 'project', title: formData.title || 'Untitled Project' }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-8 border-t border-stone-200 dark:border-white/5">
                                        <div className="space-y-4">
                                            <CloudinaryImageInput 
                                                label="The Past (Before)"
                                                value={formData.beforeImages?.[0] || ''}
                                                onChange={url => updateFormData({ beforeImages: [url] })}
                                                folder="projects"
                                                usageContext={{ id: id || 'new', type: 'project', title: formData.title || 'Untitled Project' }}
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <CloudinaryImageInput 
                                                label="The Masterpiece (After)"
                                                value={formData.afterImages?.[0] || ''}
                                                onChange={url => updateFormData({ afterImages: [url] })}
                                                folder="projects"
                                                usageContext={{ id: id || 'new', type: 'project', title: formData.title || 'Untitled Project' }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 4 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-10">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold mb-6 flex items-center gap-3"><Hammer size={14} /> Interior Logic</h4>
                                        <div className="space-y-3">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Architectural Style</label>
                                            <select value={formData.style?.[0] || ''} onChange={e => setFormData({...formData, style: [e.target.value]})} className="w-full bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/10 rounded-2xl p-6 text-stone-900 dark:text-white focus:outline-none appearance-none cursor-pointer">
                                                {DESIGN_STYLES.map(s => <option key={s} value={s} className="bg-white dark:bg-stone-900 text-stone-900 dark:text-white">{s}</option>)}
                                            </select>
                                        </div>
                                        <div className="space-y-4">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Elite Materials Used</label>
                                            <div className="flex flex-wrap gap-3">
                                                {MATERIAL_OPTIONS.map(m => (
                                                    <button key={m} onClick={() => {
                                                        const cur = formData.materialsUsed || [];
                                                        const upd = cur.includes(m) ? cur.filter(x => x !== m) : [...cur, m];
                                                        setFormData({...formData, materialsUsed: upd});
                                                    }} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
                                                        (formData.materialsUsed || []).includes(m) ? 'bg-luxury-gold text-stone-950 border-luxury-gold' : 'bg-stone-50 dark:bg-white/5 text-stone-500 border-stone-200 dark:border-white/5 hover:border-stone-400 dark:hover:border-white/20'
                                                    }`}>{m}</button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-10">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 dark:text-blue-400 mb-6 flex items-center gap-3"><Zap size={14} /> Illumination Strategy</h4>
                                        <div className="flex flex-wrap gap-3">
                                            {LIGHTING_OPTIONS.map(l => (
                                                <button key={l} onClick={() => {
                                                    const cur = formData.lightingType || [];
                                                    const upd = cur.includes(l) ? cur.filter(x => x !== l) : [...cur, l];
                                                    setFormData({...formData, lightingType: upd});
                                                }} className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all cursor-pointer ${
                                                    (formData.lightingType || []).includes(l) ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30' : 'bg-stone-50 dark:bg-white/5 text-stone-500 border-stone-200 dark:border-white/5 hover:border-stone-400 dark:hover:border-white/20'
                                                }`}>{l}</button>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-2 gap-8 pt-6">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Area (SQ.FT)</label>
                                                <input value={formData.area || ''} onChange={e => setFormData({...formData, area: e.target.value})} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-5 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-luxury-gold/50 shadow-sm" placeholder="2,500" />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Execution Time</label>
                                                <input value={formData.duration || ''} onChange={e => setFormData({...formData, duration: e.target.value})} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-5 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-luxury-gold/50 shadow-sm" placeholder="60 Days" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 5 && (
                                <div className="space-y-10">
                                    <div className="space-y-2">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Discovery Pitch (Short Description)</label>
                                        <input value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-6 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-luxury-gold/50 shadow-sm" placeholder="Captivate the user in 15 words..." />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">The Challenge (Problem)</label>
                                            <textarea value={formData.problem || ''} onChange={e => setFormData({...formData, problem: e.target.value})} rows={5} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-6 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-luxury-gold/50 resize-none shadow-sm" placeholder="What were we up against?" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">The Mastermind (Solution)</label>
                                            <textarea value={formData.designGoal || ''} onChange={e => setFormData({...formData, designGoal: e.target.value})} rows={5} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-6 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-luxury-gold/50 resize-none shadow-sm" placeholder="How did we overcome?" />
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Signature Intel (Key Features)</label>
                                        <div className="space-y-4">
                                            {(formData.keyFeatures || []).map((f, i) => (
                                                <div key={i} className="flex gap-4">
                                                    <input value={f} onChange={e => {
                                                        const upd = [...(formData.keyFeatures || [])];
                                                        upd[i] = e.target.value;
                                                        setFormData({...formData, keyFeatures: upd});
                                                    }} className="flex-1 bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-5 text-stone-900 dark:text-white placeholder-stone-450 dark:placeholder-stone-500 focus:outline-none focus:border-luxury-gold/50 shadow-sm" />
                                                    <button onClick={() => setFormData({...formData, keyFeatures: formData.keyFeatures?.filter((_, idx) => idx !== i)})} className="p-5 bg-red-500/10 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all cursor-pointer"><Trash size={20} /></button>
                                                </div>
                                            ))}
                                            <button onClick={() => setFormData({...formData, keyFeatures: [...(formData.keyFeatures || []), '']})} className="w-full py-5 border border-dashed border-stone-200 dark:border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-stone-500 hover:text-luxury-gold hover:border-luxury-gold transition-all cursor-pointer">+ Add Architectural Bullet</button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {currentStep === 6 && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                    <div className="space-y-12">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold mb-6 flex items-center gap-3"><Globe size={14} /> Search Intelligence</h4>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Optimized SEO Title</label>
                                            <input value={formData.seoTitle || ''} onChange={e => setFormData({...formData, seoTitle: e.target.value})} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-6 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-luxury-gold/50 shadow-sm" placeholder="Luxury Interior Design | Project Name" />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Meta Intelligence (Description)</label>
                                            <textarea value={formData.metaDescription || ''} onChange={e => setFormData({...formData, metaDescription: e.target.value})} rows={4} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-6 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-luxury-gold/50 resize-none shadow-sm" placeholder="Targeting Google's premium snippets..." />
                                        </div>
                                    </div>
                                    <div className="space-y-12">
                                        <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-500 dark:text-blue-400 mb-6 flex items-center gap-3"><Zap size={14} /> Conversion Mechanics</h4>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">CTA Strategic Text</label>
                                            <input value={formData.ctaText || ''} onChange={e => setFormData({...formData, ctaText: e.target.value})} className="w-full bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-2xl p-6 text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-luxury-gold/50 shadow-sm" placeholder="Book Design Consultation" />
                                        </div>
                                        <div className="grid grid-cols-1 gap-6 p-10 bg-luxury-gold/10 dark:bg-luxury-gold/5 rounded-[2.5rem] border border-luxury-gold/20 dark:border-luxury-gold/10">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <Award className="text-luxury-gold" size={24} />
                                                    <span className="text-xs font-black uppercase tracking-widest text-stone-900 dark:text-white">Elite Luxury Badge</span>
                                                </div>
                                                <input type="checkbox" checked={formData.luxuryBadge || false} onChange={e => setFormData({...formData, luxuryBadge: e.target.checked})} className="w-7 h-7 accent-luxury-gold cursor-pointer" />
                                            </div>
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <TrendingUp className="text-blue-500 dark:text-blue-400" size={24} />
                                                    <span className="text-xs font-black uppercase tracking-widest text-stone-900 dark:text-white">Trending High-Velocity</span>
                                                </div>
                                                <input type="checkbox" checked={formData.trending || false} onChange={e => setFormData({...formData, trending: e.target.checked})} className="w-7 h-7 accent-blue-500 cursor-pointer" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* Footer Nav */}
                <div className="mt-16 flex justify-between pt-10 border-t border-stone-200 dark:border-white/5">
                    <button 
                        onClick={() => setCurrentStep(prev => Math.max(1, prev - 1))}
                        disabled={currentStep === 1}
                        className={`flex items-center gap-4 px-10 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${currentStep === 1 ? 'opacity-30 cursor-not-allowed text-stone-400 bg-stone-50 border border-stone-150' : 'bg-stone-100 hover:bg-stone-200 text-stone-700 dark:bg-white/5 dark:text-white dark:hover:bg-white/10'}`}
                    >
                        <ChevronLeft size={18} /> Retrace Path
                    </button>
                    {currentStep < steps.length ? (
                        <button 
                            onClick={() => setCurrentStep(prev => Math.min(steps.length, prev + 1))}
                            className="flex items-center gap-4 px-12 py-5 bg-stone-900 dark:bg-white text-white dark:text-stone-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-luxury-gold dark:hover:bg-luxury-gold hover:text-stone-950 transition-all shadow-2xl cursor-pointer"
                        >
                            Advance Logic <ChevronRight size={18} />
                        </button>
                    ) : (
                        <button 
                            onClick={handleSubmit}
                            disabled={loading}
                            className="flex items-center gap-4 px-16 py-5 bg-luxury-gold text-stone-950 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-all shadow-glow-gold cursor-pointer"
                        >
                            {loading ? <Loader2 size={18} className="animate-spin" /> : <Zap size={18} />}
                            Finalize Orchestration
                        </button>
                    )}
                </div>
            </div>

            {/* Desktop Preview Panel */}
            <div className="hidden xl:flex w-[450px] flex-col gap-8">
                <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-white/10 rounded-[3rem] p-8 shadow-glass h-[85vh] flex flex-col relative overflow-hidden text-stone-900 dark:text-white">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-500">Cinematic Render</span>
                        </div>
                        <div className="flex bg-stone-100 dark:bg-white/5 p-1 rounded-xl">
                            <button onClick={() => setPreviewDevice('desktop')} className={`p-3 rounded-lg transition-all cursor-pointer ${previewDevice === 'desktop' ? 'bg-luxury-gold text-stone-950' : 'text-stone-500 hover:text-stone-700'}`}><Monitor size={16} /></button>
                            <button onClick={() => setPreviewDevice('mobile')} className={`p-3 rounded-lg transition-all cursor-pointer ${previewDevice === 'mobile' ? 'bg-luxury-gold text-stone-950' : 'text-stone-500 hover:text-stone-700'}`}><Smartphone size={16} /></button>
                        </div>
                    </div>

                    <div className={`flex-1 bg-stone-50 dark:bg-stone-950 rounded-3xl overflow-y-auto no-scrollbar border border-stone-200 dark:border-white/5 transition-all duration-700 ${previewDevice === 'mobile' ? 'mx-auto w-[300px] scale-95 origin-top' : 'w-full'}`}>
                         <div className="relative h-56 bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                            <img src={formData.heroImage || formData.image} className="w-full h-full object-cover opacity-70" />
                            <div className="absolute inset-0 bg-gradient-to-t from-stone-50 dark:from-stone-950 via-transparent to-transparent" />
                            <div className="absolute bottom-6 left-6 right-6">
                                <span className="px-3 py-1 bg-luxury-gold text-black rounded-full text-[6px] font-black uppercase tracking-[0.2em]">{formData.category}</span>
                                <h3 className="text-xl font-serif font-bold text-stone-900 dark:text-white mt-2 leading-tight">{formData.title || 'Untitled Narrative'}</h3>
                            </div>
                         </div>
                         <div className="p-8 space-y-6">
                              <div className="grid grid-cols-2 gap-4">
                                  <div className="h-12 bg-stone-100 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/5" />
                                  <div className="h-12 bg-stone-100 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/5" />
                              </div>
                              <div className="space-y-3">
                                  <div className="h-2 w-full bg-stone-200 dark:bg-white/10 rounded-full" />
                                  <div className="h-2 w-5/6 bg-stone-100 dark:bg-white/5 rounded-full" />
                                  <div className="h-2 w-4/6 bg-stone-100 dark:bg-white/5 rounded-full" />
                              </div>
                              <div className="aspect-video bg-stone-100 dark:bg-white/5 rounded-2xl flex items-center justify-center border border-dashed border-stone-300 dark:border-white/10 text-[8px] font-black uppercase tracking-[0.3em] text-stone-500 dark:text-stone-400">Gallery Render Engine</div>
                         </div>
                    </div>
                    
                    <div className="absolute inset-0 pointer-events-none border-[16px] border-stone-200 dark:border-stone-900 rounded-[3rem] opacity-30" />
                </div>
                
                <div className="p-8 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-3xl flex items-center gap-6 shadow-glass">
                    <div className="w-12 h-12 bg-luxury-gold/10 rounded-2xl flex items-center justify-center text-luxury-gold">
                        <Award size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-stone-900 dark:text-white">Production Ready</p>
                        <p className="text-[8px] text-stone-500 uppercase tracking-widest mt-1">Orchestrating Architectural Excellence</p>
                    </div>
                </div>
            </div>

            <MediaLibraryModal 
                isOpen={showGalleryPicker}
                onClose={() => setShowGalleryPicker(false)}
                multiple={true}
                onSelectMultiple={(urls) => {
                    updateFormData({
                        gallery: [...(formData.gallery || []), ...urls]
                    });
                    setShowGalleryPicker(false);
                    showToast(`${urls.length} architectural shots added`, 'success');
                }}
                title="Select Project Assets"
                subtitle="Curate the visual narrative for your masterpiece."
                usageContext={{ id: id || 'new', type: 'project', title: formData.title || 'Untitled Project' }}
            />
        </div>
    );
};

export default ProjectForm;
