import React, { useState } from 'react';
import { 
    Plus, 
    Search, 
    Edit2, 
    Trash2, 
    ExternalLink, 
    Image as ImageIcon,
    Filter,
    X,
    Save,
    Upload,
    PlusCircle
} from 'lucide-react';
import { useDesignInspirations, DesignInspiration } from '../../hooks/useDesignInspirations';
import { useConfirmDelete } from '../../hooks/useConfirmDelete';
import { motion, AnimatePresence } from 'framer-motion';
import CloudinaryImageInput from '../../components/admin/media/CloudinaryImageInput';

const CATEGORIES = [
    { id: 'kitchen', label: 'Modular Kitchen' },
    { id: 'bedroom', label: 'Master Bedroom' },
    { id: 'living', label: 'Living Room' },
    { id: 'bathroom', label: 'Bathroom' },
    { id: 'bhk', label: '1/2/3 BHK Plans' },
    { id: 'wardrobe', label: 'Wardrobe' },
    { id: 'study', label: 'Study Room' },
    { id: 'kids', label: 'Kid\'s Bedroom' },
    { id: 'tv-unit', label: 'TV Unit' },
    { id: 'pooja', label: 'Pooja Room' },
    { id: 'ceiling', label: 'False Ceiling' },
    { id: 'dining', label: 'Dining Room' },
    { id: 'foyer', label: 'Foyer/Entrance' },
    { id: 'office', label: 'Home Office' },
    { id: 'balcony', label: 'Balcony' },
    { id: 'flooring', label: 'Flooring' },
    { id: 'wallpaper', label: 'Wallpaper' },
    { id: 'paint', label: 'Wall Paint' },
    { id: 'staircase', label: 'Staircase' },
    { id: 'bar', label: 'Home Bar' },
];

const INITIAL_SEED_DATA = [
    {
        category: 'kitchen',
        title: 'Modern Island Kitchen',
        description: 'Luxury island kitchen with white marble countertops and copper accents.',
        image: 'https://images.unsplash.com/photo-1556912173-3bb406ef7e77?auto=format&fit=crop&q=80',
        style: 'Modern',
        tags: ['Island', 'Luxury']
    },
    {
        category: 'bedroom',
        title: 'Cinematic Master Bedroom',
        description: 'Luxury master bedroom with ambient cove lighting and wooden wall paneling.',
        image: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80',
        style: 'Luxury',
        tags: ['Ambient Lighting', 'Wood']
    },
    {
        category: 'living',
        title: 'Marble TV Wall Living Room',
        description: 'Premium living space featuring a book-matched marble TV panel and backlit lighting.',
        image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80',
        style: 'Luxury',
        tags: ['Marble', 'TV Wall']
    },
    {
        category: 'bar',
        title: 'Black Luxury Home Bar',
        description: 'Sophisticated black bar design with open display shelving and LED highlights.',
        image: 'https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&q=80',
        style: 'Ultra-Luxury',
        tags: ['Black', 'LED Bar']
    }
];

