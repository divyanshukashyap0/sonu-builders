import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

/**
 * Normalizes different geolocation API responses into a consistent format.
 */
const normalizeGeoData = (data: any, provider: string) => {
    if (provider === 'ipapi') {
        return {
            ip: data.ip || 'Unknown',
            city: data.city || 'Unknown',
            region: data.region || 'Unknown',
            country: data.country_name || 'Unknown',
            location: `${data.city || 'Unknown'}, ${data.region || 'Unknown'}, ${data.country_name || 'Unknown'}`,
            provider: 'ipapi.co'
        };
    }
    if (provider === 'freeipapi') {
        return {
            ip: data.ipAddress || 'Unknown',
            city: data.cityName || 'Unknown',
            region: data.regionName || 'Unknown',
            country: data.countryName || 'Unknown',
            location: `${data.cityName || 'Unknown'}, ${data.regionName || 'Unknown'}, ${data.countryName || 'Unknown'}`,
            provider: 'freeipapi.com'
        };
    }
    if (provider === 'ipify') {
        return {
            ip: data.ip || 'Unknown',
            city: 'Unavailable',
            region: 'Unavailable',
            country: 'Unavailable',
            location: 'Unavailable (Blocked)',
            provider: 'ipify.org'
        };
    }
    return null;
};

/**
 * Logs a call click action with user IP and estimated location data.
 * Features an automatic fallback mechanism and captures "unblockable" 
 * browser metadata like Timezone and System Language.
 */
export const logCallAction = async () => {
    const providers = [
        { name: 'ipapi', url: 'https://ipapi.co/json/' },
        { name: 'freeipapi', url: 'https://freeipapi.com/api/json' },
        { name: 'ipify', url: 'https://api.ipify.org?format=json' }
    ];

    let geoData = null;
    let lastError = null;

    // Try providers sequentially until one succeeds
    for (const provider of providers) {
        try {
            const response = await fetch(provider.url);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            geoData = normalizeGeoData(data, provider.name);
            if (geoData) break;
        } catch (error) {
            console.warn(`⚠️ Provider ${provider.name} failed:`, error);
            lastError = error;
        }
    }

    try {
        // Guaranteed Browser Metadata (Unblockable)
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'Unknown';
        const language = navigator.language || 'Unknown';

        const logData = {
            ...(geoData || {
                ip: 'API_ERROR',
                location: 'Unavailable (Blocked)',
                error: lastError?.toString() || 'All providers failed',
                provider: 'None (Global Block)'
            }),
            timezone,
            language,
            pageUrl: window.location.href,
            userAgent: navigator.userAgent,
            timestamp: serverTimestamp()
        };

        // Save to Firestore
        await addDoc(collection(db, 'call_logs'), logData);
        console.log(`✅ Call click logged successfully via ${geoData?.provider || 'fallback'}`);
    } catch (dbError) {
        console.error('❌ Critical: Failed to save call log to Firestore:', dbError);
    }
};
