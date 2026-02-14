import React, { useState } from 'react';
import {
    Plus,
    Search,
    Filter,
    Edit,
    Trash2,
    Eye,
    LayoutGrid,
    List as ListIcon,
    Loader2
} from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { Project } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';

const Projects: React.FC = () => {
    const { projects, loading, error, deleteProject } = useProjects();
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const filteredProjects = projects.filter(project =>
        project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        project.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
            await deleteProject(id);
        }
    }

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white">Portfolio Projects</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Manage your completed and ongoing works.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex bg-gray-100 dark:bg-white/5 rounded-lg p-1 border border-gray-200 dark:border-white/10">
                        <button
                            onClick={() => setViewMode('list')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'list' ? 'bg-white dark:bg-luxury-gold/20 shadow-sm text-luxury-gold' : 'text-gray-500'}`}
                        >
                            <ListIcon size={18} />
                        </button>
                        <button
                            onClick={() => setViewMode('grid')}
                            className={`p-2 rounded-md transition-colors ${viewMode === 'grid' ? 'bg-white dark:bg-luxury-gold/20 shadow-sm text-luxury-gold' : 'text-gray-500'}`}
                        >
                            <LayoutGrid size={18} />
                        </button>
                    </div>
                    <Link
                        to="/admin/projects/new"
                        className="flex items-center gap-2 bg-luxury-gold text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-glow-gold hover:bg-white hover:text-luxury-charcoal transition-all"
                    >
                        <Plus size={18} />
                        <span>Add Project</span>
                    </Link>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white dark:bg-luxury-obsidian p-4 rounded-xl border border-luxury-gold/10 flex items-center gap-4 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold/50 transition-colors"
                    />
                </div>
            </div>

            {/* Content */}
            {viewMode === 'list' ? (
                <div className="bg-white dark:bg-luxury-obsidian rounded-xl border border-luxury-gold/10 overflow-hidden shadow-sm">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-white/5 text-left text-xs uppercase text-gray-500 dark:text-gray-400 font-medium tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Title / Location</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            <AnimatePresence>
                                {filteredProjects.map((project) => (
                                    <motion.tr
                                        key={project.id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                                    >
                                        <td className="px-6 py-4 w-24">
                                            <img src={project.image} alt={project.title} className="w-16 h-12 object-cover rounded-lg" />
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="font-bold text-luxury-charcoal dark:text-white">{project.title}</p>
                                            <p className="text-xs text-gray-500">{project.description?.substring(0, 50)}...</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-white/10 dark:text-gray-300">
                                                {project.category}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => navigate(`/admin/projects/edit/${project.id}`)} className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-full transition-colors">
                                                    <Edit size={16} />
                                                </button>
                                                <button onClick={() => handleDelete(project.id)} className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full transition-colors">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                    {filteredProjects.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No projects found.</div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                    <AnimatePresence>
                        {filteredProjects.map((project) => (
                            <motion.div
                                key={project.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white dark:bg-luxury-obsidian rounded-xl border border-luxury-gold/10 overflow-hidden shadow-sm group"
                            >
                                <div className="h-48 relative overflow-hidden">
                                    <img src={project.image} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button onClick={() => navigate(`/admin/projects/edit/${project.id}`)} className="p-2 bg-white text-luxury-charcoal rounded-full hover:bg-luxury-gold hover:text-white transition-colors">
                                            <Edit size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(project.id)} className="p-2 bg-white text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-4">
                                    <h3 className="font-bold text-luxury-charcoal dark:text-white truncate">{project.title}</h3>
                                    <p className="text-xs text-luxury-gold">{project.category}</p>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default Projects;
