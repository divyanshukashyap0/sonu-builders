import React, { useState } from 'react';
import { Calculator, Trash2, Search, User, Phone, MapPin, Calendar, Layers, Eye, X, MessageSquare, Mail, Download } from 'lucide-react';
import { useEstimates } from '../../hooks/useEstimates';
import { useConfirmDelete } from '../../hooks/useConfirmDelete';
import { motion, AnimatePresence } from 'framer-motion';
import { ProjectEstimate, RoomEstimate } from '../../types';
import { useEstimationCosts } from '../../hooks/useEstimationCosts';

const AdminEstimates: React.FC = () => {
    const { estimates, loading, deleteEstimate } = useEstimates();
    const { confirmDelete } = useConfirmDelete();
    const { costs } = useEstimationCosts();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEstimate, setSelectedEstimate] = useState<ProjectEstimate | null>(null);

    const calculateRoomCost = (room: RoomEstimate) => {
        if (!costs) return room.area * (room.level === 'luxury' ? 3500 : room.level === 'premium' ? 2000 : 1200);
        
        let base = room.area * costs.baseRates[room.level];
        const tileRate = (costs.tiles as any)[room.tiles || 'vitrified'] || 0;
        base += room.area * tileRate;
        const paintRate = (costs.color as any)[room.color || 'plasticEmulsion'] || 0;
        base += room.area * paintRate;
        if (room.hasTvUnit) base += costs.fixedItems.tvUnit;
        if (room.hasModularKitchen) base += costs.fixedItems.modularKitchenBase;
        if (room.wardrobeSize) base += room.wardrobeSize * costs.fixedItems.wardrobePerSqFt;
        return base;
    };

    const filteredEstimates = estimates.filter(est =>
        est.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        est.userPhone.includes(searchTerm) ||
        est.city?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const formatCurrency = (val: number) => {
        return `₹${val.toLocaleString('en-IN')}`;
    };

    const formatDate = (date: any) => {
        if (!date) return '';
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    };

    const handleDelete = (id: string) => {
        confirmDelete(
            async () => {
                await deleteEstimate(id);
            },
            {
                firstMessage: "Delete this project estimate record?",
                secondMessage: "FINAL CONFIRMATION: This will permanently remove the user's requirement data and budget calculation.",
                successMessage: "Estimate deleted."
            }
        );
    };

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px]">
                <div className="w-12 h-12 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mb-4" />
                <p className="text-luxury-gold font-bold tracking-widest text-xs uppercase animate-pulse">Loading Estimates</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white">Project Estimates</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Track detailed user requirements and budget expectations.</p>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, phone or city..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 border rounded-lg dark:bg-luxury-obsidian dark:border-white/10 dark:text-white outline-none focus:border-luxury-gold w-full md:w-80"
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-luxury-obsidian rounded-xl border border-luxury-gold/10 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-luxury-gold/5 dark:bg-white/5 border-b border-luxury-gold/10">
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-luxury-gold">User</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-luxury-gold">City/Timeline</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-luxury-gold">Budget</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-luxury-gold">Inventory</th>
                            <th className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-luxury-gold">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                        {filteredEstimates.map((est) => (
                            <tr key={est.id} className="hover:bg-luxury-gold/5 dark:hover:bg-white/5 transition-colors group">
                                <td className="px-6 py-4">
                                    <div className="font-bold text-luxury-charcoal dark:text-white">{est.userName}</div>
                                    <div className="text-xs text-gray-500 font-mono">{est.userPhone}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-luxury-charcoal dark:text-white flex items-center gap-1"><MapPin size={12} /> {est.city || 'Unknown'}</div>
                                    <div className="text-xs text-luxury-gold font-bold uppercase tracking-tighter flex items-center gap-1"><Calendar size={12} /> {est.timeline}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-lg font-serif font-bold text-luxury-gold">{formatCurrency(est.totalBudget)}</div>
                                    <div className="text-[10px] text-gray-400">{formatDate(est.createdAt)}</div>
                                </td>
                                <td className="px-6 py-4">
                                    <button
                                        onClick={() => setSelectedEstimate(est)}
                                        className="flex items-center gap-2 px-3 py-1.5 bg-luxury-gold/10 text-luxury-gold rounded-lg text-xs font-bold border border-luxury-gold/20 hover:bg-luxury-gold hover:text-white transition-all"
                                    >
                                        <Layers size={14} /> {est.rooms?.length} Spaces
                                    </button>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <button onClick={() => setSelectedEstimate(est)} className="p-2 text-luxury-gold hover:bg-luxury-gold/10 rounded-lg"><Eye size={18} /></button>
                                        <button onClick={() => handleDelete(est.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"><Trash2 size={18} /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredEstimates.length === 0 && (
                    <div className="text-center py-20">
                        <Calculator className="mx-auto text-gray-300 dark:text-white/10 mb-4" size={48} />
                        <h3 className="text-lg font-bold text-gray-400">No Estimates Recorded Yet</h3>
                    </div>
                )}
            </div>

            {/* Modal Detail View */}
            <AnimatePresence>
                {selectedEstimate && (
                    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-luxury-obsidian w-full max-w-3xl rounded-2xl border border-luxury-gold/20 shadow-2xl overflow-hidden"
                            data-lenis-prevent
                        >
                            <div className="p-6 border-b border-luxury-gold/10 flex justify-between items-center bg-luxury-gold/5">
                                <h3 className="text-xl font-serif font-bold text-luxury-charcoal dark:text-white flex items-center gap-2">
                                    <Calculator className="text-luxury-gold" /> Detailed Estimate Breakdown
                                </h3>
                                <button onClick={() => setSelectedEstimate(null)} className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full"><X size={20} className="dark:text-white" /></button>
                            </div>
                            <div className="p-8 space-y-8 overflow-y-auto max-h-[70vh] scrollbar-hide">
                                <div className="grid grid-cols-2 gap-8 py-4 border-b border-gray-100 dark:border-white/5">
                                    <div>
                                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">User Information</p>
                                        <p className="font-bold dark:text-white text-lg">{selectedEstimate.userName}</p>
                                        <p className="text-sm font-mono text-luxury-gold">{selectedEstimate.userPhone}</p>
                                        <p className="text-xs text-gray-500">{selectedEstimate.userEmail}</p>
                                        <p className="text-xs text-gray-400 mt-2"><MapPin size={10} className="inline mr-1" /> {selectedEstimate.city}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-1">Estimated Investment</p>
                                        <p className="text-4xl font-serif font-bold text-luxury-gold">{formatCurrency(selectedEstimate.totalBudget)}</p>
                                        <p className="text-xs text-gray-500 italic mt-1">Timeline: {selectedEstimate.timeline}</p>
                                    </div>
                                </div>

                                <div>
                                    <p className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-4">Space-by-Space Inventory</p>
                                    <div className="space-y-4">
                                        {selectedEstimate.rooms?.map((r, i) => (
                                            <div key={i} className="p-5 bg-gray-50 dark:bg-white/5 rounded-2xl border border-gray-100 dark:border-white/10">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <span className="font-bold text-luxury-charcoal dark:text-white text-lg">{r.name}</span>
                                                        <span className="text-[10px] uppercase font-bold text-luxury-gold ml-3 tracking-widest bg-luxury-gold/10 px-2 py-0.5 rounded">{r.level}</span>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="font-bold font-mono dark:text-white text-lg">{formatCurrency(calculateRoomCost(r))}</div>
                                                        <div className="text-[10px] text-gray-500">{r.area} sqft</div>
                                                    </div>
                                                </div>
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200/50 dark:border-white/5">
                                                    <div className="text-[10px]">
                                                        <p className="text-gray-400 uppercase tracking-tighter">Tiles</p>
                                                        <p className="font-bold dark:text-white truncate">{r.tiles || 'Standard'}</p>
                                                    </div>
                                                    <div className="text-[10px]">
                                                        <p className="text-gray-400 uppercase tracking-tighter">Painting</p>
                                                        <p className="font-bold dark:text-white truncate">{r.color || 'Standard'}</p>
                                                    </div>
                                                    <div className="text-[10px]">
                                                        <p className="text-gray-400 uppercase tracking-tighter">Features</p>
                                                        <div className="flex gap-1 mt-1">
                                                            {r.hasTvUnit && <span className="bg-blue-500/20 text-blue-400 px-1 rounded">TV</span>}
                                                            {r.hasModularKitchen && <span className="bg-green-500/20 text-green-400 px-1 rounded">Kitchen</span>}
                                                            {r.wardrobeSize ? <span className="bg-purple-500/20 text-purple-400 px-1 rounded">Wardrobe</span> : null}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="p-8 bg-gray-50 dark:bg-black/20 space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        onClick={() => {
                                            const hour = new Date().getHours();
                                            const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
                                            const message = encodeURIComponent(`${greeting} ${selectedEstimate.userName},\n\nI hope you're doing well. This is Sonu Singh from Sonu Enterprises.\n\nI've reviewed the project estimate you generated on our website for your home in ${selectedEstimate.city || 'Mumbai'}.\n\nYour total estimated investment is approximately ${formatCurrency(selectedEstimate.totalBudget)} for ${selectedEstimate.rooms?.length} rooms.\n\nI would love to discuss this breakdown with you. When would be a good time to talk?\n\nBest regards,\nSonu Singh`);
                                            window.open(`https://wa.me/${selectedEstimate.userPhone.replace(/[^0-9]/g, '')}?text=${message}`, '_blank');
                                        }}
                                        className="flex items-center justify-center gap-2 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-green-500/20"
                                    >
                                        <MessageSquare size={16} /> WhatsApp User
                                    </button>
                                    <button
                                        onClick={() => {
                                            const hour = new Date().getHours();
                                            const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
                                            const subject = encodeURIComponent(`Regarding your Project Estimate for - ${selectedEstimate.city || 'Mumbai'}`);
                                            const body = encodeURIComponent(`${greeting} ${selectedEstimate.userName},\n\nI hope you're having a productive day.\n\nThis is Sonu Singh from Sonu Enterprises  . I'm following up on the interior design estimate you created on our portal.\n\nSUMMARY:\n- Estimated Budget: ${formatCurrency(selectedEstimate.totalBudget)}\n- Timeline: ${selectedEstimate.timeline}\n- Inventory: ${selectedEstimate.rooms?.length} rooms\n\nI have the full room-by-room breakdown ready for you. Please let me know if you'd like to schedule a site visit or a consultation call.\n\nBest regards,\n\nSonu Singh\nSonu Enterprises  `);
                                            window.location.href = `mailto:${selectedEstimate.userEmail || ''}?subject=${subject}&body=${body}`;
                                        }}
                                        className="flex items-center justify-center gap-2 py-3 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-blue-500/20"
                                    >
                                        <Mail size={16} /> Email Details
                                    </button>
                                </div>
                                <div className="text-center pt-2">
                                    <button onClick={() => window.print()} className="text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-luxury-gold transition-colors">Download / Print Full Breakdown</button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AdminEstimates;
