import React, { useState, useCallback, useMemo } from 'react';
import { useStaff } from '../../../hooks/useStaff';
import { useAttendance, isDayPast12HourLimit } from '../../../hooks/useAttendance';
import { AttendanceDayStatus, StaffMember } from '../../../types';
import { 
    Calendar, Copy, CheckSquare, Lock, Unlock, 
    ArrowLeft, ArrowRight, Loader2, RefreshCw, Grid, HelpCircle,
    Search, Sparkles, Check, X, CalendarDays
} from 'lucide-react';

const STATUS_OPTIONS: { value: AttendanceDayStatus; label: string; bg: string; text: string }[] = [
    { value: 'S', label: 'Shift (1.0)', bg: 'bg-[#111827] text-white border-transparent dark:bg-stone-850 dark:border-white/10 dark:text-white', text: 'text-[#111827] dark:text-white' },
    { value: 'P', label: 'Premium (1.5)', bg: 'bg-[#D4AF37] text-stone-950 border-transparent dark:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-300', text: 'text-[#D4AF37] dark:text-amber-400' },
    { value: 'H', label: 'Half (0.5)', bg: 'bg-[#3B82F6] text-white border-transparent dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-300', text: 'text-[#3B82F6] dark:text-blue-400' },
    { value: 'D', label: 'Double (2.0)', bg: 'bg-[#10B981] text-white border-transparent dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-300', text: 'text-[#10B981] dark:text-emerald-400' },
    { value: 'A', label: 'Absent (0)', bg: 'bg-[#EF4444] text-white border-transparent dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-300', text: 'text-[#EF4444] dark:text-red-400' },
    { value: '', label: 'Unmarked', bg: 'bg-[#F3F4F6] border border-black/[0.06] text-stone-400 hover:bg-[#E5E7EB] dark:bg-stone-900 dark:border-white/5 dark:text-stone-600 dark:hover:bg-stone-850', text: 'text-stone-450 dark:text-stone-500' }
];

