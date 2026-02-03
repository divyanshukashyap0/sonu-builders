import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
    title?: string;
    description?: string;
    canonical?: string;
    ogImage?: string;
    ogType?: string;
    schema?: object;
}

export const SEO: React.FC<SEOProps> = ({
    title = 'Sonu Interiors & Home Design - Premium Interior Design Services',
    description = 'Transform your space with Sonu Interiors. Premium interior design, modular kitchens, wardrobes, and complete home solutions. 15+ years experience, 500+ projects.',
    canonical,
    ogImage = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
    ogType = 'website',
    schema
}) => {
    const siteUrl = window.location.origin;
    const currentUrl = canonical || window.location.href;

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            <link rel="canonical" href={currentUrl} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={currentUrl} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="Sonu Interiors & Home Design" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={currentUrl} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={ogImage} />

            {/* Structured Data */}
            {schema && (
                <script type="application/ld+json">
                    {JSON.stringify(schema)}
                </script>
            )}
        </Helmet>
    );
};

// Organization Schema
export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "name": "Sonu Interiors & Home Design",
    "image": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
    "description": "Premium interior design and home solutions with 15+ years of experience",
    "address": {
        "@type": "PostalAddress",
        "addressLocality": "Your City",
        "addressCountry": "IN"
    },
    "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "reviewCount": "150"
    },
    "priceRange": "₹₹₹",
    "telephone": "+91-XXXXXXXXXX",
    "url": window.location.origin
};

// Service Schema
export const serviceSchema = (serviceName: string, description: string) => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": serviceName,
    "provider": {
        "@type": "HomeAndConstructionBusiness",
        "name": "Sonu Interiors & Home Design"
    },
    "description": description,
    "areaServed": {
        "@type": "Country",
        "name": "India"
    }
});

// Project Schema (Review)
export const projectReviewSchema = (projectName: string, rating: number, reviewText: string) => ({
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
        "@type": "Product",
        "name": projectName
    },
    "reviewRating": {
        "@type": "Rating",
        "ratingValue": rating,
        "bestRating": "5"
    },
    "author": {
        "@type": "Person",
        "name": "Client"
    },
    "reviewBody": reviewText
});

// FAQ Schema
export const faqSchema = (questions: { question: string; answer: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": questions.map(q => ({
        "@type": "Question",
        "name": q.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": q.answer
        }
    }))
});

export default SEO;
