import React, { useState, useEffect, useRef } from 'react';
import { Save, IndianRupee, Layers, Paintbrush, ImageIcon, Box, Bath, Lightbulb, Tv, Grid, Upload, Loader2, Settings as SettingsIcon, X, Plus } from 'lucide-react';
import { useEstimationCosts, EstimationCosts } from '../../hooks/useEstimationCosts';
import { uploadImage, isValidImageFile } from '../../utils/imageUpload';

const EstimationConfig: React.FC = () => {
    const { costs, loading, updateCosts } = useEstimationCosts();
    const [localCosts, setLocalCosts] = useState<EstimationCosts | null>(null);
    const [saving, setSaving] = useState(false);
    const [uploadingCategory, setUploadingCategory] = useState<string | null>(null);
    const [uploadingOption, setUploadingOption] = useState<{ category: string, option: string } | null>(null);
    const [uploadingTierIndex, setUploadingTierIndex] = useState<number | null>(null);
    
    const tierFileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        if (costs) setLocalCosts(costs);
    }, [costs]);

    const handleSave = async () => {
        if (!localCosts) return;
        setSaving(true);
        try {
            await updateCosts(localCosts);
            alert('Pricing, imagery, and material library updated successfully!');
        } catch (error) {
            console.error(error);
            alert('Failed to update configuration.');
        } finally {
            setSaving(false);
        }
    };

    const handleTierImageUpload = async (index: number, file: File) => {
        if (!isValidImageFile(file)) { alert('Invalid format.'); return; }
        setUploadingTierIndex(index);
        try {
            const url = await uploadImage(file, 'estimation_tiers');
            const newTiers = [...(localCosts?.styleTiers || [])];
            newTiers[index].image = url;
            setLocalCosts(prev => prev ? ({ ...prev, styleTiers: newTiers }) : null);
        } catch (error) { alert('Upload failed.'); } finally { setUploadingTierIndex(null); }
    };

    const handleCategoryImageUpload = async (categoryKey: string, file: File) => {
        if (!isValidImageFile(file)) { alert('Invalid format.'); return; }
        setUploadingCategory(categoryKey);
        try {
            const url = await uploadImage(file, `categories/${categoryKey}`);
            setLocalCosts(prev => {
                if (!prev) return prev;
                return { ...prev, categoryImages: { ...(prev.categoryImages || {}), [categoryKey]: url } };
            });
        } catch (error) { alert('Upload failed.'); } finally { setUploadingCategory(null); }
    };

    const handleOptionImageUpload = async (category: string, option: string, file: File) => {
        if (!isValidImageFile(file)) { alert('Invalid format.'); return; }
        setUploadingOption({ category, option });
        try {
            const url = await uploadImage(file, `options/${category}/${option}`);
            setLocalCosts(prev => {
                if (!prev) return prev;
                const newOptionImages = { ...(prev.optionImages || {}) };
                newOptionImages[category] = { ...(newOptionImages[category] || {}), [option]: url };
                return { ...prev, optionImages: newOptionImages };
            });
        } catch (error) { alert('Upload failed.'); } finally { setUploadingOption(null); }
    };

    if (loading || !localCosts) return <div className="p-20 text-center animate-pulse text-luxury-gold font-bold">Initializing Advanced Config...</div>;

    const updateValue = (category: keyof EstimationCosts, key: string, value: string) => {
        setLocalCosts(prev => {
            if (!prev) return prev;
            return {
                ...prev,
                [category]: { ...(prev[category] as any), [key]: parseFloat(value) || 0 }
            };
        });
    };

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex justify-between items-center bg-white dark:bg-luxury-obsidian p-8 rounded-3xl border border-luxury-gold/10 shadow-sm">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-luxury-charcoal dark:text-white">Material & Media Library</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Configure unit rates and granular material imagery for every selection.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-luxury-gold text-white px-8 py-4 rounded-2xl font-bold shadow-glow-gold hover:scale-105 transition-all disabled:opacity-50"
                >
                    <Save size={18} />
                    {saving ? 'Saving Library...' : 'Save All Changes'}
                </button>
            </div>

            {/* Pricing Sections */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {[
                    { title: 'Flooring & Stone', icon: Layers, category: 'tiles', catKey: 'flooring' },
                    { title: 'Wall Finishes', icon: Paintbrush, category: 'wall', catKey: 'walls' },
                    { title: 'False Ceiling', icon: Grid, category: 'falseCeiling', catKey: 'ceiling' },
                    { title: 'Modular Kitchen', icon: Box, category: 'kitchen', catKey: 'kitchen' },
                    { title: 'Wardrobe Systems', icon: Box, category: 'wardrobe', catKey: 'wardrobe' },
                    { title: 'Entertainment Units', icon: Tv, category: 'tvUnit', catKey: 'tv_unit' },
                    { title: 'Sanitary & Bathroom', icon: Bath, category: 'bathroom', catKey: 'bathroom' },
                    { title: 'Lumina & Lighting', icon: Lightbulb, category: 'lighting', catKey: 'lighting' },
                ].map(section => (
                    <PriceCategoryCard 
                        key={section.category}
                        title={section.title} icon={section.icon} 
                        data={(localCosts as any)[section.category]} 
                        category={section.category} 
                        catKey={section.catKey}
                        categoryImageUrl={localCosts.categoryImages?.[section.catKey]}
                        optionImages={localCosts.optionImages?.[section.category] || {}}
                        onCategoryUpload={handleCategoryImageUpload}
                        onOptionUpload={handleOptionImageUpload}
                        uploadingCategory={uploadingCategory === section.catKey}
                        uploadingOption={uploadingOption}
                        updateValue={updateValue} 
                    />
                ))}
            </div>

            {/* Style Tiers */}
            <div className="bg-white dark:bg-luxury-obsidian p-8 rounded-3xl border border-luxury-gold/10 shadow-sm">
                <h3 className="font-bold text-xl mb-8 flex items-center gap-2 text-luxury-charcoal dark:text-white">
                    <ImageIcon className="text-luxury-gold" size={24} /> Design Tiers
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {localCosts.styleTiers.map((tier, index) => (
                        <div key={tier.id} className="p-6 bg-gray-50 dark:bg-white/5 border border-luxury-gold/10 rounded-2xl space-y-6">
                            <div className="relative aspect-video rounded-xl overflow-hidden group">
                                <img src={tier.image} alt={tier.name} className="w-full h-full object-cover transition-all group-hover:scale-105" />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <button 
                                        onClick={() => tierFileInputRefs.current[index]?.click()}
                                        className="bg-luxury-gold text-white p-3 rounded-full shadow-glow-gold hover:scale-110 transition-all"
                                    >
                                        <Upload size={20} />
                                    </button>
                                </div>
                                {uploadingTierIndex === index && (
                                    <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center">
                                        <Loader2 className="animate-spin text-luxury-gold" size={32} />
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    ref={el => tierFileInputRefs.current[index] = el}
                                    className="hidden" accept="image/*"
                                    onChange={(e) => e.target.files?.[0] && handleTierImageUpload(index, e.target.files[0])}
                                />
                            </div>
                            <div className="text-center font-bold text-luxury-gold uppercase tracking-widest text-[10px]">{tier.name}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

const PriceCategoryCard = ({ 
    title, icon: Icon, data, category, catKey, 
    categoryImageUrl, optionImages, 
    onCategoryUpload, onOptionUpload, 
    uploadingCategory, uploadingOption, 
    updateValue 
}: any) => {
    const catFileRef = useRef<HTMLInputElement>(null);
    const optionFileRefs = useRef<Record<string, HTMLInputElement | null>>({});

    return (
        <div className="bg-white dark:bg-luxury-obsidian p-8 rounded-3xl border border-luxury-gold/10 shadow-sm hover:shadow-luxury transition-all duration-500">
            <div className="flex justify-between items-start mb-8">
                <h3 className="font-bold text-xl flex items-center gap-3 text-luxury-charcoal dark:text-white">
                    <div className="w-10 h-10 bg-luxury-gold/10 rounded-xl flex items-center justify-center text-luxury-gold">
                        <Icon size={20} />
                    </div>
                    {title}
                </h3>
                
                {/* Category Cover Image */}
                <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-luxury-gold/20 group cursor-pointer" onClick={() => catFileRef.current?.click()}>
                    {categoryImageUrl ? (
                        <img src={categoryImageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-all" />
                    ) : (
                        <div className="w-full h-full bg-gray-100 dark:bg-white/5 flex items-center justify-center"><ImageIcon size={16} className="text-gray-300" /></div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Upload size={14} className="text-white" /></div>
                    {uploadingCategory && <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 size={14} className="animate-spin text-luxury-gold" /></div>}
                    <input type="file" ref={catFileRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && onCategoryUpload(catKey, e.target.files[0])} />
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {Object.entries(data).map(([key, val]: any) => (
                    <div key={key} className="space-y-2">
                        <div className="flex justify-between items-center px-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            </label>
                            
                            {/* Option Specific Image Uploader */}
                            <div 
                                className="relative w-6 h-6 rounded-md overflow-hidden border border-luxury-gold/20 cursor-pointer group"
                                onClick={() => optionFileRefs.current[key]?.click()}
                            >
                                {optionImages[key] ? (
                                    <img src={optionImages[key]} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-50 dark:bg-white/5"><Plus size={10} className="text-luxury-gold" /></div>
                                )}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"><Upload size={8} className="text-white" /></div>
                                {uploadingOption?.category === category && uploadingOption?.option === key && (
                                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center"><Loader2 size={10} className="animate-spin text-luxury-gold" /></div>
                                )}
                                <input 
                                    type="file" ref={el => optionFileRefs.current[key] = el} className="hidden" accept="image/*" 
                                    onChange={(e) => e.target.files?.[0] && onOptionUpload(category, key, e.target.files[0])} 
                                />
                            </div>
                        </div>

                        <div className="relative">
                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                            <input
                                type="number" value={val}
                                onChange={(e) => updateValue(category, key, e.target.value)}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-xl outline-none focus:border-luxury-gold dark:text-white text-sm"
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default EstimationConfig;
