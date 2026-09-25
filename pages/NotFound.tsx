import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import SEO from '../components/SEO';

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col items-center justify-center p-6 text-center">
      <SEO
        title="Page Not Found | Sonu Enterprises"
        description="The page you are looking for does not exist. Explore our interior design services in Mumbai."
      />
      <span className="text-7xl md:text-9xl font-serif font-bold text-luxury-gold/50 mb-4">
        404
      </span>
      <h1 className="text-3xl md:text-5xl font-serif font-bold text-[#171717] mb-4">
        Page Not Found
      </h1>
      <p className="text-stone-600 max-w-md mb-8 text-sm leading-relaxed">
        The requested page could not be located. It may have been moved, renamed, or is temporarily unavailable.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-luxury-gold text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:bg-luxury-gold/90 transition-colors"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
        <Link
          to="/interior-designer-mumbai"
          className="inline-flex items-center justify-center gap-2 px-6 py-3.5 border border-luxury-gold/40 text-luxury-gold text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-luxury-gold/10 transition-colors bg-white shadow-sm"
        >
          <span>Mumbai Interior Page</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
