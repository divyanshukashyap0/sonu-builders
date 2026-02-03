import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import Section from '../components/Section';
import Button from '../components/Button';
import { SERVICES, COMPANY_PHONE, COMPANY_NAME } from '../constants';
import { useProjects } from '../hooks/useProjects';
import { useTestimonials } from '../hooks/useTestimonials';
import { useImages } from '../hooks/useImages';

// Luxury Components
import CinematicHero from '../components/luxury/CinematicHero';
import TrustMetrics from '../components/luxury/TrustMetrics';
import FloatingWhatsApp from '../components/luxury/FloatingWhatsApp';
import ProcessTimeline from '../components/luxury/ProcessTimeline';
import WhyChooseUs from '../components/luxury/WhyChooseUs';
import MobileStickyCTA from '../components/luxury/MobileStickyCTA';
import LeadCaptureForm from '../components/luxury/LeadCaptureForm';
import BrandingSection from '../components/luxury/BrandingSection';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

const Home: React.FC = () => {
  const { projects } = useProjects();
  const { testimonials } = useTestimonials();
  const { images } = useImages();
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
      {/* Cinematic Hero Section */}
      <CinematicHero backgroundImage={images.homeHero} />

      {/* Trust Metrics Section */}
      <TrustMetrics />

      {/* Dynamic Branding Section */}
      {brandingData && (
        <BrandingSection
          title={brandingData.title}
          subtitle={brandingData.subtitle}
          description={brandingData.description}
          imageUrl={brandingData.imageUrl}
          buttonText={brandingData.buttonText}
          buttonLink={brandingData.buttonLink}
        />
      )}

      {/* Services Preview */}
      <Section className="!bg-premium-stone pt-20 pb-20">
        <div className="text-center mb-16">
          <p className="text-luxury-gold font-semibold uppercase tracking-wider mb-2 text-sm">
            Our Expertise
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-luxury-charcoal">
            Premium Interior Design Services
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {SERVICES.slice(0, 6).map((service) => (
            <div
              key={service.id}
              className="group bg-white rounded-lg overflow-hidden shadow-luxury hover:shadow-luxury-hover transition-all duration-500 hover:-translate-y-2"
            >
              <div className="p-8">
                <div className="w-14 h-14 bg-luxury-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-luxury-gold transition-all duration-300">
                  <service.icon className="w-7 h-7 text-luxury-gold group-hover:text-white transition-colors" />
                </div>
                <h3 className="text-xl font-serif font-bold text-luxury-charcoal mb-3">
                  {service.title}
                </h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>
                <Link
                  to="/services"
                  className="text-luxury-gold font-semibold inline-flex items-center hover:underline group-hover:translate-x-1 transition-transform"
                >
                  Learn More <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button to="/services" variant="outline" className="border-2 border-luxury-gold text-luxury-gold hover:bg-luxury-gold hover:text-white">
            View All Services
          </Button>
        </div>
      </Section>

      {/* Why Choose Us Section */}
      <WhyChooseUs />

      {/* Process Timeline */}
      <ProcessTimeline />

      {/* Featured Projects */}
      <Section className="!bg-ivory-pearl">
        <div className="flex justify-between items-end mb-12">
          <div>
            <p className="text-luxury-gold font-semibold uppercase tracking-wider mb-2 text-sm">
              Portfolio
            </p>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-luxury-charcoal">
              Latest Projects
            </h2>
          </div>
          <Link
            to="/projects"
            className="hidden md:flex text-luxury-gold font-semibold items-center hover:underline"
          >
            View All Projects <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, 6).map((project) => (
            <div
              key={project.id}
              className="group relative overflow-hidden rounded-lg shadow-luxury hover:shadow-luxury-hover transition-all duration-500"
            >
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-700"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-luxury-charcoal/80 via-luxury-charcoal/30 to-transparent opacity-90 group-hover:opacity-100 transition-opacity">
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="inline-block px-3 py-1 bg-luxury-gold text-white text-[10px] uppercase tracking-tighter font-bold rounded-sm mb-2 shadow-sm">
                    {project.category}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white mb-1 drop-shadow-sm">
                    {project.title}
                  </h3>
                  <p className="text-white/80 text-[10px] uppercase tracking-widest font-bold flex items-center">
                    <span className="mr-1.5 opacity-60">📍</span> {project.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Button to="/projects" variant="outline" fullWidth className="border-2 border-luxury-gold text-luxury-gold">
            View All Projects
          </Button>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="!bg-premium-stone relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-gold/5 to-transparent opacity-50" />
        <div className="text-center mb-16 relative z-10">
          <p className="text-luxury-gold font-bold uppercase tracking-[0.2em] mb-3 text-xs">
            Client Experiences
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-luxury-charcoal">
            Reflections of Excellence
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white p-8 rounded-sm shadow-glass border border-luxury-gold/10 hover:border-luxury-gold/30 transition-all duration-500 hover:-translate-y-1"
            >
              <div className="flex mb-6 text-luxury-gold">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-luxury-charcoal/80 mb-8 italic leading-relaxed font-medium">
                "{testimonial.content}"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-luxury-gold/10 rounded-full flex items-center justify-center mr-4 text-luxury-gold font-bold">
                  {testimonial.name[0]}
                </div>
                <div>
                  <p className="text-luxury-charcoal font-bold text-sm uppercase tracking-tighter">{testimonial.name}</p>
                  <p className="text-luxury-gold text-[10px] font-bold uppercase tracking-widest">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* Lead Capture Section */}
      <LeadCaptureForm />

      {/* CTA Section */}
      <Section className="bg-ivory-pearl border-y border-luxury-gold/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-luxury-gold/5 rounded-full -mr-48 -mt-48 blur-3xl opacity-50" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-luxury-gold/5 rounded-full -ml-48 -mb-48 blur-3xl opacity-50" />
        <div className="text-center text-luxury-charcoal max-w-4xl mx-auto relative z-10">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold mb-6">
            Ready to Transform Your Space?
          </h2>
          <p className="text-luxury-charcoal/70 text-lg mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
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
              href={`https://wa.me/${COMPANY_PHONE.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(
                `Hello ${COMPANY_NAME}, I would like to request a quotation for my project.`
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
