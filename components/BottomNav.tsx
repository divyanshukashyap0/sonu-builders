import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, FolderOpen, Phone } from 'lucide-react';
import { motion } from 'framer-motion';

const BottomNav = () => {
    const navItems = [
        { name: 'Home', icon: Home, path: '/' },
        { name: 'Services', icon: Grid, path: '/services' },
        { name: 'Projects', icon: FolderOpen, path: '/projects' },
        { name: 'Contact', icon: Phone, path: '/contact' },
    ];

    return (
        <div className="fixed bottom-16 inset-x-0 z-50 md:hidden flex justify-center">
            <nav className="w-[90%] max-w-sm bg-luxury-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-white/20 rounded-full py-3 px-6 shadow-luxury flex justify-between items-center relative overflow-hidden">
                {/* Visual Glow Layer */}
                <div className="absolute inset-0 bg-gradient-to-tr from-luxury-gold/5 via-transparent to-luxury-gold/5 pointer-events-none" />

                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `group relative flex flex-col items-center justify-center transition-all duration-500 ${isActive ? 'text-luxury-gold scale-110' : 'text-luxury-charcoal/40 hover:text-luxury-charcoal'
                            }`
                        }
                    >
                        {({ isActive }) => (
                            <>
                                <item.icon className={`w-5 h-5 mb-1 transition-transform duration-500 ${isActive ? 'drop-shadow-[0_0_8px_rgba(212,175,55,0.5)]' : ''}`} />
                                <span className="text-[9px] font-bold uppercase tracking-[0.1em]">{item.name}</span>

                                {isActive && (
                                    <motion.div
                                        layoutId="bottom-nav-indicator"
                                        className="absolute -bottom-1 w-1 h-1 bg-luxury-gold rounded-full shadow-[0_0_10px_rgba(212,175,55,0.8)]"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </>
                        )}
                    </NavLink>
                ))}
            </nav>
        </div>
    );
};

export default BottomNav;
