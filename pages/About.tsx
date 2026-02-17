import React from 'react';
import Section from '../components/Section';
import { useAboutPage } from '../hooks/useAboutPage';
import CinematicHero from '../components/luxury/CinematicHero';
import FounderOverview from '../components/luxury/FounderOverview';
import Timeline from '../components/luxury/Timeline';
import SEO from '../components/SEO';
import * as Icons from 'lucide-react';

const About: React.FC = () => {
  const { content, loading } = useAboutPage();

  const getIcon = (iconName: string, colorClass: string = 'text-luxury-gold') => {
    const IconComponent = (Icons as any)[iconName] || Icons.Home;
    return <IconComponent className={`w - 8 h - 8 ${colorClass} `} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mb-4"></div>
          <p className="text-luxury-gold font-serif tracking-widest text-sm animate-pulse uppercase">Refining Legacy</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SEO
        title="About Us"
        description="Learn about Sonu Enterprises, our 110-year legacy, and our mission to deliver premium interior design and construction services."
        canonical="https://sonuenterprises.com/about"
      />
      {/* Distinct Page Hero */}
      <CinematicHero
        title={content.headerTitle}
        subtitle={content.headerSubtitle}
        backgroundImage={content.headerImage || "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=80"}
      />

      {/* Main Content */}
      <Section className="relative">
        {/* Subtle Section Background Pattern */}
        <div
          className="absolute inset-0 opacity-[0.07] pointer-events-none"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed'
          }}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-luxury-charcoal mb-10 text-center">{content.mainTitle}</h2>
            {content.paragraphs.map((para, idx) => (
              <p key={idx} className="text-white/90 mb-6 leading-relaxed text-lg font-medium">
                {para}
              </p>
            ))}

            <div className="mt-8 flex gap-4">
              <div className="text-center px-6 py-4 border border-luxury-gold/20 rounded-lg">
                <span className="block text-3xl font-bold text-luxury-gold font-serif">15+</span>
                <span className="text-xs uppercase tracking-widest text-white/70">Years</span>
              </div>
              <div className="text-center px-6 py-4 border border-luxury-gold/20 rounded-lg">
                <span className="block text-3xl font-bold text-luxury-gold font-serif">400+</span>
                <span className="text-xs uppercase tracking-widest text-white/70">Projects</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {content.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Interior design ${idx + 1} `}
                className={`rounded - lg shadow - lg w - full h - 64 object - cover transform hover: scale - 105 transition - transform duration - 500 ${idx % 2 === 0 ? 'mt-8' : ''} `}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
      </Section>

      {/* Founder / Team Section (New) */}
      <Section className="bg-stone-50">
        <FounderOverview />

        {/* Timeline Section */}
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-luxury-gold text-sm font-bold uppercase tracking-widest">Our Journey</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mt-2">A Legacy Built on Trust</h2>
          </div>
          <Timeline />
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section colored>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { key: 'mission', color: 'text-luxury-gold' },
            { key: 'vision', color: 'text-luxury-bronze' },
            { key: 'values', color: 'text-luxury-gold' }
          ].map((item) => {
            const pillar = (content as any)[item.key];
            return (
              <div key={item.key} className="bg-white p-8 rounded-lg shadow-luxury text-center border border-luxury-gold/5 hover:border-luxury-gold/20 transition-all duration-300">
                <div className="w-16 h-16 bg-luxury-gold/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  {getIcon(pillar.icon, item.color)}
                </div>
                <h3 className="text-xl font-bold !text-neutral-950 mb-4 font-serif">{pillar.title}</h3>
                <p className="!text-neutral-900 text-sm leading-relaxed font-medium">
                  {pillar.content}
                </p>
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
};

export default About;
