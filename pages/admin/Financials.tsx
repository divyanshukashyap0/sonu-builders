import React, { useState } from 'react';
import {
    IndianRupee,
    ArrowUpRight,
    ArrowDownRight,
    Plus,
    Trash2,
    Calendar,
    TrendingUp,
    PieChart
} from 'lucide-react';
import { useFinancials, FinancialRecord } from '../../hooks/useFinancials';
import { motion, AnimatePresence } from 'framer-motion';
import StatCard from '../../components/admin/StatCard';

const Financials: React.FC = () => {
    const { records, loading, addRecord, deleteRecord } = useFinancials();
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [newRecord, setNewRecord] = useState<Partial<FinancialRecord>>({
        type: 'Income',
        category: 'Project Payment',
        date: new Date()
    });

    // Calculate Stats
    const totalIncome = records.filter(r => r.type === 'Income').reduce((sum, r) => sum + Number(r.amount), 0);
    const totalExpense = records.filter(r => r.type === 'Expense').reduce((sum, r) => sum + Number(r.amount), 0);
    const netProfit = totalIncome - totalExpense;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newRecord.amount || !newRecord.description) return;

        await addRecord({
            type: newRecord.type as 'Income' | 'Expense',
            amount: Number(newRecord.amount),
            category: newRecord.category || 'General',
            description: newRecord.description || '',
            date: new Date(newRecord.date || new Date())
        });
        setIsFormOpen(false);
        setNewRecord({ type: 'Income', category: 'Project Payment', date: new Date() });
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white">Financial Overview</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Track revenue, expenses, and profitability.</p>
                </div>
                <button
                    onClick={() => setIsFormOpen(true)}
                    className="flex items-center gap-2 bg-luxury-gold text-white px-4 py-2.5 rounded-lg text-sm font-bold shadow-glow-gold hover:bg-white hover:text-luxury-charcoal transition-all"
                >
                    <Plus size={18} />
                    <span>Add Transaction</span>
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard
                    title="Total Income"
                    value={`₹${totalIncome.toLocaleString()}`}
                    change="+12%"
                    changeType="positive"
                    icon={ArrowUpRight}
                    delay={0}
                />
                <StatCard
                    title="Total Expenses"
                    value={`₹${totalExpense.toLocaleString()}`}
                    change="-5%"
                    changeType="neutral"
                    icon={ArrowDownRight}
                    delay={0.1}
                />
                <StatCard
                    title="Net Profit"
                    value={`₹${netProfit.toLocaleString()}`}
                    change={netProfit >= 0 ? 'Healthy' : 'Deficit'}
                    changeType={netProfit >= 0 ? "positive" : "negative"}
                    icon={IndianRupee}
                    delay={0.2}
                />
            </div>

            {/* Recent Transactions List */}
            <div className="bg-white dark:bg-luxury-obsidian rounded-xl border border-luxury-gold/10 overflow-hidden shadow-sm">
                <div className="p-6 border-b border-luxury-gold/5">
                    <h3 className="font-bold text-lg text-luxury-charcoal dark:text-white">Recent Transactions</h3>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50 dark:bg-white/5 text-left text-xs uppercase text-gray-500 dark:text-gray-400 font-medium tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Amount</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                            {records.map((record) => (
                                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {record.date.toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-luxury-charcoal dark:text-white">
                                        {record.description}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {record.category}
                                    </td>
                                    <td className={`px-6 py-4 font-bold ${record.type === 'Income' ? 'text-green-600' : 'text-red-500'}`}>
                                        {record.type === 'Income' ? '+' : '-'} ₹{Number(record.amount).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => deleteRecord(record.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {records.length === 0 && (
                                <tr><td colSpan={5} className="text-center py-8 text-gray-500">No transactions recorded yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Add Transaction Modal (Simple Inline) */}
            <AnimatePresence>
                {isFormOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm"
                        onClick={() => setIsFormOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, y: 20 }}
                            className="bg-white dark:bg-luxury-obsidian w-full max-w-md rounded-2xl p-6 shadow-2xl border border-luxury-gold/20"
                            onClick={e => e.stopPropagation()}
                        >
                            <h3 className="text-xl font-bold text-luxury-charcoal dark:text-white mb-4">Add Transaction</h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <button
                                        type="button"
                                        onClick={() => setNewRecord({ ...newRecord, type: 'Income' })}
                                        className={`p-2 rounded-lg border text-sm font-bold transition-all ${newRecord.type === 'Income' ? 'bg-green-100 border-green-500 text-green-700' : 'border-gray-200 text-gray-500'}`}
                                    >
                                        Income
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setNewRecord({ ...newRecord, type: 'Expense' })}
                                        className={`p-2 rounded-lg border text-sm font-bold transition-all ${newRecord.type === 'Expense' ? 'bg-red-100 border-red-500 text-red-700' : 'border-gray-200 text-gray-500'}`}
                                    >
                                        Expense
                                    </button>
                                </div>
                                <input
                                    type="number"
                                    placeholder="Amount (₹)"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-white/5 dark:border-white/10"
                                    onChange={e => setNewRecord({ ...newRecord, amount: Number(e.target.value) })}
                                />
                                <input
                                    type="text"
                                    placeholder="Description"
                                    required
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-white/5 dark:border-white/10"
                                    onChange={e => setNewRecord({ ...newRecord, description: e.target.value })}
                                />
                                <select
                                    className="w-full px-4 py-2 border rounded-lg dark:bg-white/5 dark:border-white/10"
                                    onChange={e => setNewRecord({ ...newRecord, category: e.target.value })}
                                >
                                    <option>Project Payment</option>
                                    <option>Material Cost</option>
                                    <option>Labor Cost</option>
                                    <option>Office Expense</option>
                                    <option>Marketing</option>
                                    <option>Other</option>
                                </select>
                                <button type="submit" className="w-full bg-luxury-gold text-white py-3 rounded-lg font-bold hover:bg-luxury-gold/90 transition-colors">
                                    Save Transaction
                                </button>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Financials;
