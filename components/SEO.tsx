import React from 'react';
import { Helmet } from 'react-helmet-async';
import { COMPANY_NAME, COMPANY_PHONE, COMPANY_ADDRESS, COMPANY_EMAIL, CANONICAL_DOMAIN } from '../constants';

interface SEOProps {
    title?: string;
    description?: string;
    canonical?: string;
    ogImage?: string;
    ogType?: string;
    keywords?: string;
    schema?: object | object[];
    geoRegion?: string;
    geoPlacename?: string;
    geoPosition?: string;
}

export const SEO: React.FC<SEOProps> = ({
    title = `${COMPANY_NAME} | Interior Construction & Design`,
    description = `Transform your space with ${COMPANY_NAME}. Premium interior design, modular kitchens, wardrobes, and complete turnkey home solutions across Mumbai, Thane, and Kalyan-Dombivli. 15+ years experience.`,
    canonical,
    ogImage = 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80',
    ogType = 'website',
    keywords,
    schema,
    geoRegion = 'IN-MH',
    geoPlacename = 'Mumbai, Kalyan-Dombivli, Thane, Palava City, Navi Mumbai',
    geoPosition = '19.1726;73.0850'
}) => {
    // Ensure canonical always uses canonical domain https://sonu-builders.in
    let finalCanonical = canonical;
    if (!finalCanonical) {
        if (typeof window !== 'undefined') {
            finalCanonical = `${CANONICAL_DOMAIN}${window.location.pathname}`;
        } else {
            finalCanonical = CANONICAL_DOMAIN;
        }
    } else if (finalCanonical.startsWith('/')) {
        finalCanonical = `${CANONICAL_DOMAIN}${finalCanonical}`;
    }

    const schemas = schema ? (Array.isArray(schema) ? schema : [schema]) : [];
    const icbmValue = geoPosition.replace(';', ', ');

    return (
        <Helmet>
            {/* Primary Meta Tags */}
            <title>{title}</title>
            <meta name="title" content={title} />
            <meta name="description" content={description} />
            {keywords && <meta name="keywords" content={keywords} />}
            <link rel="canonical" href={finalCanonical} />

            {/* Geo Location Tags for Search Engines (Google, Bing, Local SEO) */}
            <meta name="geo.region" content={geoRegion} />
            <meta name="geo.placename" content={geoPlacename} />
            <meta name="geo.position" content={geoPosition} />
            <meta name="ICBM" content={icbmValue} />

            {/* Open Graph / Facebook */}
            <meta property="og:type" content={ogType} />
            <meta property="og:url" content={finalCanonical} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            <meta property="og:image" content={ogImage} />
            <meta property="og:site_name" content="Sonu Enterprises" />

            {/* Twitter */}
            <meta property="twitter:card" content="summary_large_image" />
            <meta property="twitter:url" content={finalCanonical} />
            <meta property="twitter:title" content={title} />
            <meta property="twitter:description" content={description} />
            <meta property="twitter:image" content={ogImage} />

            {/* Structured Data / JSON-LD */}
            {schemas.map((s, index) => (
                <script key={index} type="application/ld+json">
                    {JSON.stringify(s)}
                </script>
            ))}
        </Helmet>
    );
};

// Genuine LocalBusiness / HomeAndConstructionBusiness Schema (No Fake Aggregate Ratings)
export const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "HomeAndConstructionBusiness",
    "@id": `${CANONICAL_DOMAIN}/#organization`,
    "name": COMPANY_NAME,
    "alternateName": "Sonu Enterprises",
    "image": "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
    "logo": `${CANONICAL_DOMAIN}/logo.png`,
    "description": "Premier interior design and construction firm with over 15 years of craftsmanship across Mumbai, Thane, Navi Mumbai, Palava City, and Kalyan-Dombivli.",
    "address": {
        "@type": "PostalAddress",
        "streetAddress": COMPANY_ADDRESS,
        "addressLocality": "Kalyan-Dombivli",
        "addressRegion": "Maharashtra",
        "postalCode": "421204",
        "addressCountry": "IN"
    },
    "geo": {
        "@type": "GeoCoordinates",
        "latitude": "19.1726",
        "longitude": "73.0850"
    },
    "telephone": COMPANY_PHONE,
    "email": COMPANY_EMAIL,
    "url": `${CANONICAL_DOMAIN}/`,
    "priceRange": "₹₹ - ₹₹₹₹",
    "openingHoursSpecification": [
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            "opens": "09:30",
            "closes": "20:00"
        },
        {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Sunday"],
            "opens": "10:30",
            "closes": "18:00"
        }
    ],
    "areaServed": [
        { "@type": "City", "name": "Mumbai" },
        { "@type": "City", "name": "Thane" },
        { "@type": "City", "name": "Navi Mumbai" },
        { "@type": "City", "name": "Kalyan-Dombivli" },
        { "@type": "AdministrativeArea", "name": "Palava City" }
    ],
    "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Interior Design & Turnkey Construction Services",
        "itemListElement": [
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Turnkey Residential Interior Design" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Bespoke Modular Kitchen Design" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Commercial & Office Interiors" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "Wardrobe & Storage Solutions" } },
            { "@type": "Offer", "itemOffered": { "@type": "Service", "name": "False Ceiling & Lighting Design" } }
        ]
    }
};