const InspirationManager: React.FC = () => {
    const { inspirations, loading, addInspiration, updateInspiration, deleteInspiration } = useDesignInspirations();
    const { confirmDelete } = useConfirmDelete();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: 'kitchen',
        image: '',
        gallery: '',
        style: 'Modern',
        tags: ''
    });

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            category: 'kitchen',
            image: '',
            gallery: '',
            style: 'Modern',
            tags: ''
        });
        setEditingId(null);
    };

    const handleEdit = (item: DesignInspiration) => {
        setFormData({
            title: item.title,
            description: item.description,
            category: item.category,
            image: item.image,
            gallery: item.gallery?.join('\n') || '',
            style: item.style || 'Modern',
            tags: item.tags?.join(', ') || ''
        });
        setEditingId(item.id);
        setIsModalOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            ...formData,
            gallery: formData.gallery.split('\n').map(l => l.trim()).filter(Boolean),
            tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
        };

        try {
            if (editingId) {
                await updateInspiration(editingId, data);
            } else {
                await addInspiration(data);
            }
            setIsModalOpen(false);
            resetForm();
        } catch (error) {
            alert("Error saving inspiration");
        }
    };

    const handleSeed = async () => {
        if (window.confirm("Seed initial premium designs?")) {
            for (const item of INITIAL_SEED_DATA) {
                await addInspiration(item);
            }
        }
    };

    const filtered = inspirations.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="space-y-8 p-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-white">Gallery Manager</h2>
                    <p className="text-gray-400">Manage your premium interior design and service gallery items</p>
                </div>
                <div className="flex gap-4">
                    {inspirations.length === 0 && (
                        <button 
                            onClick={handleSeed}
                            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg border border-white/10 transition-all"
                        >
                            <Upload size={18} /> Seed Initial Data
                        </button>
                    )}
                    <button 
                        onClick={() => { resetForm(); setIsModalOpen(true); }}
                        className="flex items-center gap-2 bg-luxury-gold text-white px-6 py-3 rounded-lg font-bold shadow-glow-gold hover:scale-105 transition-all"
                    >
                        <Plus size={20} /> Add New Gallery Item
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search inspirations..."
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-luxury-gold"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <select 
                        className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-white outline-none focus:border-luxury-gold appearance-none"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <option value="all">All Categories</option>
                        {CATEGORIES.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {loading ? (
                    <div className="col-span-full py-20 text-center text-gray-500">Loading...</div>
                ) : filtered.map((item) => (
                    <div key={item.id} className="bg-luxury-charcoal rounded-xl overflow-hidden border border-white/5 group hover:border-luxury-gold/50 transition-all">
                        <div className="relative aspect-video">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute top-2 right-2 flex gap-2">
                                <button 
                                    onClick={() => handleEdit(item)}
                                    className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-luxury-gold transition-colors"
                                >
                                    <Edit2 size={14} />
                                </button>
                                <button 
                                    onClick={() => {
                                        confirmDelete(
                                            async () => {
                                                await deleteInspiration(item.id);
                                            },
                                            {
                                                firstMessage: "Delete this gallery item?",
                                                secondMessage: "FINAL CONFIRMATION: Are you sure you want to permanently delete this design from the gallery?",
                                                successMessage: "Gallery item deleted."
                                            }
                                        );
                                    }}
                                    className="p-2 bg-black/50 backdrop-blur-md rounded-full text-white hover:bg-red-500 transition-colors"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                        <div className="p-4 space-y-2">
                            <div className="flex justify-between items-start">
                                <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">{item.category}</span>
                                <span className="text-[10px] text-gray-500">{item.style}</span>
                            </div>
                            <h3 className="text-white font-bold truncate">{item.title}</h3>
                            <p className="text-xs text-gray-400 line-clamp-2">{item.description}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isModalOpen && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsModalOpen(false)}
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            className="relative w-full max-w-2xl bg-luxury-obsidian border border-white/10 rounded-2xl overflow-hidden shadow-2xl"
                        >
                            <div className="p-6 border-b border-white/10 flex justify-between items-center">
                                <h3 className="text-xl font-bold text-white">{editingId ? 'Edit Gallery Item' : 'Add New Gallery Item'}</h3>
                                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                            </div>
                            
                            <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Title</label>
                                        <input 
                                            required
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-luxury-gold outline-none"
                                            value={formData.title}
                                            onChange={e => setFormData({...formData, title: e.target.value})}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Category</label>
                                        <select 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-luxury-gold outline-none"
                                            value={formData.category}
                                            onChange={e => setFormData({...formData, category: e.target.value})}
                                        >
                                            {CATEGORIES.map(cat => (
                                                <option key={cat.id} value={cat.id}>{cat.label}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-400">Description</label>
                                    <textarea 
                                        required
                                        rows={3}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-luxury-gold outline-none"
                                        value={formData.description}
                                        onChange={e => setFormData({...formData, description: e.target.value})}
                                    />
                                </div>

                                <div className="space-y-4">
                                    <CloudinaryImageInput 
                                        label="Main Display Image"
                                        value={formData.image}
                                        onChange={url => setFormData({...formData, image: url})}
                                        required
                                        folder="inspirations"
                                    />
                                </div>

                                <div className="space-y-4 pt-4 border-t border-white/5">
                                    <div className="flex justify-between items-center">
                                        <label className="text-sm font-medium text-gray-400">Design Showcase Gallery</label>
                                        <p className="text-[10px] text-gray-500 italic">Upload multiple angles or detail shots</p>
                                    </div>
                                    
                                    {/* Gallery Previews */}
                                    {formData.gallery && (
                                        <div className="grid grid-cols-4 gap-2">
                                            {formData.gallery.split('\n').filter(Boolean).map((url, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-white/10 group">
                                                    <img src={url} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                                                    <button 
                                                        type="button"
                                                        onClick={() => {
                                                            const urls = formData.gallery.split('\n').filter(Boolean);
                                                            urls.splice(idx, 1);
                                                            setFormData({...formData, gallery: urls.join('\n')});
                                                        }}
                                                        className="absolute top-1 right-1 bg-red-500 p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <X size={10} className="text-white" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}

                                    <CloudinaryImageInput 
                                        label="Upload to Gallery"
                                        value=""
                                        onChange={url => {
                                            const current = formData.gallery ? formData.gallery + '\n' : '';
                                            setFormData({...formData, gallery: current + url});
                                        }}
                                        folder="inspirations/gallery"
                                    />
                                    
                                    <div className="space-y-2">
                                        <label className="text-[10px] uppercase font-bold text-gray-500">Gallery Image List (Direct URLs)</label>
                                        <textarea 
                                            rows={3}
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-luxury-gold outline-none text-xs"
                                            value={formData.gallery}
                                            onChange={e => setFormData({...formData, gallery: e.target.value})}
                                            placeholder="Manually add URLs here if needed..."
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Style</label>
                                        <input 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-luxury-gold outline-none"
                                            value={formData.style}
                                            onChange={e => setFormData({...formData, style: e.target.value})}
                                            placeholder="e.g. Modern, Minimalist"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-400">Tags (comma separated)</label>
                                        <input 
                                            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-luxury-gold outline-none"
                                            value={formData.tags}
                                            onChange={e => setFormData({...formData, tags: e.target.value})}
                                            placeholder="Marble, LED, Island"
                                        />
                                    </div>
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full bg-luxury-gold text-white font-bold py-4 rounded-lg shadow-glow-gold hover:brightness-110 transition-all flex items-center justify-center gap-2"
                                >
                                    <Save size={20} /> {editingId ? 'Update Inspiration' : 'Save Inspiration'}
                                </button>
                            </form>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default InspirationManager;
