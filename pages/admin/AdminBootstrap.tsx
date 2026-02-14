import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../lib/firebase';
import { doc, getDoc, setDoc, collection, getDocs, query } from 'firebase/firestore';
import { Lock, Mail, Loader2, ShieldCheck, AlertTriangle, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminBootstrap: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const [checkingAdmins, setCheckingAdmins] = useState(true);
    const [adminsExist, setAdminsExist] = useState(false);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const navigate = useNavigate();

    useEffect(() => {
        // Check if admins already exist
        const checkExistingAdmins = async () => {
            try {
                const adminsRef = collection(db, 'admins');
                const q = query(adminsRef);
                const snapshot = await getDocs(q);

                // Check if any admin role exists
                const hasAdmin = snapshot.docs.some(doc => doc.data().role === 'admin');
                setAdminsExist(hasAdmin);

                if (hasAdmin) {
                    setError('Admin users already exist. Please use the regular login page.');
                }
            } catch (err) {
                console.error('Error checking admins:', err);
            } finally {
                setCheckingAdmins(false);
            }
        };

        checkExistingAdmins();

        // Listen for auth state changes
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
        });

        return () => unsubscribe();
    }, []);

    const bootstrapAdmin = async () => {
        if (!currentUser) {
            setError('You must be signed in to bootstrap admin access.');
            return;
        }

        if (adminsExist) {
            setError('Admin users already exist. Cannot bootstrap.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const adminRef = doc(db, 'admins', currentUser.email!);
            await setDoc(adminRef, {
                email: currentUser.email,
                role: 'admin',
                createdAt: new Date().toISOString(),
                bootstrapped: true
            });

            setSuccess('✅ Admin access granted! Redirecting to dashboard...');

            setTimeout(() => {
                navigate('/admin/dashboard');
            }, 2000);
        } catch (err: any) {
            console.error('Error bootstrapping admin:', err);
            setError(`Failed to bootstrap admin: ${err.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            await signInWithEmailAndPassword(auth, email, password);
            setSuccess('Signed in successfully!');
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
            await signInWithPopup(auth, provider);
            setSuccess('Signed in with Google successfully!');
        } catch (err: any) {
            console.error(err);
            setError('Google sign-in failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (checkingAdmins) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950">
                <Loader2 className="w-12 h-12 text-luxury-gold animate-spin" />
            </div>
        );
    }

    if (adminsExist) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-neutral-900/60 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-12 max-w-md w-full text-center"
                >
                    <AlertTriangle className="w-16 h-16 text-yellow-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-bold text-white mb-4">Bootstrap Not Available</h2>
                    <p className="text-neutral-400 mb-8">
                        Admin users already exist in the system. Please use the regular login page.
                    </p>
                    <button
                        onClick={() => navigate('/admin/login')}
                        className="w-full bg-gradient-to-r from-luxury-gold to-[#B08D57] text-white font-bold py-3 rounded-xl"
                    >
                        Go to Login
                    </button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053&auto=format&fit=crop')] bg-cover bg-center opacity-20 transform scale-105 blur-sm" />
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
                            Admin Bootstrap
                        </h2>
                        <p className="text-neutral-400 text-sm uppercase tracking-widest font-medium mb-4">
                            First-Time Admin Setup
                        </p>
                        <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 text-left">
                            <p className="text-blue-200 text-xs leading-relaxed">
                                <strong className="text-blue-100">ℹ️ No admins detected.</strong><br />
                                Sign in below and click "Bootstrap Admin" to grant yourself admin privileges.
                            </p>
                        </div>
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

                    {success && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-green-500/10 border border-green-500/20 text-green-200 px-4 py-3 rounded-lg mb-6 text-sm flex items-center backdrop-blur-sm"
                        >
                            <CheckCircle className="w-5 h-5 mr-3" />
                            {success}
                        </motion.div>
                    )}

                    {!currentUser ? (
                        <>
                            <form onSubmit={handleLogin} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-luxury-gold text-[10px] uppercase tracking-widest font-bold ml-1">Email</label>
                                    <div className="relative group">
                                        <Mail className="absolute left-4 top-4 w-5 h-5 text-neutral-500 group-focus-within:text-luxury-gold transition-colors" />
                                        <input
                                            type="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:border-luxury-gold/50 focus:bg-black/40 transition-all font-sans text-sm"
                                            placeholder="your.email@gmail.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-luxury-gold text-[10px] uppercase tracking-widest font-bold ml-1">Password</label>
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
                                    {loading && !currentUser ? (
                                        <Loader2 className="animate-spin w-5 h-5" />
                                    ) : (
                                        'Sign In'
                                    )}
                                </button>
                            </form>

                            <div className="mt-8">
                                <div className="relative flex py-2 items-center">
                                    <div className="flex-grow border-t border-white/10"></div>
                                    <span className="flex-shrink-0 mx-4 text-neutral-500 text-xs uppercase tracking-widest">Or</span>
                                    <div className="flex-grow border-t border-white/10"></div>
                                </div>

                                <button
                                    onClick={handleGoogleLogin}
                                    disabled={loading}
                                    className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-sm font-medium"
                                >
                                    <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                                    Google Sign In
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="space-y-6">
                            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                                <p className="text-green-200 text-sm">
                                    ✅ Signed in as: <span className="font-mono text-xs bg-black/30 px-2 py-1 rounded">{currentUser.email}</span>
                                </p>
                            </div>

                            <button
                                onClick={bootstrapAdmin}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-luxury-gold to-[#B08D57] hover:to-luxury-gold text-white font-bold py-4 rounded-xl shadow-lg shadow-luxury-gold/20 transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center uppercase tracking-widest text-xs"
                            >
                                {loading ? (
                                    <Loader2 className="animate-spin w-5 h-5" />
                                ) : (
                                    <>
                                        <ShieldCheck className="w-5 h-5 mr-2" />
                                        Bootstrap Admin
                                    </>
                                )}
                            </button>
                        </div>
                    )}

                    <div className="mt-10 text-center">
                        <a
                            href="/admin/login"
                            className="inline-flex items-center text-neutral-500 hover:text-luxury-gold text-xs uppercase tracking-widest transition-colors duration-300"
                        >
                            Already have admin access? Login here
                        </a>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AdminBootstrap;
