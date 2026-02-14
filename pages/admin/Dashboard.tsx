import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StatCard from '../../components/admin/StatCard';
import { IndianRupee, Briefcase, Users, TrendingUp, Construction, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLeads } from '../../hooks/useLeads';
import { collection, getCountFromServer, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Lead } from '../../types';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    // We use the useLeads hook for the recent leads table
    const { leads, loading: leadsLoading } = useLeads();

    // Additional Stats
    const [projectCount, setProjectCount] = useState(0);
    const [loadingStats, setLoadingStats] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch Projects Count
                const projectsColl = collection(db, 'projects');
                const projectSnap = await getCountFromServer(projectsColl);
                setProjectCount(projectSnap.data().count);
            } catch (error) {
                console.error("Error fetching stats:", error);
            } finally {
                setLoadingStats(false);
            }
        };
        fetchStats();
    }, []);

    // Calculate Derived Metrics
    const totalLeads = leads.length;
    const newLeads = leads.filter(l => l.status === 'New').length;

    // Mock Revenue (since we don't have a financials collection yet)
    // In a real app, this would sum up invoice totals from a 'invoices' collection
    const revenue = "₹0";

    // Take top 5 recent leads
    const recentLeads = leads.slice(0, 5);

    const stats = [
        { title: 'Total Revenue', value: revenue, change: '0%', changeType: 'neutral', icon: IndianRupee },
        { title: 'Active Projects', value: projectCount.toString(), change: 'Real-time', changeType: 'neutral', icon: Briefcase },
        { title: 'Total Leads', value: totalLeads.toString(), change: `+${newLeads} new`, changeType: 'positive', icon: Users },
        { title: 'Conversion Rate', value: 'N/A', change: 'Not enough data', changeType: 'neutral', icon: TrendingUp },
    ];

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-serif font-bold text-luxury-charcoal dark:text-white">Dashboard Overview</h2>
                    <p className="text-gray-500 dark:text-gray-400">Welcome back, here's what's happening today.</p>
                </div>
                <button
                    onClick={() => navigate('/admin/projects')}
                    className="bg-luxury-gold text-white px-4 py-2 rounded-lg text-sm font-bold shadow-glow-gold hover:bg-white hover:text-luxury-charcoal transition-all"
                >
                    + New Project
                </button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={loadingStats && stat.title === 'Active Projects' ? '...' : stat.value}
                        change={stat.change}
                        changeType={stat.changeType as any}
                        icon={stat.icon}
                        delay={index * 0.1}
                    />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Leads Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-white dark:bg-luxury-obsidian rounded-xl border border-luxury-gold/10 overflow-hidden"
                >
                    <div className="p-6 border-b border-luxury-gold/5 flex justify-between items-center">
                        <h3 className="font-bold text-lg text-luxury-charcoal dark:text-white">Recent Leads</h3>
                        <Link to="/admin/leads" className="text-luxury-gold text-sm hover:underline">View All</Link>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 dark:bg-white/5 text-left text-xs uppercase text-gray-400">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Name</th>
                                    <th className="px-6 py-4 font-medium">Type</th>
                                    <th className="px-6 py-4 font-medium">Status</th>
                                    <th className="px-6 py-4 font-medium">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100 dark:divide-white/5">
                                {leadsLoading ? (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-gray-400">Loading leads...</td>
                                    </tr>
                                ) : recentLeads.length > 0 ? (
                                    recentLeads.map((lead: Lead) => (
                                        <tr key={lead.id} className="hover:bg-gray-50 dark:hover:bg-white/5 transition-colors">
                                            <td className="px-6 py-4 text-sm font-medium text-luxury-charcoal dark:text-white">
                                                {lead.name}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                                {lead.projectType}
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                                                    ${lead.status === 'New' ? 'bg-blue-100 text-blue-800' : ''}
                                                    ${lead.status === 'Won' ? 'bg-green-100 text-green-800' : ''}
                                                    ${lead.status === 'Lost' ? 'bg-red-100 text-red-800' : ''}
                                                    ${!['New', 'Won', 'Lost'].includes(lead.status) ? 'bg-gray-100 text-gray-800' : ''}
                                                `}>
                                                    {lead.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-sm text-gray-400">
                                                {lead.createdAt instanceof Date ? lead.createdAt.toLocaleDateString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={4} className="text-center py-8 text-gray-400">No leads found.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </motion.div>

                {/* Quick Actions / Alerts */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-luxury-obsidian rounded-xl border border-luxury-gold/10 p-6"
                >
                    <h3 className="font-bold text-lg text-luxury-charcoal dark:text-white mb-6">Alerts & Actions</h3>

                    <div className="space-y-4">
                        {newLeads > 0 && (
                            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border-l-4 border-blue-500 rounded-r-lg">
                                <p className="text-sm font-bold text-blue-700 dark:text-blue-400">{newLeads} New Leads</p>
                                <p className="text-xs text-blue-600/80 dark:text-blue-300/80 mt-1">Review them in the Leads tab.</p>
                            </div>
                        )}

                        <div className="p-4 bg-green-50 dark:bg-green-900/10 border-l-4 border-green-500 rounded-r-lg">
                            <p className="text-sm font-bold text-green-700 dark:text-green-400 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4" /> System Active
                            </p>
                            <p className="text-xs text-green-600/80 dark:text-green-300/80 mt-1">All systems operational.</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Dashboard;
