// Debounce utility for scroll events - OPTIMIZED
export const debounce = <T extends (...args: any[]) => any>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
    let timeout: NodeJS.Timeout;
    let lastArgs: Parameters<T> | null = null;

    const debouncedFunc = (...args: Parameters<T>) => {
        lastArgs = args;
        clearTimeout(timeout);
        timeout = setTimeout(() => {
            if (lastArgs) {
                func(...lastArgs);
                lastArgs = null;
            }
        }, wait);
    };

    return debouncedFunc;
};

// Throttle utility for scroll/resize events - OPTIMIZED
export const throttle = <T extends (...args: any[]) => any>(
    func: T,
    limit: number
): ((...args: Parameters<T>) => void) => {
    let inThrottle = false;
    let lastArgs: Parameters<T> | null = null;

    return (...args: Parameters<T>) => {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => {
                inThrottle = false;
                if (lastArgs) {
                    func(...lastArgs);
                    lastArgs = null;
                }
            }, limit);
        } else {
            lastArgs = args;
        }
    };
};

// Optimized RAF-based smooth scroll
export const smoothScrollTo = (target: number, duration: number = 300) => {
    const start = window.pageYOffset;
    const distance = target - start;
    const startTime = performance.now();

    const scroll = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Ease-out cubic
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        window.scrollTo(0, start + distance * easeProgress);

        if (progress < 1) {
            requestAnimationFrame(scroll);
        }
    };

    requestAnimationFrame(scroll);
};

// Request Idle Callback polyfill for non-critical tasks
export const requestIdleCallback =
    window.requestIdleCallback ||
    function (cb: IdleRequestCallback) {
        const start = Date.now();
        return setTimeout(() => {
            cb({
                didTimeout: false,
                timeRemaining: () => Math.max(0, 50 - (Date.now() - start))
            } as IdleDeadline);
        }, 1);
    };

// Cancel Idle Callback
export const cancelIdleCallback =
    window.cancelIdleCallback ||
    function (id: number) {
        clearTimeout(id);
    };
