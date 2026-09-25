import React, { useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  User,
  ArrowLeft,
  ArrowRight,
  Share2,
  CheckCircle2,
  HelpCircle,
  Building2,
  Phone
} from 'lucide-react';
import SEO, { organizationSchema, articleSchema, breadcrumbSchema, faqSchema } from '../components/SEO';
import { BLOG_POSTS, CANONICAL_DOMAIN, COMPANY_PHONE } from '../constants';
import LeadCaptureForm from '../components/luxury/LeadCaptureForm';

const GOLD = '#c5a059';
const GOLD_LIGHT = '#e8d5a3';

const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();

  const post = useMemo(() => {
    return BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] text-stone-900 flex flex-col items-center justify-center p-6">
        <h2 className="text-3xl font-serif font-bold text-[#171717] mb-4">Article Not Found</h2>
        <Link to="/blog" className="text-luxury-gold underline font-bold">
          Back to Blog
        </Link>
      </div>
    );
  }

  const breadcrumbs = [
    { name: 'Home', url: '/' },
    { name: 'Blog', url: '/blog' },
    { name: post.title, url: `/blog/${post.slug}` }
  ];

  const schemas: any[] = [
    organizationSchema,
    articleSchema({
      title: post.title,
      description: post.metaDescription,
      slug: post.slug,
      publishedDate: post.publishedDate,
      image: post.image,
      authorName: post.author.name
    }),
    breadcrumbSchema(breadcrumbs)
  ];

  if (post.faqs && post.faqs.length > 0) {
    schemas.push(faqSchema(post.faqs));
  }

  // Related articles
  const otherPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <div className="bg-[#FAF8F5] text-stone-900 min-h-screen font-sans selection:bg-luxury-gold selection:text-white">
      <SEO
        title={post.seoTitle}
        description={post.metaDescription}
        canonical={`${CANONICAL_DOMAIN}/blog/${post.slug}`}
        ogImage={post.image}
        schema={schemas}
      />

      {/* ── ARTICLE HEADER ─────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 bg-[#FAF8F5] border-b border-luxury-gold/20">
        <div className="max-w-4xl mx-auto px-6">
          <Link
            to="/blog"
            className="inline-flex items-center text-xs uppercase tracking-widest text-luxury-gold hover:text-[#171717] transition-colors mb-8 font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5 mr-2" /> All Articles
          </Link>

          <div className="flex items-center gap-3 mb-6">
            <span className="px-3 py-1 rounded-full bg-luxury-gold/15 text-luxury-gold text-[10px] font-bold uppercase tracking-wider border border-luxury-gold/30">
              {post.category}
            </span>
            <div className="flex items-center gap-4 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-luxury-gold" />
                <span>{post.publishedDate}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-luxury-gold" />
                <span>{post.readTime}</span>
              </span>
            </div>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-[#171717] mb-6 leading-tight">
            {post.h1 || post.title}
          </h1>

          <p className="text-stone-600 text-base md:text-lg leading-relaxed font-normal mb-8">
            {post.excerpt}
          </p>

          {/* Author Badge */}
          <div className="flex items-center gap-3 pt-6 border-t border-stone-200">
            <div className="w-10 h-10 rounded-full bg-luxury-gold/15 border border-luxury-gold/40 flex items-center justify-center text-luxury-gold font-bold text-sm">
              SS
            </div>
            <div>
              <p className="text-sm font-semibold text-[#171717]">{post.author.name}</p>
              <p className="text-xs text-stone-500">{post.author.role}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED IMAGE ─────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 -mt-8 relative z-10">
        <div className="rounded-2xl overflow-hidden aspect-[16/9] shadow-luxury border border-stone-200">
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover"
            style={{ filter: 'brightness(0.96) contrast(1.02)' }}
          />
        </div>
      </div>

      {/* ── ARTICLE BODY WITH TABLE OF CONTENTS ─────────────────────────────── */}
      <section className="py-20 bg-[#FAF8F5]">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-12">
            {/* Table of Contents Box (Mobile / In-flow) */}
            {post.tableOfContents && post.tableOfContents.length > 0 && (
              <div className="p-6 rounded-2xl bg-white border border-luxury-gold/30 shadow-sm lg:hidden">
                <h3 className="text-sm font-bold uppercase tracking-wider text-luxury-gold mb-3">
                  Table of Contents
                </h3>
                <ul className="space-y-2 text-xs">
                  {post.tableOfContents.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`} className="text-stone-600 hover:text-luxury-gold transition-colors">
                        {item.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Sections */}
            {post.sections.map((section, idx) => (
              <div key={idx} id={section.id} className="scroll-mt-28 space-y-4">
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#171717] pt-4 border-t border-stone-200">
                  {section.heading}
                </h2>
                <div className="space-y-4 text-stone-700 leading-relaxed text-base font-normal">
                  {section.content.map((p, pIdx) => (
                    <p key={pIdx}>{p}</p>
                  ))}
                </div>

                {section.subsections && (
                  <div className="space-y-6 pt-4">
                    {section.subsections.map((sub, sIdx) => (
                      <div key={sIdx} className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-3">
                        <h3 className="text-lg font-serif font-bold text-luxury-gold">
                          {sub.subheading}
                        </h3>
                        <ul className="space-y-2 text-sm text-stone-700">
                          {sub.points.map((pt, ptIdx) => (
                            <li key={ptIdx} className="flex items-start gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-luxury-gold mt-2 flex-shrink-0" />
                              <span>{pt}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Internal Contextual Linking Box */}
            <div className="p-8 rounded-2xl bg-white border border-luxury-gold/35 shadow-sm space-y-4 my-12">
              <h3 className="text-xl font-serif font-bold text-[#171717]">
                Planning an Interior Project in Mumbai?
              </h3>
              <p className="text-stone-600 text-sm leading-relaxed">
                Sonu Enterprises delivers turnkey design and build solutions across Thane, Navi Mumbai, and Kalyan-Dombivli. Explore our specialized services or request a complimentary on-site measurement.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  to="/services/residential-interior-design"
                  className="text-xs uppercase font-bold tracking-wider text-luxury-gold hover:underline"
                >
                  Residential Interiors →
                </Link>
                <Link
                  to="/services/modular-kitchen-design"
                  className="text-xs uppercase font-bold tracking-wider text-luxury-gold hover:underline"
                >
                  Modular Kitchens →
                </Link>
                <Link
                  to="/interior-designer-mumbai"
                  className="text-xs uppercase font-bold tracking-wider text-luxury-gold hover:underline"
                >
                  Mumbai Turnkey Guide →
                </Link>
              </div>
            </div>

            {/* FAQs Section */}
            {post.faqs && post.faqs.length > 0 && (
              <div className="pt-12 border-t border-stone-200 space-y-6">
                <h3 className="text-2xl font-serif font-bold text-[#171717] flex items-center gap-2">
                  <HelpCircle className="w-5 h-5 text-luxury-gold" />
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  {post.faqs.map((faq, fIdx) => (
                    <div key={fIdx} className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-sm space-y-2">
                      <h4 className="font-serif font-bold text-[#171717] text-base">{faq.question}</h4>
                      <p className="text-stone-600 text-xs leading-relaxed">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sticky Sidebar (Desktop) */}
          <div className="hidden lg:block lg:col-span-4 space-y-8">
            <div className="sticky top-28 space-y-8">
              {/* Table of Contents */}
              {post.tableOfContents && post.tableOfContents.length > 0 && (
                <div className="p-6 rounded-2xl bg-white border border-stone-200/80 shadow-sm">
                  <h4 className="text-xs font-bold uppercase tracking-widest text-luxury-gold mb-4">
                    In This Guide
                  </h4>
                  <ul className="space-y-3 text-xs">
                    {post.tableOfContents.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className="text-stone-600 hover:text-luxury-gold hover:translate-x-1 inline-block transition-all"
                        >
                          {item.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Consultation Callout */}
              <div className="p-6 rounded-2xl bg-white border border-luxury-gold/30 shadow-luxury text-center space-y-4">
                <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-gold">
                  Direct Expert Consultation
                </span>
                <h4 className="text-lg font-serif font-bold text-[#171717]">
                  Speak with Our Design Experts
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Get honest guidance, budget feasibility reviews, and on-site measurements.
                </p>
                <a
                  href={`tel:${COMPANY_PHONE.replace(/\s+/g, '')}`}
                  className="w-full flex items-center justify-center gap-2 py-3 bg-luxury-gold text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-md hover:bg-luxury-gold/90 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Call {COMPANY_PHONE}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED ARTICLES ───────────────────────────────────────────────── */}
      {otherPosts.length > 0 && (
        <section className="py-20 bg-[#F4F0E8] border-t border-luxury-gold/20">
          <div className="max-w-5xl mx-auto px-6">
            <h3 className="text-2xl font-serif font-bold text-[#171717] mb-8">
              Continue Reading
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {otherPosts.map((op) => (
                <Link
                  key={op.slug}
                  to={`/blog/${op.slug}`}
                  className="p-6 rounded-2xl bg-white border border-stone-200/80 hover:border-luxury-gold/40 shadow-sm hover:shadow-luxury transition-all flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-luxury-gold mb-2 block">
                      {op.category}
                    </span>
                    <h4 className="text-lg font-serif font-bold text-[#171717] group-hover:text-luxury-gold transition-colors mb-2">
                      {op.title}
                    </h4>
                    <p className="text-xs text-stone-600 line-clamp-2 mb-4 font-normal">
                      {op.excerpt}
                    </p>
                  </div>
                  <span className="text-xs text-luxury-gold font-bold inline-flex items-center gap-1">
                    <span>Read Article</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CONSULTATION FORM ───────────────────────────────────────────────── */}
      <div id="blog-consultation">
        <LeadCaptureForm 
          title="Schedule Your Free Consultation"
          subtitle="Start Your Project"
          description="Discuss your architectural and interior design aspirations with Sonu Enterprises. Transparent estimates, bespoke concepts, and flawless execution."
        />
      </div>
    </div>
  );
};

export default BlogPost;
