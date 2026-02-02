import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, Star } from 'lucide-react';
import Section from '../components/Section';
import Button from '../components/Button';
import { SERVICES, COMPANY_PHONE, COMPANY_NAME } from '../constants';
import { useProjects } from '../hooks/useProjects';
import { useTestimonials } from '../hooks/useTestimonials';
import { useImages } from '../hooks/useImages';

const Home: React.FC = () => {
  const { projects } = useProjects();
  const { testimonials } = useTestimonials();
  const { images } = useImages();

  return (
    <>
      {/* Hero Section */}
      <div className="relative h-screen min-h-[600px] flex items-center">
        {/* Background Image with Overlay */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url("${images.homeHero}")` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-brand-dark/90 to-brand-dark/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold leading-tight mb-6">
              Building Trust. <br />
              <span className="text-brand-gold">Creating Landmarks.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-200 mb-8 leading-relaxed">
              Delivering quality construction and reliable real-estate solutions with integrity and expertise. We turn your vision into concrete reality.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button to="/projects" variant="primary">View Our Projects</Button>
              <Button to="/contact" variant="secondary" className="shadow-xl">Contact Us</Button>
            </div>

            <div className="mt-12 flex items-center space-x-8 text-sm font-medium text-slate-300">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-brand-gold mr-2" />
                Quality Construction
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-brand-gold mr-2" />
                Transparent Process
              </div>
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-brand-gold mr-2" />
                On-Time Delivery
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Brief About */}
      <Section className="!bg-brand-gold/10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <img
              src={images.aboutBanner}
              alt="Construction site"
              className="rounded-lg shadow-xl"
              loading="lazy"
              decoding="async"
            />
            <div className="absolute -bottom-6 -right-6 bg-brand-blue text-white p-8 rounded-lg shadow-lg hidden md:block">
              <p className="text-4xl font-bold font-serif mb-1">15+</p>
              <p className="text-sm uppercase tracking-wide">Years of Experience</p>
            </div>
          </div>
          <div>
            <h2 className="text-brand-gold font-semibold uppercase tracking-wider mb-2 text-sm">Who We Are</h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark mb-6">Building Dreams with Precision & Passion</h3>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Sonu Enterprises & Building Developers is a trusted name in the construction and real-estate industry. We specialize in delivering high-quality residential and commercial projects that stand the test of time.
            </p>
            <p className="text-slate-600 mb-8 leading-relaxed">
              From concept to completion, our team of expert engineers, architects, and workers ensures every detail is perfect. We value your trust and strive to exceed expectations.
            </p>
            <Button to="/about" variant="secondary">Read More About Us</Button>
          </div>
        </div>
      </Section>

      {/* Services Preview */}
      <Section className="!bg-brand-blue/10">
        <div className="text-center mb-16">
          <h2 className="text-brand-gold font-semibold uppercase tracking-wider mb-2 text-sm">Our Expertise</h2>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">Comprehensive Construction Services</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SERVICES.slice(0, 3).map((service) => (
            <div key={service.id} className="bg-brand-blue/10 p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow group border border-transparent hover:border-brand-gold/40">
              <div className="w-14 h-14 bg-brand-gold/10 rounded-full flex items-center justify-center mb-6 group-hover:bg-brand-blue transition-colors">
                <service.icon className="w-7 h-7 text-brand-blue group-hover:text-white transition-colors" />
              </div>
              <h4 className="text-xl font-bold text-brand-dark mb-3">{service.title}</h4>
              <p className="text-slate-600 mb-6">{service.description}</p>
              <Link to="/services" className="text-brand-blue font-medium inline-flex items-center hover:underline">
                Learn More <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
          ))}
        </div>
        <div className="text-center mt-12">
          <Button to="/services" variant="outline">View All Services</Button>
        </div>
      </Section>

      {/* Featured Projects */}
      <Section className="!bg-brand-blue/10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-brand-gold font-semibold uppercase tracking-wider mb-2 text-sm">Portfolio</h2>
            <h3 className="text-3xl md:text-4xl font-serif font-bold text-brand-dark">Latest Projects</h3>
          </div>
          <Link to="/projects" className="hidden md:flex text-brand-blue font-medium items-center hover:underline">
            View All Projects <ArrowRight className="w-4 h-4 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.slice(0, 3).map((project) => (
            <div key={project.id} className="group relative overflow-hidden rounded-lg shadow-lg border border-transparent hover:border-brand-gold/40">
              <div className="aspect-w-4 aspect-h-3">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-64 object-cover transform group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                  decoding="async"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-90 transition-opacity">
                <div className="absolute bottom-0 left-0 p-6">
                  <span className="inline-block px-3 py-1 bg-brand-gold text-white text-xs font-semibold rounded-full mb-2">
                    {project.category}
                  </span>
                  <h4 className="text-xl font-bold text-white mb-1">{project.title}</h4>
                  <p className="text-slate-300 text-sm flex items-center">
                    <span className="mr-1">📍</span> {project.location}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center md:hidden">
          <Button to="/projects" variant="outline" fullWidth>View All Projects</Button>
        </div>
      </Section>

      {/* Testimonials */}
      <Section className="!bg-brand-dark">
        <div className="text-center mb-16">
          <h2 className="text-brand-gold font-semibold uppercase tracking-wider mb-2 text-sm">Testimonials</h2>
          <h3 className="text-3xl md:text-4xl font-serif font-bold text-white">What Our Clients Say</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-brand-blue/15 backdrop-blur-sm p-8 rounded-lg border border-brand-gold/20">
              <div className="flex mb-4 text-brand-gold">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 mb-6 italic">"{testimonial.content}"</p>
              <div>
                <p className="text-white font-bold">{testimonial.name}</p>
                <p className="text-brand-gold text-sm">{testimonial.role}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* CTA Section */}
      <Section className="bg-gradient-to-r from-brand-blue to-brand-gold">
        <div className="text-center text-white">
          <h2 className="text-3xl md:text-4xl font-serif font-bold mb-6">Ready to Build Your Dream Project?</h2>
          <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto">
            Contact us today for a free consultation. Let's discuss how we can bring your vision to life.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button to="/contact" variant="white">Get a Quote</Button>
            <a
              href={`https://wa.me/${COMPANY_PHONE.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello ${COMPANY_NAME}, I would like to request a quotation for my project.`)}`}
              className="inline-flex items-center justify-center px-6 py-3 border border-white text-base font-medium rounded-md text-white hover:bg-white/10 transition-colors"
            >
              WhatsApp Us
            </a>
          </div>
        </div>
      </Section>
    </>
  );
};

export default Home;
