import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/admin/StatCard';
import { 
    IndianRupee, Briefcase, Users, TrendingUp, 
    Construction, CheckCircle, Calendar, CreditCard, MapPin, AlertCircle, Loader2, ArrowRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useLeads } from '../../hooks/useLeads';
import { collection, getCountFromServer, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../../lib/firebase';
import { Lead } from '../../types';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { leads, loading: leadsLoading } = useLeads();

    // Diagnostics State
    const [diagInfo, setDiagInfo] = useState<any>({ loading: true });

    // Project & Staff Stats
    const [projectCount, setProjectCount] = useState(0);
    const [staffCount, setStaffCount] = useState(0);
    const [presentToday, setPresentToday] = useState(0);
    const [absentToday, setAbsentToday] = useState(0);
    const [payrollTotal, setPayrollTotal] = useState(0);
    const [advancesTotal, setAdvancesTotal] = useState(0);
    const [receivedTotal, setReceivedTotal] = useState(0);
    const [paidTotal, setPaidTotal] = useState(0);
    const [netBalanceTotal, setNetBalanceTotal] = useState(0);
    const [siteCounts, setSiteCounts] = useState<Record<string, number>>({});
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const runDiagnostics = async () => {
            const currentUser = auth.currentUser;
            if (!currentUser) {
                setDiagInfo({ loading: false, error: 'No user authenticated' });
                return;
            }
            try {
                const email = currentUser.email || '';
                const adminRef = doc(db, 'admins', email);
                const adminSnap = await getDoc(adminRef);
                const adminData = adminSnap.exists() ? adminSnap.data() : null;

                const staffQuery = query(collection(db, 'staff'), where('email', '==', email));
                const staffSnap = await getDocs(staffQuery);
                const isStaff = !staffSnap.empty;

                let staffFetchError = null;
                let staffCountTest = 0;
                try {
                    const allStaff = await getDocs(collection(db, 'staff'));
                    staffCountTest = allStaff.size;
                } catch (e: any) {
                    staffFetchError = e.message || String(e);
                }

                setDiagInfo({
                    loading: false,
                    email,
                    uid: currentUser.uid,
                    adminExists: adminSnap.exists(),
                    adminRole: adminData?.role,
                    isStaff,
                    staffCountTest,
                    staffFetchError
                });
            } catch (err: any) {
                setDiagInfo({ loading: false, error: err.message || String(err) });
            }
        };

        const fetchStats = async () => {
            try {
                // 1. Projects Count
                const projectsColl = collection(db, 'projects');
                const projectSnap = await getCountFromServer(projectsColl);
                setProjectCount(projectSnap.data().count);

                // 2. Active Staff Count
                const staffSnap = await getDocs(collection(db, 'staff'));
                const activeEmployees: any[] = [];
                staffSnap.forEach((doc) => {
                    const data = doc.data();
                    if (data.status === 'active') {
                        activeEmployees.push({ id: doc.id, ...data });
                    }
                });
                setStaffCount(activeEmployees.length);

                // 3. Today's Attendance
                const today = new Date();
                const dayStr = String(today.getDate());
                const monthStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}`;
                
                const attSnap = await getDocs(collection(db, 'attendance', monthStr, 'employees'));
                let present = 0;
                let absent = 0;
                const attMap: Record<string, any> = {};
                attSnap.forEach((doc) => {
                    attMap[doc.id] = doc.data();
                });

                activeEmployees.forEach((emp) => {
                    const status = attMap[emp.id]?.days?.[dayStr];
                    if (['S', 'P', 'H', 'D'].includes(status)) {
                        present++;
                    } else if (status === 'A') {
                        absent++;
                    }
                });
                setPresentToday(present);
                setAbsentToday(absent);

                // 4. Advances Total for Month
                const advSnap = await getDocs(collection(db, 'advances'));
                let totalAdv = 0;
                advSnap.forEach((doc) => {
                    const data = doc.data();
                    if (data.date && data.date.startsWith(monthStr)) {
                        totalAdv += data.amount || 0;
                    }
                });
                setAdvancesTotal(totalAdv);

                // 5. Calculate Estimated Payroll Total
                let totalPayroll = 0;
                activeEmployees.forEach((emp) => {
                    const att = attMap[emp.id];
                    const workUnits = att ? att.totalWorkUnits : 0;
                    let gross = 0;
                    if (emp.salaryType === 'monthly') {
                        gross = emp.standardWage || emp.monthlySalary || 0;
                    } else {
                        gross = workUnits * (emp.standardWage || emp.dailyWage || 0);
                    }
                    totalPayroll += gross;
                });
                setPayrollTotal(Math.max(0, totalPayroll - totalAdv));

                // 6. Site breakdown
                const distribution: Record<string, number> = {};
                activeEmployees.forEach((emp) => {
                    if (emp.siteAssigned) {
                        distribution[emp.siteAssigned] = (distribution[emp.siteAssigned] || 0) + 1;
                    }
                });
                setSiteCounts(distribution);

                // 7. Expenses & Cash Flow
                const expSnap = await getDocs(collection(db, 'expenses'));
                let totalReceived = 0;
                let totalPaid = 0;
                expSnap.forEach((doc) => {
                    const data = doc.data();
                    if (data.date && data.date.startsWith(monthStr)) {
                        totalReceived += data.amountReceived || 0;
                        totalPaid += data.amountPaid || 0;
                    }
                });
                setReceivedTotal(totalReceived);
                setPaidTotal(totalPaid);
                setNetBalanceTotal(totalReceived - totalPaid);

            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoadingStats(false);
            }
        };

        runDiagnostics();
        fetchStats();
    }, []);

    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'New').length;
    const recentLeads = leads.slice(0, 5);

    return (
        <div className="space-y-8 page-transition">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-serif font-bold text-stone-900 dark:text-white tracking-wide">Orchestration Board</h2>
                    <p className="text-xs uppercase tracking-widest text-luxury-gold opacity-80 mt-1">Global Intelligence Matrix</p>
                </div>
                <button
                    onClick={() => navigate('/admin/projects/new')}
                    className="bg-luxury-gold text-stone-950 px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-glow-gold hover:bg-stone-900 hover:text-white dark:hover:bg-white dark:hover:text-stone-950 transition-all active:scale-95 cursor-pointer"
                >
                    + New Masterpiece
                </button>
            </div>

            {/* Diagnostics Panel */}
            <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 text-stone-300 space-y-4">
                <h3 className="text-sm font-black text-luxury-gold uppercase tracking-wider flex items-center gap-2">
                    <AlertCircle size={16} />
                    <span>System Diagnostics</span>
                </h3>
                {diagInfo.loading ? (
                    <div className="flex items-center gap-2 text-xs">
                        <Loader2 className="animate-spin text-luxury-gold" size={14} />
                        <span>Checking system diagnostics...</span>
                    </div>
                ) : diagInfo.error ? (
                    <div className="text-red-500 text-xs">Error: {diagInfo.error}</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs font-mono">
                        <div className="space-y-1">
                            <p><strong>Auth Email:</strong> {diagInfo.email}</p>
                            <p><strong>UID:</strong> {diagInfo.uid}</p>
                            <p><strong>Admin Record Exists:</strong> {diagInfo.adminExists ? '✅ Yes' : '❌ No'}</p>
                            <p><strong>Admin Role:</strong> {diagInfo.adminRole || 'None'}</p>
                        </div>
                        <div className="space-y-1">
                            <p><strong>Active Staff Record:</strong> {diagInfo.isStaff ? '✅ Yes (Staff authorized)' : '❌ No'}</p>
                            <p><strong>Test Read Staff Count:</strong> {diagInfo.staffCountTest}</p>
                            <p><strong>Staff Read Permission Error:</strong> {diagInfo.staffFetchError ? <span className="text-red-400">{diagInfo.staffFetchError}</span> : <span className="text-green-400">None (Full Read Allowed)</span>}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Core Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Active Projects"
                    value={loadingStats ? '...' : projectCount.toString()}
                    change="Real-time sites"
                    changeType="neutral"
                    icon={Briefcase}
                    delay={0.0}
                />
                <StatCard
                    title="Economic Payroll Flow"
                    value={loadingStats ? '...' : `₹${payrollTotal.toLocaleString()}`}
                    change="Estimated this month"
                    changeType="neutral"
                    icon={IndianRupee}
                    delay={0.1}
                />
                <StatCard
                    title="Conversion Matrix"
                    value={totalLeads.toString()}
                    change={`+${newLeads} new leads`}
                    changeType="positive"
                    icon={Users}
                    delay={0.2}
                />
                <StatCard
                    title="Advances Disbursed"
                    value={loadingStats ? '...' : `₹${advancesTotal.toLocaleString()}`}
                    change="Current month ledger"
                    changeType="neutral"
                    icon={CreditCard}
                    delay={0.3}
                />
            </div>

            {/* Operational Matrix (Staff & Attendance) */}
            <div className="space-y-4">
                <h3 className="text-xs uppercase font-black text-luxury-gold tracking-widest border-b border-stone-200 dark:border-white/5 pb-1">
                    Staff & Operations Matrix
                </h3>

                {/* Staff Core Quick Access Banner Button */}
                <div 
                    onClick={() => navigate('/admin/staff')}
                    className="group relative overflow-hidden bg-gradient-to-r from-stone-900 via-stone-950 to-stone-900 dark:from-stone-950 dark:via-black dark:to-stone-950 border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 rounded-2xl p-6 shadow-xl cursor-pointer hover:shadow-[0_0_20px_rgba(212,175,55,0.15)] transition-all duration-300 transform hover:-translate-y-0.5"
                >
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 relative z-10">
                        <div className="space-y-1">
                            <span className="text-[9px] font-black uppercase text-luxury-gold tracking-widest">Administrative Core</span>
                            <h3 className="text-lg font-serif font-extrabold text-white flex items-center gap-2.5">
                                <Users className="text-luxury-gold" size={20} />
                                <span>Staff & Payroll Management System</span>
                            </h3>
                            <p className="text-xs text-stone-400 max-w-xl">
                                Access employee roster directory, daily logs, attendance sheets, advances ledger, salary calculation, and payroll distribution.
                            </p>
                        </div>
                        <div className="flex items-center gap-2 px-5 py-3 bg-luxury-gold text-stone-950 font-black text-xs uppercase tracking-widest rounded-xl shadow-md group-hover:scale-105 transition-transform shrink-0">
                            <span>Open Staff Core</span>
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Active Staff */}
                    <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-2xl p-6 shadow-glass flex items-center justify-between">
                        <div>
                            <span className="text-[9px] font-black uppercase text-stone-500 dark:text-stone-400 tracking-wider">Total Active Staff</span>
                            <h2 className="text-3xl font-black text-stone-900 dark:text-white mt-1">{loadingStats ? '...' : staffCount}</h2>
                            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 uppercase">Onboarded Artisans</p>
                        </div>
                        <div className="w-12 h-12 bg-stone-100 dark:bg-white/5 rounded-xl border border-stone-200 dark:border-white/5 flex items-center justify-center">
                            <Users size={20} className="text-luxury-gold" />
                        </div>
                    </div>

                    {/* Today Present */}
                    <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-2xl p-6 shadow-glass flex items-center justify-between">
                        <div>
                            <span className="text-[9px] font-black uppercase text-stone-500 dark:text-stone-400 tracking-wider">Artisans Present Today</span>
                            <h2 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{loadingStats ? '...' : presentToday}</h2>
                            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 uppercase">Active Shifts Today</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <CheckCircle size={20} />
                        </div>
                    </div>

                    {/* Today Absent */}
                    <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-2xl p-6 shadow-glass flex items-center justify-between">
                        <div>
                            <span className="text-[9px] font-black uppercase text-stone-500 dark:text-stone-400 tracking-wider">Artisans Absent Today</span>
                            <h2 className="text-3xl font-black text-red-650 dark:text-red-400 mt-1">{loadingStats ? '...' : absentToday}</h2>
                            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 uppercase">Absent / Off-duty</p>
                        </div>
                        <div className="w-12 h-12 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center justify-center text-red-650 dark:text-red-400">
                            <AlertCircle size={20} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Cash Flow Matrix */}
            <div className="space-y-4">
                <h3 className="text-xs uppercase font-black text-luxury-gold tracking-widest border-b border-stone-200 dark:border-white/5 pb-1">
                    Cash Flow & Profit Matrix (Current Month)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Total Received */}
                    <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-2xl p-6 shadow-glass flex items-center justify-between">
                        <div>
                            <span className="text-[9px] font-black uppercase text-stone-500 dark:text-stone-400 tracking-wider">Total Received Payments</span>
                            <h2 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{loadingStats ? '...' : `₹${receivedTotal.toLocaleString()}`}</h2>
                            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 uppercase">Inward Site Revenue</p>
                        </div>
                        <div className="w-12 h-12 bg-emerald-500/10 rounded-xl border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <TrendingUp size={20} />
                        </div>
                    </div>

                    {/* Total Paid */}
                    <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-2xl p-6 shadow-glass flex items-center justify-between">
                        <div>
                            <span className="text-[9px] font-black uppercase text-stone-500 dark:text-stone-400 tracking-wider">Total Expenses Paid</span>
                            <h2 className="text-3xl font-black text-red-650 dark:text-red-400 mt-1">{loadingStats ? '...' : `₹${paidTotal.toLocaleString()}`}</h2>
                            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 uppercase">Outward Vendor & Site Costs</p>
                        </div>
                        <div className="w-12 h-12 bg-red-500/10 rounded-xl border border-red-500/20 flex items-center justify-center text-red-650 dark:text-red-400">
                            <IndianRupee size={20} />
                        </div>
                    </div>

                    {/* Net Cash Balance */}
                    <div className="bg-white dark:bg-stone-950/40 border border-stone-200 dark:border-white/5 rounded-2xl p-6 shadow-glass flex items-center justify-between">
                        <div>
                            <span className="text-[9px] font-black uppercase text-stone-500 dark:text-stone-400 tracking-wider">Net Monthly Cash Flow</span>
                            <h2 className={`text-3xl font-black mt-1 ${netBalanceTotal >= 0 ? 'text-luxury-gold' : 'text-red-650 dark:text-red-400'}`}>
                                {loadingStats ? '...' : `${netBalanceTotal < 0 ? '-' : ''}₹${Math.abs(netBalanceTotal).toLocaleString()}`}
                            </h2>
                            <p className="text-[10px] text-stone-500 dark:text-stone-400 mt-1 uppercase">Received Less Paid Balance</p>
                        </div>
                        <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${netBalanceTotal >= 0 ? 'bg-luxury-gold/10 border-luxury-gold/20 text-luxury-gold' : 'bg-red-500/10 border-red-500/20 text-red-650 dark:text-red-400'}`}>
                            <CreditCard size={20} />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Leads Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-white dark:bg-[#050505]/40 backdrop-blur-md rounded-2xl border border-stone-200 dark:border-white/5 overflow-hidden shadow-glass"
                >
                    <div className="p-6 border-b border-stone-200 dark:border-white/5 flex justify-between items-center bg-stone-50 dark:bg-white/5">
                        <h3 className="font-bold text-base text-stone-900 dark:text-white font-serif">Recent Leads</h3>
                        <Link to="/admin/leads" className="text-luxury-gold text-xs uppercase tracking-wider font-bold hover:underline">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-stone-100 dark:bg-stone-900 border-b border-stone-200 dark:border-white/5 text-[9px] uppercase tracking-wider font-black text-stone-500 dark:text-stone-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Type</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-stone-100 dark:divide-white/5 text-xs text-stone-700 dark:text-stone-300">
                                {leadsLoading ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-stone-500">Loading leads...</td>
                                    </tr>
                                ) : recentLeads.length > 0 ? (
                                    recentLeads.map((lead: Lead) => (
                                        <tr key={lead.id} className="hover:bg-stone-50 dark:hover:bg-white/5 transition-colors border-b border-stone-100 dark:border-white/5">
                                            <td className="px-6 py-4 font-semibold text-stone-900 dark:text-white">
                                                {lead.name}
                                            </td>
                                            <td className="px-6 py-4 text-stone-500 dark:text-stone-400">
                                                {lead.projectType}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider
                                                    ${lead.status === 'New' ? 'bg-blue-500/15 text-blue-500 dark:text-blue-400 border border-blue-500/20' : ''}
                                                    ${lead.status === 'Won' ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20' : ''}
                                                    ${lead.status === 'Lost' ? 'bg-red-500/15 text-red-500 dark:text-red-400 border border-red-500/20' : ''}
                                                    ${!['New', 'Won', 'Lost'].includes(lead.status) ? 'bg-stone-100 dark:bg-stone-850 text-stone-500 dark:text-stone-400 border border-stone-200 dark:border-white/5' : ''}
                                                `}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-stone-500">
                                                {lead.createdAt instanceof Date ? lead.createdAt.toLocaleDateString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-stone-500">No leads found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Staff Distribution Per Construction Site */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-[#050505]/40 backdrop-blur-md rounded-2xl border border-stone-200 dark:border-white/5 p-6 shadow-glass"
                >
                    <h3 className="font-bold text-base text-stone-900 dark:text-white font-serif mb-6 border-b border-stone-200 dark:border-white/5 pb-2">Active Site Distribution</h3>

                    <div className="space-y-4">
                        {loadingStats ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="w-5 h-5 text-luxury-gold animate-spin" />
                            </div>
                        ) : Object.keys(siteCounts).length > 0 ? (
                            Object.entries(siteCounts).map(([site, count]) => (
                                <div key={site} className="flex justify-between items-center bg-stone-50 dark:bg-stone-900/60 border border-stone-200 dark:border-white/5 rounded-xl p-3.5">
                                    <div className="flex items-center gap-2.5">
                                        <MapPin size={14} className="text-luxury-gold" />
                                        <span className="text-xs font-semibold text-stone-850 dark:text-white truncate max-w-[160px]">{site}</span>
                                    </div>
                                    <span className="bg-luxury-gold text-stone-950 text-[10px] font-black px-2.5 py-1 rounded-lg">
                                        {count} {count === 1 ? 'Artisan' : 'Artisans'}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <div className="py-8 text-center text-xs text-stone-500">
                                No active staff allocated to construction sites.
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
