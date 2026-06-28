import React, { useState, useMemo, useCallback } from 'react';
import { useStaff } from '../hooks/useStaff';
import { useAttendance, isDayPast12HourLimit } from '../hooks/useAttendance';
import type { AttendanceDayStatus, StaffMember } from '../types';
import { 
    Calendar, Copy, CheckSquare, Lock, Unlock, 
    ArrowLeft, ArrowRight, Loader2, RefreshCw, 
    Search, Check, X, CalendarDays, ClipboardList, Info
} from 'lucide-react';

const STATUS_OPTIONS: { value: AttendanceDayStatus; label: string; bg: string; text: string }[] = [
    { value: 'S', label: 'Shift (1.0)', bg: 'bg-[#111827] text-white border-white/5 dark:bg-stone-850 dark:border-white/10 dark:text-white', text: 'text-neutral-300' },
    { value: 'P', label: 'Premium (1.5)', bg: 'bg-[#c5a059]/25 text-[#c5a059] border-[#c5a059]/30 dark:bg-amber-500/20 dark:border-amber-500/30 dark:text-amber-300', text: 'text-[#c5a059] dark:text-amber-400' },
    { value: 'H', label: 'Half (0.5)', bg: 'bg-blue-500/20 text-blue-400 border-blue-500/30 dark:bg-blue-500/20 dark:border-blue-500/30 dark:text-blue-300', text: 'text-blue-400' },
    { value: 'D', label: 'Double (2.0)', bg: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 dark:bg-emerald-500/20 dark:border-emerald-500/30 dark:text-emerald-300', text: 'text-emerald-400' },
    { value: 'A', label: 'Absent (0)', bg: 'bg-red-500/20 text-red-400 border-red-500/30 dark:bg-red-500/20 dark:border-red-500/30 dark:text-red-300', text: 'text-red-400' },
    { value: '', label: 'Unmarked', bg: 'bg-neutral-950 border border-white/5 text-neutral-500 hover:text-white', text: 'text-neutral-500' }
];

interface AttendanceManagerProps {
    onBack: () => void;
}

export default function AttendanceManager({ onBack }: AttendanceManagerProps) {
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
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

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

    const daysInMonth = new Date(activeYear, activeMonth, 0).getDate();
    
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
            alert("Attendance locked or database error occurred.");
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
                alert("Operation blocked: Monthly payroll is locked.");
            }
        }
    }, [daysInMonth, markFullMonth]);

    const handleCopyPreviousDay = useCallback(async (day: number) => {
        if (window.confirm(`Copy attendance status from Day ${day - 1} to Day ${day} for all active staff?`)) {
            try {
                await copyPreviousDayAttendance(day, activeStaff);
            } catch (err) {
                console.error(err);
                alert("Operation failed: Lock is enabled or limits exceeded.");
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
        const targetDay = String(parsedDate.day);
        
        activeStaff.forEach((emp) => {
            const status = attendanceMap[emp.id]?.days?.[targetDay] || '';
            if (status === 'A') {
                absent++;
            } else if (status) {
                present++;
            } else {
                unmarked++;
            }
        });

        return { present, absent, unmarked };
    }, [activeStaff, attendanceMap, parsedDate.day]);

    const loading = staffLoading || attLoading;

    return (
        <div className="space-y-6 animate-fadeIn pb-8 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={viewMode === 'prompt' ? onBack : () => setViewMode('prompt')} className="p-2 bg-neutral-900 border border-white/5 hover:border-white/10 rounded-xl text-neutral-400 hover:text-white cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h2 className="text-base font-bold text-white leading-none">Attendance Log</h2>
                        <span className="text-[9px] text-[#c5a059] uppercase tracking-wider font-semibold">
                            {viewMode === 'prompt' && 'Choose Logger Mode'}
                            {viewMode === 'daily' && 'Daily Log Sheet'}
                            {viewMode === 'monthly' && 'Monthly Status Grid'}
                        </span>
                    </div>
                </div>

                {viewMode === 'monthly' && (
                    <button
                        onClick={toggleLock}
                        disabled={loading}
                        className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
                            isLocked 
                                ? 'bg-red-500/20 text-red-400 border border-red-500/20' 
                                : 'bg-[#c5a059] text-black shadow-glow-gold'
                        }`}
                    >
                        {isLocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                        <span>{isLocked ? 'Locked' : 'Lock month'}</span>
                    </button>
                )}
            </div>

            {/* View Mode Prompt Landing */}
            {viewMode === 'prompt' && (
                <div className="grid grid-cols-1 gap-4 pt-4">
                    <button
                        onClick={() => setViewMode('daily')}
                        className="bg-neutral-900 border border-white/5 p-6 rounded-2xl text-left flex items-start gap-4 hover:border-white/10 transition-all active:scale-98 cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-400">
                            <CalendarDays className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Daily Log Sheet</h3>
                            <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">
                                Record shifts and absences for today or any specific day. Quick tap buttons, stats summaries, and copying previous day logs.
                            </p>
                        </div>
                    </button>

                    <button
                        onClick={() => setViewMode('monthly')}
                        className="bg-neutral-900 border border-white/5 p-6 rounded-2xl text-left flex items-start gap-4 hover:border-white/10 transition-all active:scale-98 cursor-pointer"
                    >
                        <div className="w-12 h-12 bg-[#c5a059]/10 border border-[#c5a059]/20 rounded-xl flex items-center justify-center text-[#c5a059]">
                            <ClipboardList className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="text-sm font-bold text-white">Monthly Status Grid</h3>
                            <p className="text-[10px] text-neutral-400 mt-1 leading-relaxed">
                                View full 31-day visual attendance sheet. Review all crew shifts in a comprehensive matrix and modify cells instantly.
                            </p>
                        </div>
                    </button>
                </div>
            )}

            {/* DAILY VIEW MODE */}
            {viewMode === 'daily' && (
                <div className="space-y-4">
                    {/* Controls Row */}
                    <div className="flex justify-between items-center bg-neutral-900 border border-white/5 p-3 rounded-xl gap-3">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => {
                                if (e.target.value) {
                                    setSelectedDate(e.target.value);
                                }
                            }}
                            className="bg-neutral-950 border border-white/5 rounded-lg px-3 py-2 text-xs text-[#c5a059] outline-none font-bold cursor-pointer"
                        />
                        
                        {parsedDate.day > 1 && !isLocked && !isDayPast12HourLimit(monthId, parsedDate.day) && (
                            <button
                                onClick={() => handleCopyPreviousDay(parsedDate.day)}
                                className="flex items-center gap-1.5 bg-neutral-800 hover:bg-neutral-700 border border-white/5 text-white text-[10px] font-bold px-3 py-2 rounded-lg cursor-pointer"
                            >
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Day {parsedDate.day - 1}</span>
                            </button>
                        )}
                    </div>

                    {/* Stats Widget */}
                    <div className="bg-neutral-900 border border-white/5 p-4 rounded-xl space-y-3">
                        <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block">Day stats (Day {parsedDate.day})</span>
                        <div className="grid grid-cols-3 gap-2 text-center text-xs">
                            <div className="bg-neutral-950 p-2.5 rounded-lg border border-white/5">
                                <span className="text-[8px] uppercase text-neutral-500 font-bold block">Present</span>
                                <span className="text-sm font-bold text-emerald-400 font-mono mt-0.5 block">{dailyStats.present}</span>
                            </div>
                            <div className="bg-neutral-950 p-2.5 rounded-lg border border-white/5">
                                <span className="text-[8px] uppercase text-neutral-500 font-bold block">Absent</span>
                                <span className="text-sm font-bold text-red-400 font-mono mt-0.5 block">{dailyStats.absent}</span>
                            </div>
                            <div className="bg-neutral-950 p-2.5 rounded-lg border border-white/5">
                                <span className="text-[8px] uppercase text-neutral-500 font-bold block">Unmarked</span>
                                <span className="text-sm font-bold text-neutral-400 font-mono mt-0.5 block">{dailyStats.unmarked}</span>
                            </div>
                        </div>
                    </div>

                    {/* Daily Bulk Mark Row */}
                    {!isLocked && !isDayPast12HourLimit(monthId, parsedDate.day) && (
                        <div className="bg-neutral-900 border border-white/5 p-3 rounded-xl flex items-center justify-between gap-2">
                            <span className="text-[9px] uppercase font-bold text-neutral-400">Bulk Mark Unmarked:</span>
                            <div className="flex gap-1.5">
                                {STATUS_OPTIONS.filter(o => o.value).map((btn) => (
                                    <button
                                        key={btn.value}
                                        onClick={() => handleDailyBulkMark(btn.value)}
                                        className="px-2.5 py-1 text-[9px] font-black uppercase rounded bg-neutral-950 border border-white/5 text-[#c5a059] hover:bg-[#c5a059]/10 transition-colors cursor-pointer"
                                    >
                                        {btn.value === 'S' ? 'Single' : btn.value}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Daily Warning Lock Message */}
                    {(isLocked || isDayPast12HourLimit(monthId, parsedDate.day)) && (
                        <div className="bg-amber-500/10 border border-amber-500/25 p-3.5 rounded-xl text-[10px] text-amber-250 flex items-start gap-2.5 leading-relaxed">
                            <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                            <span>
                                {isLocked 
                                    ? "This month's payroll calculations are LOCKED. Modification of shift logs is disabled."
                                    : `Attendance for Day ${parsedDate.day} is locked (12-hour operator entry limit exceeded). Only admins can modify this via web.`}
                            </span>
                        </div>
                    )}

                    {/* Search & List */}
                    <div className="relative">
                        <Search className="absolute left-3 top-3 w-4 h-4 text-neutral-500" />
                        <input
                            type="text"
                            placeholder="Search crew member or job role..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-neutral-900 border border-white/5 focus:border-[#c5a059]/50 rounded-xl pl-9 pr-4 py-2.5 text-xs outline-none text-white placeholder-neutral-500 transition-colors"
                        />
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-16 space-y-2">
                            <Loader2 className="w-7 h-7 text-[#c5a059] animate-spin" />
                            <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Loading Shift Registers...</p>
                        </div>
                    ) : (
                        <div className="bg-neutral-900 border border-white/5 rounded-2xl p-4 divide-y divide-white/5">
                            {filteredStaff.map((emp) => {
                                const currentStatus = attendanceMap[emp.id]?.days?.[String(parsedDate.day)] || '';
                                const isCellLocked = isLocked || isDayPast12HourLimit(monthId, parsedDate.day);
                                
                                return (
                                    <div key={emp.id} className="py-4 flex flex-col gap-3 first:pt-0 last:pb-0">
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h4 className="text-xs font-bold text-white leading-none mb-1">{emp.fullName}</h4>
                                                <span className="text-[9px] text-neutral-500 uppercase font-mono">{emp.role}</span>
                                            </div>
                                            {currentStatus && (
                                                <span className={`text-[8px] font-black uppercase py-0.5 px-2 rounded-full ${
                                                    currentStatus === 'A' ? 'bg-red-500/10 text-red-400' : 'bg-emerald-500/10 text-emerald-450'
                                                }`}>
                                                    Logged: {STATUS_OPTIONS.find(o => o.value === currentStatus)?.label}
                                                </span>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-5 gap-1.5">
                                            {STATUS_OPTIONS.filter(o => o.value !== '').map((btn) => (
                                                <button
                                                    key={btn.value}
                                                    disabled={isCellLocked}
                                                    onClick={() => selectStatus(emp.id, parsedDate.day, btn.value)}
                                                    className={`py-2 text-[10px] font-bold uppercase rounded-lg border transition-all cursor-pointer disabled:opacity-40 ${
                                                        currentStatus === btn.value
                                                            ? 'bg-[#c5a059] text-black border-[#c5a059] shadow-glow-gold'
                                                            : 'bg-neutral-950 text-neutral-400 border-white/5 hover:text-white'
                                                    }`}
                                                >
                                                    {btn.value === 'P' ? '1.5' : btn.value}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* MONTHLY STATUS GRID MODE */}
            {viewMode === 'monthly' && (
                <div className="space-y-4">
                    {/* Month Picker Row */}
                    <div className="flex justify-between items-center bg-neutral-900 border border-white/5 p-3 rounded-xl">
                        <button onClick={handlePrevMonth} className="p-1.5 bg-neutral-950 border border-white/5 rounded-lg text-neutral-400 hover:text-white cursor-pointer">
                            <ArrowLeft className="w-4 h-4" />
                        </button>
                        <span className="text-xs font-black uppercase tracking-wider text-white select-none">
                            {getMonthName(currentMonth)} {currentYear}
                        </span>
                        <button onClick={handleNextMonth} className="p-1.5 bg-neutral-950 border border-white/5 rounded-lg text-neutral-400 hover:text-white cursor-pointer">
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </div>

                    {isLocked && (
                        <div className="bg-amber-500/10 border border-amber-500/25 p-3 rounded-xl text-[9px] text-amber-300 flex items-center gap-2">
                            <Lock className="w-4 h-4 text-amber-400" />
                            <span>This month is LOCKED. Attendance cell modifications are restricted.</span>
                        </div>
                    )}

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20 space-y-3">
                            <Loader2 className="w-8 h-8 text-[#c5a059] animate-spin" />
                            <p className="text-[9px] uppercase tracking-widest text-neutral-500 font-bold">Generating Monthly Matrix...</p>
                        </div>
                    ) : (
                        <div className="bg-neutral-900 border border-white/5 rounded-xl overflow-hidden shadow-xl">
                            {/* Scrollable Container */}
                            <div className="overflow-x-auto overflow-y-hidden premium-scroll">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-neutral-950 border-b border-white/5 text-[9px] uppercase tracking-wider font-bold text-neutral-500">
                                            <th className="px-3 py-3 text-left sticky left-0 bg-neutral-950 z-20 shadow-[2px_0_5px_rgba(0,0,0,0.5)] min-w-[100px]">Employee</th>
                                            {daysArray.map((day) => {
                                                const isDayLocked = isLocked || isDayPast12HourLimit(monthId, day);
                                                return (
                                                    <th 
                                                        key={day} 
                                                        className={`px-2 py-3 text-center border-l border-white/5 min-w-[30px] ${
                                                            isDayLocked ? 'text-neutral-600' : 'text-[#c5a059]'
                                                        }`}
                                                    >
                                                        {day}
                                                    </th>
                                                );
                                            })}
                                            <th className="px-3 py-3 text-center border-l border-white/5 min-w-[45px] text-[#c5a059]">Bulk</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-white/5 text-[10px]">
                                        {activeStaff.map((emp) => {
                                            const rec = attendanceMap[emp.id];
                                            
                                            return (
                                                <tr key={emp.id} className="hover:bg-white/2 transition-colors">
                                                    {/* Name fixed */}
                                                    <td className="px-3 py-2.5 font-bold text-white sticky left-0 bg-neutral-900 z-10 shadow-[2px_0_5px_rgba(0,0,0,0.5)] whitespace-nowrap min-w-[100px]">
                                                        <div>{emp.fullName.split(' ')[0]}</div>
                                                        <span className="text-[8px] text-neutral-500 font-mono block leading-none">{emp.role}</span>
                                                    </td>
                                                    
                                                    {/* Days cells */}
                                                    {daysArray.map((day) => {
                                                        const status = rec?.days?.[String(day)] || '';
                                                        const isDayLocked = isLocked || isDayPast12HourLimit(monthId, day);
                                                        
                                                        let displayCode = status;
                                                        if (status === 'P') displayCode = '1.5';

                                                        let cellStyle = "bg-neutral-950 border border-white/5 text-neutral-500";
                                                        if (status === 'S') cellStyle = "bg-[#111827] text-white border-transparent";
                                                        if (status === 'P') cellStyle = "bg-[#c5a059]/25 text-[#c5a059] border-[#c5a059]/30";
                                                        if (status === 'H') cellStyle = "bg-blue-500/20 text-blue-400 border-blue-500/30";
                                                        if (status === 'D') cellStyle = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
                                                        if (status === 'A') cellStyle = "bg-red-500/20 text-red-400 border-red-500/30";

                                                        const isUpdating = updatingCell === `${emp.id}_${day}`;

                                                        return (
                                                            <td 
                                                                key={day}
                                                                onClick={() => handleCellClick(emp.id, day)}
                                                                className={`p-1.5 text-center border-l border-white/5 ${
                                                                    isDayLocked ? 'cursor-not-allowed opacity-50' : 'cursor-pointer active:scale-95'
                                                                }`}
                                                            >
                                                                <div className={`w-7 h-7 flex items-center justify-center rounded font-mono font-bold leading-none ${cellStyle}`}>
                                                                    {isUpdating ? (
                                                                        <Loader2 className="w-3 h-3 text-[#c5a059] animate-spin" />
                                                                    ) : (
                                                                        displayCode || '-'
                                                                    )}
                                                                </div>
                                                            </td>
                                                        );
                                                    })}

                                                    {/* Bulk mark cell */}
                                                    <td className="p-1.5 text-center border-l border-white/5">
                                                        <select
                                                            disabled={isLocked}
                                                            value=""
                                                            onChange={(e) => {
                                                                if (e.target.value) {
                                                                    handleBulkMark(emp.id, e.target.value as AttendanceDayStatus);
                                                                }
                                                            }}
                                                            className="bg-neutral-950 border border-white/5 text-neutral-400 rounded px-1 py-1 text-[8px] font-black uppercase tracking-wider outline-none cursor-pointer disabled:opacity-50"
                                                        >
                                                            <option value="">Bulk</option>
                                                            <option value="S">S</option>
                                                            <option value="P">1.5</option>
                                                            <option value="H">H</option>
                                                            <option value="D">D</option>
                                                            <option value="A">A</option>
                                                            <option value="-">Clear</option>
                                                        </select>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Bottom Drawer for Monthly Cell Editing */}
            {activeCell && (
                <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-sm">
                    <div className="bg-neutral-900 border-t border-white/10 rounded-t-2xl w-full max-w-sm p-5 space-y-4 animate-slideUp">
                        <div className="flex justify-between items-center">
                            <div>
                                <h4 className="text-xs font-bold text-white">
                                    Edit Attendance: Day {activeCell.day}
                                </h4>
                                <p className="text-[9px] text-neutral-400 uppercase tracking-widest mt-0.5">
                                    {activeStaff.find(s => s.id === activeCell.staffId)?.fullName}
                                </p>
                            </div>
                            <button onClick={() => setActiveCell(null)} className="p-1 hover:bg-white/5 rounded-full text-neutral-400 hover:text-white cursor-pointer">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs">
                            {STATUS_OPTIONS.map((opt) => (
                                <button
                                    key={opt.value}
                                    onClick={() => selectStatus(activeCell.staffId, activeCell.day, opt.value)}
                                    className={`p-3 rounded-xl border flex items-center justify-between text-left transition-all active:scale-95 cursor-pointer ${opt.bg}`}
                                >
                                    <span className="font-bold">{opt.label}</span>
                                    <span className={`font-mono text-[10px] font-black ${opt.text}`}>
                                        {opt.value || 'Clear'}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
