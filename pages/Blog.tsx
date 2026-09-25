import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Clock, Calendar, ArrowRight, User, Search, BookOpen, Sparkles } from 'lucide-react';
import SEO, { organizationSchema, breadcrumbSchema } from '../components/SEO';
import { BLOG_POSTS, CANONICAL_DOMAIN } from '../constants';

const GOLD = '#c5a059';
const GOLD_LIGHT = '#e8d5a3';

const CATEGORIES = ['All Guides', 'Guides & Advice', 'Design Ideas', 'Kitchens', 'Space Optimization', 'Checklists'];

const Blog: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('All Guides');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredPosts = useMemo(() => {
    return BLOG_POSTS.filter((post) => {
      const matchesCategory =
        activeCategory === 'All Guides' || post.category.toLowerCase() === activeCategory.toLowerCase();
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.metaDescription.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' }
  ];

  return (
    <div className="bg-[#FAF8F5] text-stone-900 min-h-screen font-sans selection:bg-luxury-gold selection:text-white">
      <SEO
        title="Mumbai Interior Design Blog & Expert Guides | Sonu Enterprises"
        description="Comprehensive guides for Mumbai homeowners: choosing an interior designer, modular kitchen planning, 2BHK flat design costs, timelines & space-saving checklists."
        canonical={`${CANONICAL_DOMAIN}/blog`}
        schema={[organizationSchema, breadcrumbSchema(breadcrumbs)]}
      />

      {/* ── HERO ────────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-luxury-gold/20 bg-[#FAF8F5]">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(197,160,89,0.12) 0%, transparent 70%)', filter: 'blur(80px)' }}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-luxury-gold/40 bg-white/80 backdrop-blur-md mb-6 shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-luxury-gold" />
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-luxury-gold">
              Knowledge Hub & Practical Guides
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-[#171717] mb-6 leading-tight">
            Mumbai Interior Design{' '}
            <span
              style={{
                background: `linear-gradient(135deg, ${GOLD}, #b38b3a)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text'
              }}
            >
              Insights
            </span>
          </h1>

          <p className="text-stone-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed mb-10 font-normal">
            Real-world guides, cost breakdowns, society guideline checklists, and architectural tips from Sonu Enterprises' 15+ years of Mumbai contracting.
          </p>

          {/* Search bar */}
          <div className="max-w-md mx-auto relative">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides (e.g. 2BHK, kitchen, checklist)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 rounded-full bg-white border border-stone-200 text-stone-900 placeholder-stone-400 text-sm focus:outline-none focus:border-luxury-gold shadow-sm transition-colors"
            />
          </div>
        </div>
      </section>

      {/* ── CATEGORY FILTER ─────────────────────────────────────────────────── */}
      <section className="py-6 bg-[#FAF8F5]/90 border-b border-stone-200/80 sticky top-20 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-start md:justify-center overflow-x-auto no-scrollbar gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-300 whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-luxury-gold text-white shadow-md shadow-luxury-gold/20'
                  : 'bg-white border border-stone-200 text-stone-600 hover:text-stone-900 hover:border-luxury-gold/50 shadow-sm'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* ── ARTICLES GRID ───────────────────────────────────────────────────── */}
      <section className="py-20 relative bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-6">
          {filteredPosts.length === 0 ? (
            <div className="text-center py-20 text-stone-500">
              <p className="text-lg">No articles found matching "{searchQuery}".</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveCategory('All Guides'); }}
                className="mt-4 text-luxury-gold text-sm underline font-bold"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <article
                  key={post.slug}
                  className="rounded-2xl overflow-hidden bg-white border border-stone-200/80 hover:border-luxury-gold/50 shadow-sm hover:shadow-luxury transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    {/* Featured Image */}
                    <Link to={`/blog/${post.slug}`} className="block relative aspect-[16/10] overflow-hidden">
                      <img
                        src={post.image}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        style={{ filter: 'brightness(0.96) contrast(1.02)' }}
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-white/90 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-luxury-gold border border-luxury-gold/30 shadow-sm">
                        {post.category}
                      </div>
                    </Link>

                    {/* Metadata & Title */}
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-xs text-stone-500 mb-3">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-luxury-gold" />
                          <span>{post.publishedDate}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-luxury-gold" />
                          <span>{post.readTime}</span>
                        </span>
                      </div>

                      <h2 className="text-xl font-serif font-bold text-[#171717] mb-3 group-hover:text-luxury-gold transition-colors leading-snug">
                        <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                      </h2>

                      <p className="text-stone-600 text-xs leading-relaxed line-clamp-3 mb-6 font-normal">
                        {post.excerpt}
                      </p>
                    </div>
                  </div>

                  {/* Read More Footer */}
                  <div className="p-6 pt-0 border-t border-stone-100 mt-auto flex items-center justify-between">
                    <span className="text-xs text-stone-500 font-medium">By {post.author.name}</span>
                    <Link
                      to={`/blog/${post.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-luxury-gold group-hover:text-[#171717] transition-colors"
                    >
                      <span>Read Guide</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Blog;
