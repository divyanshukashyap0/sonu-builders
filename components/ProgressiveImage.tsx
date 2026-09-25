import React from 'react';
import LazyImage from './ui/LazyImage';

interface ProgressiveImageProps {
    src: string;
    alt: string;
    className?: string;
    blurDataURL?: string;
    priority?: boolean;
    aspectRatio?: string;
}

/**
 * Progressive Image Component
 * Powered by queued lazy loading and off-screen decoding
 */
const ProgressiveImage: React.FC<ProgressiveImageProps> = ({
    src,
    alt,
    className = '',
    blurDataURL,
    priority = false,
    aspectRatio
}) => {
    return (
        <LazyImage
            src={src}
            alt={alt}
            className={className}
            containerClassName={className}
            blurDataURL={blurDataURL}
            priority={priority}
            aspectRatio={aspectRatio}
        />
    );
};

export default React.memo(ProgressiveImage);
