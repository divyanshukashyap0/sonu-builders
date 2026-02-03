// Performance monitoring utility
export const reportWebVitals = (onPerfEntry?: (metric: any) => void) => {
    if (onPerfEntry && typeof onPerfEntry === 'function') {
        import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
            getCLS(onPerfEntry);
            getFID(onPerfEntry);
            getFCP(onPerfEntry);
            getLCP(onPerfEntry);
            getTTFB(onPerfEntry);
        }).catch(() => {
            // web-vitals not available, ignore
        });
    }
};

// Preload critical resources
export const preloadCriticalAssets = () => {
    const criticalImages = [
        // Add your critical images here
    ];

    criticalImages.forEach((src) => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
};

// Debounce utility for scroll events
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    return (...args: Parameters<T>) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
    };
};

// Throttle utility for resize events
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle: boolean;
    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// Check if device is mobile
export const isMobile = (): boolean => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
        navigator.userAgent
    );
};

// Check if device supports touch
export const isTouchDevice = (): boolean => {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
};

// Optimize images for retina displays
export const getOptimizedImageUrl = (url: string, width?: number): string => {
    if (!url) return '';

    // For Unsplash images, add optimization parameters
    if (url.includes('unsplash.com')) {
        const params = new URLSearchParams();
        if (width) params.set('w', width.toString());
        params.set('q', '80');
        params.set('fm', 'webp');
        params.set('auto', 'format');

        return `${url}?${params.toString()}`;
    }

    return url;
};

// Prefetch next page
export const prefetchPage = (href: string) => {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = href;
    document.head.appendChild(link);
};

// Service Worker registration helper
export const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('/sw.js');
            console.log('Service Worker registered:', registration);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
};
