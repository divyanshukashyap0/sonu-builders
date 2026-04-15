import React, { useState } from 'react';
import { MessageSquare, Trash2, Search, Clock, User, Phone, CheckCircle, MoreVertical } from 'lucide-react';
import { useChatInquiries } from '../../hooks/useChatInquiries';
import { motion, AnimatePresence } from 'framer-motion';

const ChatInquiries: React.FC = () => {
    const { inquiries, loading, deleteInquiry, updateInquiryStatus } = useChatInquiries();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredInquiries = inquiries.filter(inq => 
        inq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inq.phone.includes(searchTerm) ||
        inq.problem.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatDate = (date: any) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this inquiry?')) {
            await deleteInquiry(id);
        }
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mb-4" />
                <p className="text-luxury-gold font-serif tracking-widest text-sm animate-pulse uppercase">Fetching Conversations</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white">Chat Inquiries</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Direct communications from the Contact Assistant.</p>
                </div>
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search name, phone or inquiry..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg dark:bg-luxury-obsidian dark:border-white/10 dark:text-white outline-none focus:border-luxury-gold w-full md:w-80"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <AnimatePresence>
                    {filteredInquiries.map((inq) => (
                        <motion.div
                            key={inq.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-white dark:bg-luxury-obsidian p-6 rounded-xl border border-luxury-gold/10 shadow-sm hover:border-luxury-gold/30 transition-all group overflow-hidden relative"
                        >
                            {/* Status Indicator */}
                            <div className={`absolute top-0 right-0 h-1 w-full ${
                                inq.status === 'Responded' ? 'bg-green-500' : inq.status === 'Archived' ? 'bg-gray-500' : 'bg-luxury-gold'
                            }`} />

                            <div className="flex flex-col lg:flex-row justify-between gap-6">
                                <div className="space-y-4 flex-1">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 rounded-full bg-luxury-gold/10 flex items-center justify-center border border-luxury-gold/20">
                                            <User className="text-luxury-gold" size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-lg text-luxury-charcoal dark:text-white">{inq.name}</h3>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <Clock size={14} />
                                                {formatDate(inq.createdAt)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-4">
                                        <div className="flex items-center gap-2 bg-luxury-gold/5 px-3 py-1.5 rounded-lg border border-luxury-gold/10">
                                            <Phone className="text-luxury-gold" size={16} />
                                            <span className="text-sm font-bold text-luxury-charcoal dark:text-white">{inq.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2 bg-luxury-charcoal/5 dark:bg-white/5 px-3 py-1.5 rounded-lg border border-luxury-gold/10">
                                            <MessageSquare className="text-luxury-gold" size={16} />
                                            <span className="text-sm font-bold text-luxury-gold uppercase tracking-tighter">Chat Inquiry</span>
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 dark:bg-white/5 p-4 rounded-lg border border-luxury-gold/5 italic text-luxury-charcoal/80 dark:text-white/80 leading-relaxed">
                                        "{inq.problem}"
                                    </div>
                                </div>

                                <div className="flex lg:flex-col justify-end items-end gap-3 min-w-[150px]">
                                    <select
                                        value={inq.status}
                                        onChange={(e) => updateInquiryStatus(inq.id, e.target.value as any)}
                                        className="text-xs font-bold uppercase tracking-widest bg-transparent border border-luxury-gold/20 rounded-lg px-3 py-2 outline-none focus:border-luxury-gold dark:text-white"
                                    >
                                        <option value="New" className="bg-white dark:bg-luxury-obsidian">New</option>
                                        <option value="Responded" className="bg-white dark:bg-luxury-obsidian">Responded</option>
                                        <option value="Archived" className="bg-white dark:bg-luxury-obsidian">Archived</option>
                                    </select>
                                    
                                    <button
                                        onClick={() => handleDelete(inq.id)}
                                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors border border-red-500/20"
                                        title="Delete Inquiry"
                                    >
                                        <Trash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {filteredInquiries.length === 0 && (
                    <div className="text-center py-20 bg-white dark:bg-luxury-obsidian rounded-xl border border-luxury-gold/10">
                        <MessageSquare className="mx-auto text-luxury-gold/20 mb-4" size={48} />
                        <h3 className="text-lg font-serif font-bold text-luxury-charcoal dark:text-white">No inquiries found</h3>
                        <p className="text-gray-500">When people contact you via chat, they will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatInquiries;
