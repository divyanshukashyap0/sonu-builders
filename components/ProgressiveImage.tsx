import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ProgressiveImageProps {
    src: string;
    alt: string;
    className?: string;
    blurDataURL?: string;
    priority?: boolean;
}

/**
 * Progressive Image Component with Blur-Up Effect
 * Loads low-quality placeholder first, then high-quality image
 * Perfect for slow internet connections
 */
const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
    src,
    alt,
    className = '',
    blurDataURL,
    priority = false
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(false);

    // Generate blurDataURL from Cloudinary if not provided
    const getBlurPlaceholder = (url: string) => {
        if (blurDataURL) return blurDataURL;

        // If it's a Cloudinary URL, generate tiny blur version
        if (url.includes('cloudinary.com')) {
            return url.replace('/upload/', '/upload/w_20,q_auto:low,e_blur:1000/');
        }

        return '';
    };

    const placeholder = getBlurPlaceholder(src);

    if (error) {
        return (
            <div className={`bg-gradient-to-br from-luxury-charcoal to-luxury-obsidian flex items-center justify-center ${className}`}>
                <span className="text-neutral-600 text-sm">Image unavailable</span>
            </div>
        );
    }

    return (
        <div className={`relative overflow-hidden ${className}`}>
            {/* Low-quality placeholder */}
            {placeholder && !isLoaded && (
                <motion.img
                    src={placeholder}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover scale-110 blur-xl"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: isLoaded ? 0 : 1 }}
                    transition={{ duration: 0.3 }}
                />
            )}

            {/* High-quality image */}
            <motion.img
                src={src}
                alt={alt}
                className="absolute inset-0 w-full h-full object-cover"
                loading={priority ? 'eager' : 'lazy'}
                fetchpriority={priority ? 'high' : 'auto'}
                decoding="async"
                onLoad={() => setIsLoaded(true)}
                onError={() => setError(true)}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.5 }}
            />

            {/* Loading skeleton */}
            {!isLoaded && !placeholder && (
                <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800 animate-pulse" />
            )}
        </div>
    );
};

export default ProgressiveImage;
