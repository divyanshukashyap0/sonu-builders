import React, { useState, useEffect } from 'react';
import { 
    collection, 
    query, 
    orderBy, 
    onSnapshot, 
    limit,
    Timestamp 
} from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { 
    Phone, 
    MapPin, 
    Globe, 
    Clock, 
    ExternalLink, 
    Monitor,
    Search,
    ChevronLeft,
    ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CallLog {
    id: string;
    ip: string;
    location: string;
    city: string;
    region: string;
    country: string;
    pageUrl: string;
    userAgent: string;
    timestamp: Timestamp | any;
}

const CallLogs: React.FC = () => {
    const [logs, setLogs] = useState<CallLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const logsPerPage = 10;

    useEffect(() => {
        const q = query(
            collection(db, 'call_logs'),
            orderBy('timestamp', 'desc'),
            limit(100)
        );

        const unsub = onSnapshot(q, (snapshot) => {
            const logsData = snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as CallLog[];
            setLogs(logsData);
            setLoading(false);
        });

        return () => unsub();
    }, []);

    const filteredLogs = logs.filter(log => 
        log.ip?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        log.pageUrl?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const paginatedLogs = filteredLogs.slice((page - 1) * logsPerPage, page * logsPerPage);
    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'N/A';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        }).format(date);
    };

    return (
        <div className="space-y-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-luxury-obsidian p-6 rounded-xl border border-stone-200 dark:border-luxury-gold/10 shadow-sm">
                <div>
                    <h1 className="text-2xl font-serif font-bold text-stone-900 dark:text-white flex items-center gap-3">
                        <Phone className="text-luxury-gold" />
                        Call Tracking Logs
                    </h1>
                    <p className="text-sm text-gray-500 mt-1">Monitor real-time call button clicks and user origins.</p>
                </div>
                
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                        type="text" 
                        placeholder="Search IP or location..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10 pr-4 py-2 bg-white dark:bg-white/5 border border-stone-200 dark:border-white/10 rounded-lg text-stone-900 dark:text-white placeholder-stone-400 dark:placeholder-stone-500 outline-none focus:border-luxury-gold/50 transition-colors w-full md:w-64 text-sm shadow-sm"
                    />
                </div>
            </div>

            {/* Metrics */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="bg-white dark:bg-luxury-obsidian p-6 rounded-xl border border-stone-200 dark:border-luxury-gold/10 shadow-sm">
                    <p className="text-xs font-bold text-luxury-gold uppercase tracking-widest mb-2">Total Clicks</p>
                    <p className="text-3xl font-bold text-stone-900 dark:text-white">{logs.length}</p>
                </div>
                <div className="bg-white dark:bg-luxury-obsidian p-6 rounded-xl border border-stone-200 dark:border-luxury-gold/10 shadow-sm">
                    <p className="text-xs font-bold text-luxury-gold uppercase tracking-widest mb-2">Today</p>
                    <p className="text-3xl font-bold text-stone-900 dark:text-white">
                        {logs.filter(l => {
                            const date = l.timestamp?.toDate ? l.timestamp.toDate() : new Date(l.timestamp);
                            return date.toDateString() === new Date().toDateString();
                        }).length}
                    </p>
                </div>
                <div className="bg-white dark:bg-luxury-obsidian p-6 rounded-xl border border-stone-200 dark:border-luxury-gold/10 shadow-sm">
                    <p className="text-xs font-bold text-luxury-gold uppercase tracking-widest mb-2">Success Rate</p>
                    <p className="text-3xl font-bold text-stone-900 dark:text-white">100%</p>
                </div>
            </div>

            {/* Logs Table */}
            <div className="bg-white dark:bg-luxury-obsidian rounded-xl border border-stone-200 dark:border-luxury-gold/10 shadow-glass overflow-hidden">
                <div className="responsive-table-container">
                    <table className="w-full text-left min-w-[700px] md:min-w-full">
                        <thead className="bg-stone-50 dark:bg-white/5 border-b border-stone-200 dark:border-luxury-gold/10">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-luxury-gold uppercase tracking-widest whitespace-nowrap">User Details</th>
                                <th className="px-6 py-4 text-xs font-bold text-luxury-gold uppercase tracking-widest whitespace-nowrap">Location & Context</th>
                                <th className="px-6 py-4 text-xs font-bold text-luxury-gold uppercase tracking-widest whitespace-nowrap">Origin Page</th>
                                <th className="px-6 py-4 text-xs font-bold text-luxury-gold uppercase tracking-widest whitespace-nowrap">Date & Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100 dark:divide-white/5">
                            <AnimatePresence mode="popLayout">
                                {loading ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center">
                                            <div className="w-8 h-8 border-2 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mx-auto mr-3 inline-block"></div>
                                            <span className="text-gray-500">Retrieving logs...</span>
                                        </td>
                                    </tr>
                                ) : paginatedLogs.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="px-6 py-20 text-center text-gray-500">
                                            No call logs found.
                                        </td>
                                    </tr>
                                ) : (
                                    paginatedLogs.map((log) => (
                                        <motion.tr 
                                            key={log.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="hover:bg-stone-50 dark:hover:bg-white/5 transition-colors"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded bg-luxury-gold/10 flex items-center justify-center">
                                                        <Phone size={14} className="text-luxury-gold" />
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-bold text-stone-900 dark:text-white">{log.ip}</p>
                                                        <p className="text-[10px] text-gray-400 font-mono truncate max-w-[150px]" title={log.userAgent}>
                                                            {log.userAgent}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center gap-2 text-sm text-stone-700 dark:text-gray-300">
                                                        <MapPin size={14} className="text-luxury-gold/60" />
                                                        <span className={log.location?.includes('Unavailable') ? 'text-red-400 font-medium italic' : ''}>
                                                            {log.location || 'Unknown'}
                                                        </span>
                                                    </div>
                                                    {(log as any).timezone && (
                                                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-tighter text-gray-500 font-bold">
                                                            <Globe size={10} />
                                                            <span>{(log as any).timezone} • {(log as any).language}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <a 
                                                    href={log.pageUrl} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="flex items-center gap-2 text-xs text-blue-500 hover:text-blue-600 transition-colors"
                                                >
                                                    <Globe size={12} />
                                                    <span className="truncate max-w-[200px]">
                                                        {log.pageUrl.replace(window.location.origin, '') || '/'}
                                                    </span>
                                                    <ExternalLink size={10} />
                                                </a>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                    <Clock size={14} />
                                                    <span>{formatDate(log.timestamp)}</span>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="px-6 py-4 border-t border-stone-200 dark:border-luxury-gold/10 flex items-center justify-between">
                        <p className="text-xs text-gray-500 uppercase tracking-widest font-bold">
                            Page {page} of {totalPages}
                        </p>
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setPage(p => Math.max(1, p - 1))}
                                disabled={page === 1}
                                className="p-2 border border-stone-300 dark:border-luxury-gold/20 rounded hover:bg-stone-50 dark:hover:bg-luxury-gold/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                            >
                                <ChevronLeft size={16} />
                            </button>
                            <button 
                                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                                disabled={page === totalPages}
                                className="p-2 border border-stone-300 dark:border-luxury-gold/20 rounded hover:bg-stone-50 dark:hover:bg-luxury-gold/10 disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer"
                            >
                                <ChevronRight size={16} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CallLogs;
