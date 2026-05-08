import React from 'react';
import { motion } from 'framer-motion';
import { 
    Inbox, Folder, Images, Settings, BarChart3, 
    ArrowUpRight, ArrowDownRight, Clock, Eye, MessageCircle
} from 'lucide-react';
import { useProjects } from '../../hooks/useProjects';
import { useServices } from '../../hooks/useServices';
import { useGallery } from '../../hooks/useGallery';

interface DashboardOverviewProps {
    leads: any[];
    setActiveTab: (tab: any) => void;
}

const DashboardOverview: React.FC<DashboardOverviewProps> = ({ leads, setActiveTab }) => {
    const { projects } = useProjects();
    const { services } = useServices();
    const { items: galleryItems } = useGallery();

    const stats = [
        { label: 'Total Leads', val: leads.length, icon: Inbox, trend: '+12%', isUp: true, color: 'text-blue-500' },
        { label: 'Live Projects', val: projects.length, icon: Folder, trend: 'Premium', isUp: true, color: 'text-luxury-gold' },
        { label: 'Media Assets', val: galleryItems.length, icon: Images, trend: 'High Res', isUp: true, color: 'text-purple-500' },
        { label: 'Views', val: projects.reduce((acc, p) => acc + (p.views || 0), 0), icon: Eye, trend: 'Growing', isUp: true, color: 'text-green-500' }
    ];

    const inquiryTrend = React.useMemo(() => {
        const days = 7;
        const now = new Date();
        const buckets = Array.from({ length: days }, (_, i) => {
            const d = new Date(now);
            d.setDate(now.getDate() - (days - 1 - i));
            const key = d.toISOString().slice(0, 10);
            return { key, date: d, count: 0 };
        });
        leads.forEach((lead) => {
            const k = (lead.createdAt ? new Date(lead.createdAt) : new Date()).toISOString().slice(0, 10);
            const b = buckets.find(b => b.key === k);
            if (b) b.count += 1;
        });
        const max = Math.max(1, ...buckets.map(b => b.count));
        const points = buckets.map((b, i) => {
            const x = (i / (days - 1)) * 100;
            const y = 100 - (b.count / max) * 100;
            return `${x},${y}`;
        }).join(' ');
        const labels = buckets.map(b => b.key.slice(5));
        return { buckets, points, labels, max };
    }, [leads]);

    const topProjects = [...projects].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 5);

    return (
        <div className="space-y-10 animate-fadeIn">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, i) => (
                    <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-2xl p-6 hover:bg-white/[0.08] transition-all group shadow-xl relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 w-24 h-24 bg-white/5 rounded-full -mr-12 -mt-12 blur-2xl group-hover:bg-luxury-gold/10 transition-all" />
                        <div className="flex items-center justify-between mb-6 relative z-10">
                            <div className={`p-3 bg-white/5 rounded-lg group-hover:bg-luxury-gold transition-all duration-500 ${stat.color} group-hover:text-black`}>
                                <stat.icon className="w-5 h-5" />
                            </div>
                            <span className="text-[10px] text-stone-500 font-black uppercase tracking-[0.2em]">{stat.label}</span>
                        </div>
                        <div className="flex items-end justify-between relative z-10">
                            <p className="text-4xl font-serif font-black text-white tracking-tighter">{stat.val}</p>
                            <div className={`flex items-center text-[10px] font-black uppercase tracking-widest ${stat.isUp ? 'text-green-500' : 'text-red-500'}`}>
                                {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                                {stat.trend}
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Analytics Chart */}
                <div className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-[2.5rem] p-10 lg:col-span-2 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6">
                        <div className="flex items-center gap-2 px-4 py-2 bg-luxury-gold/10 border border-luxury-gold/20 rounded-full">
                            <div className="w-2 h-2 bg-luxury-gold rounded-full animate-pulse" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-luxury-gold">Live Velocity</span>
                        </div>
                    </div>
                    
                    <div className="mb-12">
                        <h3 className="text-2xl font-serif font-bold text-white tracking-tight">Intelligence Stream</h3>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-stone-500 mt-2 font-bold">Inquiry Acquisition Trend (7D)</p>
                    </div>

                    <div className="h-64 relative mt-8">
                        <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full overflow-visible">
                            <defs>
                                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="0%" stopColor="#C89B5B" stopOpacity="0.4" />
                                    <stop offset="100%" stopColor="#C89B5B" stopOpacity="0" />
                                </linearGradient>
                            </defs>
                            <path
                                d={`M ${inquiryTrend.points} L 100 100 L 0 100 Z`}
                                fill="url(#chartGradient)"
                            />
                            <polyline
                                points={inquiryTrend.points}
                                fill="none"
                                stroke="#C89B5B"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="drop-shadow-[0_0_15px_rgba(200,155,91,0.6)]"
                            />
                            {inquiryTrend.points.split(' ').map((p, idx) => {
                                const [x, y] = p.split(',').map(Number);
                                return <circle key={idx} cx={x} cy={y} r="1.5" fill="white" className="drop-shadow-[0_0_5px_white]" />;
                            })}
                        </svg>
                    </div>
                    <div className="mt-8 flex justify-between px-2">
                        {inquiryTrend.labels.map((l, i) => (
                            <span key={i} className="text-[10px] uppercase tracking-[0.3em] text-stone-500 font-black">{l}</span>
                        ))}
                    </div>
                </div>

                {/* Performance Rankings */}
                <div className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-[2.5rem] p-10 shadow-2xl flex flex-col">
                    <div className="flex items-center justify-between mb-10 border-b border-white/5 pb-6">
                        <h3 className="text-xl font-serif font-bold text-white">Top Assets</h3>
                        <BarChart3 className="text-luxury-gold" size={20} />
                    </div>
                    
                    <div className="space-y-8 flex-1">
                        {topProjects.map((project, idx) => (
                            <div key={project.id} className="flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className="relative">
                                        <img src={project.image} className="w-12 h-12 rounded-xl object-cover grayscale group-hover:grayscale-0 transition-all duration-500 border border-white/10" alt="" />
                                        <div className="absolute -top-2 -left-2 w-5 h-5 bg-stone-900 rounded-full flex items-center justify-center text-[10px] font-black text-luxury-gold border border-luxury-gold/30">
                                            {idx + 1}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-stone-200 group-hover:text-luxury-gold transition-colors line-clamp-1">{project.title}</p>
                                        <p className="text-[9px] text-stone-600 uppercase tracking-widest font-black">{project.category}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-black text-white">{project.views || 0}</p>
                                    <p className="text-[8px] text-stone-600 uppercase tracking-tighter">Views</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={() => setActiveTab('projects')}
                        className="w-full mt-10 py-4 bg-white/5 hover:bg-luxury-gold text-stone-500 hover:text-black rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] transition-all border border-white/5 hover:border-luxury-gold shadow-xl"
                    >
                        Portfolio Intelligence
                    </button>
                </div>
            </div>

            {/* Recent Intelligence Feed */}
            <div className="bg-white/5 backdrop-blur-glass border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden relative">
                <div className="flex items-center justify-between mb-10">
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-white">Recent Inquiries</h3>
                        <p className="text-[10px] uppercase tracking-[0.4em] text-stone-500 mt-2 font-bold">Latest Global Engagements</p>
                    </div>
                    <button onClick={() => setActiveTab('leads')} className="text-luxury-gold hover:underline text-[10px] font-black uppercase tracking-[0.3em]">Examine All</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {leads.slice(0, 6).map((lead) => (
                        <div key={lead.id} className="p-6 bg-white/5 border border-white/5 rounded-2xl hover:border-luxury-gold/30 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-luxury-gold/10 flex items-center justify-center text-luxury-gold font-serif font-bold group-hover:bg-luxury-gold group-hover:text-black transition-all">
                                        {lead.name ? lead.name[0] : '?'}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-white">{lead.name || 'Anonymous'}</p>
                                        <div className="flex items-center gap-2 text-[9px] text-stone-500 uppercase font-black tracking-tighter">
                                            <Clock size={10} /> {new Date(lead.createdAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-[8px] font-black uppercase tracking-widest ${lead.status === 'New' ? 'bg-blue-500/10 text-blue-500' : 'bg-green-500/10 text-green-500'}`}>
                                    {lead.status}
                                </span>
                            </div>
                            <p className="text-xs text-stone-400 line-clamp-2 italic mb-4">"{lead.notes || 'No specific notes provided.'}"</p>
                            <div className="flex items-center gap-4 border-t border-white/5 pt-4">
                                <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-luxury-gold">
                                    <MessageCircle size={10} /> {lead.projectType || 'Consultation'}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
