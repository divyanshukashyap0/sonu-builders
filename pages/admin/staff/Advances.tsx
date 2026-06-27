import React, { useState } from 'react';
import { useStaff } from '../../../hooks/useStaff';
import { useAdvances } from '../../../hooks/useAdvances';
import { 
    CreditCard, Plus, Trash2, Search, Calendar, 
    User, HelpCircle, Loader2, Save, X, ShieldCheck
} from 'lucide-react';

export default function Advances() {
    const { staff, loading: staffLoading } = useStaff();
    const { advances, loading: advancesLoading, addAdvance, deleteAdvance } = useAdvances();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedEmployeeId, setSelectedEmployeeId] = useState<string>('All');
    
    // Modal states
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form states
    const [employeeId, setEmployeeId] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [approvedBy, setApprovedBy] = useState('Administrator');

    const activeStaff = staff.filter(s => s.status === 'active');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeId || !amount || !date) {
            alert("Please fill all required fields.");
            return;
        }

        setSubmitting(true);
        const emp = activeStaff.find(s => s.id === employeeId);
        const employeeName = emp ? emp.fullName : 'Unknown';

        try {
            await addAdvance({
                employeeId,
                employeeName,
                amount: Number(amount),
                reason,
                date,
                approvedBy
            });
            
            // Reset form & close modal
            setEmployeeId('');
            setAmount('');
            setReason('');
            setDate(new Date().toISOString().split('T')[0]);
            setApprovedBy('Administrator');
            setIsOpen(false);
        } catch (err) {
            console.error(err);
            alert("Failed to log advance ledger entry.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string, amount: number, name: string) => {
        if (window.confirm(`Delete advance record of Rs. ${amount} for ${name}?`)) {
            try {
                await deleteAdvance(id);
            } catch (err) {
                console.error(err);
                alert("Failed to delete entry.");
            }
        }
    };

    const filteredAdvances = advances.filter(adv => {
        const matchesSearch = adv.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) || 
            adv.reason.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesEmp = selectedEmployeeId === 'All' || adv.employeeId === selectedEmployeeId;

        return matchesSearch && matchesEmp;
    });

    const totalAdvancesAmount = filteredAdvances.reduce((sum, adv) => sum + adv.amount, 0);

    const loading = staffLoading || advancesLoading;

    return (
        <div className="space-y-6 page-transition">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-stone-900 dark:text-white tracking-wide">Advance Management</h1>
                    <p className="text-xs uppercase tracking-widest text-luxury-gold opacity-80 mt-1">Staff Credit & Advances Ledger</p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 bg-luxury-gold text-stone-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-glow-gold hover:bg-stone-900 dark:hover:bg-white dark:hover:text-stone-950 hover:text-white transition-all active:scale-95 cursor-pointer"
                >
                    <Plus size={16} />
                    <span>Issue Advance</span>
                </button>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-2xl p-6 shadow-glass flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider">Filtered Ledgers Count</span>
                        <h2 className="text-3xl font-bold text-stone-900 dark:text-white mt-1">{filteredAdvances.length}</h2>
                    </div>
                    <div className="w-12 h-12 bg-stone-50 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/5 flex items-center justify-center">
                        <CreditCard size={20} className="text-luxury-gold" />
                    </div>
                </div>

                <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-2xl p-6 shadow-glass flex items-center justify-between">
                    <div>
                        <span className="text-[10px] font-black uppercase text-stone-500 tracking-wider">Total Active Advance Disbursed</span>
                        <h2 className="text-3xl font-black text-luxury-gold mt-1">₹{totalAdvancesAmount.toFixed(2)}</h2>
                    </div>
                    <div className="w-12 h-12 bg-luxury-gold/10 rounded-xl border border-luxury-gold/20 flex items-center justify-center">
                        <ShieldCheck size={20} className="text-luxury-gold" />
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 shadow-glass">
                {/* Search */}
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search reason or name..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 focus:border-luxury-gold/40 rounded-xl pl-11 pr-4 py-3 text-xs outline-none text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-650 transition-colors"
                    />
                </div>

                {/* Employee Filter */}
                <div className="w-full md:w-64">
                    <select
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                        className="w-full bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 focus:border-luxury-gold/40 rounded-xl px-4 py-3 text-xs outline-none text-stone-900 dark:text-white cursor-pointer"
                    >
                        <option value="All" className="text-stone-900 bg-white dark:bg-stone-950 dark:text-white">All Employees</option>
                        {activeStaff.map(emp => (
                            <option key={emp.id} value={emp.id} className="text-stone-900 bg-white dark:bg-stone-950 dark:text-white">{emp.fullName}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Ledger List */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
                    <p className="text-xs uppercase tracking-widest text-stone-500">Decrypting Credit Ledgers...</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-glass">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-white/5 text-[9px] uppercase tracking-wider font-black text-stone-600 dark:text-stone-400">
                                <tr>
                                    <th className="px-6 py-4">Employee</th>
                                    <th className="px-6 py-4 text-center">Date Issued</th>
                                    <th className="px-6 py-4 text-right">Amount</th>
                                    <th className="px-6 py-4">Reason / Remarks</th>
                                    <th className="px-6 py-4">Approved By</th>
                                    <th className="px-6 py-4 text-right">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-200 dark:divide-white/5 text-xs text-stone-850 dark:text-stone-300">
                                {filteredAdvances.length > 0 ? (
                                    filteredAdvances.map((adv) => (
                                        <tr key={adv.id} className="hover:bg-stone-50 dark:hover:bg-white/5 transition-colors border-b border-stone-100 dark:border-white/5">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-stone-900 dark:text-white">{adv.employeeName}</div>
                                                <span className="text-[8px] font-mono text-stone-400 dark:text-stone-500">{adv.employeeId.slice(0, 8)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex items-center justify-center gap-1.5 text-stone-500 dark:text-stone-400">
                                                    <Calendar size={12} />
                                                    <span>{adv.date}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right font-black text-luxury-gold text-sm">
                                                ₹{adv.amount.toFixed(2)}
                                            </td>
                                            <td className="px-6 py-4 max-w-[200px] truncate text-stone-700 dark:text-stone-300" title={adv.reason}>
                                                {adv.reason || 'Personal Advance'}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                                                    {adv.approvedBy}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button
                                                    onClick={() => handleDelete(adv.id, adv.amount, adv.employeeName)}
                                                    className="p-2 hover:bg-red-500/10 text-stone-450 hover:text-red-650 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                                                    title="Delete Log Entry"
                                                >
                                                    <Trash2 size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="py-12 text-center text-stone-500">
                                            No advance records logged for selection.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Issue Advance Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-luxury-gold/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" data-lenis-prevent>
                        <div className="flex justify-between items-center p-6 border-b border-stone-200 dark:border-white/5 bg-gradient-to-r from-luxury-gold/5 to-transparent">
                            <div>
                                <h3 className="text-xl font-serif text-stone-900 dark:text-white">Disburse Advance Pay</h3>
                                <p className="text-[9px] uppercase tracking-widest text-luxury-gold opacity-75 mt-1">Debit Register</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-stone-100 dark:hover:bg-white/5 rounded-full transition-colors text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 mb-1.5">Select Employee *</label>
                                <select
                                    required
                                    value={employeeId}
                                    onChange={e => setEmployeeId(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white cursor-pointer"
                                >
                                    <option value="" disabled className="text-stone-900 bg-white dark:bg-stone-900 dark:text-white">-- Choose staff member --</option>
                                    {activeStaff.map(emp => (
                                        <option key={emp.id} value={emp.id} className="text-stone-900 bg-white dark:bg-stone-900 dark:text-white">{emp.fullName} ({emp.role})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 mb-1.5">Advance Date *</label>
                                <input
                                    type="date"
                                    required
                                    value={date}
                                    onChange={e => setDate(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 mb-1.5">Amount (INR) *</label>
                                <input
                                    type="number"
                                    required
                                    value={amount}
                                    onChange={e => setAmount(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white font-bold text-luxury-gold text-lg"
                                    placeholder="₹ 0.00"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 mb-1.5">Reason / Remarks</label>
                                <textarea
                                    rows={2}
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white resize-none"
                                    placeholder="e.g. Medical emergency, family expenses..."
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 mb-1.5">Approved By</label>
                                <input
                                    type="text"
                                    value={approvedBy}
                                    onChange={e => setApprovedBy(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white"
                                />
                            </div>

                            <div className="pt-4 flex justify-end gap-3 border-t border-stone-200 dark:border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-5 py-2.5 bg-transparent hover:bg-stone-100 dark:hover:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs font-bold text-stone-650 dark:text-stone-300 hover:text-stone-900 hover:border-stone-350 dark:hover:text-white transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center gap-2 bg-luxury-gold text-stone-950 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-glow-gold hover:bg-stone-900 dark:hover:bg-white hover:text-white dark:hover:text-stone-950 transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    <span>Log Entry</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
