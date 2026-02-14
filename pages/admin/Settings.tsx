import React, { useState, useEffect } from 'react';
import { Save, Globe, Lock, Bell, Palette, Phone, Mail, MapPin } from 'lucide-react';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useTheme } from '../../context/ThemeContext';

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
        projectsCompleted: '400+'
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const docSnap = await getDoc(doc(db, 'settings', 'general'));
                if (docSnap.exists()) {
                    setGeneralData(docSnap.data() as any);
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

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'settings', 'general'), generalData, { merge: true });
            alert('Settings saved successfully!');
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
                                        placeholder="e.g. 400+"
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

                    <div className="bg-white dark:bg-luxury-obsidian p-6 rounded-xl border border-luxury-gold/10 shadow-sm">
                        <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-luxury-charcoal dark:text-white">
                            <Palette className="text-luxury-gold" size={20} /> Appearance
                        </h3>
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-semibold text-luxury-charcoal dark:text-white">Theme Mode</p>
                                <p className="text-sm text-gray-500">Toggle between light and dark themes.</p>
                            </div>
                            <button
                                onClick={toggleTheme}
                                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-luxury-gold focus:ring-offset-2 ${theme === 'dark' ? 'bg-luxury-gold' : 'bg-gray-200'}`}
                            >
                                <span
                                    className={`${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Sidebar Settings placeholder - kept simple for now */}
                <div className="space-y-6">
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
