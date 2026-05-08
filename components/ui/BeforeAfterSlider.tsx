import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Repeat } from 'lucide-react';

interface BeforeAfterSliderProps {
    before: string;
    after: string;
}

const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({ before, after }) => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!containerRef.current) return;
        
        const rect = containerRef.current.getBoundingClientRect();
        const x = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const relativeX = x - rect.left;
        const percentage = Math.max(0, Math.min(100, (relativeX / rect.width) * 100));
        
        setSliderPos(percentage);
    };

    return (
        <div 
            ref={containerRef}
            className="relative aspect-video rounded-[3rem] overflow-hidden cursor-ew-resize select-none border border-white/5 shadow-3xl"
            onMouseMove={handleMove}
            onTouchMove={handleMove}
        >
            {/* After Image (Background) */}
            <img 
                src={after} 
                alt="After" 
                className="absolute inset-0 w-full h-full object-cover"
            />
            
            {/* Before Image (Clipped Overlay) */}
            <div 
                className="absolute inset-0 w-full h-full overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
                <img 
                    src={before} 
                    alt="Before" 
                    className="absolute inset-0 w-full h-full object-cover grayscale"
                />
            </div>

            {/* Slider Handle */}
            <div 
                className="absolute inset-y-0 z-10 w-1 bg-luxury-gold shadow-[0_0_20px_rgba(200,155,91,0.5)]"
                style={{ left: `${sliderPos}%` }}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-luxury-gold rounded-full flex items-center justify-center shadow-2xl border-4 border-black group">
                    <Repeat className="text-black group-hover:rotate-180 transition-transform duration-500" size={20} />
                </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-10 left-10 z-20 px-6 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Before</span>
            </div>
            <div className="absolute bottom-10 right-10 z-20 px-6 py-2 bg-luxury-gold/80 backdrop-blur-md rounded-full border border-black/10">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-black">After</span>
            </div>
        </div>
    );
};

export default BeforeAfterSlider;
