import React, { useState, useCallback, useEffect } from 'react';
import { useCloudinary } from '../../../hooks/useCloudinary';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { CloudinaryMedia } from '../../../types';
import { Upload, X, Image as ImageIcon, Trash2, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import './CloudinaryUploader.css';

interface UploadingFile {
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

const CloudinaryUploader: React.FC = () => {
  const { uploadToCloudinary, deleteFromCloudinary } = useCloudinary();
  const { showToast } = useToast();
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: UploadingFile }>({});
  const [mediaList, setMediaList] = useState<CloudinaryMedia[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Sync with Firebase in real-time
  useEffect(() => {
    const q = query(collection(db, 'media'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: CloudinaryMedia[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as CloudinaryMedia);
      });
      setMediaList(items);
    });

    return () => unsubscribe();
  }, []);

  const filteredMedia = mediaList.filter(item => 
    item.public_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.format.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url).then(() => {
        showToast('URL copied to clipboard!', 'success');
    });
  };

  const validateFile = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isUnder20MB = file.size <= 20 * 1024 * 1024;
    
    if (!isImage) return 'Only image files are allowed';
    if (!isUnder20MB) return 'File size must be under 20MB for high-res architectural renders';
    return null;
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const newFiles = Array.from(files);
    
    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        showToast(`${file.name}: ${error}`, 'error');
        continue;
      }

      const fileId = `${file.name}-${Date.now()}`;
      const preview = URL.createObjectURL(file);

      setUploadingFiles(prev => ({
        ...prev,
        [fileId]: { file, preview, progress: 0, status: 'uploading' }
      }));

      try {
        await uploadToCloudinary(file, 'sonu_builders_media', (progress) => {
          setUploadingFiles(prev => ({
            ...prev,
            [fileId]: { ...prev[fileId], progress }
          }));
        });

        setUploadingFiles(prev => ({
          ...prev,
          [fileId]: { ...prev[fileId], status: 'success', progress: 100 }
        }));
        
        showToast(`Successfully uploaded ${file.name}`, 'success');

        setTimeout(() => {
          setUploadingFiles(prev => {
            const newState = { ...prev };
            delete newState[fileId];
            return newState;
          });
        }, 2000);

      } catch (err) {
        setUploadingFiles(prev => ({
          ...prev,
          [fileId]: { ...prev[fileId], status: 'error' }
        }));
        showToast(`Failed to upload ${file.name}`, 'error');
      }
    }
  }, [uploadToCloudinary, showToast]);

  const handleDelete = async (item: CloudinaryMedia) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;
    
    const success = await deleteFromCloudinary(item.id, item.public_id, item.resource_type || 'image');
    if (success) {
      showToast('Image deleted successfully', 'success');
    } else {
      showToast('Failed to delete image', 'error');
    }
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files) {
      handleFiles(e.dataTransfer.files);
    }
  };

  return (
    <div className="cloudinary-uploader p-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-widest flex items-center gap-2">
            <ImageIcon className="text-luxury-gold" /> Asset Browser
          </h2>
          <p className="text-gray-500 text-xs mt-1">Manage {mediaList.length} total assets</p>
        </div>

        <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
            <input 
                type="text" 
                placeholder="Search assets by name or format..."
                className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white focus:border-luxury-gold outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
      </div>

      {/* Dropzone */}
      <div 
        className={`dropzone ${isDragging ? 'active' : ''} bg-black/40 border-luxury-gold/20 hover:border-luxury-gold transition-all duration-500 rounded-2xl p-10 text-center cursor-pointer group mb-12`}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => document.getElementById('fileInput')?.click()}
      >
        <input 
          type="file" 
          id="fileInput" 
          multiple 
          accept="image/*" 
          style={{ display: 'none' }}
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
        />
        <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
            <Upload className="text-luxury-gold" size={24} />
        </div>
        <h3 className="text-white font-bold mb-2">Drop your architectural renders here</h3>
        <p className="text-gray-500 text-xs">High-resolution images up to 20MB supported</p>
      </div>

      {/* Grid of images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {/* Uploading Progress */}
        {Object.entries(uploadingFiles).map(([id, item]) => (
          <div key={id} className="relative aspect-square rounded-2xl overflow-hidden border border-luxury-gold/30 bg-black/40">
            <img src={item.preview} alt="Uploading" className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
              {item.status === 'uploading' ? (
                <>
                  <Loader2 className="animate-spin text-luxury-gold mb-3" size={32} />
                  <div className="w-full bg-white/10 rounded-full h-1 overflow-hidden">
                    <div className="bg-luxury-gold h-full transition-all" style={{ width: `${item.progress}%` }} />
                  </div>
                  <span className="text-[10px] text-luxury-gold font-bold mt-2">{item.progress}%</span>
                </>
              ) : item.status === 'success' ? (
                <CheckCircle className="text-green-500 w-12 h-12" />
              ) : (
                <X className="text-red-500 w-12 h-12" />
              )}
            </div>
          </div>
        ))}

        {/* Existing Media */}
        {filteredMedia.map((item) => (
          <div key={item.id} className="group relative aspect-square rounded-2xl overflow-hidden border border-white/5 bg-white/5 hover:border-luxury-gold/50 transition-all shadow-xl">
            <img 
              src={item.url.replace('/upload/', '/upload/f_auto,q_auto,w_400/')} 
              alt="Media" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              loading="lazy"
            />
            
            {/* Hover Actions */}
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                <button 
                    onClick={() => copyToClipboard(item.url)}
                    className="w-full py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-luxury-gold hover:text-white transition-all"
                >
                    Copy Asset URL
                </button>
                <button 
                    onClick={() => handleDelete(item)}
                    className="w-full py-2 bg-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-red-500/30 hover:bg-red-500 hover:text-white transition-all"
                >
                    Delete Asset
                </button>
            </div>

            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-black/60 backdrop-blur-md px-2 py-1.5 rounded-lg border border-white/10">
              <span className="text-[10px] font-bold text-white uppercase tracking-tighter truncate max-w-[60%]">{item.public_id.split('/').pop()}</span>
              <span className="text-[9px] text-luxury-gold font-bold bg-luxury-gold/10 px-1.5 py-0.5 rounded border border-luxury-gold/20">{(item.bytes / 1024).toFixed(0)}KB</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CloudinaryUploader;
