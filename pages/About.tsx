import React from 'react';
import Section from '../components/Section';
import { Target, Eye, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div>
      {/* Page Header */}
      <div className="bg-premium-stone pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/5 via-luxury-gold/2 to-transparent z-0" />
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-luxury-charcoal mb-4 animate-fadeInUp">About Us</h1>
          <p className="text-luxury-charcoal/70 text-lg max-w-2xl mx-auto animate-fadeInUp font-medium" style={{ animationDelay: '0.2s' }}>
            Transforming houses into beautiful homes with thoughtful design and exceptional craftsmanship.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold text-luxury-charcoal mb-6">Creating Dream Interiors Since 2008</h2>
            <p className="text-luxury-charcoal/80 mb-6 leading-relaxed">
              Sonu Interiors & Home Design is a trusted name in the interior design industry, specializing in residential and commercial interior solutions that blend functionality with aesthetics.
            </p>
            <p className="text-luxury-charcoal/80 mb-6 leading-relaxed">
              With a passion for creating beautiful living spaces, we offer complete home interior packages, modular kitchens, custom wardrobes, false ceiling designs, and much more. Our experienced team of designers ensures every project reflects your unique style and personality.
            </p>
            <p className="text-luxury-charcoal/80 leading-relaxed">
              From contemporary minimalist apartments to traditional Indian homes, we bring your vision to life with premium materials, expert craftsmanship, and meticulous attention to detail.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=400"
              alt="Interior design planning"
              className="rounded-lg shadow-lg w-full h-64 object-cover mt-8"
              loading="lazy"
              decoding="async"
            />
            <img
              src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=400"
              alt="Beautiful home interior"
              className="rounded-lg shadow-lg w-full h-64 object-cover"
              loading="lazy"
              decoding="async"
            />
          </div>
        </div>
      </Section>

      {/* Mission & Vision */}
      <Section colored>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-lg shadow-luxury text-center border border-luxury-gold/5">
            <div className="w-16 h-16 bg-luxury-gold/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-luxury-gold" />
            </div>
            <h3 className="text-xl font-bold text-luxury-charcoal mb-4 font-serif">Our Mission</h3>
            <p className="text-luxury-charcoal/70 text-sm leading-relaxed">
              To deliver exceptional interior design solutions that exceed client expectations while creating spaces that inspire, comfort, and reflect individual personalities.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-luxury text-center border border-luxury-gold/5">
            <div className="w-16 h-16 bg-luxury-gold/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Eye className="w-8 h-8 text-luxury-bronze" />
            </div>
            <h3 className="text-xl font-bold text-luxury-charcoal mb-4 font-serif">Our Vision</h3>
            <p className="text-luxury-charcoal/70 text-sm leading-relaxed">
              To be the leading interior design company in the region, recognized for transforming ordinary spaces into extraordinary homes with innovative designs, sustainable practices, and unmatched customer satisfaction.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-luxury text-center border border-luxury-gold/5">
            <div className="w-16 h-16 bg-luxury-gold/5 rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-luxury-gold" />
            </div>
            <h3 className="text-xl font-bold text-luxury-charcoal mb-4 font-serif">Core Values</h3>
            <p className="text-luxury-charcoal/70 text-sm leading-relaxed">
              Quality Craftsmanship, Customer Satisfaction, Creative Innovation, and Timely Delivery. We believe in ethical business practices and creating designs that stand the test of time.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default About;
