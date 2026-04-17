import React from 'react';
import { Link } from 'react-router-dom';
import SEO from '../components/SEO';
import Section from '../components/Section';
import { useCompanyData } from '../hooks/useCompanyData';

const Sitemap: React.FC = () => {
  const { name } = useCompanyData();

  const links = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Projects / Portfolio', path: '/projects' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'AI Interior Tools', path: '/ai-tools' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms and Conditions', path: '/terms' },
    { name: 'Admin Portal', path: '/admin/login' },
  ];

  return (
    <>
      <SEO 
        title={`HTML Sitemap | ${name}`} 
        description={`Sitemap and index of all pages available on ${name}.`}
      />
      <div className="pt-24 min-h-screen bg-luxury-white dark:bg-luxury-charcoal">
        <Section className="py-20">
          <div className="max-w-3xl mx-auto bg-white dark:bg-luxury-obsidian p-10 md:p-16 shadow-luxury rounded-sm">
            <h1 className="text-3xl md:text-5xl font-serif font-bold text-luxury-charcoal dark:text-white mb-6">
              Sitemap
            </h1>
            <p className="text-luxury-charcoal/70 dark:text-white/70 mb-10 leading-relaxed font-medium">
              Find your way around our website. Here is a list of all our main pages.
            </p>
            
            <div className="bg-luxury-gold/5 p-8 border border-luxury-gold/10 rounded-sm">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {links.map((link, index) => (
                  <li key={index} className="group flex items-center">
                    <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold mr-3"></span>
                    <Link 
                      to={link.path} 
                      className="text-luxury-charcoal dark:text-white group-hover:text-luxury-gold dark:group-hover:text-luxury-gold transition-colors font-medium text-lg"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>
      </div>
    </>
  );
};

export default Sitemap;
