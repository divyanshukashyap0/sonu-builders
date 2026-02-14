import React from 'react';
import { motion } from 'framer-motion';

const timelineData = [
    {
        year: "2010",
        title: "The Beginning",
        description: "Founded with a vision to revolutionize residential interiors in Mumbai."
    },
    {
        year: "2015",
        title: "50+ Projects Completed",
        description: "Expanded team to 20+ craftsmen and designers. Established local workshop."
    },
    {
        year: "2018",
        title: "Commercial Expansion",
        description: "Started taking on large-scale office and retail projects across Maharashtra."
    },
    {
        year: "2020",
        title: "100+ Happy Families",
        description: "Despite global challenges, we delivered record number of homes with safety first."
    },
    {
        year: "2024",
        title: "Industry Leaders",
        description: "Recognized as a top-tier turnkey solution provider with ISO & RERA certifications."
    }
];

const Timeline: React.FC = () => {
    return (
        <div className="relative pt-12 pb-20">
            {/* Center Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-[2px] bg-luxury-gold/20 top-0 hidden md:block" />

            <div className="space-y-12 md:space-y-24 relative z-10">
                {timelineData.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.6, delay: index * 0.1 }}
                        className={`flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''} gap-8 md:gap-16`}
                    >
                        {/* Content Side */}
                        <div className="flex-1 text-center md:text-left">
                            <div className={`${index % 2 === 0 ? 'md:text-left' : 'md:text-right'}`}>
                                <span className="inline-block text-5xl md:text-7xl font-serif font-bold text-luxury-gold/20 mb-2">
                                    {item.year}
                                </span>
                                <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                                <p className="text-white/80 leading-relaxed max-w-md mx-auto md:mx-0 ml-auto">
                                    {item.description}
                                </p>
                            </div>
                        </div>

                        {/* Center Dot */}
                        <div className="w-6 h-6 rounded-full bg-luxury-gold border-4 border-white shadow-lg z-10 shrink-0" />

                        {/* Empty Side for Balance */}
                        <div className="flex-1 hidden md:block" />
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

export default Timeline;
