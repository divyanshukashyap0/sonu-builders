import React, { useState, useEffect } from 'react';
import { Save, Globe, Lock, Bell, Palette, Phone, Mail, MapPin, User, ImageIcon } from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useTheme } from '../../context/ThemeContext';
import CloudinaryImageInput from '../../components/admin/media/CloudinaryImageInput';

const Settings: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const [generalData, setGeneralData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        footerDescription: '',
        yearsExperience: '15+',
        projectsCompleted: '4500+',
        projectsMaintenance: false
    });
    const [founderData, setFounderData] = useState({
        founderName: '',
        founderTitle: '',
        founderImage: '',
        founderBio: ''
    });
    const [socialData, setSocialData] = useState({
        facebook: '',
        twitter: '',
        instagram: '',
        linkedin: '',
        whatsapp: ''
    });

    const [themeData, setThemeData] = useState({
        activeTheme: 'royal_gold' as 'obsidian_copper' | 'royal_gold' | 'industrial_luxury'
    });

    const LUXURY_THEMES = {
        'obsidian_copper': {
            name: 'Obsidian Copper',
            description: 'Dark charcoal with deep copper accents',
            preview: '#b87333'
        },
        'royal_gold': {
            name: 'Royal Gold',
            description: 'True black with 24k luxury gold',
            preview: '#D4AF37'
        },
        'industrial_luxury': {
            name: 'Industrial Luxury',
            description: 'Dark concrete grey with copper highlights',
            preview: '#4a4a4a'
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const genSnap = await getDoc(doc(db, 'settings', 'general'));
                if (genSnap.exists()) {
                    setGeneralData(genSnap.data() as any);
                }
                const socSnap = await getDoc(doc(db, 'settings', 'social'));
                if (socSnap.exists()) {
                    setSocialData(socSnap.data() as any);
                }
                const appSnap = await getDoc(doc(db, 'settings', 'appearance'));
                if (appSnap.exists()) {
                    setThemeData(appSnap.data() as any);
                }
                const aboutSnap = await getDoc(doc(db, 'site_content', 'about'));
                if (aboutSnap.exists()) {
                    const data = aboutSnap.data();
                    setFounderData({
                        founderName: data.founderName || '',
                        founderTitle: data.founderTitle || '',
                        founderImage: data.founderImage || '',
                        founderBio: data.founderBio || ''
                    });
                }
            } catch (error) {
                console.error("Error fetching settings:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setGeneralData(prev => ({ ...prev, [name]: value }));
    };

    const handleFounderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFounderData(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setSocialData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'settings', 'general'), generalData, { merge: true });
            await setDoc(doc(db, 'settings', 'social'), socialData, { merge: true });
            await setDoc(doc(db, 'settings', 'appearance'), themeData, { merge: true });
            await updateDoc(doc(db, 'site_content', 'about'), founderData);
            alert('Settings saved successfully! The new theme is now active for all users.');
        } catch (error) {
            console.error("Error saving settings:", error);
            alert('Failed to save settings.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading settings...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white">Settings</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Configure global website settings and numbers.</p>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-luxury-gold text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-glow-gold hover:bg-white hover:text-luxury-charcoal transition-all disabled:opacity-50"
                >
                    <Save size={18} />
                    <span>{saving ? 'Saving...' : 'Save Changes'}</span>
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* General Settings */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white dark:bg-luxury-obsidian p-6 rounded-xl border border-luxury-gold/10 shadow-sm transition-all hover:border-luxury-gold/30">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-luxury-charcoal dark:text-white">
                            <Lock className="text-luxury-gold" size={20} /> Page Management
                        </h3>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-4 bg-luxury-gold/5 rounded-lg border border-luxury-gold/10">
                                <div className="max-w-[70%]">
                                    <p className="font-bold text-luxury-charcoal dark:text-white">Projects Maintenance Mode</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">When enabled, the Projects page will show an 'Under Construction' message to all users.</p>
                                </div>
                                <button
                                    onClick={() => setGeneralData(prev => ({ ...prev, projectsMaintenance: !prev.projectsMaintenance }))}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${generalData.projectsMaintenance ? 'bg-luxury-gold' : 'bg-gray-300 dark:bg-gray-700'}`}
                                >
                                    <span
                                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${generalData.projectsMaintenance ? 'translate-x-6' : 'translate-x-1'}`}
                                    />
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-luxury-obsidian p-6 rounded-xl border border-luxury-gold/10 shadow-sm">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-luxury-charcoal dark:text-white">
                            <Globe className="text-luxury-gold" size={20} /> Connection Numbers
                        </h3>
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-luxury-charcoal dark:text-white">Company Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={generalData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-white/5 dark:border-white/10 dark:text-white focus:border-luxury-gold outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-luxury-charcoal dark:text-white">Contact Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                        <input
                                            type="email"
                                            name="email"
                                            value={generalData.email}
                                            onChange={handleChange}
                                            className="w-full pl-10 px-4 py-2 border rounded-lg dark:bg-white/5 dark:border-white/10 dark:text-white focus:border-luxury-gold outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-luxury-charcoal dark:text-white">Phone Number</label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            name="phone"
                                            value={generalData.phone}
                                            onChange={handleChange}
                                            className="w-full pl-10 px-4 py-2 border rounded-lg dark:bg-white/5 dark:border-white/10 dark:text-white focus:border-luxury-gold outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-luxury-charcoal dark:text-white">Years of Experience</label>
                                    <input
                                        type="text"
                                        name="yearsExperience"
                                        value={generalData.yearsExperience}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-white/5 dark:border-white/10 dark:text-white focus:border-luxury-gold outline-none"
                                        placeholder="e.g. 15+"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-luxury-charcoal dark:text-white">Projects Completed</label>
                                    <input
                                        type="text"
                                        name="projectsCompleted"
                                        value={generalData.projectsCompleted}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-white/5 dark:border-white/10 dark:text-white focus:border-luxury-gold outline-none"
                                        placeholder="e.g. 4500+"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-semibold mb-2 text-luxury-charcoal dark:text-white">Address</label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-3 text-gray-400" size={16} />
                                    <textarea
                                        name="address"
                                        value={generalData.address}
                                        onChange={handleChange}
                                        className="w-full pl-10 px-4 py-2 border rounded-lg dark:bg-white/5 dark:border-white/10 dark:text-white focus:border-luxury-gold outline-none"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-luxury-obsidian p-6 rounded-xl border border-luxury-gold/10 shadow-sm transition-all hover:border-luxury-gold/30">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-luxury-charcoal dark:text-white">
                            <User className="text-luxury-gold" size={20} /> Founder Profile
                        </h3>
                        <div className="flex flex-col md:flex-row gap-8">
                            {/* Image Preview */}
                            <div className="w-full md:w-1/3">
                                <label className="block text-xs font-bold uppercase tracking-widest text-luxury-gold mb-3">Professional Photo</label>
                                <div className="aspect-[4/5] rounded-xl overflow-hidden border border-luxury-gold/20 bg-black/40 relative group">
                                    {founderData.founderImage ? (
                                        <img 
                                            src={founderData.founderImage} 
                                            alt="Founder Preview" 
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                                            <ImageIcon size={32} className="mb-2 opacity-20" />
                                            <span className="text-[10px] uppercase tracking-tighter">No Image</span>
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-4">
                                        <p className="text-[10px] text-white text-center uppercase tracking-widest leading-relaxed">Update URL below to change photo</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Fields */}
                            <div className="flex-1 space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-luxury-charcoal dark:text-white">Founder Name</label>
                                    <input
                                        type="text"
                                        name="founderName"
                                        value={founderData.founderName}
                                        onChange={handleFounderChange}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-white/5 dark:border-white/10 dark:text-white focus:border-luxury-gold outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-luxury-charcoal dark:text-white">Professional Title</label>
                                    <input
                                        type="text"
                                        name="founderTitle"
                                        value={founderData.founderTitle}
                                        onChange={handleFounderChange}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-white/5 dark:border-white/10 dark:text-white focus:border-luxury-gold outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-luxury-charcoal dark:text-white">Photo URL</label>
                                    <div className="relative">
                                        <ImageIcon className="absolute left-3 top-2.5 text-gray-400" size={16} />
                                        <input
                                            type="text"
                                            name="founderImage"
                                            value={founderData.founderImage}
                                            onChange={handleFounderChange}
                                            className="w-full pl-10 px-4 py-2 border rounded-lg dark:bg-white/5 dark:border-white/10 dark:text-white focus:border-luxury-gold outline-none"
                                            placeholder="https://images.unsplash.com/..."
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-2 text-luxury-charcoal dark:text-white">Professional Bio</label>
                                    <textarea
                                        name="founderBio"
                                        value={founderData.founderBio}
                                        onChange={handleFounderChange}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-white/5 dark:border-white/10 dark:text-white focus:border-luxury-gold outline-none"
                                        rows={4}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-luxury-obsidian p-6 rounded-xl border border-luxury-gold/10 shadow-sm transition-all hover:border-luxury-gold/30">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-luxury-charcoal dark:text-white">
                            <Globe className="text-luxury-gold" size={20} /> Social Connect
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { name: 'facebook', label: 'Facebook URL' },
                                { name: 'instagram', label: 'Instagram URL' },
                                { name: 'twitter', label: 'Twitter URL' },
                                { name: 'linkedin', label: 'LinkedIn URL' },
                                { name: 'whatsapp', label: 'WhatsApp Number (+91...)' }
                            ].map((field) => (
                                <div key={field.name}>
                                    <label className="block text-sm font-semibold mb-2 text-luxury-charcoal dark:text-white">{field.label}</label>
                                    <input
                                        type="text"
                                        name={field.name}
                                        value={(socialData as any)[field.name]}
                                        onChange={handleSocialChange}
                                        className="w-full px-4 py-2 border rounded-lg dark:bg-white/5 dark:border-white/10 dark:text-white focus:border-luxury-gold outline-none"
                                        placeholder={`Enter ${field.name} link`}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white dark:bg-luxury-obsidian p-6 rounded-xl border border-luxury-gold/10 shadow-sm transition-all hover:border-luxury-gold/30">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-luxury-charcoal dark:text-white">
                            <Palette className="text-luxury-gold" size={20} /> Branding & Watermarking
                        </h3>
                        <div className="space-y-6">
                            <div className="p-4 bg-luxury-gold/5 rounded-lg border border-luxury-gold/10">
                                <p className="text-sm font-bold text-luxury-charcoal dark:text-white mb-2">Watermark Logo</p>
                                <p className="text-xs text-gray-500 mb-4">Upload your official logo (PNG with transparency recommended). This will be applied to the bottom-right corner of all portfolio and service images at 50% opacity.</p>
                                <CloudinaryImageInput
                                    label="Watermark Logo Asset"
                                    value={generalData.watermarkLogo || ''}
                                    onChange={(url) => setGeneralData(prev => ({ ...prev, watermarkLogo: url }))}
                                    folder="branding"
                                    publicId="branding/website_watermark_logo"
                                />
                            </div>
                            
                            <div className="p-4 bg-luxury-gold/5 rounded-lg border border-luxury-gold/10">
                                <h4 className="font-bold text-luxury-charcoal dark:text-white mb-4">Active Luxury Theme</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {Object.entries(LUXURY_THEMES).map(([id, themeInfo]) => (
                                        <button
                                            key={id}
                                            onClick={() => setThemeData({ activeTheme: id as any })}
                                            className={`p-4 rounded-xl border-2 transition-all text-left group ${themeData.activeTheme === id 
                                                ? 'border-luxury-gold bg-luxury-gold/10 ring-2 ring-luxury-gold/20' 
                                                : 'border-white/5 bg-white/5 hover:border-white/20'}`}
                                        >
                                            <div 
                                                className="w-8 h-8 rounded-full mb-3 shadow-lg" 
                                                style={{ backgroundColor: themeInfo.preview }}
                                            />
                                            <p className={`font-bold text-xs uppercase tracking-widest ${themeData.activeTheme === id ? 'text-luxury-gold' : 'text-white'}`}>
                                                {themeInfo.name}
                                            </p>
                                            <p className="text-[10px] text-gray-400 mt-1 line-clamp-2">
                                                {themeInfo.description}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar Info */}
                <div className="space-y-6">
                    <div className="bg-luxury-gold/5 p-6 rounded-xl border border-luxury-gold/20 shadow-sm">
                        <h3 className="font-bold text-lg mb-4 text-luxury-gold">Active Dashboard</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                            You are currently managing the core business entity settings. Changes here affect global headers, SEO, and legal identifiers.
                        </p>
                        <div className="p-4 bg-white/5 rounded-lg border border-white/5 space-y-2">
                            <p className="text-[10px] uppercase tracking-widest text-gray-400">Last Synced</p>
                            <p className="text-sm text-white font-mono">{new Date().toLocaleDateString()}</p>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-luxury-obsidian p-6 rounded-xl border border-luxury-gold/10 shadow-sm opacity-50 pointer-events-none">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-luxury-charcoal dark:text-white">
                            <Lock className="text-luxury-gold" size={20} /> Security
                        </h3>
                        <p className="text-sm text-gray-500">Security settings are managed by Firebase Auth.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
