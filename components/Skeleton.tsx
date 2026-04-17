import React from 'react';

/**
 * Shimmer backdrop animation
 */
export const Shimmer = () => (
    <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.03] to-transparent animate-shimmer" />
);

/**
 * Base Skeleton component
 */
export const Skeleton = ({ className }: { className: string }) => (
    <div className={`relative overflow-hidden bg-white/[0.03] rounded-sm ${className}`}>
        <Shimmer />
    </div>
);

/**
 * Skeleton for Service Cards on Home and Services pages
 */
export const ServiceCardSkeleton = () => (
    <div className="h-[500px] bg-luxury-charcoal/50 p-10 flex flex-col justify-end space-y-6 border border-white/5">
        <Skeleton className="w-16 h-16 rounded-sm opacity-20" />
        <div className="space-y-3">
            <Skeleton className="w-3/4 h-8" />
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-2/3 h-4" />
        </div>
        <Skeleton className="w-1/3 h-4 mt-4" />
    </div>
);

/**
 * Skeleton for Project/Portfolio Cards
 */
export const ProjectCardSkeleton = () => (
    <div className="aspect-[4/5] bg-luxury-charcoal/50 relative border border-white/5">
        <Skeleton className="w-full h-full" />
        <div className="absolute inset-x-10 bottom-10 space-y-3">
            <Skeleton className="w-1/4 h-3 opacity-30" />
            <Skeleton className="w-3/4 h-7" />
            <Skeleton className="w-1/2 h-3 opacity-30" />
        </div>
    </div>
);

/**
 * Skeleton for Testimonials or Text blocks
 */
export const TextSkeleton = ({ lines = 3 }: { lines?: number }) => (
    <div className="space-y-3 w-full">
        {[...Array(lines)].map((_, i) => (
            <Skeleton key={i} className={`h-4 ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} />
        ))}
    </div>
);
