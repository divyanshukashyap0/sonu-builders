import React from 'react';
import Section from '../components/Section';
import { Target, Eye, Award } from 'lucide-react';

const About: React.FC = () => {
  return (
    <div className="pt-16">
      {/* Page Header */}
      <div className="bg-brand-dark py-20 text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-white mb-4">About Us</h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto px-4">
          Committed to excellence, integrity, and innovation in every structure we build.
        </p>
      </div>

      {/* Main Content */}
      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-serif font-bold text-brand-dark mb-6">Building Strong Foundations Since 2008</h2>
            <p className="text-slate-600 mb-6 leading-relaxed">
              Sonu Enterprises & Building Developers is a trusted name in the construction and real-estate industry, known for delivering high-quality residential and commercial projects.
            </p>
            <p className="text-slate-600 mb-6 leading-relaxed">
              With a strong commitment to quality, transparency, and customer satisfaction, we transform ideas into strong, lasting structures. Our experienced team ensures every project meets the highest standards of safety, design, and durability.
            </p>
            <p className="text-slate-600 leading-relaxed">
              We take pride in our ability to understand our clients' needs and translate them into reality, whether it's a dream home or a cutting-edge commercial space.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img
              src="https://images.unsplash.com/photo-1590644365607-1c5a38fc9270?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Team discussing plans"
              className="rounded-lg shadow-lg w-full h-64 object-cover mt-8"
              loading="lazy"
              decoding="async"
            />
            <img
              src="https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80"
              alt="Construction work"
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
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-8 h-8 text-brand-blue" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-4">Our Mission</h3>
            <p className="text-slate-600">
              To deliver reliable, innovative, and high-quality construction solutions while building long-term relationships with our clients based on trust and performance.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
              <Eye className="w-8 h-8 text-brand-green" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-4">Our Vision</h3>
            <p className="text-slate-600">
              To be the leading construction and real estate development company recognized for sustainable practices, iconic structures, and customer-centric approach.
            </p>
          </div>

          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="w-16 h-16 bg-brand-light rounded-full flex items-center justify-center mx-auto mb-6">
              <Award className="w-8 h-8 text-brand-gold" />
            </div>
            <h3 className="text-xl font-bold text-brand-dark mb-4">Core Values</h3>
            <p className="text-slate-600">
              Quality, Transparency, Safety, and Timely Delivery. We believe in ethical business practices and continuous improvement in our methodologies.
            </p>
          </div>
        </div>
      </Section>
    </div>
  );
};

export default About;
