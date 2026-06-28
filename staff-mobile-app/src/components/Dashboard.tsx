import React from 'react';
import {
    Users, Clock, DollarSign, MapPin,
    FileText, Layers, Upload, ShieldCheck,
    TrendingUp, LayoutDashboard, CalendarDays
} from 'lucide-react';
import { useStaff } from '../hooks/useStaff';
import { useSiteAllocations } from '../hooks/useSiteAllocations';
import { useAdvances } from '../hooks/useAdvances';
import { useExpenses } from '../hooks/useExpenses';
import { useAttendance } from '../hooks/useAttendance';

interface DashboardProps {
    onNavigate: (tab: 'directory' | 'attendance' | 'advances' | 'allocations' | 'expenses' | 'salary' | 'reports' | 'import') => void;
    adminName: string;
}

export default function Dashboard({ onNavigate, adminName }: DashboardProps) {
    const { staff } = useStaff();
    const { allocations } = useSiteAllocations();
    const { advances } = useAdvances();
    const { expenses } = useExpenses();

    const activeMonthId = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`;
    const { isLocked } = useAttendance(activeMonthId);

    const activeCrewCount = staff.filter(s => s.status === 'active').length;
    const ongoingSitesCount = new Set(allocations.filter(a => a.status === 'Ongoing').map(a => a.siteName)).size;
    const pendingAdvancesCount = advances.filter(a => a.approvedBy === 'Pending Admin Approval').length;

    // Financial calculations
    const monthlyExpenses = expenses.filter(e => e.date?.startsWith(activeMonthId));
    const totalReceived = monthlyExpenses.reduce((sum, e) => sum + (e.amountReceived || 0), 0);
    const totalPaid = monthlyExpenses.reduce((sum, e) => sum + (e.amountPaid || 0), 0);
    const netCashflow = totalReceived - totalPaid;

    const modules = [
        { id: 'directory' as const, label: 'Staff Roster', icon: Users, desc: 'Manage profiles, roles, and wages', color: 'from-blue-500/10 to-blue-600/5 hover:border-blue-500/30' },
        { id: 'attendance' as const, label: 'Daily Attendance', icon: Clock, desc: 'Daily logs, monthly grids, & locking', color: 'from-amber-500/10 to-amber-600/5 hover:border-amber-500/30' },
        { id: 'advances' as const, label: 'Advances Board', icon: DollarSign, desc: 'Approve loans & onsite payouts', color: 'from-red-500/10 to-red-600/5 hover:border-red-500/30' },
        { id: 'allocations' as const, label: 'Site Assignments', icon: MapPin, desc: 'Allocate crew members to sites', color: 'from-emerald-500/10 to-emerald-600/5 hover:border-emerald-500/30' },
        { id: 'expenses' as const, label: 'Expense Ledger', icon: Layers, desc: 'Cash flow widgets & sonu ledgers', color: 'from-indigo-500/10 to-indigo-600/5 hover:border-indigo-500/30' },
        { id: 'salary' as const, label: 'Salary/Payroll', icon: FileText, desc: 'Lock payroll & export bank sheets', color: 'from-purple-500/10 to-purple-600/5 hover:border-purple-500/30' },
        { id: 'reports' as const, label: 'Reports Hub', icon: TrendingUp, desc: 'Export PDF summaries & XLSX logs', color: 'from-pink-500/10 to-pink-600/5 hover:border-pink-500/30' },
        { id: 'import' as const, label: 'Bulk Import', icon: Upload, desc: 'Upload spreadsheets & parse names', color: 'from-cyan-500/10 to-cyan-600/5 hover:border-cyan-500/30' },
    ];

    return (
        <div className="space-y-6 animate-fadeIn select-none pb-8">
            {/* Welcomer card */}
            <div className="relative overflow-hidden bg-neutral-900 border border-white/5 rounded-2xl p-6 shadow-xl">
                <div className="absolute top-[-30%] right-[-10%] w-[180px] h-[180px] bg-[#c5a059]/10 blur-[60px] rounded-full pointer-events-none" />
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-[#c5a059]/15 border border-[#c5a059]/20 flex items-center justify-center shadow-glow-gold">
                        <LayoutDashboard className="w-6 h-6 text-[#c5a059]" />
                    </div>
                    <div>
                        <h2 className="text-lg font-bold tracking-wide text-white">Welcome, {adminName}</h2>
                        <p className="text-[10px] uppercase tracking-widest text-[#c5a059] font-bold">Control Terminal</p>
                    </div>
                </div>
            </div>

            {/* Quick Stat Cards */}
            <div className="grid grid-cols-2 gap-3.5">
                <div className="bg-neutral-900 border border-white/5 p-4 rounded-xl flex flex-col justify-between h-28 relative overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/25 flex items-center justify-center text-blue-400">
                        <Users className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">Active Crew</span>
                        <span className="text-xl font-bold font-mono text-white mt-0.5">{activeCrewCount} Members</span>
                    </div>
                </div>

                <div className="bg-neutral-900 border border-white/5 p-4 rounded-xl flex flex-col justify-between h-28 relative overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                        <MapPin className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">Ongoing Sites</span>
                        <span className="text-xl font-bold font-mono text-white mt-0.5">{ongoingSitesCount} Sites</span>
                    </div>
                </div>

                <div className="bg-neutral-900 border border-white/5 p-4 rounded-xl flex flex-col justify-between h-28 relative overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400">
                        <DollarSign className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">Pending Loans</span>
                        <span className="text-xl font-bold font-mono text-white mt-0.5">{pendingAdvancesCount} Requests</span>
                    </div>
                </div>

                <div className="bg-neutral-900 border border-white/5 p-4 rounded-xl flex flex-col justify-between h-28 relative overflow-hidden">
                    <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400">
                        <CalendarDays className="w-4.5 h-4.5" />
                    </div>
                    <div>
                        <span className="text-[9px] uppercase tracking-wider text-neutral-500 font-bold block">Payroll Status</span>
                        <span className={`text-xs font-black uppercase px-2 py-0.5 rounded-full inline-block mt-1 ${isLocked ? 'bg-purple-500/20 text-purple-300' : 'bg-amber-500/20 text-amber-300'}`}>
                            {isLocked ? 'Locked' : 'Unlocked'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Financial Quick Glance */}
            <div className="bg-neutral-900 border border-white/5 p-5 rounded-2xl space-y-3.5">
                <div className="flex justify-between items-center">
                    <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Cash Flow (Current Month)</span>
                    <span className="text-[9px] font-bold text-neutral-500 font-mono">{activeMonthId}</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-neutral-950/60 p-2.5 rounded-lg border border-white/5">
                        <span className="text-[8px] uppercase text-neutral-500 block font-bold">Inflows</span>
                        <span className="text-xs font-mono font-bold text-emerald-400">₹{totalReceived.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="bg-neutral-950/60 p-2.5 rounded-lg border border-white/5">
                        <span className="text-[8px] uppercase text-neutral-500 block font-bold">Outflows</span>
                        <span className="text-xs font-mono font-bold text-red-400">₹{totalPaid.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="bg-neutral-950/60 p-2.5 rounded-lg border border-white/5">
                        <span className="text-[8px] uppercase text-neutral-500 block font-bold">Balance</span>
                        <span className={`text-xs font-mono font-bold ${netCashflow >= 0 ? 'text-[#c5a059]' : 'text-red-400'}`}>
                            ₹{netCashflow.toLocaleString('en-IN')}
                        </span>
                    </div>
                </div>
            </div>

            {/* Module Hub Grid */}
            <div className="space-y-3">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block px-1">Management Hub</span>
                <div className="grid grid-cols-1 gap-3">
                    {modules.map((m) => {
                        const Icon = m.icon;
                        return (
                            <button
                                key={m.id}
                                onClick={() => onNavigate(m.id)}
                                className={`w-full text-left bg-gradient-to-r ${m.color} border border-white/5 p-4 rounded-xl flex items-center justify-between transition-all duration-300 active:scale-98 group cursor-pointer`}
                            >
                                <div className="flex items-center gap-3.5">
                                    <div className="w-10 h-10 rounded-lg bg-neutral-950/50 border border-white/5 flex items-center justify-center group-hover:scale-105 transition-transform">
                                        <Icon className="w-5 h-5 text-[#c5a059]" />
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-bold text-white tracking-wide">{m.label}</h4>
                                        <p className="text-[9px] text-neutral-500 mt-0.5 leading-snug">{m.desc}</p>
                                    </div>
                                </div>
                                <div className="w-7 h-7 rounded-full bg-neutral-950/50 flex items-center justify-center border border-white/5 text-neutral-600 group-hover:text-white group-hover:bg-[#c5a059]/15 transition-all">
                                    →
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
