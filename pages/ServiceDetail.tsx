import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Clock, DollarSign, Calendar } from 'lucide-react';
import PageHero from '../components/luxury/PageHero';
import Section from '../components/Section';
import Button from '../components/Button';
import SEO from '../components/SEO';
import { SERVICES } from '../constants';
import * as Icons from 'lucide-react';

const ServiceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const service = SERVICES.find(s => s.id === id);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (!service) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-ivory-pearl">
                <h2 className="text-2xl font-serif text-luxury-charcoal mb-4">Service Not Found</h2>
                <Link to="/services" className="text-luxury-gold hover:underline">Return to Services</Link>
            </div>
        );
    }

    const getIcon = (iconName: string) => {
        const IconComponent = (Icons as any)[iconName] || Icons.Home;
        return <IconComponent className="w-12 h-12 text-luxury-gold mb-4" />;
    };

    return (
        <div>
            <SEO
                title={`${service.title} - Luxury Services`}
                description={service.description}
                canonical={`https://sonuenterprises.com/services/${id}`}
            />

            <PageHero
                title={service.title}
                subtitle="Excellence in every detail"
                backgroundImage="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80"
            />

            <Section>
                <Link to="/services" className="inline-flex items-center text-luxury-gold mb-8 hover:translate-x-[-4px] transition-transform">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-luxury-charcoal mb-6">Service Overview</h2>
                        <p className="text-lg text-luxury-charcoal/80 leading-relaxed mb-8">
                            {service.description}. At Sonu Enterprises, we bring over 15 years of expertise to ensure {service.title} meets the highest standards of luxury and functionality.
                        </p>

                        <div className="bg-white p-8 rounded-xl shadow-luxury border border-luxury-gold/10">
                            <h3 className="font-serif font-bold text-xl mb-4">Why Choose Us?</h3>
                            <ul className="space-y-4">
                                {[1, 2, 3, 4].map((item) => (
                                    <li key={item} className="flex items-start">
                                        <CheckCircle className="w-5 h-5 text-luxury-gold mt-1 mr-3 shrink-0" />
                                        <span className="text-luxury-charcoal/70">Premium quality materials and finishes guaranteed.</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="space-y-8">
                        <div className="grid grid-cols-2 gap-4">
                            <img
                                src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800&q=80"
                                alt="Detail 1"
                                className="rounded-lg shadow-md w-full h-48 object-cover"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800&q=80"
                                alt="Detail 2"
                                className="rounded-lg shadow-md w-full h-48 object-cover mt-8"
                            />
                        </div>

                        <div className="bg-premium-stone/30 p-8 rounded-xl border border-luxury-gold/5">
                            <div className="flex items-center mb-4">
                                <Clock className="w-5 h-5 text-luxury-gold mr-3" />
                                <span className="font-bold text-luxury-charcoal">Timeline: 4-8 Weeks</span>
                            </div>
                            <div className="flex items-center mb-6">
                                <DollarSign className="w-5 h-5 text-luxury-gold mr-3" />
                                <span className="font-bold text-luxury-charcoal">Starting from ₹1,500/sq.ft</span>
                            </div>
                            <Button to="/contact" className="w-full justify-center">Get a Quote</Button>
                        </div>
                    </div>
                </div>
            </Section>
        </div>
    );
};

export default ServiceDetail;
