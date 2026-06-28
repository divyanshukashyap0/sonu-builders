import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, LogOut, Shield, Compass, Briefcase, Calendar, Phone, Mail, Award, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';
import Section from '../components/Section';

const GOLD = '#c5a059';

const Account: React.FC = () => {
    const { profile, user, role, logOut, loading } = useAuth();
    const navigate = useNavigate();
    const [savedCount, setSavedCount] = useState(0);

    useEffect(() => {
        if (!loading && !user) {
            navigate('/login');
        }
    }, [user, loading, navigate]);

    useEffect(() => {
        // Look up saved projects in localStorage if they exist
        const saved = localStorage.getItem('sonu_saved_projects');
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (Array.isArray(parsed)) setSavedCount(parsed.length);
            } catch (e) {
                console.error(e);
            }
        }
    }, []);

    if (loading || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950">
                <div className="w-12 h-12 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin"></div>
            </div>
        );
    }

    const joinDate = profile?.createdAt 
        ? new Date(profile.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        : 'N/A';

    return (
        <div className="min-h-screen bg-[#060606] text-white pt-28 pb-20 relative overflow-hidden">
            <SEO 
                title="My Account | Sonu Enterprises"
                description="Your premium Sonu Enterprises client profile dashboard."
            />

            {/* Aesthetic Background Accents */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none"
                style={{ background: 'radial-gradient(circle,rgba(197,160,89,0.05) 0%,transparent 70%)', filter: 'blur(100px)' }} />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none"
                style={{ background: 'radial-gradient(circle,rgba(197,160,89,0.03) 0%,transparent 70%)', filter: 'blur(100px)' }} />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                >
                    {/* Sidebar Profile Card */}
                    <div className="lg:col-span-4">
                        <div className="bg-neutral-900/60 backdrop-blur-xl border border-white/10 p-8 rounded-3xl text-center shadow-xl">
                            <div className="relative w-28 h-28 mx-auto mb-6">
                                {profile?.photoURL ? (
                                    <img 
                                        src={profile.photoURL} 
                                        alt={profile.displayName} 
                                        className="w-full h-full rounded-full object-cover border-2 border-luxury-gold/50 shadow-glow-gold"
                                    />
                                ) : (
                                    <div className="w-full h-full rounded-full bg-neutral-800 flex items-center justify-center border-2 border-luxury-gold/30">
                                        <User className="w-12 h-12 text-luxury-gold" />
                                    </div>
                                )}
                                <div className="absolute bottom-1 right-1 bg-luxury-gold p-1.5 rounded-full text-black">
                                    {role === 'admin' ? (
                                        <Shield className="w-3.5 h-3.5" />
                                    ) : role === 'staff' ? (
                                        <Briefcase className="w-3.5 h-3.5" />
                                    ) : (
                                        <Compass className="w-3.5 h-3.5" />
                                    )}
                                </div>
                            </div>

                            <h3 className="text-xl font-bold font-serif text-white mb-1">{profile?.displayName || 'Valued Client'}</h3>
                            <p className="text-luxury-gold text-[10px] uppercase tracking-widest font-black mb-6">
                                {role === 'admin' ? 'Administrator' : role === 'staff' ? 'Active Staff' : 'Premium Client'}
                            </p>

                            <div className="space-y-4 text-left border-t border-white/5 pt-6 text-sm text-neutral-400">
                                <div className="flex items-center gap-3">
                                    <Mail className="w-4 h-4 text-luxury-gold/60 shrink-0" />
                                    <span className="truncate">{user.email}</span>
                                </div>
                                {profile?.phoneNumber && (
                                    <div className="flex items-center gap-3">
                                        <Phone className="w-4 h-4 text-luxury-gold/60 shrink-0" />
                                        <span>{profile.phoneNumber}</span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3">
                                    <Calendar className="w-4 h-4 text-luxury-gold/60 shrink-0" />
                                    <span>Joined {joinDate}</span>
                                </div>
                            </div>

                            <button
                                onClick={logOut}
                                className="w-full mt-8 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/20 text-neutral-400 hover:text-red-400 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold cursor-pointer"
                            >
                                <LogOut className="w-4 h-4" />
                                Sign Out
                            </button>
                        </div>
                    </div>

                    {/* Main Workspace */}
                    <div className="lg:col-span-8 space-y-8">
                        {/* Welcome / Role Notification Banner */}
                        {role === 'admin' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-8 rounded-3xl border border-luxury-gold/20 bg-gradient-to-r from-luxury-gold/10 to-transparent backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                            >
                                <div>
                                    <h4 className="text-xl font-bold font-serif mb-2">Admin Command Center</h4>
                                    <p className="text-neutral-400 text-sm">You are logged in with full administrative clearance. Manage sites, staff, clients, and finance.</p>
                                </div>
                                <a 
                                    href="/admin" 
                                    className="px-6 py-3.5 bg-luxury-gold text-black rounded-xl text-xs uppercase tracking-widest font-black flex items-center gap-2 hover:opacity-90 shrink-0 transition-opacity"
                                >
                                    Open Dashboard <ArrowRight className="w-4 h-4" />
                                </a>
                            </motion.div>
                        )}

                        {role === 'staff' && (
                            <motion.div 
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="p-8 rounded-3xl border border-luxury-gold/20 bg-gradient-to-r from-luxury-gold/10 to-transparent backdrop-blur-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                            >
                                <div>
                                    <h4 className="text-xl font-bold font-serif mb-2">Staff Portal Connected</h4>
                                    <p className="text-neutral-400 text-sm">Access your shifts, log attendance, request advances, and check site allocations via the dedicated mobile application.</p>
                                </div>
                                <a 
                                    href="/staff-portal" 
                                    className="px-6 py-3.5 bg-luxury-gold text-black rounded-xl text-xs uppercase tracking-widest font-black flex items-center gap-2 hover:opacity-90 shrink-0 transition-opacity"
                                >
                                    Open Mobile App <ArrowRight className="w-4 h-4" />
                                </a>
                            </motion.div>
                        )}

                        {/* Stats Dashboard Grid */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-neutral-900/40 border border-white/5 p-6 rounded-2xl">
                                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">Status</span>
                                <span className="text-2xl font-bold text-luxury-gold capitalize font-serif">{role === 'user' ? 'Client' : role}</span>
                            </div>
                            <div className="bg-neutral-900/40 border border-white/5 p-6 rounded-2xl">
                                <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-bold block mb-1">Saved Designs</span>
                                <span className="text-2xl font-bold text-luxury-gold font-serif">{savedCount} items</span>
                            </div>
                        </div>

                        {/* Main Interactive Panel */}
                        <div className="bg-neutral-900/40 border border-white/5 rounded-3xl p-8">
                            <h4 className="text-lg font-serif font-bold text-white mb-6">Client Experience Center</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-luxury-gold/20 transition-all">
                                    <Award className="w-8 h-8 text-luxury-gold mb-4" />
                                    <h5 className="font-bold text-sm mb-2">Premium Consultations</h5>
                                    <p className="text-xs text-neutral-400 leading-relaxed mb-4">Book custom walkthroughs and technical estimation mappings directly with our design architects.</p>
                                    <a href="/contact" className="text-luxury-gold text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1">
                                        Request Quote →
                                    </a>
                                </div>

                                <div className="p-5 rounded-2xl bg-white/5 border border-white/10 hover:border-luxury-gold/20 transition-all">
                                    <Compass className="w-8 h-8 text-luxury-gold mb-4" />
                                    <h5 className="font-bold text-sm mb-2">Architectural Visualizer</h5>
                                    <p className="text-xs text-neutral-400 leading-relaxed mb-4">Utilize our interactive AI design layout and floor estimator tools to map out room designs.</p>
                                    <a href="/ai-tools" className="text-luxury-gold text-xs font-bold uppercase tracking-wider hover:underline flex items-center gap-1">
                                        Open AI Tools →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Account;
