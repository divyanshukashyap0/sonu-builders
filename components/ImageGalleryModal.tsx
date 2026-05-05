import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import MediaRenderer from './ui/MediaRenderer';

interface ImageGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  title?: string;
}

const ImageGalleryModal: React.FC<ImageGalleryModalProps> = ({ isOpen, onClose, images, title }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const nextImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  const prevImage = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') nextImage();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, nextImage, prevImage, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-luxury-charcoal/95 backdrop-blur-lg transition-opacity duration-300" onClick={onClose}>
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-50 bg-gradient-to-b from-luxury-charcoal/50 to-transparent">
        <div className="text-white">
          {title && <h3 className="text-lg md:text-xl font-serif font-bold tracking-widest uppercase">{title}</h3>}
          <p className="text-[10px] uppercase tracking-[0.3em] font-bold text-luxury-gold mt-1">{currentIndex + 1} / {images.length}</p>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onClose(); }}
          className="text-white hover:text-luxury-gold bg-white/10 hover:bg-white/20 p-2 border border-white/20 rounded-full transition-all"
          aria-label="Close gallery"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
        {images.length > 1 && (
          <button
            onClick={prevImage}
            className="absolute left-4 md:left-8 p-4 text-white bg-luxury-gold hover:bg-white hover:text-luxury-gold rounded-full transition-all backdrop-blur-md group shadow-luxury"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
          </button>
        )}

        <div className="relative max-w-full max-h-full w-full h-[70vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
          {images[currentIndex].includes('youtube.com') || images[currentIndex].includes('youtu.be') ? (
            <div className="w-full h-full max-w-4xl max-h-full">
              <iframe
                src={`https://www.youtube.com/embed/${((url) => {
                  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
                  const match = url.match(regExp);
                  return (match && match[2].length === 11) ? match[2] : '';
                })(images[currentIndex])}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                className="w-full h-full rounded-lg border border-white/10"
                allow="autoplay; encrypted-media; fullscreen"
                title="Gallery Video"
              />
            </div>
          ) : (
            <MediaRenderer
              src={images[currentIndex]}
              alt={`Gallery image ${currentIndex + 1}`}
              className="max-h-[85vh] md:max-h-[85vh] max-w-full rounded-sm shadow-2xl animate-fadeIn border border-white/10"
              objectFit="contain"
            />
          )}
        </div>

        {images.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-4 md:right-8 p-4 text-white bg-luxury-gold hover:bg-white hover:text-luxury-gold rounded-full transition-all backdrop-blur-md group shadow-luxury"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
          </button>
        )}
      </div>

      {/* Thumbnails Indicator (dots) */}
      {images.length > 1 && (
        <div className="absolute bottom-10 left-0 w-full flex justify-center gap-3 z-50">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              className={`w-2 h-2 rounded-full transition-all duration-500 ${idx === currentIndex ? 'bg-luxury-gold w-8 shadow-[0_0_15px_rgba(212,175,55,0.5)]' : 'bg-white/30 hover:bg-white/60'
                }`}
              aria-label={`Go to image ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageGalleryModal;
