import React, { useState } from 'react';
import { useExpenses } from '../../../hooks/useExpenses';
import { Expense } from '../../../types';
import { 
    IndianRupee, Plus, Search, Edit2, Trash2, Loader2, Save, X,
    Calendar, MapPin, TrendingUp, TrendingDown, ClipboardList, Info
} from 'lucide-react';
import { auth } from '../../../lib/firebase';

const EXPENSE_TYPES = [
    'Material Procurement',
    'Labor / Artisan Payout',
    'Transportation & Fuel',
    'Client Site Tea / Meals',
    'Supervisor Expense',
    'Tools & Hardware purchase',
    'Miscellaneous Expense'
];

const SITE_OPTIONS = [
    'Jubilee Hills Villa',
    'Gachibowli Flat',
    'Sonu Headquarters',
    'Kallan Site',
    'Palava City Project',
    'Kalyan Commercial Wing'
];

export default function Expenses() {
    const { expenses, loading, error, addExpense, updateExpense, deleteExpense } = useExpenses();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSite, setSelectedSite] = useState<string>('All');
    const [selectedType, setSelectedType] = useState<string>('All');
    
    // Modal states
    const [isOpen, setIsOpen] = useState(false);
    const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // Form states
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [siteName, setSiteName] = useState(SITE_OPTIONS[0]);
    const [expenseType, setExpenseType] = useState(EXPENSE_TYPES[0]);
    const [description, setDescription] = useState('');
    const [amountReceived, setAmountReceived] = useState<number | ''>('');
    const [amountPaid, setAmountPaid] = useState<number | ''>('');

    const openAddModal = () => {
        setEditingExpense(null);
        setDate(new Date().toISOString().split('T')[0]);
        setSiteName(SITE_OPTIONS[0]);
        setExpenseType(EXPENSE_TYPES[0]);
        setDescription('');
        setAmountReceived('');
        setAmountPaid('');
        setIsOpen(true);
    };

    const openEditModal = (exp: Expense) => {
        setEditingExpense(exp);
        setDate(exp.date);
        setSiteName(exp.siteName);
        setExpenseType(exp.expenseType);
        setDescription(exp.description || '');
        setAmountReceived(exp.amountReceived || 0);
        setAmountPaid(exp.amountPaid || 0);
        setIsOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        const email = auth.currentUser?.email || 'admin@sonu-builders.com';

        const payload = {
            date,
            siteName,
            expenseType,
            description,
            amountReceived: Number(amountReceived) || 0,
            amountPaid: Number(amountPaid) || 0,
            createdBy: email
        };

        try {
            if (editingExpense) {
                await updateExpense(editingExpense.id, payload);
            } else {
                await addExpense(payload);
            }
            setIsOpen(false);
        } catch (err) {
            console.error(err);
            alert("Error saving expense entry.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this expense item from the ledger?")) {
            try {
                await deleteExpense(id);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const filteredExpenses = expenses.filter(exp => {
        const matchesSearch = exp.description?.toLowerCase().includes(searchTerm.toLowerCase()) || 
            exp.expenseType?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSite = selectedSite === 'All' || exp.siteName === selectedSite;
        const matchesType = selectedType === 'All' || exp.expenseType === selectedType;

        return matchesSearch && matchesSite && matchesType;
    });

    // Calculations
    const totalReceived = filteredExpenses.reduce((sum, e) => sum + (e.amountReceived || 0), 0);
    const totalPaid = filteredExpenses.reduce((sum, e) => sum + (e.amountPaid || 0), 0);
    const totalBalance = totalReceived - totalPaid;

    return (
        <div className="space-y-6 page-transition">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-stone-900 dark:text-white tracking-wide">Expense Ledger</h1>
                    <p className="text-xs uppercase tracking-widest text-luxury-gold opacity-80 mt-1">Suraj Expenses & Cash Flow Calculation</p>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-2 bg-luxury-gold text-stone-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-glow-gold hover:bg-stone-900 dark:hover:bg-white dark:hover:text-stone-950 hover:text-white transition-all active:scale-95 cursor-pointer"
                >
                    <Plus size={16} />
                    <span>Log Expense</span>
                </button>
            </div>

            {/* Cash Flow Widgets */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Total Received */}
                <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-2xl p-6 shadow-glass flex items-center gap-5 relative overflow-hidden transition-colors duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                        <TrendingUp size={24} />
                    </div>
                    <div>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-black tracking-wider">Total Received (Capital)</span>
                        <h3 className="text-2xl font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-1">₹{totalReceived.toLocaleString('en-IN')}</h3>
                    </div>
                </div>

                {/* Total Paid */}
                <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-2xl p-6 shadow-glass flex items-center gap-5 relative overflow-hidden transition-colors duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-600 dark:text-red-400">
                        <TrendingDown size={24} />
                    </div>
                    <div>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-black tracking-wider">Total Expenses Paid</span>
                        <h3 className="text-2xl font-mono font-bold text-red-600 dark:text-red-400 mt-1">₹{totalPaid.toLocaleString('en-IN')}</h3>
                    </div>
                </div>

                {/* Net Profit Balance */}
                <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-2xl p-6 shadow-glass flex items-center gap-5 relative overflow-hidden transition-colors duration-300">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-luxury-gold/5 rounded-full blur-2xl pointer-events-none" />
                    <div className="w-12 h-12 rounded-xl bg-luxury-gold/10 border border-luxury-gold/20 flex items-center justify-center text-luxury-gold">
                        <IndianRupee size={24} />
                    </div>
                    <div>
                        <span className="text-[10px] text-stone-500 dark:text-stone-400 uppercase font-black tracking-wider">Net Profit / Balance</span>
                        <h3 className={`text-2xl font-mono font-bold mt-1 ${totalBalance >= 0 ? 'text-luxury-gold' : 'text-red-650 dark:text-red-400'}`}>
                            ₹{totalBalance.toLocaleString('en-IN')}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-white dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 shadow-glass transition-colors duration-300">
                {/* Search */}
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Scan description or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 focus:border-luxury-gold/40 rounded-xl pl-11 pr-4 py-3 text-xs outline-none text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-600 transition-colors"
                    />
                </div>

                {/* Site Filter */}
                <div className="w-full md:w-56">
                    <select
                        value={selectedSite}
                        onChange={(e) => setSelectedSite(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 focus:border-luxury-gold/40 rounded-xl px-4 py-3 text-xs outline-none text-stone-900 dark:text-white cursor-pointer transition-colors"
                    >
                        <option value="All" className="bg-white dark:bg-stone-950 text-stone-900 dark:text-white">All Construction Sites</option>
                        {SITE_OPTIONS.map(s => (
                            <option key={s} value={s} className="bg-white dark:bg-stone-950 text-stone-900 dark:text-white">{s}</option>
                        ))}
                    </select>
                </div>

                {/* Type Filter */}
                <div className="w-full md:w-56">
                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full bg-stone-50 dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 focus:border-luxury-gold/40 rounded-xl px-4 py-3 text-xs outline-none text-stone-900 dark:text-white cursor-pointer transition-colors"
                    >
                        <option value="All" className="bg-white dark:bg-stone-950 text-stone-900 dark:text-white">All Expense Types</option>
                        {EXPENSE_TYPES.map(t => (
                            <option key={t} value={t} className="bg-white dark:bg-stone-950 text-stone-900 dark:text-white">{t}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Table Area */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
                    <p className="text-xs uppercase tracking-widest text-stone-500">Decrypting Ledgers...</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-glass transition-colors duration-300">
                    <div className="overflow-x-auto relative premium-scroll">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-white/5 text-[9px] uppercase tracking-wider font-black text-stone-500 dark:text-stone-400">
                                    <th className="px-6 py-4 text-left">Date</th>
                                    <th className="px-6 py-4 text-left">Site Location</th>
                                    <th className="px-6 py-4 text-left">Expense Type</th>
                                    <th className="px-6 py-4 text-right">Received (INR)</th>
                                    <th className="px-6 py-4 text-right">Paid (INR)</th>
                                    <th className="px-6 py-4 text-right">Balance / Profit</th>
                                    <th className="px-6 py-4 text-left pl-10">Description</th>
                                    <th className="px-6 py-4 text-left">Created By</th>
                                    <th className="px-6 py-4 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 dark:divide-white/5 text-xs">
                                {filteredExpenses.length > 0 ? (
                                    filteredExpenses.map((exp) => (
                                        <tr key={exp.id} className="hover:bg-stone-50 dark:hover:bg-white/5 transition-colors border-b border-stone-100 dark:border-white/5">
                                            <td className="px-6 py-4 text-stone-900 dark:text-white font-mono whitespace-nowrap">
                                                {exp.date}
                                            </td>
                                            <td className="px-6 py-4 font-semibold text-stone-900 dark:text-white whitespace-nowrap">
                                                <div className="flex items-center gap-1.5">
                                                    <MapPin size={12} className="text-luxury-gold" />
                                                    <span>{exp.siteName}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-stone-500 dark:text-stone-400 whitespace-nowrap">
                                                {exp.expenseType}
                                            </td>
                                            <td className="px-6 py-4 text-right text-emerald-600 dark:text-emerald-400 font-mono font-bold">
                                                {exp.amountReceived > 0 ? `₹${exp.amountReceived.toLocaleString('en-IN')}` : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-right text-red-650 dark:text-red-400 font-mono font-bold">
                                                {exp.amountPaid > 0 ? `₹${exp.amountPaid.toLocaleString('en-IN')}` : '-'}
                                            </td>
                                            <td className={`px-6 py-4 text-right font-mono font-bold ${exp.balance >= 0 ? 'text-luxury-gold' : 'text-red-650 dark:text-red-400'}`}>
                                                ₹{exp.balance.toLocaleString('en-IN')}
                                            </td>
                                            <td className="px-6 py-4 text-stone-500 dark:text-stone-400 max-w-xs truncate pl-10">
                                                {exp.description || 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 text-stone-500 truncate max-w-[120px]">
                                                {exp.createdBy}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="flex gap-2 justify-center">
                                                    <button
                                                        onClick={() => openEditModal(exp)}
                                                        className="p-1 hover:bg-stone-100 dark:hover:bg-white/5 text-stone-500 hover:text-luxury-gold rounded-lg transition-all"
                                                        title="Edit entry"
                                                    >
                                                        <Edit2 size={13} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(exp.id)}
                                                        className="p-1 hover:bg-stone-100 dark:hover:bg-white/5 text-stone-500 hover:text-red-500 rounded-lg transition-all"
                                                        title="Delete entry"
                                                    >
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={9} className="py-12 text-center text-xs text-stone-500">
                                            No ledger items found. Click "Log Expense" to add records.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Log / Edit Expense Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-luxury-gold/20 rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden my-8 transition-colors duration-300" data-lenis-prevent>
                        <div className="flex justify-between items-center p-6 border-b border-stone-200 dark:border-white/5 bg-gradient-to-r from-luxury-gold/5 to-transparent">
                            <div>
                                <h3 className="text-xl font-serif text-stone-900 dark:text-white">
                                    {editingExpense ? "Edit Expense Entry" : "Log Expense Entry"}
                                </h3>
                                <p className="text-[9px] uppercase tracking-widest text-luxury-gold opacity-75 mt-1">Cash Flow Matrix</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-stone-100 dark:hover:bg-white/5 rounded-full transition-colors text-stone-500 hover:text-stone-900 dark:text-stone-400 dark:hover:text-white">
                                <X size={20} />
                            </button>
                        </div>
                        
                        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto premium-scroll">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 mb-1.5">Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 mb-1.5">Site Location *</label>
                                    <select
                                        value={siteName}
                                        onChange={e => setSiteName(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white cursor-pointer"
                                    >
                                        {SITE_OPTIONS.map(s => (
                                            <option key={s} value={s} className="bg-white dark:bg-stone-950 text-stone-900 dark:text-white">{s}</option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 mb-1.5">Expense Type *</label>
                                    <select
                                        value={expenseType}
                                        onChange={e => setExpenseType(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white cursor-pointer"
                                    >
                                        {EXPENSE_TYPES.map(t => (
                                            <option key={t} value={t} className="bg-white dark:bg-stone-950 text-stone-900 dark:text-white">{t}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 mb-1.5">Amount Received *</label>
                                        <input
                                            type="number"
                                            value={amountReceived}
                                            onChange={e => setAmountReceived(e.target.value !== '' ? Number(e.target.value) : '')}
                                            className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white"
                                            placeholder="e.g. 50000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 mb-1.5">Amount Paid *</label>
                                        <input
                                            type="number"
                                            value={amountPaid}
                                            onChange={e => setAmountPaid(e.target.value !== '' ? Number(e.target.value) : '')}
                                            className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white"
                                            placeholder="e.g. 20000"
                                        />
                                    </div>
                                </div>
                                <div className="bg-stone-50 dark:bg-stone-950 p-3 rounded-xl border border-stone-200 dark:border-white/5 text-[11px] text-stone-500 dark:text-stone-400 flex items-center justify-between">
                                    <span>Calculated Balance / Profit:</span>
                                    <span className={`font-mono font-black text-xs ${
                                        (Number(amountReceived) || 0) - (Number(amountPaid) || 0) >= 0 ? 'text-luxury-gold' : 'text-red-650 dark:text-red-400'
                                    }`}>
                                        ₹{((Number(amountReceived) || 0) - (Number(amountPaid) || 0)).toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 mb-1.5">Description / Remarks *</label>
                                    <textarea
                                        rows={2}
                                        required
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white resize-none"
                                        placeholder="Add payment details, supervisors notes or vouchers..."
                                    />
                                </div>
                            </div>

                            <div className="pt-6 flex justify-end gap-3 border-t border-stone-200 dark:border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="px-5 py-2.5 bg-transparent hover:bg-stone-100 dark:hover:bg-white/5 border border-stone-200 dark:border-white/10 rounded-xl text-xs font-bold text-stone-500 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center gap-2 bg-luxury-gold text-stone-950 px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-glow-gold hover:bg-stone-900 dark:hover:bg-white dark:hover:text-stone-950 hover:text-white transition-all disabled:opacity-50 cursor-pointer"
                                >
                                    {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                                    <span>{editingExpense ? "Save Entry" : "Log Entry"}</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
