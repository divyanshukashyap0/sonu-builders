import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Image as ImageIcon } from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { Project, ProjectCategory } from '../../types';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';

const ProjectForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addProject, updateProject } = useProjects();

    const [formData, setFormData] = useState<Partial<Project>>({
        title: '',
        category: ProjectCategory.RESIDENTIAL,
        location: '',
        image: '',
        description: '',
        gallery: []
    });
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(!!id);

    useEffect(() => {
        if (id) {
            const fetchProject = async () => {
                const docRef = doc(db, 'projects', id);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    setFormData(docSnap.data() as Project);
                }
                setFetching(false);
            };
            fetchProject();
        }
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (id) {
                await updateProject(id, formData);
            } else {
                await addProject(formData as Omit<Project, 'id'>);
            }
            navigate('/admin/projects');
        } catch (error) {
            console.error("Error saving project:", error);
            alert("Failed to save project.");
        } finally {
            setLoading(false);
        }
    };

    if (fetching) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center gap-4">
                <button
                    onClick={() => navigate('/admin/projects')}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
                </button>
                <h2 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white">
                    {id ? 'Edit Project' : 'Add New Project'}
                </h2>
            </div>

            <form onSubmit={handleSubmit} className="bg-white dark:bg-luxury-obsidian p-8 rounded-xl border border-luxury-gold/10 shadow-sm space-y-6">

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Project Title *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-white/5 focus:outline-none focus:border-luxury-gold transition-colors"
                            placeholder="e.g. Modern Villa Renewal"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Location *</label>
                        <input
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-white/5 focus:outline-none focus:border-luxury-gold transition-colors"
                            placeholder="e.g. Mumbai, India"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Category *</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-white/5 focus:outline-none focus:border-luxury-gold transition-colors"
                        >
                            {Object.values(ProjectCategory).map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Image URL (Simple for now, can implement Upload later) */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Main Image URL *</label>
                    <div className="flex gap-4 items-start">
                        <div className="flex-1">
                            <input
                                type="url"
                                name="image"
                                value={formData.image}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-white/5 focus:outline-none focus:border-luxury-gold transition-colors"
                                placeholder="https://..."
                            />
                            <p className="text-xs text-gray-500 mt-1">Paste a direct link to an image.</p>
                        </div>
                        {formData.image && (
                            <div className="w-24 h-16 rounded-lg overflow-hidden border border-gray-200">
                                <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                            </div>
                        )}
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Description *</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-white/10 rounded-lg bg-gray-50 dark:bg-white/5 focus:outline-none focus:border-luxury-gold transition-colors"
                        placeholder="Describe the project..."
                    />
                </div>

                <div className="pt-4 border-t border-gray-100 dark:border-white/5 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-luxury-gold text-white px-6 py-3 rounded-lg font-bold shadow-glow-gold hover:bg-white hover:text-luxury-charcoal transition-all flex items-center gap-2 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                        {id ? 'Update Project' : 'Create Project'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default ProjectForm;
