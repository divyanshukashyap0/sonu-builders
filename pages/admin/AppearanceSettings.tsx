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
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-luxury-charcoal dark:text-white">Site Appearance</h2>
                    <p className="text-gray-500 text-sm">Customize the global background and theme of your website.</p>
                </div>
                <button 
                    onClick={handleSave}
                    className="flex items-center gap-2 px-6 py-3 bg-luxury-gold text-white rounded-xl font-bold shadow-glow-gold hover:scale-105 transition-all"
                >
                    <Save size={18} /> Save Changes
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Background Color */}
                <div className="bg-white dark:bg-luxury-obsidian p-8 rounded-3xl border border-luxury-gold/10 shadow-luxury space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-luxury-gold/10 rounded-full flex items-center justify-center text-luxury-gold">
                            <Palette size={20} />
                        </div>
                        <h3 className="font-bold text-lg dark:text-white">Background Color</h3>
                    </div>
                    
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <input 
                                type="color" 
                                value={localSettings.backgroundColor}
                                onChange={(e) => setLocalSettings({...localSettings, backgroundColor: e.target.value})}
                                className="w-16 h-16 rounded-xl cursor-pointer bg-transparent"
                            />
                            <input 
                                type="text" 
                                value={localSettings.backgroundColor}
                                onChange={(e) => setLocalSettings({...localSettings, backgroundColor: e.target.value})}
                                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-white/5 border border-white/10 rounded-xl text-sm dark:text-white uppercase font-mono"
                                placeholder="#050505"
                            />
                        </div>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Primary site background color (visible when no image is loaded)</p>
                    </div>
                </div>

                {/* Background Image */}
                <div className="bg-white dark:bg-luxury-obsidian p-8 rounded-3xl border border-luxury-gold/10 shadow-luxury space-y-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-luxury-gold/10 rounded-full flex items-center justify-center text-luxury-gold">
                            <ImageIcon size={20} />
                        </div>
                        <h3 className="font-bold text-lg dark:text-white">Background Image</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="relative group">
                            {localSettings.backgroundImage ? (
                                <div className="aspect-video rounded-2xl overflow-hidden border border-white/10 relative">
                                    <img src={localSettings.backgroundImage} alt="Preview" className="w-full h-full object-cover" />
                                    <button 
                                        onClick={() => setLocalSettings({...localSettings, backgroundImage: ''})}
                                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            ) : (
                                <div className="aspect-video rounded-2xl border-2 border-dashed border-luxury-gold/20 flex flex-col items-center justify-center text-gray-500 gap-2">
                                    <ImageIcon size={32} className="opacity-20" />
                                    <p className="text-xs">No background image set</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="flex gap-4">
                            <input 
                                type="text" 
                                placeholder="Enter Image URL or Upload"
                                value={localSettings.backgroundImage}
                                onChange={(e) => setLocalSettings({...localSettings, backgroundImage: e.target.value})}
                                className="flex-1 px-4 py-3 bg-gray-50 dark:bg-white/5 border border-white/10 rounded-xl text-sm dark:text-white"
                            />
                            <label className="flex items-center justify-center px-4 bg-luxury-gold/10 text-luxury-gold rounded-xl cursor-pointer hover:bg-luxury-gold/20 transition-all border border-luxury-gold/20 shrink-0">
                                {uploading ? (
                                    <div className="flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin" />
                                        <span className="text-xs font-bold">{uploadProgress}%</span>
                                    </div>
                                ) : (
                                    <>
                                        <Upload size={18} />
                                        <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} />
                                    </>
                                )}
                            </label>
                        </div>
                    </div>
                </div>
            </div>

            {/* Effects & Blur */}
            <div className="bg-white dark:bg-luxury-obsidian p-8 rounded-3xl border border-luxury-gold/10 shadow-luxury space-y-6">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-luxury-gold/10 rounded-full flex items-center justify-center text-luxury-gold">
                        <Sparkles size={20} />
                    </div>
                    <h3 className="font-bold text-lg dark:text-white">Background Effects</h3>
                </div>

                <div className="space-y-6">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <label className="text-sm font-bold dark:text-white">Blur Intensity</label>
                            <span className="text-luxury-gold font-bold font-mono">{localSettings.backgroundBlur}%</span>
                        </div>
                        <input 
                            type="range" 
                            min="0" 
                            max="100" 
                            value={localSettings.backgroundBlur}
                            onChange={(e) => setLocalSettings({...localSettings, backgroundBlur: parseInt(e.target.value)})}
                            className="w-full h-2 bg-gray-200 dark:bg-white/10 rounded-lg appearance-none cursor-pointer accent-luxury-gold"
                        />
                    </div>

                    <div className="p-4 bg-luxury-gold/5 border border-luxury-gold/10 rounded-2xl">
                        <div className="flex gap-4">
                            <div className="w-12 h-12 rounded-lg bg-white/10 border border-white/10 overflow-hidden shrink-0">
                                <div 
                                    className="w-full h-full"
                                    style={{ 
                                        backgroundColor: localSettings.backgroundColor,
                                        backgroundImage: `url(${localSettings.backgroundImage})`,
                                        backgroundSize: 'cover',
                                        filter: `blur(${localSettings.backgroundBlur / 4}px)`
                                    }}
                                />
                            </div>
                            <div>
                                <p className="text-xs font-bold dark:text-white mb-1">Live Preview Logic</p>
                                <p className="text-[10px] text-gray-500 leading-relaxed">
                                    If an image is provided, it will fill the screen with a blur effect of {localSettings.backgroundBlur}%. 
                                    If no image is provided, the solid color ({localSettings.backgroundColor}) will be used.
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
