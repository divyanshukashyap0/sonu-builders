import React from 'react';
import Section from '../components/Section';
import Button from '../components/Button';
import { SERVICES } from '../constants';

const Services: React.FC = () => {
  return (
    <div className="pt-16">
      <div className="bg-brand-blue py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">Our Services</h1>
        <p className="text-white/80 text-lg max-w-2xl mx-auto px-4">
          Comprehensive construction and development solutions tailored to your needs.
        </p>
      </div>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.map((service) => (
            <div key={service.id} className="bg-brand-blue/10 border border-transparent hover:border-brand-gold/40 rounded-xl overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col">
              <div className="p-8 flex-1">
                <div className="w-16 h-16 bg-brand-gold/10 rounded-2xl flex items-center justify-center mb-6">
                  <service.icon className="w-8 h-8 text-brand-blue" />
                </div>
                <h3 className="text-xl font-bold text-brand-dark mb-3">{service.title}</h3>
                <p className="text-slate-600 leading-relaxed">
                  {service.description}
                </p>
              </div>
              <div className="bg-brand-gold/5 px-8 py-4 border-t border-gray-100">
                <ul className="text-sm text-slate-500 space-y-2">
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-gold rounded-full mr-2"></span>Expert Team</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-gold rounded-full mr-2"></span>Quality Materials</li>
                  <li className="flex items-center"><span className="w-1.5 h-1.5 bg-brand-gold rounded-full mr-2"></span>On-time Completion</li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section colored>
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-serif font-bold text-brand-dark mb-6">Need a Custom Solution?</h2>
          <p className="text-slate-600 mb-8 text-lg">
            Every project is unique. We offer tailored construction packages designed to meet your specific requirements and budget.
          </p>
          <Button to="/contact">Discuss Your Project</Button>
        </div>
      </Section>
    </div>
  );
};

export default Services;
