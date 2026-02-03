import React from 'react';
import Section from '../components/Section';
import Button from '../components/Button';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  return (
    <div>
      <div className="bg-premium-stone pt-32 pb-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/5 via-luxury-gold/2 to-transparent z-0" />
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-luxury-charcoal mb-4 animate-fadeInUp">Our Services</h1>
          <p className="text-luxury-charcoal/70 text-lg max-w-2xl mx-auto animate-fadeInUp font-medium" style={{ animationDelay: '0.2s' }}>
            Comprehensive interiors and turnkey construction solutions tailored to your dream home.
          </p>
        </div>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div key={service.id} className="bg-white border border-luxury-gold/10 hover:border-luxury-gold/40 rounded-xl overflow-hidden hover:shadow-luxury-hover transition-all duration-500 flex flex-col group">
              <div className="p-8 flex-1">
                <div className="w-16 h-16 bg-luxury-gold/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-luxury-gold transition-colors duration-500">
                  <service.icon className="w-8 h-8 text-luxury-gold group-hover:text-white transition-colors duration-500" />
                </div>
                <h3 className="text-xl font-bold text-luxury-charcoal mb-3 font-serif">{service.title}</h3>
                <p className="text-luxury-charcoal/70 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
              <div className="bg-luxury-gold/5 px-8 py-4 border-t border-luxury-gold/5">
                <ul className="text-[10px] uppercase tracking-widest font-bold text-luxury-gold/60 space-y-2">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-luxury-gold rounded-full mr-2"></span>Expert Team</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-luxury-gold rounded-full mr-2"></span>Quality Materials</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-luxury-gold rounded-full mr-2"></span>On-time Completion</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section colored>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-luxury-charcoal mb-6">Need a Custom Solution?</h2>
          <p className="text-luxury-charcoal/70 mb-8 text-lg font-medium">
            Every project is unique. We offer tailored construction packages designed to meet your specific requirements and budget.
          </p>
          <Button to="/contact">Discuss Your Project</Button>
        </div>
      </Section>
    </div>
  );
};

export default Services;
