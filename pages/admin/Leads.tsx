import React, { useState } from 'react';
import {
    Search,
    Filter,
    Plus,
    MoreVertical,
    Mail,
    Calendar,
    LayoutGrid,
    List as ListIcon,
    Loader2,
    Trash2,
    ExternalLink
} from 'lucide-react';
import { Lead, LeadStatus } from '../../types';
import { useLeads } from '../../hooks/useLeads';
import { useConfirmDelete } from '../../hooks/useConfirmDelete';
import { motion, AnimatePresence } from 'framer-motion';

const Leads: React.FC = () => {
    const { leads, loading, error, deleteLead } = useLeads();
    const { confirmDelete } = useConfirmDelete();
    const [viewMode, setViewMode] = useState<'list' | 'kanban'>('list');
    const [searchTerm, setSearchTerm] = useState('');
    const [deletingId, setDeletingId] = useState<string | null>(null);

    const filteredLeads = leads.filter(lead =>
        lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        lead.projectType.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const getStatusColor = (status: LeadStatus) => {
        switch (status) {
            case 'New': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
            case 'Contacted': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
            case 'Qualified': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
            case 'Proposal': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
            case 'Won': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
            case 'Lost': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
            default: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
        }
    };

    const handleDelete = (e: React.MouseEvent, id: string) => {
        e.stopPropagation();
        confirmDelete(
            async () => {
                setDeletingId(id);
                try {
                    await deleteLead(id);
                } finally {
                    setDeletingId(null);
                }
            },
            {
                firstMessage: "Delete this lead? This action cannot be undone.",
                secondMessage: "ARE YOU ABSOLUTELY SURE? You will lose all contact information for this lead.",
                successMessage: "Lead deleted successfully."
            }
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white">Lead Management</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Track and manage potential clients from inquiry to conversion.</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-luxury-gold text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-glow-gold hover:bg-white hover:text-luxury-charcoal transition-all">
                        <Plus size={18} />
                        <span>Add Lead</span>
                    </button>
                </div>
            </div>

            {/* Filters & Search */}
            <div className="bg-white dark:bg-luxury-obsidian p-4 rounded-xl border border-luxury-gold/10 flex flex-col md:flex-row gap-4 items-center justify-between shadow-sm">
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search leads by name, email, or project..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-luxury-gold/50 transition-colors"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 dark:border-white/10 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 text-sm font-medium transition-colors w-full md:w-auto justify-center">
                    <Filter size={16} />
                    <span>Filters</span>
                </button>
            </div>

            {/* List View / Card View Responsive Switch */}
            {viewMode === 'list' && (
                <div className="space-y-4">
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white dark:bg-luxury-obsidian rounded-xl border border-luxury-gold/10 overflow-hidden shadow-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-white/5 text-left text-xs uppercase text-gray-500 dark:text-gray-400 font-medium tracking-wider">
                                    <tr>
                                        <th className="px-6 py-4">Name / Contact</th>
                                        <th className="px-6 py-4">Project Details</th>
                                        <th className="px-6 py-4">Reference</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4">Source</th>
                                        <th className="px-6 py-4">Date</th>
                                        <th className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                    <AnimatePresence>
                                        {filteredLeads.map((lead) => (
                                            <motion.tr
                                                key={lead.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                onClick={() => window.location.href = `/admin/leads/${lead.id}`}
                                                className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold font-bold text-sm mr-3 border border-luxury-gold/20">
                                                            {lead.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-bold text-luxury-charcoal dark:text-white">{lead.name}</p>
                                                            <div className="flex items-center gap-2 mt-0.5">
                                                                <a href={`mailto:${lead.email}`} onClick={e => e.stopPropagation()} className="text-xs text-gray-500 hover:text-luxury-gold transition-colors flex items-center gap-1">
                                                                    <Mail size={10} />
                                                                    {lead.email}
                                                                </a>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <p className="text-sm font-medium text-luxury-charcoal dark:text-white">{lead.projectType}</p>
                                                    <p className="text-xs text-gray-500 mt-1">Budget: {lead.budget || 'N/A'}</p>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {lead.referredDesign && lead.referredDesign !== 'None' ? (
                                                        <div className="flex flex-col gap-1">
                                                            <span className="text-[10px] bg-luxury-gold/10 text-luxury-gold border border-luxury-gold/20 px-2 py-1 rounded font-bold uppercase tracking-wider inline-block w-fit">
                                                                {lead.referredDesign}
                                                            </span>
                                                            {lead.referredDesignId && (
                                                                <a 
                                                                    href={`/gallery/item/${lead.referredDesignId}`} 
                                                                    target="_blank" 
                                                                    rel="noreferrer"
                                                                    className="text-[9px] text-luxury-gold hover:underline flex items-center gap-1 font-bold uppercase tracking-tighter"
                                                                >
                                                                    View Design <ExternalLink size={10} />
                                                                </a>
                                                            )}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">Direct Inquiry</span>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(lead.status)}`}>
                                                        {lead.status}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="text-sm text-gray-600 dark:text-gray-300">{lead.source}</span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                        <Calendar size={12} />
                                                        {new Date(lead.createdAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2 text-luxury-gold">
                                                        <button
                                                            onClick={(e) => handleDelete(e, lead.id)}
                                                            className="p-2 hover:bg-red-50 dark:hover:bg-red-900/10 rounded-full transition-colors"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                        <MoreVertical size={16} />
                                                    </div>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-4">
                        {filteredLeads.map((lead) => (
                            <motion.div
                                key={lead.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                onClick={() => window.location.href = `/admin/leads/${lead.id}`}
                                className="bg-white dark:bg-luxury-obsidian p-4 rounded-xl border border-luxury-gold/10 shadow-sm space-y-4 active:scale-95 transition-transform"
                            >
                                <div className="flex justify-between items-start">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold font-bold border border-luxury-gold/20">
                                            {lead.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="font-bold dark:text-white">{lead.name}</p>
                                            <p className="text-xs text-gray-500">{lead.email}</p>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wider ${getStatusColor(lead.status)}`}>
                                        {lead.status}
                                    </span>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-white/5">
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Project</p>
                                        <p className="text-sm dark:text-gray-200">{lead.projectType}</p>
                                    </div>
                                    <div>
                                        <p className="text-[10px] uppercase text-gray-400 font-bold mb-1">Source</p>
                                        <p className="text-sm dark:text-gray-200">{lead.source}</p>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center pt-2">
                                    <span className="text-xs text-gray-400 flex items-center gap-1">
                                        <Calendar size={12} />
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </span>
                                    <button 
                                        onClick={(e) => handleDelete(e, lead.id)}
                                        className="text-red-400 text-xs font-bold uppercase tracking-widest flex items-center gap-1"
                                    >
                                        <Trash2 size={12} />
                                        Delete
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredLeads.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No leads found matching your search.</p>
                        </div>
                    )}
                </div>
            )}


        </div>
    );
};

export default Leads;
