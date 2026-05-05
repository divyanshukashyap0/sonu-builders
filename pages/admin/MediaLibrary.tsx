import React from 'react';
import CloudinaryUploader from '../../components/admin/media/CloudinaryUploader';
import { motion } from 'framer-motion';

const MediaLibrary: React.FC = () => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Media Management</h1>
        <p className="text-gray-400">Upload and manage your assets with production-grade optimization.</p>
      </div>

      <CloudinaryUploader />
    </motion.div>
  );
};

export default MediaLibrary;
