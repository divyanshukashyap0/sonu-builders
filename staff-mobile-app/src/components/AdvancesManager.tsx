import React, { useState } from 'react';
import { useAdvances } from '../hooks/useAdvances';
import { useStaff } from '../hooks/useStaff';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { 
    DollarSign, Check, Trash2, Plus, 
    ArrowLeft, Loader2, AlertCircle, Calendar, FileText
} from 'lucide-react';

interface AdvancesManagerProps {
    onBack: () => void;
    adminName: string;
}

export default function AdvancesManager({ onBack, adminName }: AdvancesManagerProps) {
    const { advances, loading: advancesLoading, addAdvance, deleteAdvance } = useAdvances();
    const { staff, loading: staffLoading } = useStaff();

    // Form states
    const [employeeId, setEmployeeId] = useState('');
    const [amount, setAmount] = useState('');
    const [reason, setReason] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [submitting, setSubmitting] = useState(false);

    const activeStaff = staff.filter(s => s.status === 'active');
    const pendingAdvances = advances.filter(a => a.approvedBy === 'Pending Admin Approval');
    const approvedAdvances = advances.filter(a => a.approvedBy !== 'Pending Admin Approval');

    const handleApprove = async (id: string) => {
        try {
            const docRef = doc(db, 'advances', id);
            await setDoc(docRef, {
                approvedBy: adminName || 'Admin'
            }, { merge: true });
            alert('Advance request approved!');
        } catch (err) {
            console.error(err);
            alert('Failed to approve request.');
        }
    };

    const handleReject = async (id: string) => {
        if (window.confirm('Decline and delete this advance request?')) {
            try {
                await deleteAdvance(id);
                alert('Request declined/deleted.');
            } catch (err) {
                console.error(err);
                alert('Failed to delete request.');
            }
        }
    };

    const handleAddAdvance = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!employeeId || !amount || !date) return;

        setSubmitting(true);
        const emp = activeStaff.find(s => s.id === employeeId);
        if (!emp) return;

        try {
            await addAdvance({
                employeeId,
                employeeName: emp.fullName,
                amount: parseFloat(amount),
                reason: reason || 'Logged On-Site',
                date,
                approvedBy: adminName || 'Admin'
            });

            alert('Advance payment logged successfully.');
            setEmployeeId('');
            setAmount('');
            setReason('');
            setDate(new Date().toISOString().split('T')[0]);
        } catch (err) {
            console.error(err);
            alert('Failed to log advance.');
        } finally {
            setSubmitting(false);
        }
    };

    const loading = advancesLoading || staffLoading;

    return (
        <div className="space-y-6 animate-fadeIn pb-8 select-none">
            {/* Header */}
            <div className="flex items-center gap-2">
                <button onClick={onBack} className="p-2 bg-neutral-900 border border-white/5 hover:border-white/10 rounded-xl text-neutral-400 hover:text-white cursor-pointer">
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <div>
                    <h2 className="text-base font-bold text-white leading-none">Salary Advances</h2>
                    <span className="text-[9px] text-[#c5a059] uppercase tracking-wider font-semibold">debits & disbursements</span>
                </div>
            </div>

            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="w-8 h-8 text-[#c5a059] animate-spin" />
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Decrypting Ledger...</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {/* Pending Approvals */}
                    <div className="bg-neutral-900 border border-white/5 p-4 rounded-2xl space-y-3.5">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block px-1">Pending Requests ({pendingAdvances.length})</span>
                        
                        {pendingAdvances.length === 0 ? (
                            <p className="text-xs text-neutral-500 py-3 px-1 italic">No pending advance requests.</p>
                        ) : (
                            <div className="space-y-3">
                                {pendingAdvances.map((adv) => (
                                    <div key={adv.id} className="bg-neutral-950 p-4 border border-white/5 rounded-xl space-y-3.5 shadow-md">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="text-xs font-bold text-white">{adv.employeeName}</h4>
                                                <span className="text-[9px] text-[#c5a059] font-mono mt-0.5 block">{adv.date}</span>
                                            </div>
                                            <span className="text-xs font-bold text-red-400 font-mono">₹{adv.amount.toLocaleString('en-IN')}</span>
                                        </div>
                                        <p className="text-[11px] text-neutral-400 italic">" {adv.reason} "</p>
                                        
                                        <div className="flex gap-2.5 pt-3 border-t border-white/5">
                                            <button
                                                onClick={() => handleApprove(adv.id)}
                                                className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 cursor-pointer"
                                            >
                                                <Check className="w-3.5 h-3.5" /> Approve
                                            </button>
                                            <button
                                                onClick={() => handleReject(adv.id)}
                                                className="flex-grow bg-red-500/10 hover:bg-red-500/20 text-red-400 font-bold py-2 rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1 border border-red-500/15 cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Decline
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Record New Advance Form */}
                    <div className="bg-neutral-900 border border-white/5 p-5 rounded-2xl space-y-4">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-[#c5a059] block">Disburse Onsite Advance</span>
                        <form onSubmit={handleAddAdvance} className="space-y-4 text-xs">
                            <div className="space-y-1">
                                <label className="block text-[9px] uppercase font-bold text-neutral-400">Select Employee *</label>
                                <select
                                    required
                                    value={employeeId}
                                    onChange={e => setEmployeeId(e.target.value)}
                                    className="w-full bg-neutral-950 border border-white/5 rounded-xl py-3 px-3.5 text-white outline-none focus:border-[#c5a059] cursor-pointer"
                                >
                                    <option value="">-- Choose Crew Member --</option>
                                    {activeStaff.map((s) => (
                                        <option key={s.id} value={s.id}>{s.fullName} ({s.role})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="block text-[9px] uppercase font-bold text-neutral-400">Amount (₹) *</label>
                                    <input 
                                        type="number"
                                        required
                                        value={amount}
                                        onChange={e => setAmount(e.target.value)}
                                        placeholder="e.g. 3000"
                                        className="w-full bg-neutral-950 border border-white/5 rounded-xl py-3 px-3.5 text-white outline-none focus:border-[#c5a059] font-mono"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-[9px] uppercase font-bold text-neutral-400">Payment Date *</label>
                                    <input 
                                        type="date"
                                        required
                                        value={date}
                                        onChange={e => setDate(e.target.value)}
                                        className="w-full bg-neutral-950 border border-white/5 rounded-xl py-2 px-3 text-white outline-none focus:border-[#c5a059] cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[9px] uppercase font-bold text-neutral-400">Remarks / Reason *</label>
                                <input 
                                    type="text"
                                    required
                                    value={reason}
                                    onChange={e => setReason(e.target.value)}
                                    placeholder="e.g. Personal emergency, family support"
                                    className="w-full bg-neutral-950 border border-white/5 rounded-xl py-3 px-3.5 text-white outline-none focus:border-[#c5a059]"
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full bg-[#c5a059] text-black font-black py-3 rounded-xl uppercase tracking-widest text-[10px] flex items-center justify-center gap-1.5 cursor-pointer mt-2 shadow-glow-gold active:scale-98 transition-all"
                            >
                                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                                <span>Save & Disburse</span>
                            </button>
                        </form>
                    </div>

                    {/* Approved/Logged History */}
                    <div className="bg-neutral-900 border border-white/5 p-4 rounded-2xl space-y-3.5">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block px-1">Approved Ledger History</span>
                        
                        {approvedAdvances.length === 0 ? (
                            <p className="text-xs text-neutral-500 py-3 px-1 italic">No approved advance records.</p>
                        ) : (
                            <div className="space-y-3 max-h-[300px] overflow-y-auto premium-scroll">
                                {approvedAdvances.map((adv) => (
                                    <div key={adv.id} className="bg-neutral-950 p-3 border border-white/5 rounded-xl flex items-center justify-between">
                                        <div>
                                            <h4 className="text-[11px] font-bold text-white leading-none mb-1">{adv.employeeName}</h4>
                                            <p className="text-[9px] text-neutral-500 font-mono">
                                                {adv.date} · approved by {adv.approvedBy}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[11px] font-bold text-[#c5a059] font-mono">₹{adv.amount}</span>
                                            <button
                                                onClick={() => handleReject(adv.id)}
                                                className="block text-[8px] text-red-400 hover:text-red-300 font-bold uppercase tracking-wider mt-1 text-right ml-auto cursor-pointer"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
