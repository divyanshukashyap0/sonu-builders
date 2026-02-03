import React from 'react';
import { AnimatedCounter } from './AnimatedCounter';
import { Award, Building2, Users, MapPin } from 'lucide-react';

export const TrustMetrics: React.FC = () => {
    const metrics = [
        {
            value: 15,
            suffix: '+',
            label: 'Years of Excellence',
            icon: Award,
            color: 'text-luxury-gold'
        },
        {
            value: 500,
            suffix: '+',
            label: 'Projects Completed',
            icon: Building2,
            color: 'text-luxury-gold'
        },
        {
            value: 1000,
            suffix: '+',
            label: 'Happy Families',
            icon: Users,
            color: 'text-luxury-gold'
        },
        {
            value: 5,
            suffix: '',
            label: 'Cities Served',
            icon: MapPin,
            color: 'text-luxury-gold'
        }
    ];

    return (
        <section className="bg-luxury-white py-16 sm:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Trust Metrics Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12">
                    {metrics.map((metric, index) => {
                        const Icon = metric.icon;
                        return (
                            <div
                                key={index}
                                className="text-center group reveal"
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                {/* Icon */}
                                <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-luxury-beige mb-4 group-hover:bg-luxury-gold/10 transition-all duration-300">
                                    <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${metric.color}`} />
                                </div>

                                {/* Counter */}
                                <div className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-luxury-charcoal mb-2">
                                    <AnimatedCounter
                                        end={metric.value}
                                        suffix={metric.suffix}
                                        duration={2500}
                                    />
                                </div>

                                {/* Label */}
                                <p className="text-sm sm:text-base text-gray-600 font-medium">
                                    {metric.label}
                                </p>
                            </div>
                        );
                    })}
                </div>

                {/* Certifications (Optional) */}
                <div className="mt-16 pt-12 border-t border-gray-200">
                    <div className="text-center mb-8">
                        <p className="text-sm uppercase tracking-wider text-gray-500 font-semibold">
                            Trusted & Certified
                        </p>
                    </div>
                    <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-12 opacity-60">
                        <div className="text-gray-400 text-sm font-medium">ISO 9001:2015 Certified</div>
                        <div className="text-gray-400 text-sm font-medium">RERA Approved</div>
                        <div className="text-gray-400 text-sm font-medium">Industry Member</div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default TrustMetrics;
