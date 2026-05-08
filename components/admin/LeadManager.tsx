import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Trash2, Mail, Phone, MapPin, 
    Calendar, CheckCircle, Clock, Search,
    Filter, Download, ExternalLink, MessageCircle,
    User, Tag, MoreVertical, ChevronRight, Inbox,
    ArrowUpRight
} from 'lucide-react';
import { doc, deleteDoc, updateDoc, db } from '../../lib/firebase';
import { useNavigate } from 'react-router-dom';

interface LeadManagerProps {
    leads: any[];
}

const LeadManager: React.FC<LeadManagerProps> = ({ leads }) => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    const deleteLead = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this lead?')) {
            await deleteDoc(doc(db, 'leads', id));
        }
    };

    const setLeadStatus = async (id: string, status: string) => {
        await updateDoc(doc(db, 'leads', id), { status });
    };

    const filteredLeads = leads.filter(lead => {
        const nameMatch = (lead.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const emailMatch = (lead.email || '').toLowerCase().includes(searchTerm.toLowerCase());
        const projectMatch = (lead.referredDesign || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSearch = nameMatch || emailMatch || projectMatch;
        const matchesStatus = statusFilter === 'All' || lead.status === statusFilter;
        return matchesSearch && matchesStatus;
    }).sort((a, b) => {
        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        return dateB - dateA;
    });

    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <p className="text-luxury-gold font-black uppercase tracking-[0.4em] text-[10px] mb-2">Acquisition Hub</p>
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tighter">Inquiries</h2>
                </div>
                
                <div className="flex gap-4 w-full md:w-auto">
                    <div className="relative flex-1 md:flex-none group">
                        <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-stone-600 group-focus-within:text-luxury-gold transition-colors" size={18} />
                        <input 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            placeholder="Scan client intelligence..." 
                            className="w-full md:w-80 bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-xs font-bold text-white focus:outline-none focus:border-luxury-gold/50 transition-all"
                        />
                    </div>
                    <button className="p-4 bg-white/5 border border-white/10 rounded-2xl text-stone-500 hover:text-luxury-gold transition-all">
                        <Download size={20} />
                    </button>
                </div>
            </div>

            {/* Status Filters */}
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
                {['All', 'New', 'Contacted', 'Closed'].map(status => (
                    <button 
                        key={status}
                        onClick={() => setStatusFilter(status)}
                        className={`px-8 py-2.5 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
                            statusFilter === status ? 'bg-luxury-gold border-luxury-gold text-stone-950 shadow-glow-gold' : 'bg-white/5 border-white/10 text-stone-500 hover:text-white'
                        }`}
                    >
                        {status}
                    </button>
                ))}
            </div>

            {/* Leads Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                    {filteredLeads.map((lead, idx) => (
                        <motion.div 
                            key={lead.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ delay: idx * 0.05 }}
                            className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-[2.5rem] p-10 shadow-3xl flex flex-col relative group overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-luxury-gold/5 blur-3xl -mr-16 -mt-16 group-hover:bg-luxury-gold/10 transition-all" />
                            
                            {/* Card Header */}
                            <div className="flex justify-between items-start mb-10 relative z-10">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 rounded-2xl bg-luxury-gold/10 flex items-center justify-center text-luxury-gold font-serif font-black text-2xl border border-luxury-gold/20 shadow-xl group-hover:bg-luxury-gold group-hover:text-stone-950 transition-all duration-500">
                                        {lead.name ? lead.name[0] : '?'}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white tracking-tight">{lead.name || 'Anonymous Intelligence'}</h3>
                                        <div className="flex items-center gap-2 text-[9px] text-stone-500 font-black uppercase tracking-widest mt-1">
                                            <Clock size={12} /> {lead.createdAt ? new Date(lead.createdAt).toLocaleDateString() : 'Historical Data'}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-end gap-2">
                                    <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-xl border ${
                                        lead.status === 'New' ? 'bg-blue-500 text-white border-blue-400' : 
                                        lead.status === 'Closed' ? 'bg-stone-800 text-stone-500 border-stone-700' : 'bg-green-500 text-white border-green-400'
                                    }`}>
                                        {lead.status || 'New'}
                                    </span>
                                </div>
                            </div>

                            {/* Contact Matrix */}
                            <div className="grid grid-cols-1 gap-4 mb-10 relative z-10">
                                <a href={`mailto:${lead.email}`} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-luxury-gold/30 transition-all group/link">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-stone-500 group-hover/link:text-luxury-gold transition-all">
                                        <Mail size={18} />
                                    </div>
                                    <span className="text-sm font-medium text-stone-300 truncate">{lead.email || 'No electronic bridge'}</span>
                                </a>
                                <a href={`tel:${lead.phone}`} className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl hover:border-luxury-gold/30 transition-all group/link">
                                    <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-stone-500 group-hover/link:text-luxury-gold transition-all">
                                        <Phone size={18} />
                                    </div>
                                    <span className="text-sm font-medium text-stone-300">{lead.phone || 'No voice signal'}</span>
                                </a>
                                {lead.city && (
                                    <div className="flex items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-2xl">
                                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-stone-500">
                                            <MapPin size={18} />
                                        </div>
                                        <span className="text-sm font-medium text-stone-300">{lead.city}</span>
                                    </div>
                                )}
                            </div>

                            {/* Intelligence Payload */}
                            <div className="flex-1 bg-stone-950/50 p-6 rounded-[2rem] border border-white/5 mb-10 relative z-10">
                                <div className="flex items-center justify-between mb-4">
                                    <p className="text-[9px] font-black uppercase tracking-[0.3em] text-luxury-gold flex items-center gap-2">
                                        <Tag size={10} /> {lead.projectType || 'General Consultation'}
                                    </p>
                                    {lead.budget && (
                                        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-stone-500">
                                            Budget: {lead.budget}
                                        </p>
                                    )}
                                </div>
                                <p className="text-sm text-stone-400 leading-relaxed italic font-medium mb-6">
                                    "{lead.notes || 'No specific strategic objectives provided.'}"
                                </p>
                                
                                {(lead.projectContext || (lead.referredDesign && lead.referredDesign !== 'None')) && (
                                    <div className="mt-auto pt-6 border-t border-white/5">
                                        <div className="flex items-center justify-between group/asset">
                                            <div>
                                                <p className="text-[8px] font-black text-stone-600 uppercase tracking-[0.2em] mb-1">Architectural Interest</p>
                                                <p className="text-xs font-bold text-luxury-gold group-hover:text-white transition-colors">{lead.projectContext?.title || lead.referredDesign}</p>
                                            </div>
                                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-stone-700">
                                                <ArrowUpRight size={12} />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Operations */}
                            <div className="flex gap-4 relative z-10">
                                <select 
                                    value={lead.status || 'New'}
                                    onChange={(e) => setLeadStatus(lead.id, e.target.value)}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-white focus:outline-none focus:border-luxury-gold/50 transition-all appearance-none text-center"
                                >
                                    <option value="New" className="bg-stone-900">Mark: NEW</option>
                                    <option value="Contacted" className="bg-stone-900">Mark: CONTACTED</option>
                                    <option value="Closed" className="bg-stone-900">Mark: CLOSED</option>
                                </select>
                                <button 
                                    onClick={() => deleteLead(lead.id)}
                                    className="p-4 bg-red-500/10 text-red-500 border border-red-500/20 rounded-2xl hover:bg-red-500 hover:text-white transition-all shadow-xl"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredLeads.length === 0 && (
                    <div className="col-span-full py-32 text-center bg-white/5 rounded-[3rem] border border-dashed border-white/10">
                        <Inbox className="w-16 h-16 text-stone-800 mx-auto mb-6" />
                        <h3 className="text-2xl font-serif font-bold text-stone-600">Static Silence</h3>
                        <p className="text-[10px] uppercase tracking-[0.3em] text-stone-700 mt-2">No intelligence gathered in this sector.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LeadManager;