export const localBusinessSchema = organizationSchema;

// Service Schema
export const serviceSchema = (serviceName: string, description: string, urlSlug: string = '') => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "name": serviceName,
    "serviceType": serviceName,
    "description": description,
    "provider": {
        "@type": "HomeAndConstructionBusiness",
        "name": COMPANY_NAME,
        "telephone": COMPANY_PHONE,
        "url": `${CANONICAL_DOMAIN}/`
    },
    "areaServed": [
        { "@type": "City", "name": "Mumbai" },
        { "@type": "City", "name": "Thane" },
        { "@type": "City", "name": "Kalyan-Dombivli" },
        { "@type": "City", "name": "Navi Mumbai" }
    ],
    "url": urlSlug ? `${CANONICAL_DOMAIN}/services/${urlSlug}` : `${CANONICAL_DOMAIN}/services`
});

// Breadcrumb Schema
export const breadcrumbSchema = (items: { name: string; url: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url.startsWith('http') ? item.url : `${CANONICAL_DOMAIN}${item.url}`
    }))
});

// Article Schema for Blog Posts
export const articleSchema = (post: {
    title: string;
    description: string;
    slug?: string;
    url?: string;
    publishedDate: string;
    image: string;
    authorName?: string;
}) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "description": post.description,
    "image": post.image,
    "author": {
        "@type": "Organization",
        "name": post.authorName || "Sonu Enterprises"
    },
    "publisher": {
        "@type": "Organization",
        "name": "Sonu Enterprises",
        "logo": {
            "@type": "ImageObject",
            "url": `${CANONICAL_DOMAIN}/logo.png`
        }
    },
    "datePublished": post.publishedDate,
    "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": post.url || `${CANONICAL_DOMAIN}/blog/${post.slug || ''}`
    }
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

// Location-Specific LocalBusiness / HomeAndConstructionBusiness Schema
export const locationLocalBusinessSchema = (location: {
    name: string;
    slug: string;
    suburbs?: string[];
    seoTitle?: string;
    metaDescription?: string;
    heroImage?: string;
}) => {
    const coords: Record<string, { lat: string; lon: string; postalCode: string; locality: string }> = {
        'kalyan-dombivli': { lat: '19.2437', lon: '73.1355', postalCode: '421204', locality: 'Kalyan-Dombivli' },
        'palava-city': { lat: '19.1726', lon: '73.0850', postalCode: '421204', locality: 'Palava City, Dombivli' },
        'thane': { lat: '19.2183', lon: '72.9781', postalCode: '400601', locality: 'Thane' },
        'navi-mumbai': { lat: '19.0330', lon: '73.0297', postalCode: '400703', locality: 'Navi Mumbai' },
        'bandra': { lat: '19.0596', lon: '72.8295', postalCode: '400050', locality: 'Bandra, Mumbai' },
        'andheri': { lat: '19.1136', lon: '72.8697', postalCode: '400053', locality: 'Andheri, Mumbai' },
        'powai': { lat: '19.1176', lon: '72.9060', postalCode: '400076', locality: 'Powai, Mumbai' },
    };

    const coord = coords[location.slug] || { lat: '19.1726', lon: '73.0850', postalCode: '421204', locality: location.name };
    const areaList = [
        { "@type": "City", "name": location.name },
        ...(location.suburbs || []).map(sub => ({ "@type": "AdministrativeArea", "name": sub }))
    ];

    return {
        "@context": "https://schema.org",
        "@type": "HomeAndConstructionBusiness",
        "@id": `${CANONICAL_DOMAIN}/locations/${location.slug}#localbusiness`,
        "name": `Sonu Enterprises - Interior Designer in ${location.name}`,
        "alternateName": `${COMPANY_NAME} ${location.name}`,
        "image": location.heroImage || "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=1200&q=80",
        "url": `${CANONICAL_DOMAIN}/locations/${location.slug}`,
        "telephone": COMPANY_PHONE,
        "email": COMPANY_EMAIL,
        "priceRange": "₹₹ - ₹₹₹₹",
        "address": {
            "@type": "PostalAddress",
            "streetAddress": COMPANY_ADDRESS,
            "addressLocality": coord.locality,
            "addressRegion": "Maharashtra",
            "postalCode": coord.postalCode,
            "addressCountry": "IN"
        },
        "geo": {
            "@type": "GeoCoordinates",
            "latitude": coord.lat,
            "longitude": coord.lon
        },
        "areaServed": areaList,
        "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": `Interior Design Services in ${location.name}`,
            "itemListElement": [
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": `Turnkey Home Interiors in ${location.name}` } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": `Modular Kitchen Design in ${location.name}` } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": `Bedroom Interior Design in ${location.name}` } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": `Bathroom Renovation in ${location.name}` } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": `Home Temple & Mandir Design in ${location.name}` } },
                { "@type": "Offer", "itemOffered": { "@type": "Service", "name": `Custom Wardrobes & Storage in ${location.name}` } }
            ]
        }
    };
};

export default SEO;

