import React from 'react';
import YouTubeBackground from './YouTubeBackground';
import { Play } from 'lucide-react';
import { useCompanyData } from '../../hooks/useCompanyData';
import logo from '../../logo.png';

interface MediaRendererProps {
  src: string;
  alt?: string;
  className?: string;
  loading?: 'lazy' | 'eager';
  showPlayIcon?: boolean;
  objectFit?: 'cover' | 'contain';
}

const MediaRenderer: React.FC<MediaRendererProps> = ({
  src,
  alt = "",
  className = "",
  loading = 'lazy',
  showPlayIcon = false,
  objectFit = 'cover'
}) => {
  const isYoutube = src.includes('youtube.com') || src.includes('youtu.be');

  const { watermarkLogo } = useCompanyData();

  // Apply watermark to Cloudinary images
  const getWatermarkedUrl = (url: string) => {
    if (!url) return 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&q=80'; // High-quality luxury default

    // Only apply if Cloudinary image and watermarkLogo is a valid URL in settings
    const isCloudinary = url.includes('cloudinary.com');
    const hasWatermarkConfig = watermarkLogo && watermarkLogo.length > 5;

    if (isCloudinary && hasWatermarkConfig && !url.includes('website_watermark_logo')) {
      const watermarkTransform = 'l_branding:website_watermark_logo,o_50,g_south_east,w_150,x_20,y_20/';
      if (url.includes('/upload/')) {
        return url.replace('/upload/', `/upload/${watermarkTransform}`);
      }
    }
    return url;
  };

  const finalSrc = isYoutube ? src : getWatermarkedUrl(src);

  if (isYoutube) {
    return (
      <div className={`relative ${className} overflow-hidden bg-black`}>
        <YouTubeBackground videoUrl={src} overlayOpacity={0} />
        {showPlayIcon && (
          <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
            <div className="bg-white/20 backdrop-blur-md p-4 rounded-full text-white">
              <Play className="w-8 h-8 fill-current" />
            </div>
          </div>
        )}
      </div>
    );
  }

  const isActuallyVideo = src.match(/\.(mp4|webm|ogg|mov)$|video\/upload/i);

  return (
    <div className={`relative overflow-hidden group/media ${className}`}>
      {isActuallyVideo ? (
        <video
          src={src}
          className={`w-full h-full object-${objectFit}`}
          autoPlay
          muted
          loop
          playsInline
        />
      ) : (
        <img
          src={finalSrc}
          alt={alt}
          className={`w-full h-full object-${objectFit}`}
          loading={loading}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            if (target.src.includes('l_branding:website_watermark_logo')) {
              target.src = target.src.replace(/l_branding:website_watermark_logo,[^/]+\//, '');
              return;
            }
            target.src = 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1200&q=60';
          }}
        />
      )}

      {/* Local Watermark Overlay Fallback (For non-Cloudinary or as double-check) */}
      <div className="absolute bottom-3 right-3 pointer-events-none opacity-80 select-none z-10 w-12 md:w-20">
        <img
          src={logo}
          alt="Sonu Enterprises"
          className="w-full h-auto"
        />
      </div>

      {/* Video Play Overlay */}
      {showPlayIcon && isActuallyVideo && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/media:bg-black/40 transition-colors">
          <div className="w-16 h-16 rounded-full bg-luxury-gold/80 flex items-center justify-center text-white shadow-glow-gold backdrop-blur-sm transform group-hover/media:scale-110 transition-transform">
            <svg className="w-8 h-8 fill-current" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaRenderer;
