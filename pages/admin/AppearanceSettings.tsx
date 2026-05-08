import React, { useState, useEffect } from 'react';
import { useSiteSettings, SiteSettings } from '../../hooks/useSiteSettings';
import { useCloudinary } from '../../hooks/useCloudinary';
import { Palette, Image as ImageIcon, Sparkles, Save, Trash2, Upload, Loader2 } from 'lucide-react';
// import { toast } from 'react-hot-toast';

const AppearanceSettings: React.FC = () => {
    const { settings, loading, updateSettings } = useSiteSettings();
    const { uploadToCloudinary, loading: uploading } = useCloudinary();
    const [localSettings, setLocalSettings] = useState<SiteSettings | null>(null);
    const [uploadProgress, setUploadProgress] = useState(0);

    const THEME_PREVIEWS = [
        { id: 'luxury-white', label: 'Luxury White', color: '#B87333', desc: 'Elegant, warm villa style' },
        { id: 'dark-luxury', label: 'Dark Luxury', color: '#C9A227', desc: 'Cinematic obsidian & gold' },
        { id: 'modern-minimal', label: 'Modern Minimal', color: '#6B705C', desc: 'Soft ivory & olive' },
        { id: 'contemporary', label: 'Contemporary', color: '#B87333', desc: 'Corporate grey & copper' },
        { id: 'premium-earthy', label: 'Premium Earthy', color: '#A2674B', desc: 'Organic clay & walnut' },
    ];

    useEffect(() => {
        if (settings) setLocalSettings(settings);
    }, [settings]);

    const handleSave = async () => {
        if (!localSettings) return;
        try {
            await updateSettings(localSettings);
            alert('Appearance settings updated successfully');
        } catch (error) {
            alert('Failed to update settings');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be under 5MB');
            return;
        }

        try {
            const result = await uploadToCloudinary(file, 'site_backgrounds', (progress) => {
                setUploadProgress(progress);
            });
            if (localSettings) {
                setLocalSettings({ ...localSettings, backgroundImage: result.url });
            }
        } catch (error) {
            alert('Upload failed. Please try again.');
        } finally {
            setUploadProgress(0);
        }
    };

    if (loading || !localSettings) return <div className="p-20 text-center animate-pulse text-luxury-gold font-bold">Loading Appearance Engine...</div>;

    return (
        <div className="max-w-5xl mx-auto space-y-12 animate-fade-in pb-20">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-luxury-charcoal dark:text-white">Site Appearance</h2>
                    <p className="text-gray-500 text-sm">Control the global visual atmosphere for all visitors.</p>
                </div>
                <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-8 py-4 bg-luxury-gold text-white rounded-2xl font-bold shadow-glow-gold hover:scale-105 active:scale-95 transition-all"
                >
                    <Save size={20} /> Publish Changes
                </button>
            </div>

            {/* Global Theme Selection */}
            <div className="bg-white dark:bg-luxury-obsidian p-10 rounded-[2.5rem] border border-luxury-gold/10 shadow-2xl space-y-10">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-luxury-gold/10 rounded-2xl flex items-center justify-center text-luxury-gold">
                        <Palette size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-xl dark:text-white">Global Visual Theme</h3>
                        <p className="text-xs text-gray-500 font-medium">This theme will be applied to every user visiting the site.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                    {THEME_PREVIEWS.map((t) => (
                        <button
                            key={t.id}
                            onClick={() => setLocalSettings({ ...localSettings, activeTheme: t.id })}
                            className={`group relative flex flex-col p-6 rounded-3xl transition-all duration-500 border-2 ${
                                localSettings.activeTheme === t.id 
                                ? 'bg-luxury-gold/5 border-luxury-gold shadow-xl' 
                                : 'bg-gray-50 dark:bg-white/5 border-transparent hover:border-luxury-gold/30'
                            }`}
                        >
                            <div 
                                className="w-full aspect-square rounded-2xl mb-4 shadow-inner flex items-center justify-center relative overflow-hidden"
                                style={{ backgroundColor: t.id === 'dark-luxury' || t.id === 'contemporary' ? '#1A1A1A' : '#FFFFFF' }}
                            >
                                <div className="w-8 h-8 rounded-full shadow-lg" style={{ backgroundColor: t.color }} />
                                {localSettings.activeTheme === t.id && (
                                    <div className="absolute inset-0 bg-luxury-gold/10 flex items-center justify-center">
                                        <div className="bg-luxury-gold text-white p-1 rounded-full">
                                            <Save size={12} />
                                        </div>
                                    </div>
                                )}
                            </div>
                            <h4 className="text-sm font-bold dark:text-white mb-1">{t.label}</h4>
                            <p className="text-[10px] text-gray-400 font-medium uppercase tracking-tight">{t.desc}</p>
                        </button>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Hero Overlay Image */}
                <div className="bg-white dark:bg-luxury-obsidian p-10 rounded-[2.5rem] border border-luxury-gold/10 shadow-2xl space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-luxury-gold/10 rounded-2xl flex items-center justify-center text-luxury-gold">
                            <ImageIcon size={24} />
                        </div>
                        <h3 className="font-bold text-xl dark:text-white">Main Hero Image</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="relative group">
                            {localSettings.backgroundImage ? (
                                <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 relative shadow-inner">
                                    <img src={localSettings.backgroundImage} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button 
                                            onClick={() => setLocalSettings({...localSettings, backgroundImage: ''})}
                                            className="p-3 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-video rounded-3xl border-2 border-dashed border-luxury-gold/20 flex flex-col items-center justify-center text-gray-500 gap-4 bg-gray-50 dark:bg-white/5">
                                    <ImageIcon size={48} className="opacity-10" />
                                    <p className="text-sm font-medium">No custom branding image set</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex gap-4">
                            <input 
                                type="text" 
                                placeholder="External Image URL"
                                value={localSettings.backgroundImage}
                                onChange={(e) => setLocalSettings({...localSettings, backgroundImage: e.target.value})}
                                className="flex-1 px-5 py-4 bg-gray-50 dark:bg-white/5 border border-white/10 rounded-2xl text-sm dark:text-white focus:border-luxury-gold/50 outline-none transition-all"
                            />
                            <label className="flex items-center justify-center px-6 bg-luxury-gold/10 text-luxury-gold rounded-2xl cursor-pointer hover:bg-luxury-gold/20 transition-all border border-luxury-gold/20 shrink-0">
                                {uploading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <>
                                        <Upload size={22} />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    </>
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                {/* Gallery Background Image */}
                <div className="bg-white dark:bg-luxury-obsidian p-10 rounded-[2.5rem] border border-luxury-gold/10 shadow-2xl space-y-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-luxury-gold/10 rounded-2xl flex items-center justify-center text-luxury-gold">
                            <ImageIcon size={24} />
                        </div>
                        <h3 className="font-bold text-xl dark:text-white">Gallery Background</h3>
                    </div>

                    <div className="space-y-6">
                        <div className="relative group">
                            {localSettings.galleryBackgroundImage ? (
                                <div className="aspect-video rounded-3xl overflow-hidden border border-white/10 relative shadow-inner">
                                    <img src={localSettings.galleryBackgroundImage} alt="Preview" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                        <button 
                                            onClick={() => setLocalSettings({...localSettings, galleryBackgroundImage: ''})}
                                            className="p-3 bg-red-500 text-white rounded-xl hover:scale-110 transition-transform"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="aspect-video rounded-3xl border-2 border-dashed border-luxury-gold/20 flex flex-col items-center justify-center text-gray-500 gap-4 bg-gray-50 dark:bg-white/5">
                                    <ImageIcon size={48} className="opacity-10" />
                                    <p className="text-sm font-medium">No custom gallery background set</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex gap-4">
                            <input 
                                type="text" 
                                placeholder="External Image URL"
                                value={localSettings.galleryBackgroundImage}
                                onChange={(e) => setLocalSettings({...localSettings, galleryBackgroundImage: e.target.value})}
                                className="flex-1 px-5 py-4 bg-gray-50 dark:bg-white/5 border border-white/10 rounded-2xl text-sm dark:text-white focus:border-luxury-gold/50 outline-none transition-all"
                            />
                            <label className="flex items-center justify-center px-6 bg-luxury-gold/10 text-luxury-gold rounded-2xl cursor-pointer hover:bg-luxury-gold/20 transition-all border border-luxury-gold/20 shrink-0">
                                {uploading ? (
                                    <Loader2 size={18} className="animate-spin" />
                                ) : (
                                    <div className="relative">
                                        <Upload size={22} />
                                        <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" onChange={async (e) => {
                                            const file = e.target.files?.[0];
                                            if (!file) return;
                                            const result = await uploadToCloudinary(file, 'site_backgrounds');
                                            setLocalSettings({ ...localSettings, galleryBackgroundImage: result.url });
                                        }} />
                                    </div>
                                )}
                            </label>
                        </div>
                    </div>
                </div>

                {/* Hero Slideshow Management */}
                <div className="bg-white dark:bg-luxury-obsidian p-10 rounded-[2.5rem] border border-luxury-gold/10 shadow-2xl space-y-8 lg:col-span-2">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-luxury-gold/10 rounded-2xl flex items-center justify-center text-luxury-gold">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-xl dark:text-white">Hero Slideshow</h3>
                                <p className="text-xs text-gray-500 font-medium">Manage images that cycle on the homepage hero section.</p>
                            </div>
                        </div>
                        <label className="flex items-center gap-2 px-6 py-3 bg-luxury-gold text-white rounded-xl cursor-pointer hover:scale-105 transition-all shadow-glow-gold">
                            {uploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
                            <span className="text-sm font-bold">Add Hero Image</span>
                            <input type="file" className="hidden" accept="image/*" onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                const result = await uploadToCloudinary(file, 'hero_slideshow');
                                const currentSlides = localSettings.heroSlideshow || [];
                                setLocalSettings({ ...localSettings, heroSlideshow: [...currentSlides, result.url] });
                            }} />
                        </label>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                        {(localSettings.heroSlideshow || []).map((url, idx) => (
                            <div key={idx} className="relative group aspect-video rounded-xl overflow-hidden border border-white/10 bg-gray-50 dark:bg-white/5">
                                <img src={url} alt={`Hero ${idx + 1}`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                    <button 
                                        onClick={() => {
                                            const newSlides = (localSettings.heroSlideshow || []).filter((_, i) => i !== idx);
                                            setLocalSettings({ ...localSettings, heroSlideshow: newSlides });
                                        }}
                                        className="p-2 bg-red-500 text-white rounded-lg hover:scale-110 transition-transform"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))}
                        {(!localSettings.heroSlideshow || localSettings.heroSlideshow.length === 0) && (
                            <div className="col-span-full py-12 flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-luxury-gold/10 rounded-2xl">
                                <ImageIcon size={40} className="opacity-10 mb-2" />
                                <p className="text-sm font-medium">No hero slideshow images. Using defaults.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Cinematic Effects */}
                <div className="bg-white dark:bg-luxury-obsidian p-10 rounded-[2.5rem] border border-luxury-gold/10 shadow-2xl space-y-8 lg:col-span-2">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-luxury-gold/10 rounded-2xl flex items-center justify-center text-luxury-gold">
                            <Sparkles size={24} />
                        </div>
                        <h3 className="font-bold text-xl dark:text-white">Atmospheric Depth</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold dark:text-white uppercase tracking-wider">Background Blur Intensity</label>
                                <span className="text-luxury-gold font-bold font-mono text-lg">{localSettings.backgroundBlur}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={localSettings.backgroundBlur}
                                onChange={(e) => setLocalSettings({...localSettings, backgroundBlur: parseInt(e.target.value)})}
                                className="w-full h-3 bg-gray-100 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-luxury-gold"
                            />
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-sm font-bold dark:text-white uppercase tracking-wider">Gallery Overlay Opacity</label>
                                <span className="text-luxury-gold font-bold font-mono text-lg">{Math.round((localSettings.galleryOverlayOpacity || 0.4) * 100)}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={(localSettings.galleryOverlayOpacity || 0.4) * 100}
                                onChange={(e) => setLocalSettings({...localSettings, galleryOverlayOpacity: parseInt(e.target.value) / 100})}
                                className="w-full h-3 bg-gray-100 dark:bg-white/10 rounded-full appearance-none cursor-pointer accent-luxury-gold"
                            />
                        </div>

                        <div className="p-6 bg-luxury-gold/5 border border-luxury-gold/10 rounded-[2rem] flex items-center gap-4 lg:col-span-2">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/10 overflow-hidden shrink-0 shadow-lg relative">
                                <div 
                                    className="absolute inset-0"
                                    style={{ 
                                        backgroundImage: `url(${localSettings.galleryBackgroundImage || localSettings.backgroundImage})`,
                                        backgroundSize: 'cover',
                                        filter: `blur(${localSettings.backgroundBlur / 5}px)`,
                                        opacity: localSettings.galleryOverlayOpacity || 0.4
                                    }}
                                />
                            </div>
                            <div>
                                <p className="text-sm font-bold dark:text-white mb-1">Atmospheric Preview</p>
                                <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                                    Controls the softness and transparency of background layers for a cinematic depth effect.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppearanceSettings;
