import React, { useState } from 'react';
import { useStaff } from '../hooks/useStaff';
import { useSiteAllocations } from '../hooks/useSiteAllocations';
import type { SiteAllocation } from '../types';
import {
    MapPin, Plus, Trash2, Search, Calendar,
    User, HelpCircle, Loader2, Save, X, ToggleLeft, ToggleRight, ArrowLeft
} from 'lucide-react';

interface SiteAllocationManagerProps {
    onBack: () => void;
    adminName: string;
}

export default function SiteAllocationManager({ onBack, adminName }: SiteAllocationManagerProps) {
    const { staff, loading: staffLoading } = useStaff();
    const {
        allocations, activeSites, loading: allocLoading,
        addAllocation, updateAllocationStatus, deleteAllocation
    } = useSiteAllocations();

    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSite, setSelectedSite] = useState<string>('All');

    // Modal states
    const [isOpen, setIsOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    // Form states
    const [siteName, setSiteName] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [workType, setWorkType] = useState('');
    const [startDate, setStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [deadline, setDeadline] = useState('');
    const [supervisor, setSupervisor] = useState('');
    const [status, setStatus] = useState<'Ongoing' | 'Pending' | 'Completed'>('Ongoing');

    const activeStaff = staff.filter(s => s.status === 'active');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!siteName || !employeeId || !startDate) {
            alert("Please fill all required fields.");
            return;
        }

        setSubmitting(true);
        const emp = activeStaff.find(s => s.id === employeeId);
        const employeeName = emp ? emp.fullName : 'Unknown';

        try {
            await addAllocation({
                siteName,
                employeeId,
                employeeName,
                workType: workType || emp?.role || '',
                startDate,
                deadline: deadline || 'N/A',
                supervisor: supervisor || adminName || 'Admin',
                status
            });

            // Reset
            setSiteName('');
            setEmployeeId('');
            setWorkType('');
            setStartDate(new Date().toISOString().split('T')[0]);
            setDeadline('');
            setSupervisor('');
            setStatus('Ongoing');
            setIsOpen(false);
        } catch (err) {
            console.error(err);
            alert("Failed to allocate staff to site.");
        } finally {
            setSubmitting(false);
        }
    };

    const handleToggleStatus = async (alloc: SiteAllocation) => {
        const nextStatus: SiteAllocation['status'] = alloc.status === 'Ongoing' ? 'Completed' : 'Ongoing';
        if (window.confirm(`Mark assignment for ${alloc.employeeName} at ${alloc.siteName} as ${nextStatus}?`)) {
            try {
                await updateAllocationStatus(alloc.id, nextStatus, alloc.employeeId, alloc.siteName);
            } catch (err) {
                console.error(err);
            }
        }
    };

    const handleDelete = async (id: string, name: string, site: string, employeeId?: string) => {
        if (window.confirm(`Remove allocation for ${name} at ${site}?`)) {
            try {
                await deleteAllocation(id, employeeId);
            } catch (err) {
                console.error(err);
                alert("Failed to remove allocation.");
            }
        }
    };

    const filteredAllocations = allocations.filter(alloc => {
        const matchesSearch = alloc.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alloc.workType.toLowerCase().includes(searchTerm.toLowerCase()) ||
            alloc.siteName.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSite = selectedSite === 'All' || alloc.siteName === selectedSite;

        return matchesSearch && matchesSite;
    });

    const loading = staffLoading || allocLoading;

    return (
        <div className="space-y-6 animate-fadeIn pb-8 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-2 bg-neutral-900 border border-white/5 hover:border-white/10 rounded-xl text-neutral-400 hover:text-white cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h2 className="text-base font-bold text-white leading-none">Site Assignments</h2>
                        <span className="text-[9px] text-[#c5a059] uppercase tracking-wider font-semibold">labor distribution matrix</span>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setSiteName(activeSites[0] || '');
                        setIsOpen(true);
                    }}
                    className="flex items-center gap-1.5 bg-[#c5a059] text-black px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-glow-gold transition-all active:scale-95 cursor-pointer"
                >
                    <Plus className="w-3.5 h-3.5" /> Assign Site
                </button>
            </div>

            {/* Filters */}
            <div className="bg-neutral-900 border border-white/5 p-4 rounded-xl space-y-3">
                {/* Search */}
                <div className="relative">
                    <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                    <input
                        type="text"
                        placeholder="Search employee, site, or job role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-neutral-950 border border-white/5 focus:border-[#c5a059]/50 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none text-white placeholder-neutral-500 transition-colors"
                    />
                </div>

                {/* Site Filter */}
                <select
                    value={selectedSite}
                    onChange={(e) => setSelectedSite(e.target.value)}
                    className="w-full bg-neutral-950 border border-white/5 rounded-xl px-3 py-2.5 text-xs outline-none text-neutral-300 cursor-pointer"
                >
                    <option value="All">All Active Sites</option>
                    {activeSites.map((name) => (
                        <option key={name} value={name}>{name}</option>
                    ))}
                </select>
            </div>

            {/* Allocations Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="w-8 h-8 text-[#c5a059] animate-spin" />
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Decrypting Work Assignments...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4">
                    {filteredAllocations.length > 0 ? (
                        filteredAllocations.map((alloc) => (
                            <div
                                key={alloc.id}
                                className={`bg-neutral-900 border ${alloc.status === 'Ongoing' ? 'border-white/5' : 'border-emerald-500/25 opacity-70'
                                    } rounded-2xl p-5 space-y-3.5 relative overflow-hidden`}
                            >
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#c5a059]/5 to-transparent pointer-events-none" />

                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xs font-bold text-white">{alloc.siteName}</h3>
                                        <span className="inline-block bg-neutral-950 text-neutral-400 text-[8px] font-bold px-2 py-0.5 rounded mt-1 border border-white/5 uppercase tracking-wider">
                                            {alloc.workType}
                                        </span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleToggleStatus(alloc)}
                                            className={`p-1.5 hover:bg-white/5 rounded-lg transition-colors cursor-pointer ${alloc.status === 'Ongoing' ? 'text-neutral-500 hover:text-emerald-400' : 'text-emerald-500'
                                                }`}
                                            title={alloc.status === 'Ongoing' ? 'Mark Completed' : 'Mark Ongoing'}
                                        >
                                            {alloc.status === 'Ongoing' ? <ToggleLeft className="w-5 h-5" /> : <ToggleRight className="w-5 h-5" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(alloc.id, alloc.employeeName, alloc.siteName, alloc.employeeId)}
                                            className="p-1.5 hover:bg-white/5 text-neutral-500 hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                                            title="Delete assignment"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-[11px] text-neutral-400 border-t border-white/5 pt-3">
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Employee:</span>
                                        <span className="text-white font-bold">{alloc.employeeName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Start Date:</span>
                                        <span className="text-white font-mono">{alloc.startDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Deadline:</span>
                                        <span className="text-white font-mono">{alloc.deadline || 'Flexible'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-neutral-500">Supervisor:</span>
                                        <span className="text-white">{alloc.supervisor}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-white/5 pt-2.5 mt-2.5">
                                        <span className="text-neutral-500">Status:</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider ${alloc.status === 'Completed'
                                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                                : alloc.status === 'Ongoing'
                                                    ? 'bg-[#c5a059]/15 text-[#c5a059] border border-[#c5a059]/20'
                                                    : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                            }`}>
                                            {alloc.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-neutral-900 border border-white/5 rounded-xl py-12 text-center text-xs text-neutral-500">
                            No allocations found matching selection.
                        </div>
                    )}
                </div>
            )}

            {/* Allocate Site Work Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 overflow-y-auto">
                    <div className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-sm overflow-hidden my-6">
                        <div className="flex justify-between items-center p-5 border-b border-white/5 bg-gradient-to-r from-[#c5a059]/10 to-transparent">
                            <div>
                                <h3 className="text-sm font-bold text-white">Assign Staff Site Work</h3>
                                <p className="text-[9px] uppercase tracking-widest text-[#c5a059] mt-0.5">Resource Allocation</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
                            <div className="space-y-1">
                                <label className="block text-[9px] uppercase font-bold text-neutral-400">Select Site / Project *</label>
                                <select
                                    required
                                    value={siteName}
                                    onChange={e => setSiteName(e.target.value)}
                                    className="w-full bg-neutral-950 border border-white/5 rounded-xl py-3 px-3 text-white outline-none focus:border-[#c5a059] cursor-pointer"
                                >
                                    <option value="">-- Choose Project --</option>
                                    {activeSites.map((name) => (
                                        <option key={name} value={name}>{name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[9px] uppercase font-bold text-neutral-400">Staff Member *</label>
                                <select
                                    required
                                    value={employeeId}
                                    onChange={e => setEmployeeId(e.target.value)}
                                    className="w-full bg-neutral-950 border border-white/5 rounded-xl py-3 px-3 text-white outline-none focus:border-[#c5a059] cursor-pointer"
                                >
                                    <option value="">-- Choose Worker --</option>
                                    {activeStaff.map((s) => (
                                        <option key={s.id} value={s.id}>{s.fullName} ({s.role})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-1">
                                <label className="block text-[9px] uppercase font-bold text-neutral-400">Specific Job Type (Optional)</label>
                                <input
                                    type="text"
                                    value={workType}
                                    onChange={e => setWorkType(e.target.value)}
                                    placeholder="e.g. Marble Cutting, Ceiling framing"
                                    className="w-full bg-neutral-950 border border-white/5 rounded-xl py-3 px-3.5 text-white outline-none focus:border-[#c5a059]"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="block text-[9px] uppercase font-bold text-neutral-400">Start Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        className="w-full bg-neutral-950 border border-white/5 rounded-xl py-2 px-2.5 text-white outline-none focus:border-[#c5a059] cursor-pointer"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-[9px] uppercase font-bold text-neutral-400">Target Deadline</label>
                                    <input
                                        type="date"
                                        value={deadline}
                                        onChange={e => setDeadline(e.target.value)}
                                        className="w-full bg-neutral-950 border border-white/5 rounded-xl py-2 px-2.5 text-white outline-none focus:border-[#c5a059] cursor-pointer"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="block text-[9px] uppercase font-bold text-neutral-400">Supervisor</label>
                                    <input
                                        type="text"
                                        value={supervisor}
                                        onChange={e => setSupervisor(e.target.value)}
                                        placeholder={adminName || "Admin"}
                                        className="w-full bg-neutral-950 border border-white/5 rounded-xl py-3 px-3.5 text-white outline-none focus:border-[#c5a059]"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="block text-[9px] uppercase font-bold text-neutral-400">Status</label>
                                    <select
                                        value={status}
                                        onChange={e => setStatus(e.target.value as 'Ongoing' | 'Completed' | 'Pending')}
                                        className="w-full bg-neutral-950 border border-white/5 rounded-xl py-3 px-3 text-white outline-none focus:border-[#c5a059] cursor-pointer"
                                    >
                                        <option value="Ongoing">Ongoing</option>
                                        <option value="Pending">Pending</option>
                                        <option value="Completed">Completed</option>
                                    </select>
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
                                    <span>Create Allocation</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
