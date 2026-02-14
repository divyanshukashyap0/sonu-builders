import React, { useState, useEffect } from 'react';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, Save, Image, Type, CheckCircle } from 'lucide-react';

interface FieldConfig {
    key: string;
    label: string;
    type: 'text' | 'textarea' | 'image';
    placeholder?: string;
}

interface AdminSectionEditorProps {
    sectionId: string;
    title: string;
    fields: FieldConfig[];
}

const AdminSectionEditor: React.FC<AdminSectionEditorProps> = ({ sectionId, title, fields }) => {
    const [data, setData] = useState<Record<string, any>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            if (!db) return;
            try {
                const docSnap = await getDoc(doc(db, 'site_content', sectionId));
                if (docSnap.exists()) {
                    setData(docSnap.data());
                }
            } catch (error) {
                console.error("Error loading section data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [sectionId]);

    const getNestedValue = (obj: any, path: string) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const setNestedValue = (obj: any, path: string, value: any) => {
        const parts = path.split('.');
        const last = parts.pop()!;
        const target = parts.reduce((acc, part) => {
            if (!acc[part]) acc[part] = {};
            return acc[part];
        }, obj);
        target[last] = value;
        return { ...obj };
    };

    const handleChange = (key: string, value: string) => {
        setData(prev => setNestedValue({ ...prev }, key, value));
        setSuccess(false);
    };

    const handleSave = async () => {
        setSaving(true);
        try {
            await setDoc(doc(db, 'site_content', sectionId), data, { merge: true });
            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (error) {
            console.error("Error saving section data:", error);
            alert("Failed to save changes.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-luxury-gold" /></div>;
    }

    return (
        <div className="bg-white dark:bg-neutral-900 border border-luxury-gold/10 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 bg-gray-50 dark:bg-white/5 border-b border-luxury-gold/10 flex justify-between items-center">
                <h3 className="font-serif font-bold text-lg text-luxury-charcoal dark:text-white flex items-center gap-2">
                    <span className="w-2 h-8 bg-luxury-gold rounded-full inline-block"></span>
                    {title}
                </h3>
                {success && <span className="text-green-500 text-sm flex items-center gap-1"><CheckCircle size={14} /> Saved</span>}
            </div>

            <div className="p-6 space-y-6">
                {fields.map((field) => (
                    <div key={field.key} className="space-y-2">
                        <label className="text-xs uppercase tracking-wider font-bold text-gray-500 dark:text-gray-400 flex items-center gap-2">
                            {field.type === 'image' ? <Image size={14} /> : <Type size={14} />}
                            {field.label}
                        </label>

                        {field.type === 'textarea' ? (
                            <textarea
                                value={getNestedValue(data, field.key) || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                rows={4}
                                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-white/10 rounded-lg p-3 text-sm focus:ring-2 focus:ring-luxury-gold/50 outline-none transition-all text-luxury-charcoal dark:text-white"
                            />
                        ) : (
                            <input
                                type="text"
                                value={getNestedValue(data, field.key) || ''}
                                onChange={(e) => handleChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                className="w-full bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-white/10 rounded-lg p-3 text-sm focus:ring-2 focus:ring-luxury-gold/50 outline-none transition-all text-luxury-charcoal dark:text-white"
                            />
                        )}

                        {field.type === 'image' && getNestedValue(data, field.key) && (
                            <div className="mt-2 relative group w-fit">
                                <img
                                    src={getNestedValue(data, field.key)}
                                    alt="Preview"
                                    className="h-20 w-auto rounded-lg border border-gray-200 dark:border-white/10 object-cover"
                                />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg pointer-events-none">
                                    <span className="text-white text-xs">Preview</span>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="p-4 bg-gray-50 dark:bg-white/5 border-t border-luxury-gold/10 flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 bg-luxury-gold text-white px-6 py-2 rounded-lg hover:bg-luxury-gold/90 transition-all font-bold text-sm disabled:opacity-50"
                >
                    {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                    {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

export default AdminSectionEditor;
