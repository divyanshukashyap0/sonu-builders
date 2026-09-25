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
          
          {/* XML Search Engine Feeds Banner */}
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-stone-900 font-bold text-base flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Search Engine Sitemaps (Google &amp; Bing Ready)
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Structured XML feeds with full Google Image extension (<code className="text-xs text-amber-700 bg-amber-100 px-1.5 py-0.5 rounded">xmlns:image</code>) for instant image indexing.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href="/sitemap.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-stone-900 hover:bg-luxury-gold text-white text-xs font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>📄 Main XML Sitemap</span>
              </a>
              <a
                href="/sitemap-images.xml"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-luxury-gold/90 hover:bg-luxury-gold text-white text-xs font-semibold rounded-lg transition-colors shadow-sm flex items-center gap-1.5"
              >
                <span>🖼️ Google Image Sitemap</span>
              </a>
            </div>
          </div>

          {/* High-Intent Search Categories */}
          <div className="bg-white p-8 md:p-10 rounded-2xl border border-stone-200/80 shadow-sm space-y-6">
            <h2 className="text-xl font-serif font-bold text-luxury-gold border-b border-stone-100 pb-3 flex items-center justify-between">
              <span>Popular Room &amp; Interior Categories</span>
              <span className="text-xs font-sans text-stone-400 font-normal">Indexed for Google &amp; Bing</span>
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link
                to="/services/residential-interior-design"
                className="group p-4 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-luxury-gold/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-luxury-gold text-xs font-bold uppercase tracking-wider mb-1">Full Home</div>
                  <div className="text-stone-900 font-semibold text-sm group-hover:text-luxury-gold transition-colors">Turnkey Interior Design</div>
                  <div className="text-stone-500 text-xs mt-1">1BHK, 2BHK, 3BHK flats, penthouses &amp; villas across Mumbai MMR.</div>
                </div>
                <div className="text-xs text-luxury-gold font-medium mt-3 flex items-center gap-1">Explore Interiors →</div>
              </Link>

              <Link
                to="/services/bedroom-interior-design"
                className="group p-4 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-luxury-gold/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-luxury-gold text-xs font-bold uppercase tracking-wider mb-1">Bedroom</div>
                  <div className="text-stone-900 font-semibold text-sm group-hover:text-luxury-gold transition-colors">Master &amp; Guest Bedroom Design</div>
                  <div className="text-stone-500 text-xs mt-1">Custom headboards, hydraulic storage beds, acoustic walls &amp; warm lighting.</div>
                </div>
                <div className="text-xs text-luxury-gold font-medium mt-3 flex items-center gap-1">Explore Bedrooms →</div>
              </Link>

              <Link
                to="/services/modular-kitchen-design"
                className="group p-4 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-luxury-gold/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-luxury-gold text-xs font-bold uppercase tracking-wider mb-1">Kitchen</div>
                  <div className="text-stone-900 font-semibold text-sm group-hover:text-luxury-gold transition-colors">Bespoke Modular Kitchens</div>
                  <div className="text-stone-500 text-xs mt-1">100% IS:710 Marine Ply, German Blum soft-close fittings &amp; seamless quartz.</div>
                </div>
                <div className="text-xs text-luxury-gold font-medium mt-3 flex items-center gap-1">Explore Kitchens →</div>
              </Link>

              <Link
                to="/services/bathroom-interior-design"
                className="group p-4 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-luxury-gold/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-luxury-gold text-xs font-bold uppercase tracking-wider mb-1">Bathroom</div>
                  <div className="text-stone-900 font-semibold text-sm group-hover:text-luxury-gold transition-colors">Luxury Bathroom Renovations</div>
                  <div className="text-stone-500 text-xs mt-1">Large format porcelain tiles, glass shower cubicles &amp; floating quartz vanities.</div>
                </div>
                <div className="text-xs text-luxury-gold font-medium mt-3 flex items-center gap-1">Explore Bathrooms →</div>
              </Link>

              <Link
                to="/services/pooja-room-design"
                className="group p-4 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-luxury-gold/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-luxury-gold text-xs font-bold uppercase tracking-wider mb-1">Temple / Mandir</div>
                  <div className="text-stone-900 font-semibold text-sm group-hover:text-luxury-gold transition-colors">Sacred Home Mandir &amp; Pooja Room</div>
                  <div className="text-stone-500 text-xs mt-1">Vastu-compliant layouts, CNC brass jali screens, backlit onyx &amp; marble altars.</div>
                </div>
                <div className="text-xs text-luxury-gold font-medium mt-3 flex items-center gap-1">Explore Temples →</div>
              </Link>

              <Link
                to="/services/wardrobe-design"
                className="group p-4 rounded-xl border border-stone-100 bg-stone-50/50 hover:bg-stone-50 hover:border-luxury-gold/40 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="text-luxury-gold text-xs font-bold uppercase tracking-wider mb-1">Wardrobes</div>
                  <div className="text-stone-900 font-semibold text-sm group-hover:text-luxury-gold transition-colors">Custom Wardrobes &amp; Closets</div>
                  <div className="text-stone-500 text-xs mt-1">Floor-to-ceiling sliding mirrors, tinted glass walk-in closets &amp; organizers.</div>
                </div>
                <div className="text-xs text-luxury-gold font-medium mt-3 flex items-center gap-1">Explore Wardrobes →</div>
              </Link>
            </div>
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
