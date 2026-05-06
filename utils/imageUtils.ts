import logo from '../logo.png';

/**
 * Downloads an image with a watermark logo at the bottom right.
 * @param imageUrl The URL of the image to download
 * @param fileName The desired filename
 */
export const downloadWithWatermark = async (imageUrl: string, fileName: string) => {
    const fallbackDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `${fileName}.jpg`;
        link.target = "_blank";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    try {
        // Create a canvas element
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');

        // Load the main image
        const mainImg = new Image();
        mainImg.crossOrigin = "anonymous";
        
        // Add a cache-busting query param to help with CORS if needed
        const urlWithCacheBust = imageUrl.includes('?') 
            ? `${imageUrl}&watermark=true` 
            : `${imageUrl}?watermark=true`;
            
        mainImg.src = urlWithCacheBust;

        await new Promise((resolve, reject) => {
            mainImg.onload = resolve;
            mainImg.onerror = () => reject(new Error('Failed to load main image'));
        });

        // Set canvas dimensions to match image
        canvas.width = mainImg.width;
        canvas.height = mainImg.height;

        // Draw the main image
        ctx.drawImage(mainImg, 0, 0);

        // Load and draw the logo (watermark)
        const watermarkImg = new Image();
        watermarkImg.src = logo;

        await new Promise((resolve, reject) => {
            watermarkImg.onload = resolve;
            watermarkImg.onerror = () => reject(new Error('Failed to load watermark logo'));
        });

        // Calculate watermark size (15% of image width)
        const watermarkWidth = mainImg.width * 0.15;
        const watermarkHeight = (watermarkImg.height / watermarkImg.width) * watermarkWidth;
        
        // Position: Bottom Right with padding
        const padding = mainImg.width * 0.02;
        const x = mainImg.width - watermarkWidth - padding;
        const y = mainImg.height - watermarkHeight - padding;

        // Draw watermark with 50% opacity
        ctx.globalAlpha = 0.5;
        ctx.drawImage(watermarkImg, x, y, watermarkWidth, watermarkHeight);
        ctx.globalAlpha = 1.0;

        // Convert canvas to blob and trigger download
        canvas.toBlob((blob) => {
            if (!blob) {
                fallbackDownload();
                return;
            }
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${fileName}-watermarked.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        }, 'image/jpeg', 0.95);

    } catch (error) {
        console.error('Watermark generation failed, falling back to direct download:', error);
        fallbackDownload();
    }
};
