import React, { useState } from 'react';
import { useServices } from '../../hooks/useServices';
import { Plus, Trash2, Edit, Save, X, Image, List, Lightbulb, Award, ChevronRight, Search, Loader2 } from 'lucide-react';
import { Service } from '../../types';

const ServiceManager: React.FC = () => {
    const { services, loading, addService, updateService, deleteService } = useServices();
    const [editingId, setEditingId] = useState<string | null>(null);
    const [isAdding, setIsAdding] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');

    const [formData, setFormData] = useState<Partial<Service>>({
        title: '',
        description: '',
        longDescription: '',
        icon: 'Home',
        image: '',
        features: [],
        suggestions: [],
        gallery: []
    });

    const handleEdit = (service: Service) => {
        setEditingId(service.id);
        setFormData(service);
        setIsAdding(false);
    };

    const handleAddNew = () => {
        setEditingId(null);
        setIsAdding(true);
        setFormData({
            title: '',
            description: '',
            longDescription: '',
            icon: 'Home',
            image: '',
            features: [],
            suggestions: [],
            gallery: []
        });
    };

    const handleCancel = () => {
        setEditingId(null);
        setIsAdding(false);
    };

    const handleSave = async () => {
        try {
            if (editingId) {
                await updateService(editingId, formData);
            } else {
                await addService(formData as Omit<Service, 'id'>);
            }
            setEditingId(null);
            setIsAdding(false);
        } catch (error) {
            alert('Error saving service');
        }
    };

    const handleArrayUpdate = (field: 'features' | 'suggestions' | 'gallery', index: number, value: string) => {
        const newArray = [...(formData[field] || [])];
        newArray[index] = value;
        setFormData({ ...formData, [field]: newArray });
    };

    const addArrayItem = (field: 'features' | 'suggestions' | 'gallery') => {
        setFormData({ ...formData, [field]: [...(formData[field] || []), ''] });
    };

    const removeArrayItem = (field: 'features' | 'suggestions' | 'gallery', index: number) => {
        const newArray = (formData[field] || []).filter((_, i) => i !== index);
        setFormData({ ...formData, [field]: newArray });
    };

    const filteredServices = services.filter(s =>
        s.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-luxury-gold" /></div>;
    }

    return (
        <div className="space-y-6">
            {!editingId && !isAdding ? (
                <>
                    <div className="flex justify-between items-center gap-4">
                        <div className="relative flex-1 max-w-md">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search services..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-gray-50 dark:bg-neutral-800 border border-luxury-gold/10 rounded-lg pl-10 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-luxury-gold/50"
                            />
                        </div>
                        <button
                            onClick={handleAddNew}
                            className="bg-luxury-gold text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-luxury-gold/90 transition-all font-bold text-sm shadow-luxury"
                        >
                            <Plus size={18} /> Add Service
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredServices.map(service => (
                            <div key={service.id} className="bg-white dark:bg-neutral-900 border border-luxury-gold/10 rounded-xl overflow-hidden shadow-sm group hover:border-luxury-gold/40 transition-all">
                                <div className="h-32 bg-luxury-obsidian relative overflow-hidden">
                                    {service.image ? (
                                        <img src={service.image} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" alt={service.title} />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-luxury-gold/20 font-serif italic">No Image</div>
                                    )}
                                    <div className="absolute top-2 right-2 flex gap-2">
                                        <button onClick={() => handleEdit(service)} className="p-2 bg-white/90 dark:bg-neutral-800/90 rounded-full text-blue-500 shadow-sm hover:scale-110 transition-transform"><Edit size={16} /></button>
                                        <button onClick={() => deleteService(service.id)} className="p-2 bg-white/90 dark:bg-neutral-800/90 rounded-full text-red-500 shadow-sm hover:scale-110 transition-transform"><Trash2 size={16} /></button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-serif font-bold text-lg text-luxury-charcoal dark:text-white mb-1">{service.title}</h3>
                                    <p className="text-xs text-gray-500 line-clamp-2 mb-4">{service.description}</p>
                                    <div className="flex gap-4 text-[10px] uppercase font-bold tracking-widest text-luxury-gold">
                                        <span>{service.features?.length || 0} Features</span>
                                        <span>{service.gallery?.length || 0} Images</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="animate-fadeIn">
                    <div className="flex justify-between items-center mb-8 pb-4 border-b border-luxury-gold/10">
                        <h3 className="text-xl font-serif font-bold text-luxury-charcoal dark:text-white">
                            {editingId ? 'Edit Service' : 'Add New Service'}
                        </h3>
                        <div className="flex gap-3">
                            <button
                                onClick={handleCancel}
                                className="px-4 py-2 text-sm text-gray-500 hover:text-luxury-charcoal font-bold"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSave}
                                className="bg-luxury-gold text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-luxury-gold/90 transition-all font-bold text-sm shadow-luxury"
                            >
                                <Save size={18} /> Save Service
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                        {/* Left Column: Basic Info */}
                        <div className="space-y-6">
                            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-luxury-gold/10 space-y-4">
                                <h4 className="text-xs font-bold uppercase tracking-tighter text-luxury-gold mb-2">Basic Information</h4>
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Service Title</label>
                                        <input
                                            type="text"
                                            value={formData.title}
                                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                            className="w-full mt-1 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-white/5 rounded-lg p-3 text-sm focus:ring-2 focus:ring-luxury-gold/50 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Short Description</label>
                                        <textarea
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            rows={2}
                                            className="w-full mt-1 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-white/5 rounded-lg p-3 text-sm focus:ring-2 focus:ring-luxury-gold/50 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">Long Description (Page Detail)</label>
                                        <textarea
                                            value={formData.longDescription}
                                            onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                                            rows={4}
                                            className="w-full mt-1 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-white/5 rounded-lg p-3 text-sm focus:ring-2 focus:ring-luxury-gold/50 outline-none"
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><Award size={12} /> Icon Name</label>
                                            <input
                                                type="text"
                                                value={formData.icon as string}
                                                onChange={(e) => setFormData({ ...formData, icon: e.target.value as any })}
                                                className="w-full mt-1 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-white/5 rounded-lg p-3 text-sm focus:ring-2 focus:ring-luxury-gold/50 outline-none"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-2"><Image size={12} /> Featured Image</label>
                                            <input
                                                type="text"
                                                value={formData.image}
                                                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                                className="w-full mt-1 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-white/5 rounded-lg p-3 text-sm focus:ring-2 focus:ring-luxury-gold/50 outline-none"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Gallery List */}
                            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-luxury-gold/10">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-xs font-bold uppercase tracking-tighter text-luxury-gold">Image Gallery</h4>
                                    <button onClick={() => addArrayItem('gallery')} className="text-luxury-gold hover:underline font-bold text-xs flex items-center gap-1">
                                        <Plus size={14} /> Add Image
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.gallery?.map((img, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={img}
                                                onChange={(e) => handleArrayUpdate('gallery', idx, e.target.value)}
                                                placeholder="Image URL..."
                                                className="flex-1 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-white/5 rounded-lg p-2 text-xs"
                                            />
                                            <button onClick={() => removeArrayItem('gallery', idx)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Features & Suggestions */}
                        <div className="space-y-6">
                            {/* Features List */}
                            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-luxury-gold/10">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-xs font-bold uppercase tracking-tighter text-luxury-gold flex items-center gap-2"><Award size={14} /> Service Features</h4>
                                    <button onClick={() => addArrayItem('features')} className="text-luxury-gold hover:underline font-bold text-xs flex items-center gap-1">
                                        <Plus size={14} /> Add Feature
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.features?.map((feat, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <input
                                                type="text"
                                                value={feat}
                                                onChange={(e) => handleArrayUpdate('features', idx, e.target.value)}
                                                placeholder="Feature description..."
                                                className="flex-1 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-white/5 rounded-lg p-2 text-xs"
                                            />
                                            <button onClick={() => removeArrayItem('features', idx)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Suggestions List */}
                            <div className="bg-white dark:bg-neutral-900 p-6 rounded-xl border border-luxury-gold/10">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-xs font-bold uppercase tracking-tighter text-luxury-gold flex items-center gap-2"><Lightbulb size={14} /> Design Suggestions</h4>
                                    <button onClick={() => addArrayItem('suggestions')} className="text-luxury-gold hover:underline font-bold text-xs flex items-center gap-1">
                                        <Plus size={14} /> Add Suggestion
                                    </button>
                                </div>
                                <div className="space-y-2">
                                    {formData.suggestions?.map((sugg, idx) => (
                                        <div key={idx} className="flex gap-2">
                                            <textarea
                                                value={sugg}
                                                onChange={(e) => handleArrayUpdate('suggestions', idx, e.target.value)}
                                                placeholder="Pro design tip..."
                                                rows={2}
                                                className="flex-1 bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-white/5 rounded-lg p-2 text-xs"
                                            />
                                            <button onClick={() => removeArrayItem('suggestions', idx)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-colors align-top"><Trash2 size={16} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Tips */}
                            <div className="p-4 bg-luxury-gold/5 border border-luxury-gold/20 rounded-xl space-y-2">
                                <h5 className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold">Admin Pro Tip</h5>
                                <p className="text-[11px] text-luxury-charcoal/60 leading-relaxed">
                                    Images should ideally be high-resolution Unsplash or Cloudinary links. Icons must match Lucide-React name strings (e.g., 'Home', 'PaintBucket', 'Lamp').
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ServiceManager;
