/**
 * Validates if a URL is properly formatted
 * @param url - URL string to validate
 * @returns true if valid URL format
 */
export const validateUrl = (url: string): boolean => {
    try {
        const urlObj = new URL(url);
        return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
        return false;
    }
};

/**
 * Validates if a URL points to a valid image
 * @param url - Image URL to validate
 * @returns Promise that resolves to true if image loads successfully
 */
export const validateImageUrl = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        if (!validateUrl(url)) {
            resolve(false);
            return;
        }

        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;

        // Timeout after 5 seconds
        setTimeout(() => resolve(false), 5000);
    });
};

/**
 * Extracts Google Drive file ID from various Drive URL formats
 * @param url - Google Drive URL
 * @returns File ID or null if not found
 */
export const extractGoogleDriveId = (url: string): string | null => {
    if (!url) return null;

    // Pattern 1: https://drive.google.com/file/d/FILE_ID/view
    let match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (match) return match[1];

    // Pattern 2: https://drive.google.com/open?id=FILE_ID
    match = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    if (match) return match[1];

    // Pattern 3: https://drive.google.com/uc?id=FILE_ID
    match = url.match(/\/uc\?id=([a-zA-Z0-9_-]+)/);
    if (match) return match[1];

    // If it's already just an ID (no slashes or special chars except _ and -)
    if (/^[a-zA-Z0-9_-]+$/.test(url) && url.length > 20) {
        return url;
    }

    return null;
};

/**
 * Validates Google Drive file ID format
 * @param id - File ID to validate
 * @returns true if valid Drive ID format
 */
export const isValidDriveId = (id: string): boolean => {
    // Drive IDs are typically 28-44 characters, alphanumeric with _ and -
    return /^[a-zA-Z0-9_-]{20,50}$/.test(id);
};

/**
 * Converts Google Drive link to embeddable format
 * @param url - Google Drive URL or file ID
 * @returns Embeddable URL or null
 */
export const getDriveEmbedUrl = (url: string): string | null => {
    const fileId = extractGoogleDriveId(url);
    if (!fileId || !isValidDriveId(fileId)) return null;
    return `https://drive.google.com/file/d/${fileId}/preview`;
};

/**
 * Formats WhatsApp URL to wa.me format
 * @param input - Phone number or WhatsApp URL
 * @returns Formatted wa.me URL
 */
export const formatWhatsAppUrl = (input: string): string => {
    // If already a wa.me link, return as is
    if (input.includes('wa.me/')) return input;

    // Extract only numbers
    const numbers = input.replace(/[^0-9]/g, '');

    if (numbers.length === 0) return '';

    // Format as wa.me link
    return `https://wa.me/${numbers}`;
};

/**
 * Validates social media URL format
 * @param url - Social media URL
 * @param platform - Platform name (facebook, instagram, etc.)
 * @returns true if valid format for the platform
 */
export const validateSocialUrl = (url: string, platform: string): boolean => {
    if (!validateUrl(url)) return false;

    const patterns: Record<string, RegExp> = {
        facebook: /^https?:\/\/(www\.)?(facebook|fb)\.com\/.+/i,
        twitter: /^https?:\/\/(www\.)?twitter\.com\/.+/i,
        instagram: /^https?:\/\/(www\.)?instagram\.com\/.+/i,
        linkedin: /^https?:\/\/(www\.)?linkedin\.com\/.+/i,
        youtube: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/i,
    };

    const pattern = patterns[platform.toLowerCase()];
    return pattern ? pattern.test(url) : validateUrl(url);
};

/**
 * Gets the domain name from a URL
 * @param url - Full URL
 * @returns Domain name or empty string
 */
export const getDomainFromUrl = (url: string): string => {
    try {
        const urlObj = new URL(url);
        return urlObj.hostname.replace('www.', '');
    } catch {
        return '';
    }
};

export interface OpenGraphData {
    title?: string;
    description?: string;
    image?: string;
    url?: string;
}

/**
 * Fetches Open Graph metadata from a URL
 * Note: This requires CORS proxy or backend endpoint in production
 * @param url - URL to fetch metadata from
 * @returns Open Graph data object
 */
export const fetchOpenGraphPreview = async (url: string): Promise<OpenGraphData> => {
    // This is a placeholder implementation
    // In production, you'd need to use a backend endpoint or CORS proxy
    // as direct fetching will fail due to CORS restrictions

    try {
        // For now, return basic info from the URL
        const urlObj = new URL(url);
        return {
            title: getDomainFromUrl(url),
            description: url,
            url: url,
        };
    } catch {
        return {};
    }
};
