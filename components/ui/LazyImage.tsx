import React, { useState, useEffect, useRef } from 'react';
import { imageLoadQueue } from '../../utils/imageLoadQueue';

export interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  containerClassName?: string;
  priority?: boolean;
  rootMargin?: string;
  objectFit?: 'cover' | 'contain' | 'fill';
  aspectRatio?: string;
  blurDataURL?: string;
  onLoad?: () => void;
  onError?: (e?: any) => void;
  style?: React.CSSProperties;
}

/**
 * LazyImage — High performance image component with:
 * 1. Generous IntersectionObserver rootMargin (800px) so images pre-load well before entering view
 * 2. Top-to-bottom scroll priority queue
 * 3. Off-thread image pre-decoding (zero paint jank)
 * 4. Zero layout shift (CLS) placeholder
 */
const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = '',
  containerClassName = '',
  priority = false,
  rootMargin = '800px 0px 800px 0px',
  objectFit = 'cover',
  aspectRatio,
  blurDataURL,
  onLoad,
  onError,
  style,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(priority || imageLoadQueue.isLoaded(src));
  const [isLoaded, setIsLoaded] = useState(imageLoadQueue.isLoaded(src));
  const [hasError, setHasError] = useState(false);

  // 1. Observe when user is approaching this element's position
  useEffect(() => {
    if (priority || shouldLoad) return;

    const element = containerRef.current;
    if (!element) {
      setShouldLoad(true);
      return;
    }

    // Fast initial check: if element is already within 800px on mount, load immediately!
    const rect = element.getBoundingClientRect();
    if (rect.top <= window.innerHeight + 800 && rect.bottom >= -400) {
      setShouldLoad(true);
      return;
    }

    if (typeof IntersectionObserver === 'undefined') {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      {
        rootMargin,
        threshold: 0.01,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [priority, rootMargin, shouldLoad]);

  // 2. Queue-managed download & decode once triggered
  useEffect(() => {
    if (!shouldLoad || !src) return;

    // Fast-path: already loaded in memory
    if (imageLoadQueue.isLoaded(src)) {
      setIsLoaded(true);
      if (onLoad) onLoad();
      return;
    }

    // Calculate priority: elements higher up on the screen load first
    let priorityScore = priority ? 1000 : 50;
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      // Elements closer to viewport or above get higher priority (top-to-bottom load order)
      priorityScore = priority ? 1000 : Math.max(1, 500 - Math.floor(Math.max(0, rect.top) / 10));
    }

    const { promise, cancel } = imageLoadQueue.enqueue(src, priorityScore);

    let isSubscribed = true;

    promise
      .then(() => {
        if (!isSubscribed) return;
        setIsLoaded(true);
        if (onLoad) onLoad();
      })
      .catch((err) => {
        if (!isSubscribed) return;
        setHasError(true);
        if (onError) onError(err);
      });

    return () => {
      isSubscribed = false;
      cancel();
    };
  }, [shouldLoad, src, priority, onLoad, onError]);

  // Fallback placeholder blur
  const placeholder = blurDataURL || (src?.includes('cloudinary.com')
    ? src.replace('/upload/', '/upload/w_40,q_auto:low,e_blur:1000/')
    : null);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${aspectRatio || ''} ${containerClassName}`}
      style={style}
    >
      {/* Skeleton / Placeholder (Prevents Cumulative Layout Shift) */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-stone-200/60 animate-pulse pointer-events-none z-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(235,232,226,0.6) 0%, rgba(248,245,240,0.8) 50%, rgba(235,232,226,0.6) 100%)',
            backgroundSize: '200% 100%',
          }}
        />
      )}

      {/* Low-quality blur placeholder if available */}
      {placeholder && !isLoaded && !hasError && (
        <img
          src={placeholder}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-${objectFit} blur-md scale-105 pointer-events-none transition-opacity duration-300 ${
            isLoaded ? 'opacity-0' : 'opacity-100'
          }`}
        />
      )}

      {/* Main Image with queued loading and smooth CSS transition */}
      {shouldLoad && !hasError && (
        <img
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          className={`w-full h-full object-${objectFit} transition-opacity duration-500 ease-out will-change-opacity ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          } ${className}`}
          onError={() => {
            setHasError(true);
            if (onError) onError();
          }}
        />
      )}

      {/* Error Fallback */}
      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-stone-100 text-stone-400 text-xs text-center p-2">
          <span>Image preview unavailable</span>
        </div>
      )}
    </div>
  );
};

export default React.memo(LazyImage);
