import React, { useState } from 'react';
import { useSalary } from '../hooks/useSalary';
import type { SalaryRecord } from '../types';
import {
    IndianRupee, Lock, Unlock, FileText, Download,
    CheckCircle, AlertCircle, Loader2, ArrowLeft, ArrowRight, Table
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface SalaryBoardProps {
    onBack: () => void;
    adminName: string;
}

export default function SalaryBoard({ onBack, adminName }: SalaryBoardProps) {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);

    const monthId = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
    const {
        salaryRecords, isLocked, loading,
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
        try {
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
        } catch (err) {
            console.error("PDF Payslip error:", err);
            alert("Failed to generate PDF Payslip.");
        }
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
        <div className="space-y-6 animate-fadeIn pb-8 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-2 bg-neutral-900 border border-white/5 hover:border-white/10 rounded-xl text-neutral-400 hover:text-white cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h2 className="text-base font-bold text-white leading-none">Salary Board</h2>
                        <span className="text-[9px] text-[#c5a059] uppercase tracking-wider font-semibold">monthly payroll statements</span>
                    </div>
                </div>
            </div>

            {/* Month Controller & Exporters */}
            <div className="bg-neutral-900 border border-white/5 p-4 rounded-2xl space-y-4">
                <div className="flex justify-between items-center bg-neutral-950 p-2 border border-white/5 rounded-xl">
                    <button onClick={handlePrevMonth} className="p-1.5 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <span className="text-xs font-black uppercase tracking-wider text-white">
                        {getMonthName(currentMonth)} {currentYear}
                    </span>
                    <button onClick={handleNextMonth} className="p-1.5 hover:bg-white/5 rounded-lg text-neutral-400 hover:text-white cursor-pointer">
                        <ArrowRight className="w-4 h-4" />
                    </button>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={exportToExcel}
                        disabled={loading || salaryRecords.length === 0}
                        className="flex-1 flex items-center justify-center gap-1.5 bg-neutral-950 border border-white/5 text-neutral-300 hover:text-white py-2.5 rounded-xl text-[10px] font-bold uppercase transition-all disabled:opacity-40 cursor-pointer"
                    >
                        <Table className="w-3.5 h-3.5 text-emerald-450" />
                        <span>Export Excel</span>
                    </button>

                    {!isLocked && (
                        <button
                            onClick={handleLockPayroll}
                            disabled={loading || processingLock || salaryRecords.length === 0}
                            className="flex-1 flex items-center justify-center gap-1.5 bg-[#c5a059] text-black py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-glow-gold transition-all active:scale-95 disabled:opacity-40 cursor-pointer"
                        >
                            {processingLock ? (
                                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                                <Lock className="w-3.5 h-3.5" />
                            )}
                            <span>Lock Payroll</span>
                        </button>
                    )}
                </div>
            </div>

            {/* Lock/Unlock Warning message */}
            <div className="bg-neutral-900 border border-white/5 p-4 rounded-xl flex items-center justify-between shadow-xl text-xs gap-3">
                <div className="flex items-start gap-2.5">
                    {isLocked ? (
                        <>
                            <CheckCircle className="w-5 h-5 text-emerald-450 shrink-0 mt-0.5" />
                            <span className="text-neutral-300 leading-snug">Payroll has been LOCKED. Real-time wage edits are frozen and records archived.</span>
                        </>
                    ) : (
                        <>
                            <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                            <span className="text-neutral-300 leading-snug font-medium">Payroll is currently UNLOCKED. Records will update dynamically as attendance shifts.</span>
                        </>
                    )}
                </div>
            </div>

            {/* Payroll list */}
            {loading ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-3">
                    <Loader2 className="w-8 h-8 text-[#c5a059] animate-spin" />
                    <p className="text-[10px] uppercase tracking-widest text-neutral-500 font-bold">Decrypting Salary Slips...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {salaryRecords.length > 0 ? (
                        salaryRecords.map((record) => (
                            <div key={record.staffId} className="bg-neutral-900 border border-white/5 rounded-2xl p-5 space-y-3.5 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#c5a059]/5 to-transparent pointer-events-none" />

                                <div className="flex justify-between items-start">
                                    <div>
                                        <h4 className="text-xs font-bold text-white leading-none">{record.fullName}</h4>
                                        <span className="inline-block bg-neutral-950 text-neutral-400 text-[8px] font-bold px-2 py-0.5 rounded mt-1.5 border border-white/5 uppercase tracking-wider font-mono">
                                            {record.role} · {record.salaryType}
                                        </span>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider ${
                                        record.status === 'Paid' 
                                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                            : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                    }`}>
                                        {record.status}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 text-[10px] text-neutral-450 pt-2 border-t border-white/5">
                                    <div>Rate: <span className="text-white font-mono">₹{record.salaryType === 'daily' ? record.dailyWage : record.monthlySalary}</span></div>
                                    <div>Shifts worked: <span className="text-white font-mono">{record.workUnits.toFixed(1)}</span></div>
                                    <div>Gross Salary: <span className="text-white font-mono">₹{record.grossSalary.toFixed(2)}</span></div>
                                    <div>Less Advances: <span className="text-red-400 font-mono">₹{record.advance.toFixed(2)}</span></div>
                                </div>

                                <div className="flex justify-between items-center border-t border-white/5 pt-3 mt-1.5">
                                    <div>
                                        <span className="text-[8px] text-neutral-500 uppercase font-black block">Net Payout</span>
                                        <span className="text-sm font-bold text-[#c5a059] font-mono">₹{record.netSalary.toFixed(2)}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        {isLocked && record.status === 'Unpaid' && (
                                            <button
                                                onClick={() => handleMarkPaid(record.staffId, record.fullName)}
                                                disabled={processingPay === record.staffId}
                                                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-lg text-[9px] uppercase tracking-wider flex items-center gap-1 cursor-pointer disabled:opacity-40"
                                            >
                                                {processingPay === record.staffId ? <Loader2 className="w-3 h-3 animate-spin" /> : <IndianRupee className="w-3 h-3" />}
                                                <span>Mark Paid</span>
                                            </button>
                                        )}
                                        <button
                                            onClick={() => generatePDFPayslip(record)}
                                            className="bg-neutral-950 border border-white/5 text-neutral-300 hover:text-white py-2 px-3 rounded-lg text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 cursor-pointer"
                                            title="Download Payslip PDF"
                                        >
                                            <Download className="w-3 h-3" />
                                            <span>Invoice</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="bg-neutral-900 border border-white/5 rounded-xl py-12 text-center text-xs text-neutral-500">
                            No salary slips compiled. Ensure active staff records exist.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
