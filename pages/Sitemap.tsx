import React from 'react';
import { Link } from 'react-router-dom';
import SEO, { organizationSchema, breadcrumbSchema } from '../components/SEO';
import Section from '../components/Section';
import { useCompanyData } from '../hooks/useCompanyData';
import { SERVICES, MUMBAI_LOCATIONS, BLOG_POSTS, CANONICAL_DOMAIN } from '../constants';

const Sitemap: React.FC = () => {
  const { name } = useCompanyData();

  const coreLinks = [
    { name: 'Home', path: '/' },
    { name: 'Mumbai Turnkey Interior Pillar', path: '/interior-designer-mumbai' },
    { name: 'About Us', path: '/about' },
    { name: 'Services Directory', path: '/services' },
    { name: 'Gallery & Inspirations', path: '/gallery' },
    { name: 'AI Interior Tools', path: '/ai-tools' },
    { name: 'Blog & Practical Guides', path: '/blog' },
    { name: 'Contact Us', path: '/contact' },
    { name: 'Privacy Policy', path: '/privacy-policy' },
    { name: 'Terms and Conditions', path: '/terms' }
  ];

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'HTML Sitemap', url: '/sitemap' }
  ];

  return (
    <div className="pt-24 min-h-screen bg-[#FAF8F5] text-stone-900">
      <SEO 
        title={`HTML Sitemap | ${name}`} 
        description={`Complete sitemap and directory of all interior services, genuine Mumbai locations, and blog guides for ${name}.`}
        canonical={`${CANONICAL_DOMAIN}/sitemap`}
        schema={[organizationSchema, breadcrumbSchema(breadcrumbs)]}
      />
      <Section className="py-20 bg-[#FAF8F5]">
        <div className="max-w-5xl mx-auto space-y-12">
          <div>
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-[#171717] mb-4">
              Website Sitemap
            </h1>
            <p className="text-stone-600 text-base leading-relaxed">
              Explore our full directory of turnkey interior services, operational Mumbai locations, and technical design guides.
            </p>
          </div>
          
          {/* Core Pages */}
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-stone-200/80 shadow-sm space-y-6">
            <h2 className="text-xl font-serif font-bold text-luxury-gold border-b border-stone-100 pb-3">
              Core Pages
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coreLinks.map((link, index) => (
                <li key={index} className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold mr-3"></span>
                  <Link 
                    to={link.path} 
                    className="text-stone-600 hover:text-luxury-gold transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* 18 Specialized Services */}
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-stone-200/80 shadow-sm space-y-6">
            <h2 className="text-xl font-serif font-bold text-luxury-gold border-b border-stone-100 pb-3">
              18 Specialized Interior Services
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {SERVICES.map((s) => (
                <li key={s.id} className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold mr-3"></span>
                  <Link 
                    to={`/services/${s.slug || s.id}`} 
                    className="text-stone-600 hover:text-luxury-gold transition-colors text-sm"
                  >
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Genuine Mumbai Locations */}
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-stone-200/80 shadow-sm space-y-6">
            <h2 className="text-xl font-serif font-bold text-luxury-gold border-b border-stone-100 pb-3">
              Operational Mumbai Locality Hubs
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {MUMBAI_LOCATIONS.map((loc) => (
                <li key={loc.slug} className="flex items-center">
                  <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold mr-3"></span>
                  <Link 
                    to={`/locations/${loc.slug}`} 
                    className="text-stone-600 hover:text-luxury-gold transition-colors text-sm"
                  >
                    Interior Designer in {loc.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Mumbai Blog & Advice */}
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-stone-200/80 shadow-sm space-y-6">
            <h2 className="text-xl font-serif font-bold text-luxury-gold border-b border-stone-100 pb-3">
              Mumbai Interior Design Guides & Articles
            </h2>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {BLOG_POSTS.map((bp) => (
                <li key={bp.slug} className="flex items-start">
                  <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold mr-3 mt-2 flex-shrink-0"></span>
                  <Link 
                    to={`/blog/${bp.slug}`} 
                    className="text-stone-600 hover:text-luxury-gold transition-colors text-sm"
                  >
                    {bp.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Sitemap;
