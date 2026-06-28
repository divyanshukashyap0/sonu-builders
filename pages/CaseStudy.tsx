import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, MapPin, DollarSign, CheckCircle, Ruler } from 'lucide-react';
import Section from '../components/Section';
import Button from '../components/Button';
import SEO from '../components/SEO';
import MediaRenderer from '../components/ui/MediaRenderer';
import { getOptimizedImageUrl } from '../utils/performance';

// Mock Data for a single case study (In real app, fetch based on ID)
const caseStudyData = {
    id: 'luxury-penthouse-thane',
    title: 'Luxury Penthouse in Thane West',
    category: 'Luxury Interiors',
    location: 'Thane West',
    duration: '12 months',
    budget: '25 Lakhs',
    area: '1200 sqft',
    heroImage: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2070',
    challenge: "The client wanted to transform a standard layout 3BHK into a spacious, ultra-luxury penthouse feeling home. The challenge was low ceiling height and lack of natural light in the dining area.",
    solution: "We used reflective surfaces, Italian marble flooring, and smart false ceiling designs with cove lighting to create an illusion of height. We also opened up the kitchen to the dining area to increase light flow.",
    results: [
        "40% more perceived space",
        "Zero compromises on material quality",
        "Delivered 2 weeks ahead of schedule",
        "Client rated 5/5 stars"
    ],
    timeline: [
        { phase: "Design & Planning", duration: "Weeks 1-2" },
        { phase: "Material Selection", duration: "Weeks 3-5" },
        { phase: "Execution (Civil/Carpentry)", duration: "Weeks 6-10" },
        { phase: "Finishing & Handover", duration: "Weeks 11-12" }
    ],
    materials: [
        { name: "Italian Marble", image: "https://images.unsplash.com/photo-1615873968403-89e068629265?w=150&q=80" },
        { name: "German Hardware (Blum)", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=150&q=80" },
        { name: "Premium Veneer", image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=150&q=80" }
    ],
    images: [
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1200",
        "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?q=80&w=1200",
        "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?q=80&w=1200"
    ]
};

const CaseStudy: React.FC = () => {
    // const { id } = useParams(); // In real app, use ID to fetch data
    const data = caseStudyData;

    return (
        <div className="pt-20">
            <SEO
                title={data.title}
                description={data.challenge}
                canonical={`https://sonu-builders.in/case-study/${data.id}`}
                ogImage={data.heroImage}
                ogType="article"
            />
            {/* Hero */}
            <div className="relative h-[60vh] md:h-[80vh] w-full overflow-hidden">
                <MediaRenderer
                    src={data.heroImage}
                    alt={data.title}
                    className="absolute inset-0 w-full h-full object-cover"
                    loading="eager"
                    width={1200}
                />
                <div className="absolute inset-0 bg-black/50" />
                <div className="absolute inset-0 flex items-center justify-center text-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="text-luxury-gold uppercase tracking-[0.3em] font-bold text-sm mb-4 block">
                            {data.category}
                        </span>
                        <h1 className="text-4xl md:text-6xl font-serif font-bold text-white mb-6">
                            {data.title}
                        </h1>
                        <div className="flex flex-wrap justify-center gap-6 text-white/80 text-sm uppercase tracking-widest">
                            <span className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-luxury-gold" /> {data.location}</span>
                            <span className="flex items-center"><Calendar className="w-4 h-4 mr-2 text-luxury-gold" /> {data.duration}</span>
                            <span className="flex items-center"><Ruler className="w-4 h-4 mr-2 text-luxury-gold" /> {data.area}</span>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Overview */}
            <Section className="bg-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-luxury-charcoal mb-6">Project Overview</h2>
                        <div className="mb-8">
                            <h3 className="text-lg font-bold text-luxury-gold mb-2">The Challenge</h3>
                            <p className="text-luxury-charcoal/70 leading-relaxed">{data.challenge}</p>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-luxury-gold mb-2">Our Solution</h3>
                            <p className="text-luxury-charcoal/70 leading-relaxed">{data.solution}</p>
                        </div>
                    </div>

                    <div className="bg-luxury-obsidian/5 p-8 rounded-lg border border-luxury-gold/10">
                        <h3 className="text-xl font-bold text-luxury-charcoal mb-6">Key Results</h3>
                        <ul className="space-y-4">
                            {data.results.map((result, idx) => (
                                <li key={idx} className="flex items-start">
                                    <CheckCircle className="w-6 h-6 text-primary-green mr-3 flex-shrink-0" />
                                    <span className="text-luxury-charcoal/80 font-medium">{result}</span>
                                </li>
                            ))}
                        </ul>
                        <div className="mt-8 pt-8 border-t border-luxury-charcoal/10 flex justify-between items-center">
                            <div>
                                <p className="text-xs uppercase tracking-widest text-luxury-charcoal/50">Budget</p>
                                <p className="text-2xl font-bold text-luxury-gold">{data.budget}</p>
                            </div>
                            <Button to="/contact" variant="primary" className="text-sm px-6">
                                Get Similar Quote
                            </Button>
                        </div>
                    </div>
                </div>
            </Section>

            {/* Gallery */}
            <Section className="bg-luxury-white">
                <h2 className="text-3xl font-serif font-bold text-luxury-charcoal text-center mb-12">Project Gallery</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.images.map((img, idx) => (
                        <motion.div
                            key={idx}
                            whileHover={{ y: -10 }}
                            className="bg-white p-2 shadow-lg"
                        >
                            <MediaRenderer 
                                src={getOptimizedImageUrl(img, 800)} 
                                alt={`Gallery ${idx + 1}`} 
                                className="w-full h-64 object-cover" 
                                showPlayIcon
                            />
                        </motion.div>
                    ))}
                </div>
            </Section>

            {/* Timeline & Materials */}
            <Section className="bg-luxury-charcoal text-white">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                    <div>
                        <h3 className="text-2xl font-serif font-bold text-luxury-gold mb-8">Project Timeline</h3>
                        <div className="space-y-6">
                            {data.timeline.map((item, idx) => (
                                <div key={idx} className="flex items-center">
                                    <div className="w-24 text-sm text-white/50 font-mono">{item.duration}</div>
                                    <div className="w-1 h-12 bg-luxury-gold/30 mx-4 relative">
                                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-luxury-gold rounded-full" />
                                    </div>
                                    <div className="font-bold text-lg">{item.phase}</div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="text-2xl font-serif font-bold text-luxury-gold mb-8">Premium Materials Used</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            {data.materials.map((mat, idx) => (
                                <div key={idx} className="flex items-center bg-white/5 p-4 rounded-lg border border-white/10">
                                    <img src={getOptimizedImageUrl(mat.image, 100)} alt={mat.name} className="w-12 h-12 rounded-full object-cover mr-4" />
                                    <span className="font-medium">{mat.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </Section>

            {/* CTA */}
            <div className="py-20 text-center">
                <h2 className="text-3xl font-serif font-bold text-luxury-charcoal mb-6">Inspired by this project?</h2>
                <Button to="/contact" variant="primary" className="bg-luxury-gold text-white px-10 py-4 text-lg">
                    Start Your Transformation
                </Button>
            </div>
        </div>
    );
};

export default CaseStudy;
