import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, Clock, DollarSign } from 'lucide-react';
import PageHero from '../components/luxury/PageHero';
import Section from '../components/Section';
import Button from '../components/Button';
import { useServices } from '../hooks/useServices';
import SEO from '../components/SEO';
import { SERVICES } from '../constants';
import * as Icons from 'lucide-react';

const ServiceDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { services, loading } = useServices();

    // Find service from Firestore first, then fallback to constants
    const serviceFromHook = services.find(s => s.id === id);
    const serviceFromConstants = SERVICES.find(s => s.id === id);
    const service = serviceFromHook || serviceFromConstants;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="w-12 h-12 border-4 border-luxury-gold/30 border-t-luxury-gold rounded-full animate-spin"></div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-ivory-pearl">
                <h2 className="text-2xl font-serif text-luxury-charcoal mb-4">Service Not Found</h2>
                <Link to="/services" className="text-luxury-gold hover:underline">Return to Services</Link>
            </div>
        );
    }

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
                backgroundImage={service.image || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1600&q=80"}
            />

            <Section>
                <Link to="/services" className="inline-flex items-center text-luxury-gold mb-8 hover:translate-x-[-4px] transition-transform font-bold uppercase tracking-widest text-xs">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-luxury-charcoal mb-6">Service Overview</h2>
                        <div className="text-lg text-luxury-charcoal/80 leading-relaxed mb-8 space-y-4">
                            <p className="font-medium">{service.longDescription || service.description}</p>
                            <p>At Sonu Enterprises, we bring over 15 years of expertise to ensure {service.title} meets the highest standards of luxury and functionality.</p>
                        </div>

                        {service.features && service.features.length > 0 && (
                            <div className="bg-white p-8 rounded-xl shadow-luxury border border-luxury-gold/10">
                                <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-2">
                                    <Icons.Award className="w-6 h-6 text-luxury-gold" />
                                    Key Service Features
                                </h3>
                                <ul className="space-y-4">
                                    {service.features.map((feature, idx) => (
                                        <li key={idx} className="flex items-start">
                                            <CheckCircle className="w-5 h-5 text-luxury-gold mt-1 mr-3 shrink-0" />
                                            <span className="text-luxury-charcoal/70 font-medium">{feature}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    <div className="space-y-8">
                        {/* Static images replaced by dynamic suggestions if available */}
                        {service.suggestions && service.suggestions.length > 0 && (
                            <div className="bg-luxury-gold/5 p-8 rounded-xl border border-luxury-gold/20">
                                <h3 className="font-serif font-bold text-xl mb-6 flex items-center gap-2">
                                    <Icons.Lightbulb className="w-6 h-6 text-luxury-gold" />
                                    Expert Design Suggestions
                                </h3>
                                <div className="space-y-6">
                                    {service.suggestions.map((sugg, idx) => (
                                        <div key={idx} className="flex gap-4">
                                            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm">
                                                <span className="text-luxury-gold font-bold text-xs">{idx + 1}</span>
                                            </div>
                                            <p className="text-luxury-charcoal/80 text-sm font-medium leading-relaxed italic">
                                                "{sugg}"
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        <div className="bg-premium-stone p-8 rounded-xl border border-luxury-gold/10 shadow-lg">
                            <div className="flex items-center mb-4">
                                <Clock className="w-5 h-5 text-luxury-gold mr-3" />
                                <span className="font-bold text-luxury-charcoal">Estimated Timeline: 4-8 Weeks</span>
                            </div>
                            <div className="flex items-center mb-6">
                                <DollarSign className="w-5 h-5 text-luxury-gold mr-3" />
                                <span className="font-bold text-luxury-charcoal">Starting from ₹1,500/sq.ft</span>
                            </div>
                            <Button to="/contact" className="w-full justify-center shadow-glow-gold">Request Personalized Quote</Button>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Service Gallery */}
            {service.gallery && service.gallery.length > 0 && (
                <Section colored>
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-serif font-bold text-luxury-charcoal mb-4">Design Inspiration</h2>
                        <p className="text-luxury-charcoal/60 uppercase tracking-widest text-xs font-bold">A glimpse into our {service.title} accomplishments</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {service.gallery.map((img, idx) => (
                            <motion.div
                                key={idx}
                                whileHover={{ y: -10 }}
                                className="aspect-[4/5] rounded-xl overflow-hidden shadow-luxury border border-white/20"
                            >
                                <img src={img} alt={`${service.title} inspiration ${idx + 1}`} className="w-full h-full object-cover" />
                            </motion.div>
                        ))}
                    </div>
                </Section>
            )}
        </div>
    );
};

export default ServiceDetail;
