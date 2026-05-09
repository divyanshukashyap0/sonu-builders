import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, Search, Filter, Edit2, Trash2, 
    Eye, Copy, MapPin, Grid, List, 
    TrendingUp, Award, ExternalLink, MousePointer2,
    CheckCircle2, Clock, Hammer, Inbox, ArrowUpRight
} from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useConfirmDelete } from '../../hooks/useConfirmDelete';
import { useNavigate, Link } from 'react-router-dom';

const PROJECT_CATEGORIES = [
    'Living Room', 'Bedroom', 'Kitchen', 'Bathroom', 'TV Unit', 'Wardrobe', 
    'False Ceiling', 'Balcony', 'Dining Room', 'Pooja Room', 'Home Office', 
    'Full Home Interior', 'Commercial Interior', 'Office Interior'
];

const AdminProjects: React.FC = () => {
    const { projects, deleteProject, duplicateProject } = useProjects();
    const { confirmDelete } = useConfirmDelete();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

    const filteredProjects = projects.filter(p => {
        const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCat = categoryFilter === 'All' || p.category === categoryFilter;
        return matchesSearch && matchesCat;
    });

    const handleDelete = (id: string) => {
        confirmDelete(
            async () => {
                await deleteProject(id);
            },
            {
                firstMessage: "Terminate this masterpiece from the global records?",
                secondMessage: "FINAL CONFIRMATION: Are you absolutely sure you want to obliterate this project? This cannot be undone.",
                successMessage: "Project successfully removed from portfolio."
            }
        );
    };

    return (
        <div className="space-y-12 animate-fadeIn pb-20">
            {/* Cinematic Header */}
            <div className="flex flex-col xl:flex-row justify-between items-start xl:items-end gap-8">
                <div className="space-y-6">
                    <div className="flex items-center gap-4">
                        <div className="w-2 h-14 bg-luxury-gold rounded-full" />
                        <div>
                            <p className="text-luxury-gold font-black uppercase tracking-[0.4em] text-[10px] mb-2">Masterpiece Inventory</p>
                            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white tracking-tighter">Portfolio Hub</h1>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 w-full xl:w-auto">
                    <div className="relative group flex-1 md:flex-none">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-600 group-focus-within:text-luxury-gold transition-colors" size={20} />
                        <input 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-6 text-xs font-bold text-white focus:outline-none focus:border-luxury-gold/50 transition-all" 
                            placeholder="Scan architectural assets..." 
                        />
                    </div>
                    <Link 
                        to="/admin/projects/new"
                        className="flex items-center justify-center gap-3 px-10 py-5 bg-luxury-gold text-stone-950 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] shadow-glow-gold hover:scale-105 active:scale-95 transition-all"
                    >
                        <Plus size={20} /> Orchestrate New
                    </Link>
                </div>
            </div>

            {/* Quick Intelligence Row */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                    { label: 'Total Assets', val: projects.length, icon: Inbox, color: 'text-luxury-gold' },
                    { label: 'Total Views', val: projects.reduce((a, b) => a + (b.views || 0), 0), icon: Eye, color: 'text-blue-500' },
                    { label: 'Leads Generated', val: projects.reduce((a, b) => a + (b.inquiryCount || 0), 0), icon: TrendingUp, color: 'text-green-500' },
                    { label: 'Featured', val: projects.filter(p => p.featured).length, icon: Award, color: 'text-purple-500' }
                ].map((stat, i) => (
                    <div key={i} className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col justify-between hover:border-luxury-gold/30 transition-all group">
                        <div className={`p-3 bg-white/5 rounded-xl w-fit ${stat.color} group-hover:scale-110 transition-transform`}><stat.icon size={20} /></div>
                        <div className="mt-4">
                            <p className="text-2xl font-serif font-bold text-white tracking-tight">{stat.val}</p>
                            <p className="text-[9px] font-black uppercase tracking-widest text-stone-500">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Orchestration Controls */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-8 bg-white/5 border border-white/10 p-6 rounded-[2.5rem] backdrop-blur-xl">
                <div className="flex flex-wrap gap-3 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                    {['All', ...PROJECT_CATEGORIES.slice(0, 8)].map(cat => (
                        <button 
                            key={cat}
                            onClick={() => setCategoryFilter(cat)}
                            className={`px-8 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                                categoryFilter === cat ? 'bg-luxury-gold border-luxury-gold text-stone-950 shadow-glow-gold' : 'bg-white/2 border-white/5 text-stone-500 hover:text-white'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>
                <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/10">
                    <button onClick={() => setViewMode('list')} className={`p-3 rounded-xl transition-all ${viewMode === 'list' ? 'bg-luxury-gold text-stone-950 shadow-glow-gold' : 'text-stone-500'}`}><List size={18} /></button>
                    <button onClick={() => setViewMode('grid')} className={`p-3 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-luxury-gold text-stone-950 shadow-glow-gold' : 'text-stone-500'}`}><Grid size={18} /></button>
                </div>
            </div>

            {/* Assets Matrix */}
            <AnimatePresence mode="wait">
                {viewMode === 'list' ? (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-[3rem] overflow-hidden shadow-3xl"
                    >
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse">
                                <thead>
                                    <tr className="border-b border-white/5">
                                        <th className="px-10 py-10 text-left text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">Asset Identity</th>
                                        <th className="px-10 py-10 text-left text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">Geography</th>
                                        <th className="px-10 py-10 text-left text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">Intelligence Matrix</th>
                                        <th className="px-10 py-10 text-left text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">Vitals</th>
                                        <th className="px-10 py-10 text-right text-[10px] font-black uppercase tracking-[0.3em] text-stone-500">Interventions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {filteredProjects.map((project, idx) => (
                                        <motion.tr 
                                            key={project.id}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="group hover:bg-white/[0.03] transition-all cursor-default"
                                        >
                                            <td className="px-10 py-10">
                                                <div className="flex items-center gap-8">
                                                    <div className="relative w-20 h-20 rounded-[1.5rem] overflow-hidden border border-white/10 group-hover:border-luxury-gold/50 transition-all">
                                                        <img src={project.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-125" alt="" />
                                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                            <MousePointer2 size={24} className="text-luxury-gold" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <h4 className="text-lg font-serif font-bold text-white group-hover:text-luxury-gold transition-colors leading-tight">{project.title}</h4>
                                                        <div className="flex items-center gap-3 mt-2">
                                                            <span className="text-[9px] text-stone-500 uppercase tracking-widest font-black">{project.category}</span>
                                                            {project.featured && <Award size={12} className="text-luxury-gold" />}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-10">
                                                <div className="flex items-center gap-3 text-stone-400">
                                                    <MapPin size={18} className="text-luxury-gold/60" />
                                                    <span className="text-xs font-medium tracking-tight">{project.city || 'Pan-India'}</span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-10">
                                                <div className="flex gap-8">
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-white">{project.views || 0}</span>
                                                        <span className="text-[8px] text-stone-600 uppercase font-black tracking-widest mt-1">Views</span>
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <span className="text-sm font-black text-luxury-gold">{project.inquiryCount || 0}</span>
                                                        <span className="text-[8px] text-stone-600 uppercase font-black tracking-widest mt-1">Leads</span>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-10 py-10">
                                                <div className="flex flex-col gap-2">
                                                    <span className={`px-4 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest w-fit border ${
                                                        project.status === 'Completed' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 'bg-luxury-gold/10 text-luxury-gold border-luxury-gold/20'
                                                    }`}>
                                                        {project.status}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-10 py-10">
                                                <div className="flex items-center justify-end gap-4 opacity-0 group-hover:opacity-100 transition-all translate-x-10 group-hover:translate-x-0">
                                                    <button onClick={() => duplicateProject(project.id)} title="Replicate Asset" className="p-4 bg-white/5 text-stone-500 hover:text-blue-400 rounded-2xl border border-white/5 transition-all"><Copy size={20} /></button>
                                                    <button onClick={() => navigate(`/admin/projects/edit/${project.id}`)} title="Refine Core" className="p-4 bg-white/5 text-stone-500 hover:text-luxury-gold rounded-2xl border border-white/5 transition-all"><Edit2 size={20} /></button>
                                                    <button onClick={() => handleDelete(project.id)} title="Obliterate" className="p-4 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-2xl border border-red-500/10 transition-all"><Trash2 size={20} /></button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                    >
                        {filteredProjects.map((project, idx) => (
                            <motion.div 
                                key={project.id}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative bg-white/5 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl hover:border-luxury-gold/30 transition-all"
                            >
                                <div className="aspect-[4/3] relative overflow-hidden">
                                    <img src={project.image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-stone-950 to-transparent opacity-80" />
                                    <div className="absolute top-6 right-6 flex gap-2">
                                        <span className="px-4 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-white border border-white/10">{project.status}</span>
                                    </div>
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all backdrop-blur-sm flex items-center justify-center gap-4">
                                         <button onClick={() => navigate(`/admin/projects/edit/${project.id}`)} className="p-5 bg-luxury-gold text-stone-950 rounded-2xl hover:scale-110 transition-all shadow-glow-gold"><Edit2 size={24} /></button>
                                         <button onClick={() => handleDelete(project.id)} className="p-5 bg-red-500 text-white rounded-2xl hover:scale-110 transition-all shadow-xl"><Trash2 size={24} /></button>
                                    </div>
                                </div>
                                <div className="p-8">
                                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-luxury-gold mb-2">{project.category}</p>
                                    <h3 className="text-xl font-serif font-bold text-white group-hover:text-luxury-gold transition-colors">{project.title}</h3>
                                    <div className="mt-6 pt-6 border-t border-white/5 flex items-center justify-between">
                                        <div className="flex items-center gap-3 text-stone-500">
                                            <Eye size={14} />
                                            <span className="text-xs font-black">{project.views || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-3 text-luxury-gold">
                                            <TrendingUp size={14} />
                                            <span className="text-xs font-black">{project.inquiryCount || 0}</span>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {filteredProjects.length === 0 && (
                <div className="py-40 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                    <Inbox className="w-20 h-20 text-stone-800 mx-auto mb-8" />
                    <h3 className="text-3xl font-serif font-bold text-stone-600">No Masterpieces Found</h3>
                    <p className="text-[10px] uppercase tracking-[0.4em] text-stone-700 mt-3 font-black">Sync your architectural records to begin.</p>
                </div>
            )}
        </div>
    );
};

export default AdminProjects;
