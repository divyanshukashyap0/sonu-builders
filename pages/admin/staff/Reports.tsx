import React, { useState } from 'react';
import { useStaff } from '../../../hooks/useStaff';
import { useAttendance } from '../../../hooks/useAttendance';
import { useSalary } from '../../../hooks/useSalary';
import { useAdvances } from '../../../hooks/useAdvances';
import { useSiteAllocations } from '../../../hooks/useSiteAllocations';
import { useExpenses } from '../../../hooks/useExpenses';
import { 
    ClipboardList, FileText, Table, Download, Calendar, 
    MapPin, Users, TrendingUp, AlertTriangle, Loader2, ArrowLeft, ArrowRight,
    Layers, TrendingDown, Activity
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

export default function Reports() {
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
                    "Created By": ex.createdBy || 'Suraj'
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
                [] // Spacer row
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
                    ex.createdBy || 'Suraj'
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
                        `${uniqueStaffOnSite.size} workers`
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

    return (
        <div className="space-y-6 page-transition">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-serif text-stone-900 dark:text-white tracking-wide">Reports Engine</h1>
                    <p className="text-xs uppercase tracking-widest text-luxury-gold opacity-80 mt-1">Analytics & Audit Exporters</p>
                </div>
                
                {/* Month Controller */}
                <div className="flex items-center gap-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-white/5 rounded-xl px-3 py-1.5 shadow-glass">
                    <button onClick={handlePrevMonth} className="p-1.5 hover:bg-stone-100 dark:hover:bg-white/5 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer">
                        <ArrowLeft size={16} />
                    </button>
                    <span className="text-xs font-black uppercase tracking-wider text-stone-900 dark:text-white select-none min-w-[120px] text-center">
                        {getMonthName(currentMonth)} {currentYear}
                    </span>
                    <button onClick={handleNextMonth} className="p-1.5 hover:bg-stone-100 dark:hover:bg-white/5 rounded-lg text-stone-600 dark:text-stone-400 hover:text-stone-950 dark:hover:text-white transition-colors cursor-pointer">
                        <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            {/* Selection Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                    { type: 'attendance' as const, icon: Calendar, title: 'Attendance Report', subtitle: 'Monthly Shift Summary' },
                    { type: 'salary' as const, icon: FileText, title: 'Salary / Payroll', subtitle: 'Net payout ledger' },
                    { type: 'advance' as const, icon: TrendingUp, title: 'Advances Log', subtitle: 'Debit adjustments' },
                    { type: 'manpower' as const, icon: MapPin, title: 'Site Manpower', subtitle: 'Labor Distribution' },
                    { type: 'performance' as const, icon: Users, title: 'Performance', subtitle: 'Reliability metrics' },
                    { type: 'expenses' as const, icon: Layers, title: 'Expense Ledger', subtitle: 'Cash Flow Register' },
                    { type: 'site' as const, icon: MapPin, title: 'Site Summaries', subtitle: 'Site Cash Balances' },
                    { type: 'profitloss' as const, icon: Activity, title: 'Profit & Loss', subtitle: 'Revenue vs Expenditures' }
                ].map((item) => {
                    const Icon = item.icon;
                    const isActive = reportType === item.type;
                    return (
                        <div
                            key={item.type}
                            onClick={() => setReportType(item.type)}
                            className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer flex flex-col justify-between ${
                                isActive
                                    ? 'bg-luxury-gold/5 border-luxury-gold shadow-glow-gold'
                                    : 'bg-white dark:bg-stone-950/40 border-stone-200 dark:border-white/5 hover:border-stone-300 dark:hover:border-white/20'
                            }`}
                        >
                            <div>
                                <Icon className={`w-8 h-8 ${isActive ? 'text-luxury-gold' : 'text-stone-450 dark:text-stone-500'}`} />
                                <h3 className="text-sm font-bold text-stone-900 dark:text-white mt-3 font-serif">{item.title}</h3>
                                <p className="text-[10px] text-stone-500 dark:text-stone-450 mt-1 uppercase">{item.subtitle}</p>
                            </div>

                            {isActive && (
                                <div className="mt-5 pt-4 border-t border-stone-200 dark:border-white/5 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={exportExcelReport}
                                        disabled={generating}
                                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-stone-50 dark:bg-stone-900 border border-stone-200 dark:border-white/10 hover:border-luxury-gold/50 text-stone-700 dark:text-white rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Table size={13} className="text-emerald-500 dark:text-emerald-400" />}
                                        <span>Export Excel (XLSX)</span>
                                    </button>

                                    <button
                                        onClick={exportPDFReport}
                                        disabled={generating}
                                        className="flex items-center justify-center gap-2 w-full py-2.5 bg-luxury-gold text-stone-950 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-glow-gold hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-stone-950 transition-all disabled:opacity-50 cursor-pointer"
                                    >
                                        {generating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download size={13} />}
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
