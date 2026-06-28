import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { Lock, Mail, Loader2, ArrowRight, User, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import SEO from '../components/SEO';

const Login: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState(false);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { role, signInWithGoogle, user } = useAuth();

    useEffect(() => {
        if (user && role) {
            if (role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/account');
            }
        }
    }, [user, role, navigate]);

    const handleEmailAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            if (isSignUp) {
                // Register a new user
                await createUserWithEmailAndPassword(auth, email, password);
                // AuthContext will automatically handle role check and firestore write
            } else {
                // Login
                await signInWithEmailAndPassword(auth, email, password);
            }
        } catch (err: any) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered. Please log in.');
            } else if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
                setError('Invalid email or password.');
            } else {
                setError('Authentication failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleAuth = () => {
        setError('');
        
        signInWithGoogle()
            .then(() => {
                // Redirect navigated inside useEffect hook
            })
            .catch((err: any) => {
                console.error(err);
                if (err.code === 'auth/popup-blocked' || err.message?.includes('popup')) {
                    setError('Sign-in popup blocked. Please allow popups for this site.');
                } else if (err.code === 'auth/popup-closed-by-user') {
                    setError('Sign-in cancelled.');
                } else {
                    setError('Google authentication failed.');
                }
                setLoading(false);
            });

        setLoading(true);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950 relative overflow-hidden pt-20">
            <SEO 
                title={isSignUp ? "Sign Up | Sonu Enterprises" : "Sign In | Sonu Enterprises"}
                description="Access your premium Sonu Enterprises profile to view estimates, design projects, and account details."
            />
            {/* Background Ambience */}
            <div className="absolute inset-0 z-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=2000')] bg-cover bg-center opacity-25 transform scale-105 blur-sm" />
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
                            className="w-16 h-16 bg-gradient-to-br from-luxury-gold/20 to-transparent rounded-2xl flex items-center justify-center mx-auto mb-6 border border-luxury-gold/30 shadow-glow-gold"
                        >
                            <User className="w-8 h-8 text-luxury-gold" />
                        </motion.div>
                        <h2 className="text-3xl font-serif font-bold text-white mb-3 tracking-wide">
                            {isSignUp ? 'Create Profile' : 'Portal Login'}
                        </h2>
                        <p className="text-neutral-400 text-xs uppercase tracking-widest font-medium">
                            Sonu Enterprises & Builders
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

                    <form onSubmit={handleEmailAuth} className="space-y-6">
                        {isSignUp && (
                            <div className="space-y-2">
                                <label className="text-luxury-gold text-[10px] uppercase tracking-widest font-bold ml-1">Your Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-4 w-5 h-5 text-neutral-500 group-focus-within:text-luxury-gold transition-colors" />
                                    <input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:border-luxury-gold/50 focus:bg-black/40 transition-all font-sans text-sm"
                                        placeholder="John Doe"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-luxury-gold text-[10px] uppercase tracking-widest font-bold ml-1">Email Address</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-4 w-5 h-5 text-neutral-500 group-focus-within:text-luxury-gold transition-colors" />
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-black/20 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-white placeholder-neutral-600 focus:outline-none focus:border-luxury-gold/50 focus:bg-black/40 transition-all font-sans text-sm"
                                    placeholder="client@gmail.com"
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
                            className="w-full bg-gradient-to-r from-luxury-gold to-[#B08D57] hover:to-luxury-gold text-white font-bold py-4 rounded-xl shadow-lg shadow-luxury-gold/20 transition-all duration-300 transform hover:scale-[1.01] flex items-center justify-center uppercase tracking-widest text-xs group mt-4 cursor-pointer"
                        >
                            {loading ? (
                                <Loader2 className="animate-spin w-5 h-5" />
                            ) : (
                                <>{isSignUp ? 'Create Profile' : 'Access Account'} <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" /></>
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
                            onClick={handleGoogleAuth}
                            disabled={loading}
                            className="w-full mt-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-sm font-medium cursor-pointer"
                        >
                            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
                            Google Account
                        </button>
                    </div>

                    <div className="mt-6 text-center text-xs">
                        <span className="text-neutral-400">
                            {isSignUp ? 'Already have an account? ' : "Don't have a profile? "}
                        </span>
                        <button
                            onClick={() => setIsSignUp(!isSignUp)}
                            className="text-luxury-gold hover:underline font-bold transition-all"
                        >
                            {isSignUp ? 'Login Here' : 'Create Profile'}
                        </button>
                    </div>

                    <div className="mt-8 text-center border-t border-white/5 pt-4">
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
