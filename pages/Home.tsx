import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import Section from '../components/Section';
import Button from '../components/Button';
import { SERVICES, COMPANY_PHONE, COMPANY_NAME } from '../constants';
import { useProjects } from '../hooks/useProjects';
import { useTestimonials } from '../hooks/useTestimonials';
import { useImages } from '../hooks/useImages';
import { useServices } from '../hooks/useServices';
import { useCompanyData } from '../hooks/useCompanyData';
import * as Icons from 'lucide-react';
import { ServiceCardSkeleton, ProjectCardSkeleton } from '../components/Skeleton';

// Luxury Components
import CinematicHero from '../components/luxury/CinematicHero';
import TestimonialCarousel from '../components/luxury/TestimonialCarousel';
import TrustMetrics from '../components/luxury/TrustMetrics';
import SEO, { organizationSchema } from '../components/SEO';
import FloatingWhatsApp from '../components/luxury/FloatingWhatsApp';
import ProcessTimeline from '../components/luxury/ProcessTimeline';
import WhyChooseUs from '../components/luxury/WhyChooseUs';
import MobileStickyCTA from '../components/luxury/MobileStickyCTA';
import LeadCaptureForm from '../components/luxury/LeadCaptureForm';
import BrandingSection from '../components/luxury/BrandingSection';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'framer-motion';

