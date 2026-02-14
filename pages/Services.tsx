import React from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/Section';
import Button from '../components/Button';
import PageHero from '../components/luxury/PageHero';
import { useServices } from '../hooks/useServices';
import { usePageHeaders } from '../hooks/usePageHeaders';
import SEO from '../components/SEO';
import * as Icons from 'lucide-react';

const Services: React.FC = () => {
  const { services, loading } = useServices();
  const { headers, loading: headersLoading } = usePageHeaders();

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Home;
    return <IconComponent className="w-8 h-8 text-luxury-gold group-hover:text-white transition-colors duration-500" />;
  };

  if (loading || headersLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center pt-20">
        <div className="flex flex-col items-center justify-center">
          <div className="w-12 h-12 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin mb-4"></div>
          <p className="text-luxury-gold font-serif tracking-widest text-sm animate-pulse uppercase">Curating Excellence</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SEO
        title="Services"
        description="Explore our premium services: Interior Design, Modular Kitchens, Turnkey Construction, and more. Tailored solutions for luxury living."
        canonical="https://sonuenterprises.com/services"
      />
      <PageHero
        title={headers.services.title}
        subtitle={headers.services.subtitle}
        backgroundImage="https://images.unsplash.com/photo-1616137466211-f939a420be63?w=1600&q=80"
      />

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <Link to={`/services/${service.id}`} key={service.id} className="bg-white dark:bg-luxury-charcoal border border-luxury-gold/10 hover:border-luxury-gold/40 rounded-xl overflow-hidden hover:shadow-luxury-hover transition-all duration-500 flex flex-col group block h-full">
              <div className="p-8 flex-1">
                <div className="w-16 h-16 bg-luxury-gold/5 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-luxury-gold transition-colors duration-500">
                  {getIcon(service.icon as unknown as string)}
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
            </Link>
          ))}
        </div>

        {services.length === 0 && (
          <div className="text-center py-20">
            <p className="text-stone-400 italic">Our executive offerings are currently being curated.</p>
          </div>
        )}
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
