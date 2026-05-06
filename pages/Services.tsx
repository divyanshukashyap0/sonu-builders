import React from 'react';
import { Link } from 'react-router-dom';
import Section from '../components/Section';
import Button from '../components/Button';
import PageHero from '../components/luxury/PageHero';
import { useServices } from '../hooks/useServices';
import { usePageHeaders } from '../hooks/usePageHeaders';
import SEO from '../components/SEO';
import * as Icons from 'lucide-react';
import DesignInspirations from '../components/luxury/DesignInspirations';

import { ServiceCardSkeleton, Skeleton } from '../components/Skeleton';
import MediaRenderer from '../components/ui/MediaRenderer';

const Services: React.FC = () => {
  const { services, loading: servicesLoading } = useServices();
  const { headers, loading: headersLoading } = usePageHeaders();

  const getIcon = (iconName: string) => {
    const IconComponent = (Icons as any)[iconName] || Icons.Home;
    return <IconComponent className="w-8 h-8 text-white transition-colors duration-500" />;
  };

  // Pre-define dummy headers if loading
  const headerData = headersLoading || !headers?.services ? {
    title: "Our Services",
    subtitle: "Excellence in every detail",
    backgroundImage: ""
  } : headers.services;

  return (
    <div className="bg-white dark:bg-luxury-obsidian">
      <SEO
        title="Premium Services"
        description="Explore our world-class interior design and construction services. From modular kitchens to full-home luxury renovations."
        canonical="https://sonu-builders.in/services"
      />
      <PageHero
        title={headerData.title}
        subtitle={headerData.subtitle}
        backgroundImage={headerData.backgroundImage || "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1920&q=100"}
      />

      <Section className="relative">
        <div className="text-center mb-20">
          <span className="text-theme-accent font-bold uppercase tracking-[0.4em] text-xs mb-4 block">Core Offerings</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-theme-text">Professional Solutions</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {servicesLoading ? (
            [...Array(6)].map((_, i) => <ServiceCardSkeleton key={i} />)
          ) : (
            services.map((service) => (
              <Link to={`/services/${service.id}`} key={service.id} className="bg-theme-card border border-theme-border hover:border-theme-accent rounded-sm overflow-hidden hover:shadow-2xl transition-all duration-700 flex flex-col group block h-full">
                <div className="relative h-64 overflow-hidden bg-theme-background">
                  <MediaRenderer
                    src={service.image || "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80"}
                    alt={service.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-100"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-theme-background/90 via-transparent to-transparent" />
                  <div className="absolute top-6 left-6 w-14 h-14 bg-theme-accent flex items-center justify-center rounded-sm shadow-lg transform group-hover:-translate-y-1 transition-transform">
                    {getIcon(service.icon as unknown as string)}
                  </div>
                </div>
                <div className="p-10 flex-1">
                  <h3 className="text-2xl font-bold text-theme-text mb-4 font-serif">{service.title}</h3>
                  <p className="text-theme-muted leading-relaxed text-sm font-medium line-clamp-3">
                    {service.description}
                  </p>
                </div>
                <div className="bg-theme-accent/5 px-10 py-6 border-t border-theme-border/10">
                  <div className="flex items-center text-theme-accent font-bold text-[10px] uppercase tracking-widest group-hover:translate-x-2 transition-transform">
                    Explore Details <Icons.ArrowRight className="w-4 h-4 ml-2" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        {services.length === 0 && (
          <div className="text-center py-20">
            <p className="text-theme-muted italic">Our executive offerings are currently being curated.</p>
          </div>
        )}
      </Section>

      {/* Massive Design Inspirations Gallery integrated here */}
      <div className="border-t border-theme-border/10">
        <DesignInspirations isSection={true} />
      </div>

      <Section colored className="text-theme-text">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-serif font-bold mb-8">Need a Bespoke Solution?</h2>
          <p className="text-theme-muted mb-12 text-lg font-medium leading-relaxed">
            Every project is unique. We offer tailored construction packages and custom design services crafted specifically for your lifestyle and vision.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button to="/contact" className="px-12 py-5 text-lg rounded-sm">Discuss Your Project</Button>
            <Button to="/contact" variant="outline" className="px-12 py-5 text-lg rounded-sm">Book Consultation</Button>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default Services;

