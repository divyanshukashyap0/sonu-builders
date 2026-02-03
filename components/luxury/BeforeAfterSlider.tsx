import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BeforeAfterSliderProps {
    beforeImage: string;
    afterImage: string;
    beforeLabel?: string;
    afterLabel?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
    beforeImage,
    afterImage,
    beforeLabel = 'Before',
    afterLabel = 'After'
}) => {
    const [sliderPosition, setSliderPosition] = useState(50);
    const [isDragging, setIsDragging] = useState(false);

    const handleMove = (clientX: number, container: HTMLDivElement) => {
        const rect = container.getBoundingClientRect();
        const x = clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        setSliderPosition(Math.min(Math.max(percentage, 0), 100));
    };

    const handleMouseDown = () => setIsDragging(true);
    const handleMouseUp = () => setIsDragging(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDragging) return;
        handleMove(e.clientX, e.currentTarget);
    };

    const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
        if (e.touches.length > 0) {
            handleMove(e.touches[0].clientX, e.currentTarget);
        }
    };

    return (
        <div
            className="relative w-full h-full overflow-hidden rounded-lg select-none cursor-ew-resize"
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleMouseUp}
        >
            {/* Before Image */}
            <img
                src={beforeImage}
                alt={beforeLabel}
                className="absolute inset-0 w-full h-full object-cover"
                draggable={false}
            />

            {/* After Image with clip */}
            <div
                className="absolute inset-0 overflow-hidden"
                style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
            >
                <img
                    src={afterImage}
                    alt={afterLabel}
                    className="absolute inset-0 w-full h-full object-cover"
                    draggable={false}
                />
            </div>

            {/* Labels */}
            <div className="absolute top-4 left-4 bg-luxury-charcoal/80 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                {beforeLabel}
            </div>
            <div className="absolute top-4 right-4 bg-luxury-gold/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm font-semibold">
                {afterLabel}
            </div>

            {/* Slider Handle */}
            <div
                className="absolute top-0 bottom-0 w-1 bg-white cursor-ew-resize"
                style={{ left: `${sliderPosition}%` }}
                onMouseDown={handleMouseDown}
                onTouchStart={() => setIsDragging(true)}
            >
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-luxury flex items-center justify-center">
                    <ChevronLeft className="w-4 h-4 text-luxury-charcoal absolute left-1" />
                    <ChevronRight className="w-4 h-4 text-luxury-charcoal absolute right-1" />
                </div>
            </div>
        </div>
    );
};

export default BeforeAfterSlider;
