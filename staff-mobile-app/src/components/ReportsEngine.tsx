import React, { useState } from 'react';
import { useStaff } from '../hooks/useStaff';
import { useAttendance } from '../hooks/useAttendance';
import { useSalary } from '../hooks/useSalary';
import { useAdvances } from '../hooks/useAdvances';
import { useSiteAllocations } from '../hooks/useSiteAllocations';
import { useExpenses } from '../hooks/useExpenses';
import {
    ClipboardList, FileText, Table, Download, Calendar,
    MapPin, Users, TrendingUp, Loader2, ArrowLeft, ArrowRight,
    Layers, TrendingDown, Activity
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface ReportsEngineProps {
    onBack: () => void;
}

export default function ReportsEngine({ onBack }: ReportsEngineProps) {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
    const [reportType, setReportType] = useState<'attendance' | 'salary' | 'advance' | 'manpower' | 'performance' | 'expenses' | 'site' | 'profitloss'>('attendance');
    const [generating, setGenerating] = useState(false);

    const monthId = `${currentYear}-${String(currentMonth).padStart(2, '0')}`;
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

    // Initialize hooks
    const { staff } = useStaff();
    const { attendanceMap } = useAttendance(monthId);
    const { salaryRecords } = useSalary(monthId);
    const { advances } = useAdvances();
    const { allocations } = useSiteAllocations();
    const { expenses } = useExpenses();

    const activeStaff = staff.filter(s => s.status === 'active');
    const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();

    // 1. Generate Excel Report
    const exportExcelReport = () => {
        setGenerating(true);
        try {
            const wb = XLSX.utils.book_new();
            let ws_data: any[] = [];
            let sheetName = "";

            if (reportType === 'attendance') {
                sheetName = "Attendance summary";
                ws_data = activeStaff.map((emp, index) => {
                    const rec = attendanceMap[emp.id];
                    const daysRecord: Record<string, string> = {};
                    for (let d = 1; d <= daysInMonth; d++) {
                        daysRecord[`Day ${d}`] = rec?.days?.[String(d)] || '-';
                    }
                    return {
                        "S.No": index + 1,
                        "Employee ID": emp.employeeId,
                        "Name": emp.fullName,
                        "Role": emp.role,
                        ...daysRecord,
                        "Total Work Units (Shifts)": rec ? rec.totalWorkUnits : 0,
                        "Total Absences": rec ? rec.totalAbsent : 0
                    };
                });
            } else if (reportType === 'salary') {
                sheetName = "Payroll Summary";
                ws_data = salaryRecords.map((r, i) => ({
                    "S.No": i + 1,
                    "Employee Name": r.fullName,
                    "Role": r.role,
                    "Salary Mode": r.salaryType === 'daily' ? 'Daily' : 'Monthly',
                    "Daily/Monthly Wage": r.salaryType === 'daily' ? r.dailyWage : r.monthlySalary,
                    "Work Units (Shifts)": r.workUnits,
                    "Gross Salary (INR)": r.grossSalary,
                    "Advances Deducted (INR)": r.advance,
                    "Net Payout (INR)": r.netSalary,
                    "Payment Status": r.status,
                    "Paid Date": r.paidAt ? new Date(r.paidAt).toLocaleDateString() : '-'
                }));
            } else if (reportType === 'advance') {
                sheetName = "Advances Ledger";
                const monthlyAdvances = advances.filter(adv => adv.date.startsWith(monthId));
                ws_data = monthlyAdvances.map((adv, i) => ({
                    "S.No": i + 1,
                    "Employee Name": adv.employeeName,
                    "Date Issued": adv.date,
                    "Amount (INR)": adv.amount,
                    "Remarks / Reason": adv.reason || 'Personal Advance',
                    "Approved By": adv.approvedBy
                }));
            } else if (reportType === 'manpower') {
                sheetName = "Site Allocation";
                const activeAllocations = allocations.filter(alloc => alloc.status === 'Ongoing');
                ws_data = activeAllocations.map((alloc, i) => ({
                    "S.No": i + 1,
                    "Site Location": alloc.siteName,
                    "Employee Assigned": alloc.employeeName,
                    "Job Type": alloc.workType,
                    "Assignment Start": alloc.startDate,
                    "Target Deadline": alloc.deadline || 'Flexible',
                    "Site Supervisor": alloc.supervisor
                }));
            } else if (reportType === 'performance') {
                sheetName = "Employee Performance";
                ws_data = activeStaff.map((emp, i) => {
                    const rec = attendanceMap[emp.id];
                    const workUnits = rec ? rec.totalWorkUnits : 0;
                    const absents = rec ? rec.totalAbsent : 0;
                    const rate = daysInMonth > 0 ? ((daysInMonth - absents) / daysInMonth) * 100 : 0;

                    return {
                        "S.No": i + 1,
                        "Employee ID": emp.employeeId,
                        "Employee Name": emp.fullName,
                        "Role": emp.role,
                        "Total Days In Month": daysInMonth,
                        "Worked Shifts (Work Units)": workUnits,
                        "Total Absences": absents,
                        "Attendance Reliability Rate (%)": `${rate.toFixed(1)}%`,
                        "Performance Evaluation": rate > 90 ? 'Outstanding' : rate > 75 ? 'Standard' : 'Action Required'
                    };
                });
            } else if (reportType === 'expenses') {
                sheetName = "Expenses Ledger";
                const monthlyExpenses = expenses.filter(exp => exp.date && exp.date.startsWith(monthId));
                ws_data = monthlyExpenses.map((ex, i) => ({
                    "S.No": i + 1,
                    "Date": ex.date,
                    "Site Location": ex.siteName,
                    "Expense Type": ex.expenseType,
                    "Amount Received (INR)": ex.amountReceived,
                    "Amount Paid (INR)": ex.amountPaid,
                    "Balance (INR)": ex.balance,
                    "Description": ex.description || '',
                    "Created By": ex.createdBy || 'sonu'
                }));
            } else if (reportType === 'site') {
                sheetName = "Site Expenses Summary";
                const monthlyExpenses = expenses.filter(exp => exp.date && exp.date.startsWith(monthId));
                const siteGroups: Record<string, { received: number; paid: number; balance: number }> = {};
                monthlyExpenses.forEach(ex => {
                    const site = ex.siteName || 'Unallocated';
                    if (!siteGroups[site]) {
                        siteGroups[site] = { received: 0, paid: 0, balance: 0 };
                    }
                    siteGroups[site].received += ex.amountReceived;
                    siteGroups[site].paid += ex.amountPaid;
                    siteGroups[site].balance += ex.balance;
                });

                ws_data = Object.entries(siteGroups).map(([site, totals], idx) => {
                    const uniqueStaffOnSite = new Set(
                        allocations
                            .filter(a => a.siteName === site && a.status === 'Ongoing')
                            .map(a => a.employeeName)
                    );
                    return {
                        "S.No": idx + 1,
                        "Site Location": site,
                        "Total Received (INR)": totals.received,
                        "Total Paid (INR)": totals.paid,
                        "Net Balance (INR)": totals.balance,
                        "Active Crew Count": uniqueStaffOnSite.size
                    };
                });
            } else if (reportType === 'profitloss') {
                sheetName = "Monthly Profit and Loss";
                const monthlyExpenses = expenses.filter(exp => exp.date && exp.date.startsWith(monthId));
                const totalReceived = monthlyExpenses.reduce((sum, ex) => sum + ex.amountReceived, 0);
                const totalPaid = monthlyExpenses.reduce((sum, ex) => sum + ex.amountPaid, 0);
                const totalWages = salaryRecords.reduce((sum, r) => sum + r.grossSalary, 0);
                const netProfit = totalReceived - totalPaid - totalWages;

                ws_data = [
                    { "Financial Metric": "Revenue / Received Payments", "Amount (INR)": totalReceived, "Category": "Inflow" },
                    { "Financial Metric": "Operational Paid Expenses", "Amount (INR)": totalPaid, "Category": "Outflow" },
                    { "Financial Metric": "Staff Gross Payroll", "Amount (INR)": totalWages, "Category": "Outflow" },
                    { "Financial Metric": "Total Expenditures", "Amount (INR)": totalPaid + totalWages, "Category": "Outflow" },
                    { "Financial Metric": "Net Monthly Profit/Loss", "Amount (INR)": netProfit, "Category": "Net" }
                ];
            }

            const header_aoa = [
                ["SONU ENTERPRISES - Luxury Interior & Construction"],
                [`Report: ${sheetName} | Month: ${getMonthName(currentMonth)} ${currentYear}`],
                []
            ];
            const ws = XLSX.utils.aoa_to_sheet(header_aoa);
            XLSX.utils.sheet_add_json(ws, ws_data, { origin: "A4" });

            XLSX.utils.book_append_sheet(wb, ws, sheetName);
            XLSX.writeFile(wb, `Sonu_Builders_${sheetName.replace(/\s+/g, '_')}_${monthId}.xlsx`);
        } catch (err) {
            console.error(err);
            alert("Excel generation failed.");
        } finally {
            setGenerating(false);
        }
    };

    // 2. Generate PDF Report
    const exportPDFReport = async () => {
        setGenerating(true);
        try {
            const doc = new jsPDF() as any;

            // Header Banner
            doc.setFillColor(15, 15, 15);
            doc.rect(0, 0, 210, 40, 'F');

            // Draw company logo
            try {
                const logoImg = await new Promise<HTMLImageElement>((resolve, reject) => {
                    const img = new Image();
                    img.src = '/logo.png';
                    img.crossOrigin = 'anonymous';
                    img.onload = () => resolve(img);
                    img.onerror = (e) => reject(e);
                });
                doc.addImage(logoImg, 'PNG', 14, 8, 24, 24);
            } catch (e) {
                console.error("Error loading logo for PDF:", e);
            }

            doc.setTextColor(212, 175, 55);
            doc.setFont('times', 'bold');
            doc.setFontSize(20);
            doc.text("SONU ENTERPRISES", 42, 18);

            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.setFont('helvetica', 'normal');
            doc.text("LUXURY INTERIOR DESIGN & CONSTRUCTION | REPORTS ENGINE", 42, 23);
            doc.text(`Generated At: ${new Date().toLocaleString()}`, 42, 27);

            // Report Title & Date
            doc.setTextColor(212, 175, 55);
            doc.setFontSize(11);
            doc.setFont('helvetica', 'bold');
            const titleText = `${reportType.toUpperCase()} INTELLIGENCE REPORT`;
            doc.text(titleText, 140, 18);

            doc.setTextColor(255, 255, 255);
            doc.text(`Month: ${getMonthName(currentMonth)} ${currentYear}`, 140, 24);

            doc.setTextColor(15, 15, 15);
            doc.setFontSize(12);
            doc.setFont('helvetica', 'bold');
            doc.text(`Sonu Builders - ${reportType.charAt(0).toUpperCase() + reportType.slice(1)} Summary`, 14, 52);

            let tableHead: string[][] = [];
            let tableBody: any[][] = [];

            if (reportType === 'attendance') {
                tableHead = [["Emp ID", "Employee Name", "Role", "Shifts (Units)", "Absences", "Status"]];
                tableBody = activeStaff.map(emp => {
                    const rec = attendanceMap[emp.id];
                    return [
                        emp.employeeId,
                        emp.fullName,
                        emp.role,
                        rec ? rec.totalWorkUnits.toFixed(1) : "0.0",
                        rec ? rec.totalAbsent : "0",
                        emp.status.toUpperCase()
                    ];
                });
            } else if (reportType === 'salary') {
                tableHead = [["Employee Name", "Role", "Scheme", "Rate", "Shifts", "Gross Pay", "Advances", "Net Payout"]];
                tableBody = salaryRecords.map(r => [
                    r.fullName,
                    r.role,
                    r.salaryType === 'daily' ? 'Daily' : 'Monthly',
                    r.salaryType === 'daily' ? `Rs.${r.dailyWage}` : `Rs.${r.monthlySalary}`,
                    r.workUnits.toFixed(1),
                    `Rs.${r.grossSalary.toFixed(2)}`,
                    `Rs.${r.advance.toFixed(2)}`,
                    `Rs.${r.netSalary.toFixed(2)}`
                ]);
            } else if (reportType === 'advance') {
                tableHead = [["Employee Name", "Date Issued", "Amount", "Remarks / Reason", "Approved By"]];
                const monthlyAdvances = advances.filter(adv => adv.date.startsWith(monthId));
                tableBody = monthlyAdvances.map(adv => [
                    adv.employeeName,
                    adv.date,
                    `Rs. ${adv.amount.toFixed(2)}`,
                    adv.reason || 'Personal Advance',
                    adv.approvedBy
                ]);
            } else if (reportType === 'manpower') {
                tableHead = [["Site Location", "Employee", "Job Type", "Start Date", "Deadline", "Supervisor"]];
                const activeAllocations = allocations.filter(alloc => alloc.status === 'Ongoing');
                tableBody = activeAllocations.map(a => [
                    a.siteName,
                    a.employeeName,
                    a.workType,
                    a.startDate,
                    a.deadline || 'Flexible',
                    a.supervisor
                ]);
            } else if (reportType === 'performance') {
                tableHead = [["Emp ID", "Employee Name", "Role", "Worked Shifts", "Absences", "Reliability %", "Evaluation"]];
                tableBody = activeStaff.map(emp => {
                    const rec = attendanceMap[emp.id];
                    const workUnits = rec ? rec.totalWorkUnits : 0;
                    const absents = rec ? rec.totalAbsent : 0;
                    const rate = daysInMonth > 0 ? ((daysInMonth - absents) / daysInMonth) * 100 : 0;
                    const evaluation = rate > 90 ? 'Outstanding' : rate > 75 ? 'Standard' : 'Action Req.';
                    return [
                        emp.employeeId,
                        emp.fullName,
                        emp.role,
                        workUnits.toFixed(1),
                        absents,
                        `${rate.toFixed(1)}%`,
                        evaluation
                    ];
                });
            } else if (reportType === 'expenses') {
                tableHead = [["Date", "Site Location", "Expense Type", "Received", "Paid", "Balance", "Created By"]];
                const monthlyExpenses = expenses.filter(exp => exp.date && exp.date.startsWith(monthId));
                tableBody = monthlyExpenses.map(ex => [
                    ex.date,
                    ex.siteName,
                    ex.expenseType,
                    `Rs. ${ex.amountReceived.toFixed(2)}`,
                    `Rs. ${ex.amountPaid.toFixed(2)}`,
                    `Rs. ${ex.balance.toFixed(2)}`,
                    ex.createdBy || 'sonu'
                ]);
            } else if (reportType === 'site') {
                tableHead = [["Site Location", "Total Received", "Total Paid", "Net Balance", "Active Crew"]];
                const monthlyExpenses = expenses.filter(exp => exp.date && exp.date.startsWith(monthId));
                const siteGroups: Record<string, { received: number; paid: number; balance: number }> = {};
                monthlyExpenses.forEach(ex => {
                    const site = ex.siteName || 'Unallocated';
                    if (!siteGroups[site]) {
                        siteGroups[site] = { received: 0, paid: 0, balance: 0 };
                    }
                    siteGroups[site].received += ex.amountReceived;
                    siteGroups[site].paid += ex.amountPaid;
                    siteGroups[site].balance += ex.balance;
                });
                tableBody = Object.entries(siteGroups).map(([site, totals]) => {
                    const uniqueStaffOnSite = new Set(
                        allocations
                            .filter(a => a.siteName === site && a.status === 'Ongoing')
                            .map(a => a.employeeName)
                    );
                    return [
                        site,
                        `Rs. ${totals.received.toFixed(2)}`,
                        `Rs. ${totals.paid.toFixed(2)}`,
                        `Rs. ${totals.balance.toFixed(2)}`,
                        `${uniqueStaffOnSite.size} crew`
                    ];
                });
            } else if (reportType === 'profitloss') {
                tableHead = [["Financial Category", "Details / Breakdown", "Total Amount (INR)"]];
                const monthlyExpenses = expenses.filter(exp => exp.date && exp.date.startsWith(monthId));
                const totalReceived = monthlyExpenses.reduce((sum, ex) => sum + ex.amountReceived, 0);
                const totalPaid = monthlyExpenses.reduce((sum, ex) => sum + ex.amountPaid, 0);
                const totalWages = salaryRecords.reduce((sum, r) => sum + r.grossSalary, 0);
                const netProfit = totalReceived - totalPaid - totalWages;

                tableBody = [
                    ["INCOMES", "Received Client Payments / Site Inflows", `Rs. ${totalReceived.toFixed(2)}`],
                    ["EXPENSES", "Paid Vendor/Site Expenses (Operational)", `Rs. ${totalPaid.toFixed(2)}`],
                    ["EXPENSES", "Staff Gross Salary / Wages (Labor)", `Rs. ${totalWages.toFixed(2)}`],
                    ["SUMMARY", "Total Expenditures (Operational + Labor)", `Rs. ${(totalPaid + totalWages).toFixed(2)}`],
                    ["NET PROFIT / LOSS", "Net Monthly Earnings Balance", `Rs. ${netProfit.toFixed(2)}`]
                ];
            }

            autoTable(doc, {
                startY: 58,
                theme: 'striped',
                headStyles: { fillColor: [15, 15, 15], textColor: [212, 175, 55], fontStyle: 'bold' },
                head: tableHead,
                body: tableBody,
                styles: { fontSize: 8.5, cellPadding: 3.5 }
            });

            doc.save(`Sonu_Builders_${reportType}_report_${monthId}.pdf`);
        } catch (err) {
            console.error(err);
            alert("PDF generation failed.");
        } finally {
            setGenerating(false);
        }
    };

    const reportsList = [
        { type: 'attendance' as const, icon: Calendar, title: 'Attendance Report', desc: 'Monthly Shift Log Summary' },
        { type: 'salary' as const, icon: FileText, title: 'Salary / Payroll', desc: 'Net payroll transfer ledger' },
        { type: 'advance' as const, icon: TrendingUp, title: 'Advances Log', desc: 'Debited worker loans registry' },
        { type: 'manpower' as const, icon: MapPin, title: 'Site Manpower', desc: 'Crew Distribution Matrix' },
        { type: 'performance' as const, icon: Users, title: 'Performance', desc: 'Roster Reliability Ratios' },
        { type: 'expenses' as const, icon: Layers, title: 'Expense Ledger', desc: 'Itemized operational cash registers' },
        { type: 'site' as const, icon: MapPin, title: 'Site Summaries', desc: 'Site-wise cash balances' },
        { type: 'profitloss' as const, icon: Activity, title: 'Profit & Loss', desc: 'Revenue vs operational payouts' }
    ];

    return (
        <div className="space-y-6 animate-fadeIn pb-8 select-none">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <button onClick={onBack} className="p-2 bg-neutral-900 border border-white/5 hover:border-white/10 rounded-xl text-neutral-400 hover:text-white cursor-pointer">
                        <ArrowLeft className="w-4 h-4" />
                    </button>
                    <div>
                        <h2 className="text-base font-bold text-white leading-none">Reports Hub</h2>
                        <span className="text-[9px] text-[#c5a059] uppercase tracking-wider font-semibold">intelligence exporters</span>
                    </div>
                </div>
            </div>

            {/* Month Controller */}
            <div className="bg-neutral-900 border border-white/5 p-4 rounded-xl flex justify-between items-center">
                <button onClick={handlePrevMonth} className="p-1.5 bg-neutral-950 border border-white/5 rounded-lg text-neutral-400 hover:text-white cursor-pointer">
                    <ArrowLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-black uppercase tracking-wider text-white">
                    {getMonthName(currentMonth)} {currentYear}
                </span>
                <button onClick={handleNextMonth} className="p-1.5 bg-neutral-950 border border-white/5 rounded-lg text-neutral-400 hover:text-white cursor-pointer">
                    <ArrowRight className="w-4 h-4" />
                </button>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 gap-3.5">
                {reportsList.map((item) => {
                    const Icon = item.icon;
                    const isActive = reportType === item.type;
                    return (
                        <div
                            key={item.type}
                            onClick={() => setReportType(item.type)}
                            className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col justify-between ${isActive
                                    ? 'bg-[#c5a059]/5 border-[#c5a059] shadow-glow-gold'
                                    : 'bg-neutral-900 border-white/5 hover:border-white/10'
                                }`}
                        >
                            <div className="flex items-center gap-3">
                                <div className={`w-10 h-10 rounded-lg bg-neutral-950/50 border border-white/5 flex items-center justify-center ${isActive ? 'text-[#c5a059]' : 'text-neutral-500'}`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold text-white leading-none">{item.title}</h3>
                                    <p className="text-[9px] text-neutral-500 mt-1 uppercase font-bold">{item.desc}</p>
                                </div>
                            </div>

                            {isActive && (
                                <div className="mt-4 pt-3.5 border-t border-white/5 grid grid-cols-2 gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={exportExcelReport}
                                        disabled={generating}
                                        className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-neutral-950 border border-white/5 hover:border-[#c5a059]/55 text-neutral-300 rounded-xl text-[9px] font-bold uppercase transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Table className="w-3.5 h-3.5 text-emerald-450" />}
                                        <span>Export Excel</span>
                                    </button>

                                    <button
                                        onClick={exportPDFReport}
                                        disabled={generating}
                                        className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#c5a059] text-black rounded-xl text-[9px] font-black uppercase tracking-wider shadow-glow-gold transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        {generating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                                        <span>Download PDF</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
