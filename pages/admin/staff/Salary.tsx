import React, { useState } from 'react';
import { useSalary } from '../../../hooks/useSalary';
import { SalaryRecord } from '../../../types';
import {
    IndianRupee, Lock, Unlock, FileText, Download,
    CheckCircle, AlertCircle, Loader2, ArrowLeft, ArrowRight, Table
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function Salary() {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

    const monthId = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    const {
        salaryRecords, isLocked, loading, error,
        lockAndSavePayroll, markSalaryPaid
    } = useSalary(monthId);

    const [processingLock, setProcessingLock] = useState(false);
    const [processingPay, setProcessingPay] = useState<string | null>(null);

    const getMonthName = (month: number) => {
        return new Date(currentYear, month - 1).toLocaleString('default', { month: 'long' });
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

    const handleLockPayroll = async () => {
        if (window.confirm("Generate payroll and LOCK attendance edits? This will freeze all calculations and create historical salary records.")) {
            setProcessingLock(true);
            try {
                await lockAndSavePayroll();
                alert("Payroll successfully locked and generated!");
            } catch (err) {
                console.error(err);
                alert("Failed to lock payroll.");
            } finally {
                setProcessingLock(false);
            }
        }
    };

    const handleMarkPaid = async (staffId: string, name: string) => {
        if (window.confirm(`Mark salary as PAID for ${name}?`)) {
            setProcessingPay(staffId);
            try {
                await markSalaryPaid(staffId);
            } catch (err) {
                console.error(err);
                alert("Failed to update status.");
            } finally {
                setProcessingPay(null);
            }
        }
    };

    // PDF Payslip Generator
    const generatePDFPayslip = async (record: SalaryRecord) => {
        const doc = new jsPDF() as any;

        // Brand Identity styling
        doc.setFillColor(15, 15, 15); // Dark Obsidian
        doc.rect(0, 0, 210, 45, 'F');

        // Draw company logo
        try {
            const logoImg = await new Promise<HTMLImageElement>((resolve, reject) => {
                const img = new Image();
                img.src = '/logo.png';
                img.crossOrigin = 'anonymous';
                img.onload = () => resolve(img);
                img.onerror = (e) => reject(e);
            });
            doc.addImage(logoImg, 'PNG', 14, 10, 25, 25);
        } catch (e) {
            console.error("Error loading logo for PDF:", e);
        }

        doc.setTextColor(212, 175, 55); // Gold Accent
        doc.setFont('times', 'bold');
        doc.setFontSize(22);
        doc.text("SONU ENTERPRISES", 45, 20);

        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.setFont('helvetica', 'normal');
        doc.text("LUXURY INTERIOR DESIGN & CONSTRUCTION", 45, 26);
        doc.text("Email: sonu15enterprises@gmail.com | Tel: +91 9967044479", 45, 31);

        doc.setTextColor(212, 175, 55);
        doc.setFontSize(14);
        doc.text("PAYSLIP INVOICE", 150, 20);

        doc.setTextColor(255, 255, 255);
        doc.setFontSize(10);
        doc.text(`Month: ${getMonthName(currentMonth)} ${currentYear}`, 150, 27);
        doc.text(`Invoice ID: SE-PS-${monthId}-${record.staffId.slice(0, 4).toUpperCase()}`, 150, 33);

        // Body Content
        doc.setTextColor(15, 15, 15);
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.text("EMPLOYEE METRICS", 14, 60);

        // Employee Info Table
        autoTable(doc, {
            startY: 65,
            theme: 'grid',
            headStyles: { fillColor: [15, 15, 15], textColor: [212, 175, 55], fontStyle: 'bold' },
            body: [
                ["Employee Name", record.fullName],
                ["Designation / Role", record.role],
                ["Salary Scheme", record.salaryType === 'daily' ? 'Daily Wage' : 'Monthly Salary'],
                ["Wage Matrix", record.salaryType === 'daily' ? `Rs. ${record.dailyWage} / shift` : `Rs. ${record.monthlySalary} / month`],
                ["Work Units (Shifts)", record.workUnits.toFixed(1)],
            ],
            styles: { fontSize: 9, cellPadding: 3.5 }
        });

        const nextY = (doc as any).lastAutoTable.finalY + 12;

        doc.setFont('helvetica', 'bold');
        doc.text("PAYROLL STATEMENT", 14, nextY);

        // Financial Calculation Table
        autoTable(doc, {
            startY: nextY + 5,
            theme: 'striped',
            headStyles: { fillColor: [212, 175, 55], textColor: [15, 15, 15], fontStyle: 'bold' },
            head: [["Earnings Description", "Amount (INR)"]],
            body: [
                ["Gross Earned Salary", `Rs. ${record.grossSalary.toFixed(2)}`],
                ["Less: Advance Deductions", `- Rs. ${record.advance.toFixed(2)}`],
                ["Net Payout", `Rs. ${record.netSalary.toFixed(2)}`],
            ],
            styles: { fontSize: 9, cellPadding: 4 }
        });

        const finalY = (doc as any).lastAutoTable.finalY + 15;

        // Payment status badge
        doc.setFont('helvetica', 'bold');
        doc.text("PAYMENT STATUS: ", 14, finalY);

        if (record.status === 'Paid') {
            doc.setTextColor(30, 198, 85); // Emerald Green
            doc.text("PAID", 52, finalY);
            doc.setTextColor(100, 100, 100);
            doc.setFont('helvetica', 'normal');
            doc.setFontSize(8);
            doc.text(`Stamped At: ${record.paidAt ? new Date(record.paidAt).toLocaleString() : 'N/A'}`, 14, finalY + 5);
        } else {
            doc.setTextColor(239, 68, 68); // Red
            doc.text("UNPAID", 52, finalY);
        }

        // Signatures
        doc.setFontSize(10);
        doc.setTextColor(15, 15, 15);
        doc.setFont('helvetica', 'bold');
        doc.text("Authorized Signature", 140, finalY);
        doc.setDrawColor(200, 200, 200);
        doc.line(140, finalY - 4, 195, finalY - 4);

        doc.setFontSize(7);
        doc.setTextColor(150, 150, 150);
        doc.text("This is an electronically generated slip for Sonu Enterprises. No signature required.", 14, 280);

        doc.save(`Payslip_${record.fullName.replace(/\s+/g, '_')}_${monthId}.pdf`);
    };

    // Excel Export Generator
    const exportToExcel = () => {
        const data = salaryRecords.map((r, i) => ({
            "S.No": i + 1,
            "Employee Name": r.fullName,
            "Role": r.role,
            "Salary Type": r.salaryType === 'daily' ? 'Daily' : 'Monthly',
            "Daily/Monthly Rate": r.salaryType === 'daily' ? r.dailyWage : r.monthlySalary,
            "Total Shifts (Work Units)": r.workUnits,
            "Gross Salary (INR)": r.grossSalary,
            "Advance Deducted (INR)": r.advance,
            "Net Payout (INR)": r.netSalary,
            "Status": r.status,
            "Paid Date": r.paidAt ? new Date(r.paidAt).toLocaleString() : '-'
        }));

        const ws = XLSX.utils.json_to_sheet(data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Payroll Ledger");
        XLSX.writeFile(wb, `Sonu_Builders_Payroll_${monthId}.xlsx`);
    };

    return (
        <div className="space-y-6 page-transition">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-stone-900 dark:text-white tracking-wide">Salary / Payroll Board</h1>
                    <p className="text-xs uppercase tracking-widest text-luxury-gold opacity-80 mt-1">Wage Disbursal Ledger</p>
                </div>

                {/* Month Controller */}
                <div className="flex items-center gap-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl px-3 py-1.5 shadow-glass">
                    <button onClick={handlePrevMonth} className="p-1.5 hover:bg-stone-100 dark:hover:bg-white/5 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer">
                        <ArrowLeft size={16} />
                    </button>
                    <span className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-white select-none min-w-[120px] text-center">
                        {getMonthName(currentMonth)} {currentYear}
                    </span>
                    <button onClick={handleNextMonth} className="p-1.5 hover:bg-stone-100 dark:hover:bg-white/5 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white transition-colors cursor-pointer">
                        <ArrowRight size={16} />
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={exportToExcel}
                        disabled={loading || salaryRecords.length === 0}
                        className="flex items-center gap-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-850 hover:border-luxury-gold/50 px-4 py-2.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                        <Table size={15} className="text-emerald-500 dark:text-emerald-400" />
                        <span>Export Excel</span>
                    </button>

                    {!isLocked && (
                        <button
                            onClick={handleLockPayroll}
                            disabled={loading || processingLock || salaryRecords.length === 0}
                            className="flex items-center gap-2 bg-luxury-gold text-stone-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-glow-gold hover:bg-stone-900 dark:hover:bg-white hover:text-white dark:hover:text-stone-950 transition-all disabled:opacity-50 active:scale-95 cursor-pointer"
                        >
                            {processingLock ? (
                                <Loader2 size={15} className="animate-spin" />
                            ) : (
                                <Lock size={15} />
                            )}
                            <span>Lock & Generate Payroll</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Lock Info */}
            <div className="bg-stone-50 dark:bg-white/5 border border-stone-200 dark:border-white/5 rounded-2xl p-4 flex items-center justify-between shadow-glass text-xs">
                <div className="flex items-center gap-2">
                    {isLocked ? (
                        <>
                            <CheckCircle size={16} className="text-emerald-500 dark:text-emerald-400 animate-pulse" />
                            <span className="text-stone-700 dark:text-stone-300 font-medium">Payroll has been locked and historically archived. Attendance adjustments are now restricted.</span>
                        </>
                    ) : (
                        <>
                            <AlertCircle size={16} className="text-amber-500 dark:text-amber-400 animate-pulse" />
                            <span className="text-stone-700 dark:text-stone-300 font-medium">This month is currently UNLOCKED. Calculations are updated dynamically as attendance changes.</span>
                        </>
                    )}
                </div>
            </div>

            {/* Payroll Table */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                    <Loader2 className="w-8 h-8 text-luxury-gold animate-spin" />
                    <p className="text-xs uppercase tracking-widest text-stone-500">Decrypting Financial Flow...</p>
                </div>
            ) : (
                <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-glass">
                    <div className="overflow-x-auto relative">
                        <table className="w-full text-left">
                            <thead className="bg-stone-50 dark:bg-stone-900 border-b border-stone-200 dark:border-white/5 text-[9px] uppercase tracking-wider font-black text-stone-600 dark:text-stone-400">
                                <tr>
                                    <th className="px-6 py-4">Employee</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4 text-center">Salary Scheme</th>
                                    <th className="px-6 py-4 text-right">Wage Matrix</th>
                                    <th className="px-6 py-4 text-center">Work Units</th>
                                    <th className="px-6 py-4 text-right">Gross Salary</th>
                                    <th className="px-6 py-4 text-right text-amber-600 dark:text-amber-400">Advances</th>
                                    <th className="px-6 py-4 text-right text-luxury-gold font-bold">Net Payout</th>
                                    <th className="px-6 py-4 text-center">Status</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-200 dark:divide-white/5 text-xs text-stone-800 dark:text-stone-300">
                                {salaryRecords.length > 0 ? (
                                    salaryRecords.map((record) => (
                                        <tr key={record.staffId} className="hover:bg-stone-50 dark:hover:bg-white/5 transition-colors border-b border-stone-100 dark:border-white/5">
                                            <td className="px-6 py-4">
                                                <div className="font-semibold text-stone-900 dark:text-white">{record.fullName}</div>
                                                <span className="text-[8px] font-mono text-stone-400 dark:text-stone-500">{record.staffId.slice(0, 8)}</span>
                                            </td>
                                            <td className="px-6 py-4 text-stone-700 dark:text-stone-400 font-bold">{record.role}</td>
                                            <td className="px-6 py-4 text-center text-stone-600 dark:text-stone-400 capitalize">{record.salaryType}</td>
                                            <td className="px-6 py-4 text-right text-stone-700 dark:text-stone-300">
                                                {record.salaryType === 'daily'
                                                    ? `₹${record.dailyWage}/shift`
                                                    : `₹${record.monthlySalary}/mo`
                                                }
                                            </td>
                                            <td className="px-6 py-4 text-center font-bold text-stone-800 dark:text-stone-300">{record.workUnits.toFixed(1)}</td>
                                            <td className="px-6 py-4 text-right text-stone-800 dark:text-stone-300 font-medium">₹{record.grossSalary.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right text-amber-600 dark:text-amber-300">₹{record.advance.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-right text-luxury-gold font-black">₹{record.netSalary.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${record.status === 'Paid'
                                                    ? 'bg-emerald-500/10 text-emerald-650 dark:text-emerald-400 border border-emerald-500/20'
                                                    : 'bg-red-500/10 text-red-650 dark:text-red-400 border border-red-500/20'
                                                    }`}>
                                                    {record.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2">
                                                    {isLocked && record.status === 'Unpaid' && (
                                                        <button
                                                            onClick={() => handleMarkPaid(record.staffId, record.fullName)}
                                                            disabled={processingPay === record.staffId}
                                                            className="flex items-center gap-1 bg-emerald-500 text-stone-950 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-wider hover:bg-emerald-600 dark:hover:bg-white hover:text-white dark:hover:text-stone-950 transition-all disabled:opacity-50 cursor-pointer"
                                                        >
                                                            {processingPay === record.staffId ? (
                                                                <Loader2 size={10} className="animate-spin" />
                                                            ) : (
                                                                <IndianRupee size={10} />
                                                            )}
                                                            <span>Mark Paid</span>
                                                        </button>
                                                    )}

                                                    <button
                                                        onClick={() => generatePDFPayslip(record)}
                                                        className="flex items-center gap-1.5 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white px-3 py-1.5 rounded-lg text-[9px] font-bold tracking-wider hover:border-luxury-gold/50 hover:bg-stone-50 dark:hover:bg-stone-850 transition-all cursor-pointer"
                                                        title="Download PDF Invoice"
                                                    >
                                                        <Download size={10} />
                                                        <span>Invoice</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={10} className="py-12 text-center text-stone-500">
                                            No active staff records compiled. Ensure active employees exist in the system.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
