import React from 'react';
import Section from '../components/Section';
import { useAboutPage } from '../hooks/useAboutPage';
import * as Icons from 'lucide-react';

const About: React.FC = () => {
  const { content, loading } = useAboutPage();

  const getIcon = (iconName: string, colorClass: string = 'text-luxury-gold') => {
    const IconComponent = (Icons as any)[iconName] || Icons.Home;
    return <IconComponent className={`w-8 h-8 ${colorClass}`} />;
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
      {/* Page Header */}
      <div className="bg-premium-stone pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/5 via-luxury-gold/2 to-transparent z-0" />
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-luxury-charcoal mb-4 animate-fadeInUp">
            {content.headerTitle}
          </h1>
          <p className="text-luxury-charcoal/70 text-lg max-w-2xl mx-auto animate-fadeInUp font-medium" style={{ animationDelay: '0.2s' }}>
            {content.headerSubtitle}
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold text-luxury-charcoal mb-6">{content.mainTitle}</h2>
            {content.paragraphs.map((para, idx) => (
              <p key={idx} className="text-luxury-charcoal/80 mb-6 leading-relaxed">
                {para}
              </p>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-4">
            {content.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Interior design ${idx + 1}`}
                className={`rounded-lg shadow-lg w-full h-64 object-cover ${idx % 2 === 0 ? 'mt-8' : ''}`}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
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
              <div key={item.key} className="bg-white p-8 rounded-lg shadow-luxury text-center border border-luxury-gold/5">
                <div className="w-16 h-16 bg-luxury-gold/5 rounded-full flex items-center justify-center mx-auto mb-6">
                  {getIcon(pillar.icon, item.color)}
                </div>
                <h3 className="text-xl font-bold text-luxury-charcoal mb-4 font-serif">{pillar.title}</h3>
                <p className="text-luxury-charcoal/70 text-sm leading-relaxed">
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
