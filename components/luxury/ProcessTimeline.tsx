import React, { useEffect, useRef, useState } from 'react';
import { CheckCircle, ArrowRight } from 'lucide-react';

interface ProcessStep {
    number: number;
    title: string;
    description: string;
}

const steps: ProcessStep[] = [
    {
        number: 1,
        title: 'Free Consultation',
        description: 'Share your vision, budget, and timeline. We understand your needs.'
    },
    {
        number: 2,
        title: 'Design & Planning',
        description: 'Our designers create 3D visualizations and detailed plans for your approval.'
    },
    {
        number: 3,
        title: 'Material Selection',
        description: 'Choose from premium materials with transparent pricing and quality guarantee.'
    },
    {
        number: 4,
        title: 'Execution',
        description: 'Dedicated project manager ensures timely, quality execution with regular updates.'
    },
    {
        number: 5,
        title: 'Quality Check',
        description: 'Rigorous inspection and client walkthrough before final handover.'
    },
    {
        number: 6,
        title: 'Handover',
        description: 'Move into your dream space with warranty and post-handover support.'
    }
];

export const ProcessTimeline: React.FC = () => {
    const [activeStep, setActiveStep] = useState(0);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const index = parseInt(entry.target.getAttribute('data-step') || '0');
                        setActiveStep(index);
                    }
                });
            },
            { threshold: 0.5 }
        );

        const stepElements = containerRef.current?.querySelectorAll('.process-step');
        stepElements?.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section className="bg-white py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-luxury-gold font-semibold uppercase tracking-wider mb-2 text-sm">
                        How We Work
                    </p>
                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif font-bold text-luxury-charcoal">
                        Our Seamless Process
                    </h2>
                </div>

                <div ref={containerRef} className="relative">
                    {/* Progress Line */}
                    <div className="hidden lg:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-luxury-gold/10 -translate-x-1/2">
                        <div
                            className="absolute top-0 left-0 w-full bg-luxury-gold transition-all duration-500 shadow-[0_0_10px_rgba(212,175,55,0.3)]"
                            style={{ height: `${(activeStep / (steps.length - 1)) * 100}%` }}
                        />
                    </div>

                    {/* Steps */}
                    <div className="space-y-12 lg:space-y-20">
                        {steps.map((step, index) => (
                            <div
                                key={index}
                                data-step={index}
                                className={`process-step flex flex-col lg:flex-row items-center gap-8 ${index % 2 === 0 ? 'lg:flex-row-reverse' : ''
                                    }`}
                            >
                                {/* Content */}
                                <div className="flex-1 text-center lg:text-left">
                                    <div className={`${index % 2 === 0 ? 'lg:text-right' : ''}`}>
                                        <h3 className="text-2xl font-serif font-bold text-luxury-charcoal mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed max-w-md mx-auto lg:mx-0">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>

                                {/* Number Circle */}
                                <div className="relative z-10 flex-shrink-0">
                                    <div
                                        className={`w-20 h-20 rounded-full flex items-center justify-center font-serif font-bold text-2xl transition-all duration-500 ${activeStep >= index
                                            ? 'bg-luxury-gold text-white scale-110 shadow-luxury'
                                            : 'bg-gray-100 text-gray-400'
                                            }`}
                                    >
                                        {activeStep > index ? (
                                            <CheckCircle className="w-10 h-10" />
                                        ) : (
                                            step.number
                                        )}
                                    </div>
                                </div>

                                {/* Spacer for alignment */}
                                <div className="flex-1 hidden lg:block" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default ProcessTimeline;
