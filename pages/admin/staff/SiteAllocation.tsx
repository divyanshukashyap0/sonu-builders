import React, { useState } from 'react';
import { useStaff } from '../../../hooks/useStaff';
import { useSiteAllocations } from '../../../hooks/useSiteAllocations';
import { SiteAllocation } from '../../../types';
import { 
    MapPin, Plus, Trash2, Search, Calendar, 
    User, HelpCircle, Loader2, Save, X, ToggleLeft, ToggleRight
} from 'lucide-react';

export default function SiteAllocationPage() {
    const { staff, loading: staffLoading } = useStaff();
    const { allocations, activeSites, loading: allocLoading, addAllocation, updateAllocationStatus, deleteAllocation } = useSiteAllocations();

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
                supervisor: supervisor || 'Admin',
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
        <div className="space-y-6 page-transition">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-stone-900 dark:text-white tracking-wide">Site Allocations</h1>
                    <p className="text-xs uppercase tracking-widest text-luxury-gold opacity-80 mt-1">Labor Assignments Matrix</p>
                </div>
                <button
                    onClick={() => setIsOpen(true)}
                    className="flex items-center gap-2 bg-luxury-gold text-stone-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-glow-gold hover:bg-stone-900 dark:hover:bg-white dark:hover:text-stone-950 hover:text-white transition-all active:scale-95 cursor-pointer"
                >
                    <Plus size={16} />
                    <span>Assign Site Work</span>
                </button>
            </div>

            {/* Filters */}
            <div className="bg-white dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-2xl p-4 flex flex-col md:flex-row gap-4 shadow-glass">
                {/* Search */}
                <div className="relative flex-grow">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500 w-4 h-4" />
                    <input
                        type="text"
                        placeholder="Search employee, site or job role..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 focus:border-luxury-gold/40 rounded-xl pl-11 pr-4 py-3 text-xs outline-none text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-650 transition-colors"
                    />
                </div>

                {/* Site Filter */}
                <div className="w-full md:w-64">
                    <select
                        value={selectedSite}
                        onChange={(e) => setSelectedSite(e.target.value)}
                        className="w-full bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 focus:border-luxury-gold/40 rounded-xl px-4 py-3 text-xs outline-none text-stone-900 dark:text-white cursor-pointer"
                    >
                        <option value="All" className="text-stone-900 bg-white dark:bg-stone-950 dark:text-white">All Active Sites</option>
                        {activeSites.map((siteName) => (
                            <option key={siteName} value={siteName} className="text-stone-900 bg-white dark:bg-stone-950 dark:text-white">{siteName}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Allocations Grid */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
                    <p className="text-xs uppercase tracking-widest text-stone-500">Decrypting Work Assignments...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAllocations.length > 0 ? (
                        filteredAllocations.map((alloc) => (
                            <div 
                                key={alloc.id} 
                                className={`bg-white dark:bg-stone-950/40 border ${alloc.status === 'Ongoing' ? 'border-stone-200 dark:border-white/5' : 'border-emerald-500/20 dark:border-emerald-500/10 opacity-75'} rounded-2xl p-6 shadow-glass relative group overflow-hidden transition-all duration-300 hover:border-luxury-gold/30`}
                            >
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-luxury-gold/5 to-transparent pointer-events-none" />

                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-base font-serif text-stone-900 dark:text-white">{alloc.siteName}</h3>
                                        <span className="inline-block bg-stone-100 dark:bg-white/5 text-stone-600 dark:text-stone-400 text-[9px] font-bold px-2 py-0.5 rounded-md mt-1 border border-stone-200 dark:border-white/5 uppercase tracking-wider">
                                            {alloc.workType}
                                        </span>
                                    </div>
                                    <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleToggleStatus(alloc)}
                                            className={`p-1.5 hover:bg-stone-100 dark:hover:bg-white/5 rounded-lg transition-colors cursor-pointer ${alloc.status === 'Ongoing' ? 'hover:text-emerald-600 dark:hover:text-emerald-400' : 'hover:text-amber-600 dark:hover:text-amber-400'}`}
                                            title={alloc.status === 'Ongoing' ? 'Mark Completed' : 'Mark Ongoing'}
                                        >
                                            {alloc.status === 'Ongoing' ? <ToggleLeft size={16} className="text-stone-400" /> : <ToggleRight size={16} className="text-emerald-500 dark:text-emerald-400" />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(alloc.id, alloc.employeeName, alloc.siteName, alloc.employeeId)}
                                            className="p-1.5 hover:bg-stone-100 dark:hover:bg-white/5 text-stone-400 hover:text-red-650 dark:hover:text-red-400 rounded-lg transition-colors cursor-pointer"
                                            title="Delete assignment"
                                        >
                                            <Trash2 size={13} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-xs text-stone-700 dark:text-stone-400 border-t border-stone-150 dark:border-white/5 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-stone-500 dark:text-stone-500">Employee Name:</span>
                                        <span className="text-stone-900 dark:text-white font-semibold">{alloc.employeeName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-stone-500 dark:text-stone-500">Start Date:</span>
                                        <span className="text-stone-800 dark:text-stone-300">{alloc.startDate}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-stone-500 dark:text-stone-500">Deadline:</span>
                                        <span className="text-stone-850 dark:text-stone-300">{alloc.deadline || 'Flexible'}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-stone-500 dark:text-stone-500">Supervisor:</span>
                                        <span className="text-stone-800 dark:text-stone-300">{alloc.supervisor}</span>
                                    </div>
                                    <div className="flex justify-between items-center border-t border-stone-150 dark:border-white/5 pt-3 mt-3">
                                        <span className="text-stone-500 dark:text-stone-500">Status:</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                                            alloc.status === 'Completed' 
                                                ? 'bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border border-emerald-500/20' 
                                                : alloc.status === 'Ongoing'
                                                ? 'bg-luxury-gold/15 text-luxury-gold border border-luxury-gold/20'
                                                : 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20'
                                        }`}>
                                            {alloc.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="col-span-full bg-stone-50 dark:bg-stone-950/20 border border-stone-200 dark:border-white/5 rounded-2xl py-16 text-center text-stone-500">
                            No allocations found matching selection.
                        </div>
                    )}
                </div>
            )}

            {/* Allocate Site Work Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
                    <div className="bg-white dark:bg-stone-950 border border-stone-200 dark:border-luxury-gold/20 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" data-lenis-prevent>
                        <div className="flex justify-between items-center p-6 border-b border-stone-200 dark:border-white/5 bg-gradient-to-r from-luxury-gold/5 to-transparent">
                            <div>
                                <h3 className="text-xl font-serif text-stone-900 dark:text-white">Assign Staff Site Work</h3>
                                <p className="text-[9px] uppercase tracking-widest text-luxury-gold opacity-75 mt-1">Resource Allocation</p>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-stone-100 dark:hover:bg-white/5 rounded-full transition-colors text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white cursor-pointer">
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 mb-1.5">Select Site / Project *</label>
                                <select
                                    required
                                    value={siteName}
                                    onChange={e => setSiteName(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white cursor-pointer"
                                >
                                    <option value="" disabled className="text-stone-900 bg-white dark:bg-stone-900 dark:text-white">-- Select Site --</option>
                                    {activeSites.map((site) => (
                                        <option key={site} value={site} className="text-stone-900 bg-white dark:bg-stone-900 dark:text-white">{site}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 mb-1.5">Select Employee *</label>
                                <select
                                    required
                                    value={employeeId}
                                    onChange={e => setEmployeeId(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white cursor-pointer"
                                >
                                    <option value="" disabled className="text-stone-900 bg-white dark:bg-stone-900 dark:text-white">-- Select staff member --</option>
                                    {activeStaff.map(emp => (
                                        <option key={emp.id} value={emp.id} className="text-stone-900 bg-white dark:bg-stone-900 dark:text-white">{emp.fullName} ({emp.role})</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 mb-1.5">Work Type / Job Description (Optional)</label>
                                <input
                                    type="text"
                                    value={workType}
                                    onChange={e => setWorkType(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white"
                                    placeholder="e.g. Master Carving, Standard POP"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 mb-1.5">Start Date *</label>
                                    <input
                                        type="date"
                                        required
                                        value={startDate}
                                        onChange={e => setStartDate(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 mb-1.5">Deadline / End Date</label>
                                    <input
                                        type="date"
                                        value={deadline}
                                        onChange={e => setDeadline(e.target.value)}
                                        className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 mb-1.5">Site Supervisor / Approved By</label>
                                <input
                                    type="text"
                                    value={supervisor}
                                    onChange={e => setSupervisor(e.target.value)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white"
                                    placeholder="e.g. Supervisor Name"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] uppercase font-bold text-stone-600 dark:text-stone-400 mb-1.5">Allocation Status</label>
                                <select
                                    value={status}
                                    onChange={e => setStatus(e.target.value as any)}
                                    className="w-full px-4 py-2.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl focus:border-luxury-gold/50 outline-none text-xs text-stone-900 dark:text-white cursor-pointer"
                                >
                                    <option value="Ongoing" className="text-stone-900 bg-white dark:bg-stone-900 dark:text-white">Ongoing</option>
                                    <option value="Pending" className="text-stone-900 bg-white dark:bg-stone-900 dark:text-white">Pending</option>
                                    <option value="Completed" className="text-stone-900 bg-white dark:bg-stone-900 dark:text-white">Completed</option>
                                </select>
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
                                    <span>Allocate</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
