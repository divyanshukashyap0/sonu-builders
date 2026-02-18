import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import { NAV_LINKS } from '../constants';

const Breadcrumbs: React.FC = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter((x) => x);

    // Don't show on home page
    if (pathnames.length === 0) return null;

    return (
        <nav aria-label="Breadcrumb" className="w-full bg-luxury-white/50 dark:bg-luxury-charcoal/50 backdrop-blur-sm border-b border-luxury-gold/5 mt-16 md:mt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
                <ol className="flex items-center space-x-2">
                    <li>
                        <Link to="/" className="text-luxury-charcoal/60 dark:text-white/60 hover:text-luxury-gold transition-colors flex items-center">
                            <Home className="w-4 h-4" />
                        </Link>
                    </li>
                    {pathnames.map((value, index) => {
                        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
                        const isLast = index === pathnames.length - 1;

                        // Find readable label from constants or capitalize
                        const navLink = NAV_LINKS.find(link => link.path === to);
                        let label = navLink ? navLink.label : value.replace(/-/g, ' ');

                        // Capitalize first letter of each word
                        label = label.replace(/\b\w/g, l => l.toUpperCase());

                        return (
                            <li key={to} className="flex items-center">
                                <ChevronRight className="w-4 h-4 text-luxury-charcoal/30 dark:text-white/30 mx-1" />
                                {isLast ? (
                                    <span className="text-luxury-gold font-bold text-sm uppercase tracking-wider" aria-current="page">
                                        {label}
                                    </span>
                                ) : (
                                    <Link to={to} className="text-luxury-charcoal/60 dark:text-white/60 hover:text-luxury-gold transition-colors text-sm font-medium">
                                        {label}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
};

export default Breadcrumbs;
