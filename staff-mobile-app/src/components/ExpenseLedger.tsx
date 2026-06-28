import React, { useState } from 'react';
import { useExpenses } from '../hooks/useExpenses';
import type { Expense } from '../types';
import {
    IndianRupee, Plus, Search, Edit2, Trash2, Loader2, Save, X,
    Calendar, MapPin, TrendingUp, TrendingDown, ClipboardList, Info, ArrowLeft
} from 'lucide-react';

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

interface ExpenseLedgerProps {
    onBack: () => void;
    adminEmail: string;
}

export default function ExpenseLedger({ onBack, adminEmail }: ExpenseLedgerProps) {
    const { expenses, loading, addExpense, updateExpense, deleteExpense } = useExpenses();
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

        const email = adminEmail || 'admin@sonu-builders.in';

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
                alert("Failed to delete expense.");
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

    const totalReceived = filteredExpenses.reduce((sum, e) => sum + (e.amountReceived || 0), 0);
    const totalPaid = filteredExpenses.reduce((sum, e) => sum + (e.amountPaid || 0), 0);
    const totalBalance = totalReceived - totalPaid;

    return (
        <div className="space-y-6 animate-fadeIn pb-8 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-2 bg-neutral-900 border border-white/5 hover:border-white/10 rounded-xl text-neutral-400 hover:text-white cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h2 className="text-base font-bold text-white leading-none">Expense Ledger</h2>
                        <span className="text-[9px] text-[#c5a059] uppercase tracking-wider font-semibold">sonu Cash Flow Ledger</span>
                    </div>
                </div>
                <button
                    onClick={openAddModal}
                    className="flex items-center gap-1.5 bg-[#c5a059] text-black px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-glow-gold transition-all active:scale-95 cursor-pointer"
                >
                    <Plus className="w-3.5 h-3.5" /> Log Expense
                </button>
            </div>

            {/* Cash Flow Widgets */}
            <div className="grid grid-cols-1 gap-3">
                <div className="bg-neutral-900 border border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-xl relative overflow-hidden">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                            <TrendingUp className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[9px] text-neutral-500 uppercase font-black tracking-wider">Total Inflow</span>
                            <h3 className="text-base font-mono font-bold text-emerald-400 mt-0.5">₹{totalReceived.toLocaleString('en-IN')}</h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 border-l border-white/5 pl-4 pr-2">
                        <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                            <TrendingDown className="w-5 h-5" />
                        </div>
                        <div>
                            <span className="text-[9px] text-neutral-500 uppercase font-black tracking-wider">Total Outflow</span>
                            <h3 className="text-base font-mono font-bold text-red-400 mt-0.5">₹{totalPaid.toLocaleString('en-IN')}</h3>
                        </div>
                    </div>
                </div>

                <div className="bg-neutral-900 border border-white/5 rounded-2xl p-4 flex items-center gap-3 shadow-xl">
                    <div className="w-10 h-10 rounded-xl bg-[#c5a059]/10 border border-[#c5a059]/20 flex items-center justify-center text-[#c5a059] shadow-glow-gold">
                        <IndianRupee className="w-5 h-5" />
                    </div>
                    <div>
                        <span className="text-[9px] text-neutral-500 uppercase font-black tracking-wider">Net Profit / Balance</span>
                        <h3 className={`text-base font-mono font-bold mt-0.5 ${totalBalance >= 0 ? 'text-[#c5a059]' : 'text-red-400'}`}>
                            ₹{totalBalance.toLocaleString('en-IN')}
                        </h3>
                    </div>
                </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-neutral-900 border border-white/5 p-4 rounded-xl space-y-3">
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Search description or type..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-neutral-950 border border-white/5 focus:border-[#c5a059]/50 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none text-white placeholder-neutral-500 transition-colors"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <select
                        value={selectedSite}
                        onChange={(e) => setSelectedSite(e.target.value)}
                        className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2.5 text-[11px] outline-none text-neutral-300 cursor-pointer"
                    >
                        <option value="All">All Sites</option>
                        {SITE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>

                    <select
                        value={selectedType}
                        onChange={(e) => setSelectedType(e.target.value)}
                        className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2.5 text-[11px] outline-none text-neutral-300 cursor-pointer"
                    >
                        <option value="All">All Expense Types</option>
                        {EXPENSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                </div>
            </div>

            {/* List of expenses */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="w-8 h-8 text-[#c5a059] animate-spin" />
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Decrypting Ledger entries...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {filteredExpenses.length > 0 ? (
                        filteredExpenses.map((exp) => (
                            <div key={exp.id} className="bg-neutral-900 border border-white/5 rounded-2xl p-5 space-y-3.5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#c5a059]/5 to-transparent pointer-events-none" />

                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xs font-bold text-white flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5 text-[#c5a059]" /> {exp.siteName}
                                        </h3>
                                        <span className="inline-block bg-neutral-950 text-neutral-400 text-[8px] font-bold px-2 py-0.5 rounded mt-1 border border-white/5 uppercase tracking-wider">
                                            {exp.expenseType}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => openEditModal(exp)}
                                            className="p-1.5 hover:bg-white/5 text-neutral-400 hover:text-[#c5a059] rounded-lg transition-colors cursor-pointer"
                                            title="Edit expense"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(exp.id)}
                                            className="p-1.5 hover:bg-white/5 text-neutral-400 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                                            title="Delete expense"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-[11px] text-neutral-400 border-t border-white/5 pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Transaction Date:</span>
                                        <span className="text-white font-mono">{exp.date}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Received (Capital):</span>
                                        <span className="text-emerald-400 font-bold font-mono">
                                            {exp.amountReceived > 0 ? `₹${exp.amountReceived.toLocaleString('en-IN')}` : '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Paid (Expense):</span>
                                        <span className="text-red-400 font-bold font-mono">
                                            {exp.amountPaid > 0 ? `₹${exp.amountPaid.toLocaleString('en-IN')}` : '-'}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Net Profit/Balance:</span>
                                        <span className={`font-mono font-bold ${exp.balance >= 0 ? 'text-[#c5a059]' : 'text-red-400'}`}>
                                            ₹{exp.balance.toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Description:</span>
                                        <span className="text-white text-right max-w-[200px] truncate" title={exp.description}>{exp.description || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between text-[9px] text-neutral-500 pt-2 border-t border-white/2">
                                        <span>Log By:</span>
                                        <span>{exp.createdBy}</span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-neutral-900 border border-white/5 rounded-xl py-12 text-center text-xs text-neutral-500">
                            No ledger entries found.
                        </div>
                    )}
                </div>
            )}

            {/* Log / Edit Expense Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden my-6">
                        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-gradient-to-r from-[#c5a059]/10 to-transparent">
                            <div>
                                <h3 className="text-sm font-bold text-white">
                                    {editingExpense ? "Edit Expense Entry" : "Log Expense Entry"}
                                </h3>
                                <p className="text-[9px] uppercase tracking-widest text-[#c5a059] mt-0.5">Cash Flow Matrix</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
                            <div className="space-y-3">
                                <div>
                                    <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Site Location *</label>
                                    <select
                                        value={siteName}
                                        onChange={e => setSiteName(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none text-white cursor-pointer"
                                    >
                                        {SITE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Expense Type *</label>
                                    <select
                                        value={expenseType}
                                        onChange={e => setExpenseType(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none text-white cursor-pointer"
                                    >
                                        {EXPENSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Amount Received</label>
                                        <input
                                            type="number"
                                            value={amountReceived}
                                            onChange={e => setAmountReceived(e.target.value !== '' ? Number(e.target.value) : '')}
                                            className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white font-mono"
                                            placeholder="e.g. 50000"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Amount Paid</label>
                                        <input
                                            type="number"
                                            value={amountPaid}
                                            onChange={e => setAmountPaid(e.target.value !== '' ? Number(e.target.value) : '')}
                                            className="w-full px-3 py-2.5 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white font-mono"
                                            placeholder="e.g. 20000"
                                        />
                                    </div>
                                </div>
                                <div className="bg-neutral-950 p-3 rounded-xl border border-white/5 text-[10px] text-neutral-400 flex items-center justify-between">
                                    <span>Calculated Net Balance:</span>
                                    <span className={`font-mono font-black text-xs ${(Number(amountReceived) || 0) - (Number(amountPaid) || 0) >= 0 ? 'text-[#c5a059]' : 'text-red-400'
                                        }`}>
                                        ₹{((Number(amountReceived) || 0) - (Number(amountPaid) || 0)).toLocaleString('en-IN')}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-[9px] uppercase font-bold text-neutral-400 mb-1">Description / Remarks *</label>
                                    <textarea
                                        rows={2}
                                        required
                                        value={description}
                                        onChange={e => setDescription(e.target.value)}
                                        className="w-full px-3 py-2 bg-neutral-950 border border-white/5 rounded-xl outline-none focus:border-[#c5a059] text-white resize-none"
                                        placeholder="Add payment details, vouchers, invoice notes..."
                                    />
                                </div>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex gap-2.5">
                                <button
                                    type="button"
                                    onClick={() => setIsOpen(false)}
                                    className="flex-1 bg-transparent hover:bg-white/5 border border-white/10 rounded-xl py-2.5 text-[10px] font-bold text-neutral-400 hover:text-white uppercase transition-all"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex-grow flex items-center justify-center gap-1.5 bg-[#c5a059] text-black font-black py-2.5 rounded-xl text-[10px] uppercase tracking-wider shadow-glow-gold transition-all cursor-pointer"
                                >
                                    {submitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                                    <span>Save Entry</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