export default function Attendance() {
    const { staff, loading: staffLoading } = useStaff();
    const [viewMode, setViewMode] = useState<'prompt' | 'daily' | 'monthly'>('prompt');
    
    // Daily view states
    const [selectedDate, setSelectedDate] = useState(() => {
        const d = new Date();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [loadingBulk, setLoadingBulk] = useState(false);

    // Monthly view states
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // 1-indexed

    // Calculate active parameters
    const parsedDate = useMemo(() => {
        const parts = selectedDate.split('-');
        return {
            year: parseInt(parts[0], 10),
            month: parseInt(parts[1], 10),
            day: parseInt(parts[2], 10)
        };
    }, [selectedDate]);

    const activeYear = viewMode === 'daily' ? parsedDate.year : currentYear;
    const activeMonth = viewMode === 'daily' ? parsedDate.month : currentMonth;
    const monthId = `${activeYear}-${String(activeMonth).padStart(2, '0')}`;

    const { 
        attendanceMap, isLocked, loading: attLoading, 
        markAttendanceCell, markFullMonth, copyPreviousDayAttendance, setMonthLockStatus 
    } = useAttendance(monthId);

    const [activeCell, setActiveCell] = useState<{ staffId: string; day: number } | null>(null);
    const [updatingCell, setUpdatingCell] = useState<string | null>(null);

    const activeStaff = useMemo(() => {
        return staff.filter(s => s.status === 'active');
    }, [staff]);

    const filteredStaff = useMemo(() => {
        return activeStaff.filter(emp => 
            emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (emp.employeeId && emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [activeStaff, searchTerm]);

    // Get number of days in current month
    const daysInMonth = new Date(activeYear, activeMonth, 0).getDate();
    
    // Memoize daysArray to prevent reference changes on parent re-renders
    const daysArray = useMemo(() => {
        return Array.from({ length: daysInMonth }, (_, i) => i + 1);
    }, [daysInMonth]);

    const getMonthName = (month: number) => {
        return new Date(activeYear, month - 1).toLocaleString('default', { month: 'long' });
    };

    const handlePrevMonth = () => {
        if (currentMonth === 1) {
            setCurrentMonth(12);
            setCurrentYear(prev => prev - 1);
        } else {
            setCurrentMonth(prev => prev - 1);
        }
    };

    const handleNextMonth = () => {
        if (currentMonth === 12) {
            setCurrentMonth(1);
            setCurrentYear(prev => prev + 1);
        } else {
            setCurrentMonth(prev => prev + 1);
        }
    };

    // Memoize lockedDaysMap to prevent full row recalculations
    const lockedDaysMap = useMemo(() => {
        return daysArray.reduce((acc, day) => {
            acc[day] = isLocked || isDayPast12HourLimit(monthId, day);
            return acc;
        }, {} as Record<number, boolean>);
    }, [monthId, isLocked, daysArray]);

    const handleCellClick = useCallback((staffId: string, day: number) => {
        if (isLocked || isDayPast12HourLimit(monthId, day)) return;
        setActiveCell({ staffId, day });
    }, [isLocked, monthId]);

    const selectStatus = useCallback(async (staffId: string, day: number, status: AttendanceDayStatus) => {
        setActiveCell(null);
        setUpdatingCell(`${staffId}_${day}`);
        try {
            await markAttendanceCell(staffId, day, status);
        } catch (err) {
            console.error(err);
            alert("Lock restriction is active or connection failed.");
        } finally {
            setUpdatingCell(null);
        }
    }, [markAttendanceCell]);

    const handleBulkMark = useCallback(async (staffId: string, status: AttendanceDayStatus) => {
        if (window.confirm(`Mark all ${daysInMonth} days as ${status || 'Unmarked'} for this employee?`)) {
            try {
                await markFullMonth(staffId, status, daysInMonth);
            } catch (err) {
                console.error(err);
                alert("Operation blocked: Payroll locked.");
            }
        }
    }, [daysInMonth, markFullMonth]);

    const handleCopyPreviousDay = useCallback(async (day: number) => {
        if (window.confirm(`Copy attendance status from Day ${day - 1} to Day ${day} for all active staff?`)) {
            try {
                await copyPreviousDayAttendance(day, activeStaff);
            } catch (err) {
                console.error(err);
                alert("Operation failed: Lock is enabled.");
            }
        }
    }, [copyPreviousDayAttendance, activeStaff]);

    const handleDailyBulkMark = async (status: AttendanceDayStatus) => {
        if (isLocked) {
            alert("This month is locked and cannot be edited.");
            return;
        }
        if (isDayPast12HourLimit(monthId, parsedDate.day)) {
            alert(`Attendance for Day ${parsedDate.day} is locked (12-hour limit exceeded).`);
            return;
        }
        const unmarkedStaff = activeStaff.filter(emp => {
            const currentStatus = attendanceMap[emp.id]?.days?.[String(parsedDate.day)] || '';
            return !currentStatus;
        });
        if (unmarkedStaff.length === 0) {
            alert("No unmarked staff members found for this day.");
            return;
        }
        if (window.confirm(`Mark all ${unmarkedStaff.length} unmarked staff as ${STATUS_OPTIONS.find(o => o.value === status)?.label || 'Unmarked'} for Day ${parsedDate.day}?`)) {
            setLoadingBulk(true);
            try {
                for (const emp of unmarkedStaff) {
                    await markAttendanceCell(emp.id, parsedDate.day, status);
                }
            } catch (err) {
                console.error(err);
                alert("Failed to update some cells.");
            } finally {
                setLoadingBulk(false);
            }
        }
    };

    const toggleLock = useCallback(async () => {
        const message = isLocked 
            ? "Unlock this month's attendance? Admins will be able to modify records." 
            : "Lock this month's attendance? This will lock attendance edits. Payroll remains reviewable.";
        if (window.confirm(message)) {
            try {
                await setMonthLockStatus(!isLocked);
            } catch (err) {
                console.error(err);
            }
        }
    }, [isLocked, setMonthLockStatus]);

    // Live statistics for daily view
    const dailyStats = useMemo(() => {
        let present = 0;
        let absent = 0;
        let unmarked = 0;
        const dayKey = String(parsedDate.day);
        activeStaff.forEach(emp => {
            const status = attendanceMap[emp.id]?.days?.[dayKey] || '';
            if (['S', 'P', 'H', 'D'].includes(status)) {
                present++;
            } else if (status === 'A') {
                absent++;
            } else {
                unmarked++;
            }
        });
        return { present, absent, unmarked };
    }, [activeStaff, attendanceMap, parsedDate.day]);

    const isLoading = staffLoading || attLoading || loadingBulk;

    // View 1: Control Center Mode Selector Prompt
    if (viewMode === 'prompt') {
        return (
            <div className="min-h-[70vh] flex flex-col justify-center items-center py-12 px-4 page-transition">
                <div className="max-w-4xl w-full text-center space-y-8">
                    <div>
                        <h1 className="text-4xl font-serif text-stone-900 dark:text-white font-extrabold tracking-wide">Attendance Control Center</h1>
                        <p className="text-xs uppercase tracking-[3px] font-black text-[#B8860B] dark:text-luxury-gold mt-2">Shift & Presence Selection Matrix</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                        {/* Daily check-in card */}
                        <div 
                            onClick={() => setViewMode('daily')}
                            className="group relative bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-3xl p-8 shadow-xl cursor-pointer hover:border-[#B8860B]/50 dark:hover:border-luxury-gold/50 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_50px_rgba(184,134,11,0.05)] transform hover:-translate-y-2 flex flex-col justify-between text-left"
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#B8860B]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            <div className="relative z-10 space-y-6">
                                <div className="w-16 h-16 bg-[#B8860B]/10 dark:bg-luxury-gold/10 rounded-2xl flex items-center justify-center text-[#B8860B] dark:text-luxury-gold transition-colors duration-300 group-hover:bg-[#B8860B] group-hover:text-white dark:group-hover:bg-luxury-gold dark:group-hover:text-stone-950">
                                    <CalendarDays size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-white group-hover:text-[#B8860B] dark:group-hover:text-luxury-gold transition-colors">Daily Shift Tracker</h3>
                                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                                        Mark or update attendance for all active staff for a single day. Lightweight layout optimized for speed on mobile and tablet. Zero rendering lag.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#B8860B] dark:text-luxury-gold group-hover:translate-x-2 transition-transform">
                                <span>Access Daily Board</span>
                                <ArrowRight size={14} />
                            </div>
                        </div>

                        {/* Monthly grid card */}
                        <div 
                            onClick={() => setViewMode('monthly')}
                            className="group relative bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-3xl p-8 shadow-xl cursor-pointer hover:border-[#B8860B]/50 dark:hover:border-luxury-gold/50 transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] dark:hover:shadow-[0_20px_50px_rgba(184,134,11,0.05)] transform hover:-translate-y-2 flex flex-col justify-between text-left"
                        >
                            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#B8860B]/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                            <div className="relative z-10 space-y-6">
                                <div className="w-16 h-16 bg-[#B8860B]/10 dark:bg-luxury-gold/10 rounded-2xl flex items-center justify-center text-[#B8860B] dark:text-luxury-gold transition-colors duration-300 group-hover:bg-[#B8860B] group-hover:text-white dark:group-hover:bg-luxury-gold dark:group-hover:text-stone-950">
                                    <Grid size={32} />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-serif font-bold text-stone-900 dark:text-white group-hover:text-[#B8860B] dark:group-hover:text-luxury-gold transition-colors">Monthly Grid Matrix</h3>
                                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-2 leading-relaxed">
                                        View the full spreadsheet matrix for the selected month. Perfect for double checking historical entries, locking records, and calculating payroll estimates.
                                    </p>
                                </div>
                            </div>
                            <div className="mt-8 flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#B8860B] dark:text-luxury-gold group-hover:translate-x-2 transition-transform">
                                <span>Open Monthly Grid</span>
                                <ArrowRight size={14} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // View 2: Daily Attendance Tracker
    if (viewMode === 'daily') {
        const isDayLocked = isLocked || isDayPast12HourLimit(monthId, parsedDate.day);
        return (
            <div className="space-y-6 page-transition">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#B8860B] dark:text-luxury-gold">
                            <Sparkles size={12} />
                            <span>Daily Shift Tracker</span>
                        </div>
                        <div className="flex flex-wrap items-center gap-3 mt-1">
                            <h1 className="text-3xl font-serif text-[#1A1A1A] dark:text-white font-bold tracking-wide">Daily Log</h1>
                            <div className="text-[9px] font-bold text-amber-650 dark:text-amber-400 uppercase tracking-wider bg-amber-500/10 border border-amber-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1.5 shrink-0">
                                <HelpCircle size={10} className="text-amber-655 dark:text-amber-400" />
                                <span>Daily auto-lock active (12h window)</span>
                            </div>
                        </div>
                    </div>

                    {/* Controls & Nav */}
                    <div className="flex flex-wrap items-center gap-3">
                        <button 
                            onClick={() => setViewMode('prompt')} 
                            className="flex items-center gap-2 px-4 py-2 border border-stone-200 dark:border-white/5 bg-white dark:bg-stone-900 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                        >
                            <ArrowLeft size={14} />
                            <span>Control Center</span>
                        </button>
                        <button 
                            onClick={() => setViewMode('monthly')} 
                            className="flex items-center gap-2 px-4 py-2 bg-stone-950 text-white dark:bg-white dark:text-stone-950 rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors"
                        >
                            <Grid size={14} />
                            <span>Monthly Sheet</span>
                        </button>
                    </div>
                </div>

                {/* Day selector & Stats Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Date Picker Card */}
                    <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-[20px] p-5 shadow-glass flex flex-col justify-between">
                        <div>
                            <span className="text-[10px] font-black uppercase text-stone-400 tracking-wider">Select Attendance Target Date</span>
                            <div className="mt-2 relative">
                                <input 
                                    type="date" 
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                    className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl px-4 py-3 text-sm font-bold text-stone-900 dark:text-white focus:outline-none focus:border-[#B8860B]/50"
                                />
                            </div>
                        </div>
                        <div className="mt-4 flex items-center justify-between text-xs font-bold text-stone-500 dark:text-stone-400">
                            <span>Selected Day:</span>
                            <span className="text-stone-900 dark:text-white uppercase font-black tracking-wider bg-stone-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                                Day {parsedDate.day}
                            </span>
                        </div>
                    </div>

                    {/* Stats Dashboard */}
                    <div className="lg:col-span-2 bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-[20px] p-5 shadow-glass grid grid-cols-3 gap-4">
                        <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                            <span className="text-[9px] font-black uppercase tracking-wider text-emerald-500 dark:text-emerald-400/80">Present</span>
                            <span className="text-2xl font-black mt-1">{attLoading ? '...' : dailyStats.present}</span>
                        </div>
                        <div className="bg-red-500/10 border border-red-500/20 text-red-650 dark:text-red-400 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                            <span className="text-[9px] font-black uppercase tracking-wider text-red-550 dark:text-red-400/80">Absent</span>
                            <span className="text-2xl font-black mt-1">{attLoading ? '...' : dailyStats.absent}</span>
                        </div>
                        <div className="bg-stone-100 dark:bg-white/5 border border-stone-200 dark:border-white/5 text-stone-500 dark:text-stone-400 rounded-xl p-4 flex flex-col justify-center items-center text-center">
                            <span className="text-[9px] font-black uppercase tracking-wider">Unmarked</span>
                            <span className="text-2xl font-black mt-1">{attLoading ? '...' : dailyStats.unmarked}</span>
                        </div>
                    </div>
                </div>

                {/* Filter and Bulk Actions Panel */}
                <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-[20px] p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-glass">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400" size={16} />
                        <input 
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Find artisan by name/role..."
                            className="w-full bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 focus:outline-none focus:border-[#B8860B]/30"
                        />
                    </div>

                    {!isDayLocked && (
                        <div className="flex items-center gap-2 w-full md:w-auto">
                            <span className="text-[10px] font-black text-stone-400 uppercase tracking-wider shrink-0 mr-2">Bulk Fill Day:</span>
                            {STATUS_OPTIONS.filter(o => o.value).map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => handleDailyBulkMark(opt.value)}
                                    disabled={isLoading}
                                    className="flex-1 md:flex-initial text-[10px] font-black px-3 py-2 border rounded-xl hover:scale-105 active:scale-95 transition-all text-center flex items-center justify-center gap-1.5"
                                    style={{
                                        borderColor: opt.value === 'S' ? '#111827' : opt.value === 'P' ? '#D4AF37' : opt.value === 'H' ? '#3B82F6' : opt.value === 'D' ? '#10B981' : '#EF4444',
                                        color: opt.value === 'S' ? undefined : opt.value === 'P' ? '#D4AF37' : opt.value === 'H' ? '#3B82F6' : opt.value === 'D' ? '#10B981' : '#EF4444'
                                    }}
                                >
                                    <span>{opt.value}</span>
                                </button>
                            ))}
                        </div>
                    )}

                    {isDayLocked && (
                        <div className="text-[10px] font-black text-red-650 dark:text-red-400 uppercase tracking-widest bg-red-50 dark:bg-red-955/20 border border-red-200 dark:border-red-900/30 px-4 py-2 rounded-xl flex items-center gap-2">
                            <Lock size={13} />
                            <span>Day Locked (Read-Only)</span>
                        </div>
                    )}
                </div>

                {/* Artisan List */}
                {attLoading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
                        <p className="text-xs uppercase tracking-widest text-stone-500">Retrieving Daily Matrix...</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredStaff.length > 0 ? (
                            filteredStaff.map((emp) => {
                                const currentStatus = attendanceMap[emp.id]?.days?.[String(parsedDate.day)] || '';
                                const isCellUpdating = updatingCell === `${emp.id}_${parsedDate.day}`;
                                
                                return (
                                    <div 
                                        key={emp.id}
                                        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-2xl p-5 shadow-glass flex flex-col justify-between gap-4 hover:border-[#B8860B]/20 dark:hover:border-luxury-gold/20 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-[#B8860B]/10 dark:bg-luxury-gold/10 border border-[#B8860B]/20 dark:border-luxury-gold/20 flex items-center justify-center text-xs font-black text-[#B8860B] dark:text-luxury-gold uppercase">
                                                {emp.fullName.split(' ').map(n => n[0]).slice(0, 2).join('')}
                                            </div>
                                            <div className="min-w-0 flex-1">
                                                <h3 className="text-sm font-bold text-stone-900 dark:text-white truncate" title={emp.fullName}>{emp.fullName}</h3>
                                                <p className="text-[10px] text-stone-400 uppercase font-black tracking-wider mt-0.5">{emp.role}</p>
                                            </div>
                                        </div>

                                        <div className="border-t border-stone-100 dark:border-white/5 pt-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <span className="text-[9px] font-black uppercase text-stone-400 tracking-wider">Attendance Status</span>
                                                <span className="text-[9px] font-mono text-stone-400">{emp.employeeId}</span>
                                            </div>

                                            {isCellUpdating ? (
                                                <div className="h-10 flex items-center justify-center">
                                                    <Loader2 size={16} className="animate-spin text-[#B8860B] dark:text-luxury-gold" />
                                                </div>
                                            ) : (
                                                <div className="flex gap-1.5 justify-between">
                                                    {STATUS_OPTIONS.map((opt) => {
                                                        const isActive = currentStatus === opt.value;
                                                        return (
                                                            <button
                                                                key={opt.value || 'unmark'}
                                                                disabled={isDayLocked}
                                                                onClick={() => selectStatus(emp.id, parsedDate.day, opt.value)}
                                                                className={`flex-1 h-9 rounded-lg text-xs font-black flex items-center justify-center transition-all ${
                                                                    isDayLocked 
                                                                        ? isActive 
                                                                            ? opt.bg + ' opacity-100 shadow-sm' 
                                                                            : 'bg-stone-50 dark:bg-stone-900 text-stone-300 dark:text-stone-700 border border-transparent' 
                                                                        : isActive 
                                                                            ? opt.bg + ' scale-105 shadow-md' 
                                                                            : 'bg-stone-50 hover:bg-stone-100 dark:bg-stone-900 dark:hover:bg-stone-850 text-stone-400 hover:text-stone-900 dark:text-stone-500 dark:hover:text-stone-200 border border-transparent'
                                                                }`}
                                                                title={opt.label}
                                                            >
                                                                {opt.value || <X size={12} />}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        ) : (
                            <div className="col-span-full py-12 text-center text-xs text-stone-500">
                                No active artisans registered or found matching search parameters.
                            </div>
                        )}
                    </div>
                )}
            </div>
        );
    }

    // View 3: Traditional Monthly Attendance Matrix Sheet
    return (
        <div className="space-y-6 page-transition">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-[#B8860B] dark:text-luxury-gold">
                        <Grid size={12} />
                        <span>Monthly Sheet Grid</span>
                    </div>
                    <h1 className="text-3xl font-serif text-[#1A1A1A] dark:text-white font-bold tracking-wide mt-1">Attendance Sheet</h1>
                </div>
                
                {/* Controls & Nav */}
                <div className="flex flex-wrap items-center gap-2.5">
                    <button 
                        onClick={() => setViewMode('prompt')} 
                        className="flex items-center gap-2 px-4 py-2 border border-stone-200 dark:border-white/5 bg-white dark:bg-stone-900 rounded-xl text-xs font-bold text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors"
                    >
                        <ArrowLeft size={14} />
                        <span>Control Center</span>
                    </button>
                    <button 
                        onClick={() => setViewMode('daily')} 
                        className="flex items-center gap-2 px-4 py-2 bg-stone-950 text-white dark:bg-white dark:text-stone-900 rounded-xl text-xs font-black uppercase tracking-wider shadow-md hover:bg-stone-800 dark:hover:bg-stone-100 transition-colors"
                    >
                        <CalendarDays size={14} />
                        <span>Daily Log</span>
                    </button>

                    {/* Month Controller */}
                    <div className="flex items-center gap-3 bg-white dark:bg-stone-900 border border-black/[0.08] dark:border-white/5 rounded-xl px-3 py-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.04)] dark:shadow-glass">
                        <button onClick={handlePrevMonth} className="p-1.5 hover:bg-stone-100 dark:hover:bg-white/5 rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                            <ArrowLeft size={16} />
                        </button>
                        <span className="text-xs font-black uppercase tracking-wider text-[#111827] dark:text-white select-none min-w-[120px] text-center">
                            {getMonthName(currentMonth)} {currentYear}
                        </span>
                        <button onClick={handleNextMonth} className="p-1.5 hover:bg-stone-100 dark:hover:bg-white/5 rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors">
                            <ArrowRight size={16} />
                        </button>
                    </div>

                    <button
                        onClick={toggleLock}
                        disabled={isLoading}
                        className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all active:scale-95 ${
                            isLocked 
                                ? 'bg-red-500/10 border border-red-500/20 text-red-500 dark:text-red-400 hover:bg-red-500/20' 
                                : 'bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-[#111827] shadow-[0_8px_18px_rgba(184,134,11,0.25)] hover:translate-y-[-2px] hover:shadow-[0_12px_24px_rgba(184,134,11,0.35)] dark:from-luxury-gold dark:to-luxury-gold dark:shadow-glow-gold dark:hover:from-white dark:hover:to-white'
                        }`}
                    >
                        {isLocked ? <Lock size={15} /> : <Unlock size={15} />}
                        <span>{isLocked ? 'Sheet Locked' : 'Lock Attendance'}</span>
                    </button>
                </div>
            </div>

            {/* Shift legend indicator */}
            <div className="bg-white/88 dark:bg-white/5 border border-black/[0.05] dark:border-white/5 rounded-[20px] p-4 flex flex-wrap gap-4 items-center text-xs text-[#6B7280] dark:text-stone-400 shadow-[0_8px_20px_rgba(0,0,0,0.04)] dark:shadow-glass transition-colors duration-300">
                <span className="font-bold text-[#111827] dark:text-white uppercase text-[10px] tracking-wider mr-2">Legend:</span>
                {STATUS_OPTIONS.filter(o => o.value).map((opt) => (
                    <div key={opt.value} className="flex items-center gap-1.5 bg-white dark:bg-stone-900 border border-black/[0.06] dark:border-white/5 px-2.5 py-1.5 rounded-lg shadow-[0_4px_8px_rgba(0,0,0,0.03)]">
                        <span className={`font-black w-5 text-center ${opt.text}`}>{opt.value}</span>
                        <span className="text-stone-500 dark:text-stone-400">={opt.label}</span>
                    </div>
                ))}
                
                {isLocked ? (
                    <div className="ml-auto text-[10px] font-black text-red-650 dark:text-red-400 uppercase tracking-widest bg-red-50 dark:bg-red-955/20 border border-red-200 dark:border-red-900/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-pulse">
                        <Lock size={12} />
                        <span>Sheet Locked (Read-Only)</span>
                    </div>
                ) : (
                    <div className="ml-auto text-[10px] font-bold text-amber-650 dark:text-amber-400 uppercase tracking-wider bg-amber-500/10 border border-amber-900/30 px-3 py-1.5 rounded-xl flex items-center gap-1.5">
                        <HelpCircle size={12} className="text-amber-655 dark:text-amber-400" />
                        <span>Daily auto-lock active (12h window)</span>
                    </div>
                )}
            </div>

            {/* Grid Container */}
            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
                    <p className="text-xs uppercase tracking-widest text-stone-500">Decrypting Attendance Grid...</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-stone-950/40 border border-black/[0.08] dark:border-white/5 rounded-[24px] overflow-hidden shadow-[0_8px_20px_rgba(0,0,0,0.04)] dark:shadow-glass transition-colors duration-300">
                    <div className="overflow-x-auto relative premium-scroll max-h-[60vh]" data-lenis-prevent>
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-white dark:bg-stone-900/80 border-b border-black/[0.12] dark:border-white/5 text-[9px] uppercase tracking-wider font-black text-[#374151] dark:text-stone-400">
                                    <th className="px-4 py-3 text-left sticky left-0 z-20 bg-white dark:bg-stone-900 min-w-[160px] text-[#111827] dark:text-white">Employee Name</th>
                                    <th className="px-4 py-3 text-center border-r border-black/[0.05] dark:border-white/5 text-[#111827] dark:text-white">Role</th>
                                    {daysArray.map((day) => {
                                        const isDayLocked = lockedDaysMap[day];
                                        return (
                                            <th 
                                                key={day} 
                                                className="p-2 text-center border-r border-black/[0.05] dark:border-white/5 min-w-[38px] group hover:bg-[#F3F4F6] dark:hover:bg-stone-800 transition-colors"
                                            >
                                                <div className="flex flex-col items-center">
                                                    <span>{day}</span>
                                                    {day > 1 && !isDayLocked && (
                                                        <button
                                                            onClick={() => handleCopyPreviousDay(day)}
                                                            className="mt-1 opacity-0 group-hover:opacity-100 p-0.5 text-stone-500 hover:text-theme-accent rounded transition-all"
                                                            title={`Copy from Day ${day - 1}`}
                                                        >
                                                            <Copy size={9} />
                                                        </button>
                                                    )}
                                                </div>
                                            </th>
                                        );
                                    })}
                                    <th className="px-3 py-3 text-center border-l border-black/[0.05] dark:border-white/5 bg-white dark:bg-stone-900/60 sticky right-12 z-10 font-bold text-[#B8860B] dark:text-luxury-gold min-w-[50px]">Work</th>
                                    <th className="px-3 py-3 text-center bg-white dark:bg-stone-900/60 sticky right-0 z-10 font-bold text-red-500 dark:text-red-400 min-w-[50px]">Abs</th>
                                    {!isLocked && <th className="px-4 py-3 text-center min-w-[80px]">Bulk</th>}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-200 dark:divide-white/5">
                                {activeStaff.length > 0 ? (
                                    activeStaff.map((emp) => {
                                        const record = attendanceMap[emp.id];
                                        const activeCellDay = activeCell?.staffId === emp.id ? activeCell.day : null;
                                        const updatingCellDay = updatingCell && updatingCell.startsWith(`${emp.id}_`)
                                            ? parseInt(updatingCell.split('_')[1], 10)
                                            : null;

                                        return (
                                            <AttendanceRow
                                                key={emp.id}
                                                emp={emp}
                                                record={record}
                                                daysArray={daysArray}
                                                lockedDaysMap={lockedDaysMap}
                                                activeCellDay={activeCellDay}
                                                updatingCellDay={updatingCellDay}
                                                onCellClick={handleCellClick}
                                                onSelectStatus={selectStatus}
                                                onBulkMark={handleBulkMark}
                                                isLocked={isLocked}
                                            />
                                        );
                                    })
                                ) : (
                                    <tr>
                                        <td colSpan={daysInMonth + 5} className="py-12 text-center text-xs text-stone-500">
                                            No active staff registered. Add profiles in the Staff Directory.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
            
            {/* Backdrop for closing active dropdown cells */}
            {activeCell && (
                <div className="fixed inset-0 z-20 bg-transparent" onClick={() => setActiveCell(null)} />
            )}
        </div>
    );
}

// Optimized individual cell component to avoid full-grid re-renders on cell actions
const AttendanceCell = React.memo(({
    day,
    status,
    isCellLocked,
    isCellActive,
    isUpdating,
    onCellClick,
    onSelectStatus,
    empId,
    isLocked
}: {
    day: number;
    status: AttendanceDayStatus;
    isCellLocked: boolean;
    isCellActive: boolean;
    isUpdating: boolean;
    onCellClick: (staffId: string, day: number) => void;
    onSelectStatus: (staffId: string, day: number, status: AttendanceDayStatus) => void;
    empId: string;
    isLocked: boolean;
}) => {
    const option = STATUS_OPTIONS.find(o => o.value === status) || STATUS_OPTIONS[5];

    return (
        <td className="p-1 border-r border-b border-black/[0.05] dark:border-white/5 relative text-center">
            {isUpdating ? (
                 <div className="w-8 h-8 flex items-center justify-center mx-auto">
                     <RefreshCw size={10} className="animate-spin text-[#B8860B] dark:text-luxury-gold" />
                 </div>
             ) : (
                 <button
                     onClick={() => onCellClick(empId, day)}
                     disabled={isCellLocked}
                     className={`w-8 h-8 rounded-lg text-xs font-black transition-all flex items-center justify-center mx-auto border ${isCellLocked ? 'opacity-40 cursor-not-allowed hover:scale-100 active:scale-100' : 'hover:scale-105 active:scale-95'} ${option.bg}`}
                     title={isCellLocked && !isLocked ? `Locked (12-hour limit exceeded)` : undefined}
                  >
                     {status || '-'}
                 </button>
             )}

            {/* Absolute Cell Dropdown Picker */}
            {isCellActive && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 z-30 bg-white dark:bg-stone-950 border border-black/[0.08] dark:border-luxury-gold/30 rounded-xl shadow-2xl p-1.5 grid grid-cols-5 gap-1 min-w-[160px]">
                    {STATUS_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => onSelectStatus(empId, day, opt.value)}
                            className={`w-7 h-7 rounded-lg text-xs font-black flex items-center justify-center hover:scale-115 transition-transform ${opt.bg}`}
                            title={opt.label}
                        >
                            {opt.value || '-'}
                        </button>
                    ))}
                </div>
            )}
        </td>
    );
});

const AttendanceRow = React.memo(({
    emp,
    record,
    daysArray,
    lockedDaysMap,
    activeCellDay,
    updatingCellDay,
    onCellClick,
    onSelectStatus,
    onBulkMark,
    isLocked
}: {
    emp: StaffMember;
    record: any;
    daysArray: number[];
    lockedDaysMap: Record<number, boolean>;
    activeCellDay: number | null;
    updatingCellDay: number | null;
    onCellClick: (staffId: string, day: number) => void;
    onSelectStatus: (staffId: string, day: number, status: AttendanceDayStatus) => void;
    onBulkMark: (staffId: string, status: AttendanceDayStatus) => void;
    isLocked: boolean;
}) => {
    const workUnits = record ? record.totalWorkUnits : 0;
    const absents = record ? record.totalAbsent : 0;

    return (
        <tr className="hover:bg-stone-50 dark:hover:bg-white/5 transition-colors border-b border-black/[0.05] dark:border-white/5">
            {/* Sticky Name */}
            <td className="px-4 py-3 font-bold text-xs text-[#111827] dark:text-white sticky left-0 z-10 bg-white dark:bg-stone-900/90 border-r-2 border-stone-200 dark:border-white/10 truncate max-w-[180px]">
                <div className="flex flex-col">
                    <span>{emp.fullName}</span>
                    <span className="text-[8px] font-mono text-[#9CA3AF] dark:text-stone-500 mt-0.5">{emp.employeeId}</span>
                </div>
            </td>

            {/* Role */}
            <td className="px-3 py-3 text-center border-r border-black/[0.05] dark:border-white/5 text-[10px] text-[#6B7280] dark:text-stone-400 font-bold">
                {emp.role}
            </td>

            {/* Attendance Days */}
            {daysArray.map((day) => {
                const status = record?.days?.[String(day)] || '';
                const isCellActive = activeCellDay === day;
                const isUpdating = updatingCellDay === day;
                const isCellLocked = lockedDaysMap[day];

                return (
                    <AttendanceCell 
                        key={day}
                        day={day}
                        status={status}
                        isCellLocked={isCellLocked}
                        isCellActive={isCellActive}
                        isUpdating={isUpdating}
                        onCellClick={onCellClick}
                        onSelectStatus={onSelectStatus}
                        empId={emp.id}
                        isLocked={isLocked}
                    />
                );
            })}

            {/* Auto-computed Work Units */}
            <td className="px-3 py-3 text-center font-black text-xs text-[#B8860B] dark:text-luxury-gold sticky right-12 z-10 bg-white dark:bg-stone-900/90 border-l border-stone-200 dark:border-white/10">
                {workUnits.toFixed(1)}
            </td>

            {/* Auto-computed Absences */}
            <td className="px-3 py-3 text-center font-black text-xs text-[#EF4444] dark:text-red-400 sticky right-0 z-10 bg-white dark:bg-stone-900/90 border-l border-stone-200 dark:border-white/10">
                {absents}
            </td>

            {/* Bulk actions */}
            {!isLocked && (
                <td className="px-3 py-3 text-center">
                    <select
                        onChange={(e) => onBulkMark(emp.id, e.target.value as AttendanceDayStatus)}
                        defaultValue=""
                        className="bg-white dark:bg-stone-900 border border-black/[0.08] dark:border-white/5 rounded-lg text-[9px] font-bold p-1 outline-none text-stone-500 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white cursor-pointer"
                    >
                        <option value="" disabled>Fill...</option>
                        <option value="S">All Shift (S)</option>
                        <option value="P">All Premium (P)</option>
                        <option value="H">All Half (H)</option>
                        <option value="D">All Double (D)</option>
                        <option value="A">All Absent (A)</option>
                    </select>
                </td>
            )}
        </tr>
    );
});
