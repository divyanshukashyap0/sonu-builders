import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const checkAdminRole = async (user: any) => {
        try {
            const adminDoc = await getDoc(doc(db, 'admins', user.email!));
            // Allow if admin doc exists OR if it's the specific dev email (optional safeguard)
            if (adminDoc.exists() && adminDoc.data().role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                // Determine if we should allow a 'first user' exception or just block
                // For now, strict blocking
                setError('Access denied. Administrator privileges required.');
                await auth.signOut();
            }
        } catch (err) {
            console.error("Role check failed", err);
            setError('System error verifying credentials.');
            await auth.signOut();
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            await checkAdminRole(userCredential.user);
        } catch (err: any) {
            console.error(err);
            setError('Invalid credentials. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            await checkAdminRole(result.user);
        } catch (err: any) {
            console.error(err);
            setError('Google sign-in failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop')] bg-cover bg-center opacity-30 transform scale-105 blur-sm" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/80 to-transparent" />
                <div className="absolute inset-0 bg-black/40" />
            </div>

            {/* Glowing Orbs */}
            <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-luxury-gold/10 blur-[120px] rounded-full z-0 pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-luxury-gold/5 blur-[120px] rounded-full z-0 pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 30 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative z-10 w-full max-w-[480px] p-8 md:p-12 mx-4"
            >
                {/* Glass Card */}
                <div className="absolute inset-0 bg-neutral-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl" />

                <div className="relative z-20">
                    <div className="text-center mb-10">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className="w-20 h-20 bg-gradient-to-br from-luxury-gold/20 to-transparent rounded-2xl flex items-center justify-center mx-auto mb-6 border border-luxury-gold/30 shadow-glow-gold"
                        >
                            <ShieldCheck className="w-10 h-10 text-luxury-gold" />
                        </motion.div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-3 tracking-wide">
                            Command Center
                        </h2>
                        <p className="text-neutral-400 text-sm uppercase tracking-widest font-medium">
                            Sonu Enterprises Admin
                        </p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-red-500/10 border border-red-500/20 text-red-200 px-4 py-3 rounded-lg mb-6 text-sm flex items-center backdrop-blur-sm"
                        >
                            <div className="w-1 h-8 bg-red-500 rounded-full mr-3" />
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-luxury-gold text-[10px] uppercase tracking-widest font-bold ml-1">Official Email</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-4 w-5 h-5 text-neutral-500 group-focus-within:text-luxury-gold transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:border-luxury-gold/50 focus:bg-black/40 transition-all font-sans text-sm"
                                    placeholder="admin@sonuenterprises.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-luxury-gold text-[10px] uppercase tracking-widest font-bold ml-1">Secure Password</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-4 w-5 h-5 text-neutral-500 group-focus-within:text-luxury-gold transition-colors" />
                                <input
                                    type="password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:border-luxury-gold/50 focus:bg-black/40 transition-all font-sans text-sm"
                                    placeholder="••••••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-luxury-gold to-[#B08D57] hover:to-luxury-gold text-white font-bold py-4 rounded-xl shadow-lg shadow-luxury-gold/20 transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center uppercase tracking-widest text-xs group mt-4"
                        >
                            {loading && !error ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                <>Authenticate <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative flex py-2 items-center">
                            <div className="flex-grow border-t border-white/10"></div>
                            <span className="flex-shrink-0 mx-4 text-neutral-500 text-xs uppercase tracking-widest">Or Access With</span>
                            <div className="flex-grow border-t border-white/10"></div>
                        </div>

                        <button
                            onClick={handleGoogleLogin}
                            disabled={loading}
                            className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-sm font-medium"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                            Google Workspace
                        </button>
                    </div>

                    <div className="mt-10 text-center">
                        <a
                            href="/"
                            className="inline-flex items-center text-neutral-500 hover:text-luxury-gold text-xs uppercase tracking-widest transition-colors duration-300 group"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1 group-hover:-translate-x-1 transition-transform" />
                            Return to Homepage
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Login;
