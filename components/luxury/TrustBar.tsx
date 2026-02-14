import React from 'react';
import { ShieldCheck, Award, ThumbsUp, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const trustItems = [
    {
        icon: ShieldCheck,
        title: "ISO 9001:2015",
        subtitle: "Certified Quality"
    },
    {
        icon: Award,
        title: "RERA Approved",
        subtitle: "Govt. Registered"
    },
    {
        icon: ThumbsUp,
        title: "Platinum Member",
        subtitle: "Industry Recognized"
    },
    {
        icon: Clock,
        title: "15+ Years",
        subtitle: "of Excellence"
    }
];

const TrustBar: React.FC = () => {
    return (
        <div className="bg-luxury-black text-white py-12 border-t border-white/10 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-luxury-gold/5 rounded-full blur-[100px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                    {trustItems.map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                            className="flex flex-col items-center text-center group cursor-default"
                        >
                            <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 group-hover:bg-luxury-gold/10 group-hover:border-luxury-gold/30 transition-all duration-300 group-hover:scale-110 shadow-glow-gold">
                                <item.icon className="w-8 h-8 text-luxury-gold group-hover:text-white transition-colors duration-300" />
                            </div>
                            <h3 className="text-lg font-serif font-bold text-white mb-1 group-hover:text-luxury-gold transition-colors">{item.title}</h3>
                            <p className="text-xs uppercase tracking-widest text-white/50">{item.subtitle}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrustBar;
