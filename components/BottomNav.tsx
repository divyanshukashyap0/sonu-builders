import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Grid, FolderOpen, Phone, User, Calendar } from 'lucide-react';

const BottomNav = () => {
    const navItems = [
        { name: 'Home', icon: Home, path: '/' },
        { name: 'Services', icon: Grid, path: '/services' },
        { name: 'Projects', icon: FolderOpen, path: '/projects' },
        { name: 'Contact', icon: Phone, path: '/contact' },
    ];

    return (
        <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-[env(safe-area-inset-bottom)] bg-brand-dark/80 backdrop-blur-lg border-t border-white/10 shadow-lg transition-transform duration-300">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        className={({ isActive }) =>
                            `flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-300 ${isActive ? 'text-brand-gold' : 'text-slate-400 hover:text-slate-200'
                            }`
                        }
                    >
                        <item.icon className="w-5 h-5" strokeWidth={1.5} />
                        <span className="text-[10px] font-medium tracking-wide">{item.name}</span>
                    </NavLink>
                ))}
            </div>
        </div>
    );
};

export default BottomNav;
