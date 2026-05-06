import React from 'react';
import CloudinaryUploader from '../../components/admin/media/CloudinaryUploader';
import { motion } from 'framer-motion';

const MediaLibrary: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2">Media Management</h1>
          <p className="text-gray-400">Manage your high-resolution architectural assets and design renders.</p>
        </div>
        
        <div className="flex gap-4">
            <div className="bg-luxury-gold/10 border border-luxury-gold/20 px-6 py-3 rounded-xl flex flex-col items-center">
                <span className="text-[10px] uppercase tracking-widest text-luxury-gold font-bold">Cloud Sync</span>
                <span className="text-xl font-bold text-white">Active</span>
            </div>
        </div>
      </div>

      <div className="bg-luxury-obsidian border border-luxury-gold/10 rounded-2xl overflow-hidden shadow-2xl">
        <CloudinaryUploader />
      </div>
    </motion.div>
  );
};

export default MediaLibrary;
