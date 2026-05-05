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

  const validateFile = (file: File) => {
    const isImage = file.type.startsWith('image/');
    const isUnder5MB = file.size <= 5 * 1024 * 1024;
    
    if (!isImage) return 'Only image files are allowed';
    if (!isUnder5MB) return 'File size must be under 5MB';
    return null;
  };

  const handleFiles = useCallback(async (files: FileList | File[]) => {
    const newFiles = Array.from(files);
    
    for (const file of newFiles) {
      const error = validateFile(file);
      if (error) {
        alert(`${file.name}: ${error}`);
        continue;
      }

      const fileId = `${file.name}-${Date.now()}`;
      const preview = URL.createObjectURL(file);

      // Add to uploading state
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

        // Update status to success
        setUploadingFiles(prev => ({
          ...prev,
          [fileId]: { ...prev[fileId], status: 'success', progress: 100 }
        }));
        
        showToast(`Successfully uploaded ${file.name}`, 'success');

        // Remove from uploading list after 2 seconds
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
    
    // Optimistic delete
    setMediaList(prev => prev.filter(m => m.id !== item.id));
    
    const success = await deleteFromCloudinary(item.id, item.public_id, item.resource_type || 'image');
    if (success) {
      showToast('Image deleted successfully', 'success');
    } else {
      showToast('Failed to delete image', 'error');
    }
  };

  // Drag & Drop Handlers
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
    <div className="cloudinary-uploader">
      <div className="uploader-header">
        <h2>Media Library</h2>
        <p>Production-grade Cloudinary integration with Firebase</p>
      </div>

      {/* Dropzone */}
      <div 
        className={`dropzone ${isDragging ? 'active' : ''}`}
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
        <Upload className="dropzone-icon" />
        <h3>Drag & Drop images here</h3>
        <p>or click to browse (Max 5MB per file)</p>
      </div>

      {/* Grid of images (Uploading + Existing) */}
      <div className="preview-grid">
        {/* Uploading Progress Cards */}
        {Object.entries(uploadingFiles).map(([id, item]) => (
          <div key={id} className="preview-card">
            <img src={item.preview} alt="Uploading" className="preview-image" />
            <div className="upload-overlay">
              {item.status === 'uploading' ? (
                <>
                  <Loader2 className="animate-spin text-white mb-2" />
                  <div className="progress-bar-container">
                    <div className="progress-bar" style={{ width: `${item.progress}%` }} />
                  </div>
                  <span className="text-xs mt-2">{item.progress}%</span>
                </>
              ) : item.status === 'success' ? (
                <CheckCircle className="text-green-500 w-12 h-12" />
              ) : (
                <X className="text-red-500 w-12 h-12" />
              )}
            </div>
            <span className={`status-badge status-${item.status}`}>
              {item.status.toUpperCase()}
            </span>
          </div>
        ))}

        {/* Existing Media Cards */}
        {mediaList.map((item) => (
          <div key={item.id} className="preview-card">
            {/* Using Cloudinary optimizations: f_auto, q_auto, w_400 */}
            <img 
              src={item.url.replace('/upload/', '/upload/f_auto,q_auto,w_400/')} 
              alt="Media" 
              className="preview-image"
              loading="lazy"
            />
            <button 
              className="delete-btn" 
              onClick={() => handleDelete(item)}
              title="Delete Permanently"
            >
              <Trash2 size={16} />
            </button>
            <div className="status-badge status-success">
              {item.format.toUpperCase()} • {(item.bytes / 1024).toFixed(1)} KB
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CloudinaryUploader;
