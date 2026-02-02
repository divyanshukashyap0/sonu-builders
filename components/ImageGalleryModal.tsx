import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

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
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md transition-opacity duration-300" onClick={onClose}>
      {/* Top Bar */}
      <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center z-50 bg-gradient-to-b from-black/50 to-transparent">
        <div className="text-white">
           {title && <h3 className="text-lg md:text-xl font-bold font-serif tracking-wide">{title}</h3>}
           <p className="text-sm text-gray-300 font-medium">{currentIndex + 1} / {images.length}</p>
        </div>
        <button 
          onClick={(e) => { e.stopPropagation(); onClose(); }} 
          className="text-white hover:text-brand-gold bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
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
            className="absolute left-4 md:left-8 p-3 text-white bg-black/40 hover:bg-brand-blue/80 rounded-full transition-all backdrop-blur-sm group"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-8 h-8 group-hover:-translate-x-0.5 transition-transform" />
          </button>
        )}

        <div className="relative max-w-full max-h-full" onClick={(e) => e.stopPropagation()}>
          <img
            src={images[currentIndex]}
            alt={`Gallery image ${currentIndex + 1}`}
            className="max-h-[80vh] md:max-h-[85vh] max-w-full object-contain rounded-sm shadow-2xl animate-fadeIn"
          />
        </div>

        {images.length > 1 && (
          <button
            onClick={nextImage}
            className="absolute right-4 md:right-8 p-3 text-white bg-black/40 hover:bg-brand-blue/80 rounded-full transition-all backdrop-blur-sm group"
            aria-label="Next image"
          >
            <ChevronRight className="w-8 h-8 group-hover:translate-x-0.5 transition-transform" />
          </button>
        )}
      </div>

      {/* Thumbnails Indicator (dots) */}
      {images.length > 1 && (
        <div className="absolute bottom-6 left-0 w-full flex justify-center gap-2 z-50">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={(e) => { e.stopPropagation(); setCurrentIndex(idx); }}
              className={`w-2 h-2 md:w-2.5 md:h-2.5 rounded-full transition-all ${
                idx === currentIndex ? 'bg-brand-gold w-4 md:w-6' : 'bg-white/50 hover:bg-white'
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