import React from 'react';
import { Library, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import CloudinaryUploader from './CloudinaryUploader';
import { MediaUsage } from '../../../types';

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (url: string) => void;
  onSelectMultiple?: (urls: string[]) => void;
  multiple?: boolean;
  title?: string;
  subtitle?: string;
  usageContext?: MediaUsage;
}

const MediaLibraryModal: React.FC<MediaLibraryModalProps> = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  onSelectMultiple,
  multiple = false,
  title = "Select Architectural Asset",
  subtitle = "Choose an existing high-resolution render from your library.",
  usageContext
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[999] bg-black/80 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="bg-luxury-obsidian w-full h-full shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="p-6 border-b border-luxury-gold/10 flex justify-between items-center bg-luxury-gold/5">
              <div>
                <h3 className="text-xl font-serif font-bold text-white flex items-center gap-2">
                  <Library className="text-luxury-gold" /> {title}
                </h3>
                <p className="text-xs text-gray-400">{subtitle}</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <X className="text-white" size={24} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto">
              <CloudinaryUploader 
                multiple={multiple}
                usageContext={usageContext}
                onSelect={(url) => {
                  if (onSelect) onSelect(url);
                  onClose();
                }} 
                onSelectMultiple={(urls) => {
                  if (onSelectMultiple) onSelectMultiple(urls);
                  onClose();
                }}
              />
            </div>

            <div className="p-4 bg-black/40 border-t border-luxury-gold/10 text-center">
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
              >
                Cancel Selection
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default MediaLibraryModal;
