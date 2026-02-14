import React from 'react';
import { motion } from 'framer-motion';

interface ProjectFilterProps {
    categories: string[];
    activeCategory: string;
    onSelectCategory: (category: string) => void;
    counts?: Record<string, number>;
}

const ProjectFilter: React.FC<ProjectFilterProps> = ({
    categories,
    activeCategory,
    onSelectCategory,
    counts
}) => {
    return (
        <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    className="relative group"
                >
                    <div className={`
                        px-6 py-2 rounded-full text-xs uppercase tracking-widest font-bold transition-all duration-300 border
                        ${activeCategory === category
                            ? 'bg-luxury-gold text-white border-luxury-gold shadow-luxury transform scale-105'
                            : 'bg-white dark:bg-luxury-charcoal text-luxury-charcoal dark:text-white border-luxury-gold/20 hover:border-luxury-gold hover:text-luxury-gold'
                        }
                    `}>
                        {category}
                        {counts && counts[category] !== undefined && (
                            <span className={`ml-2 text-[10px] ${activeCategory === category ? 'text-white/90' : 'text-luxury-charcoal/60 dark:text-white/60'}`}>
                                ({counts[category]})
                            </span>
                        )}
                    </div>
                </button>
            ))}
        </div>
    );
};

export default ProjectFilter;