const Home: React.FC = () => {
  const { projects, loading: projectsLoading } = useProjects();
  const { testimonials } = useTestimonials();
  const { images } = useImages();
  const { services, loading: servicesLoading } = useServices();
  const { name, phone } = useCompanyData();
  const [brandingData, setBrandingData] = React.useState<any>(null);

  React.useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'branding'), (docSnap) => {
      if (docSnap.exists()) {
        setBrandingData(docSnap.data());
      }
    });
    return () => unsub();
  }, []);

  return (
    <>
      <SEO
        title="Home"
        description="Sonu Enterprises & Building Developers - Where Luxury Meets Your Vision. Expert interior design and construction services in Mumbai & Thane."
        canonical="https://sonu-builders.in/"
        schema={organizationSchema}
      />
      {/* Cinematic Hero Section */}
      <CinematicHero
        backgroundImage={brandingData?.imageUrl || images.homeHero}
        titleColor={brandingData?.titleColor}
        emphasisColor={brandingData?.emphasisColor}
        subtextColor={brandingData?.subtextColor}
        title={brandingData?.title}
        emphasisText={brandingData?.emphasisText}
        description={brandingData?.description}
      />

      <div>
        <div>
          <TrustMetrics />
        </div>

        {/* Dynamic Branding Section */}
        {brandingData && (
          <div>
            <BrandingSection
              title={brandingData.title}
              subtitle={brandingData.subtitle}
              description={brandingData.description}
              imageUrl={brandingData.imageUrl}
              buttonText={brandingData.buttonText}
              buttonLink={brandingData.buttonLink}
            />
          </div>
        )}

        {/* Services Preview */}
        <Section className="bg-luxury-white dark:bg-luxury-charcoal pt-20 pb-20">
          <div className="text-center mb-24">
            <p className="text-luxury-gold font-bold uppercase tracking-[0.3em] mb-4 text-xs">
              Our Expertise
            </p>
            <h2 className="text-luxury-charcoal dark:text-white">
              Crafting Exceptional Environments
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {servicesLoading ? (
              [...Array(6)].map((_, i) => <ServiceCardSkeleton key={i} />)
            ) : (
              services.slice(0, 6).map((service, idx) => {
                const IconComponent = (Icons as any)[service.icon] || Icons.Home;
                return (
                  <div
                    key={service.id}
                    className="group relative h-[500px] overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-700 bg-luxury-charcoal"
                  >
                    <Link to={`/services/${service.id}`} className="block h-full w-full">
                      {/* Background Image (Design Inspiration) */}
                      <div className="absolute inset-0 z-0">
                        <img
                          src={service.image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80"}
                          alt={service.title}
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-1000 opacity-60 group-hover:opacity-80"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-luxury-obsidian via-luxury-obsidian/40 to-transparent" />
                      </div>

                      {/* Content */}
                      <div className="absolute inset-0 z-10 p-10 flex flex-col justify-end">
                        <div className="w-16 h-16 bg-luxury-gold/20 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:bg-luxury-gold transition-all duration-500 rounded-sm">
                          <IconComponent className="w-6 h-6 text-luxury-gold group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-3xl font-serif font-bold text-white mb-4 leading-tight">
                          {service.title}
                        </h3>
                        <p className="text-white/80 mb-8 leading-relaxed text-sm opacity-0 group-hover:opacity-100 dark:group-hover:text-white/90 transition-all duration-500 translate-y-4 group-hover:translate-y-0 line-clamp-2">
                          {service.description}
                        </p>
                        <div
                          className="text-luxury-gold font-bold text-xs uppercase tracking-[0.2em] inline-flex items-center group-hover:tracking-[0.3em] transition-all"
                        >
                          Discover Design <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                      </div>
                    </Link>
                  </div>
                );
              })
            )}
          </div>

          <div className="text-center mt-20">
            <Button to="/services" variant="outline">
              Explore All Services
            </Button>
          </div>
        </Section>

        <div>
          <WhyChooseUs />
        </div>

        <div>
          <ProcessTimeline />
        </div>

        {/* Featured Projects */}
        <Section className="bg-luxury-white dark:bg-luxury-charcoal">
          <div className="flex justify-between items-end mb-20">
            <div>
              <p className="text-luxury-gold font-bold uppercase tracking-[0.3em] mb-4 text-xs">
                Portfolio
              </p>
              <h2 className="text-luxury-charcoal dark:text-white">
                The Gallery of Works
              </h2>
            </div>
            <Link
              to="/projects"
              className="hidden md:flex text-luxury-gold font-bold items-center hover:underline uppercase tracking-widest text-xs"
            >
              See the Collection <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {projectsLoading ? (
              [...Array(3)].map((_, i) => <ProjectCardSkeleton key={i} />)
            ) : (
              projects.slice(0, 6).map((project) => (
                <div
                  key={project.id}
                  className="group relative overflow-hidden shadow-luxury"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-1000"
                      loading="eager"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-luxury-obsidian/90 via-luxury-obsidian/40 to-transparent p-10 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                    <span className="text-luxury-gold text-[10px] uppercase tracking-[0.3em] font-bold mb-3">
                      {project.category}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-white mb-2">
                      {project.title}
                    </h3>
                    <p className="text-white/60 text-xs uppercase tracking-widest flex items-center">
                      <span className="mr-2 h-[1px] w-4 bg-luxury-gold" /> {project.location}
                    </p>
                  </div>
                  </div>
              ))
            )}
          </div>

        </Section>
      </div>

      <div className="mt-8 text-center md:hidden">
        <Button to="/projects" variant="outline" fullWidth className="border-2 border-luxury-gold text-luxury-gold">
          View All Projects
        </Button>
      </div>

      {/* Testimonials */}
      <Section className="bg-luxury-white dark:bg-luxury-charcoal relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/5 to-transparent opacity-50" />
        <div className="text-center mb-16 relative z-10">
          <p className="text-luxury-gold font-bold uppercase tracking-[0.2em] mb-3 text-xs">
            Client Experiences
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-luxury-charcoal dark:text-white mb-6">
            Reflections of Excellence
          </h2>
          <div className="flex items-center justify-center gap-4 py-3 px-6 bg-white/5 backdrop-blur-sm rounded-full border border-white/10 w-fit mx-auto">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 text-[#FFD700] fill-[#FFD700]" />
              ))}
            </div>
            <p className="text-sm font-bold text-white tracking-wide">
              4.9/5.0 <span className="text-gray-400 font-medium ml-1">on Google Maps</span>
            </p>
          </div>
        </div>

        <div className="relative z-10">
          <TestimonialCarousel />
        </div>
      </Section>

      {/* Lead Capture Section */}
      <LeadCaptureForm />

      {/* CTA Section */}
      <Section className="bg-luxury-white dark:bg-luxury-charcoal border-y border-luxury-gold/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-luxury-gold/5 rounded-full -ml-48 -mb-48 blur-3xl opacity-50" />
        <div className="text-center text-luxury-charcoal max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6 dark:text-white">
            Ready to Transform Your Space?
          </h2>
          <p className="text-luxury-charcoal/70 dark:text-white/70 text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Contact us today for a free consultation. Let's discuss how we can bring your interior design vision to life with precision and elegance.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-6">
            <Button
              to="/contact"
              variant="primary"
              className="bg-luxury-gold text-white px-10 py-5 text-lg rounded-sm hover:bg-luxury-charcoal transition-all duration-500 shadow-luxury hover:shadow-luxury-hover uppercase tracking-[0.2em] font-bold"
            >
              Get a Quote
            </Button>
            <a
              href={`https://wa.me/${phone.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hello ${name}, I would like to request a quotation for my project.`
              )}`}
              className="inline-flex items-center justify-center px-10 py-5 border border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white transition-all duration-500 rounded-sm text-lg font-bold uppercase tracking-[0.2em]"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </Section>

      {/* Mobile Sticky CTA Bar */}
      <MobileStickyCTA />

      {/* Floating WhatsApp */}
      <FloatingWhatsApp />
    </>
  );
};

export default Home;
