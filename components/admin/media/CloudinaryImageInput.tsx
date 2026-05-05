import React, { useState, useEffect } from 'react';
import { Upload, Link, Loader2, Youtube, Play } from 'lucide-react';
import { useCloudinary } from '../../../hooks/useCloudinary';
import { useToast } from '../../../context/ToastContext';

interface CloudinaryImageInputProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  required?: boolean;
  folder?: string;
  placeholder?: string;
  publicId?: string; // Add this
}

const CloudinaryImageInput: React.FC<CloudinaryImageInputProps> = ({
  label,
  value,
  onChange,
  required = false,
  folder = 'sonu_builders_media',
  placeholder = 'https://...',
  publicId // Destructure this
}) => {
  const { uploadToCloudinary, loading } = useCloudinary();
  const { showToast } = useToast();
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(true);
  const [isYoutube, setIsYoutube] = useState(false);

  useEffect(() => {
    const checkYoutube = (url: string) => {
      return url.includes('youtube.com') || url.includes('youtu.be');
    };
    setIsYoutube(checkYoutube(value));
  }, [value]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await uploadToCloudinary(file, folder, (progress) => {
        setUploadProgress(progress);
      }, publicId); // Pass publicId
      
      onChange(result.url);
      showToast('Image uploaded successfully', 'success');
      setUploadProgress(null);
    } catch (err: any) {
      showToast(err.message || 'Upload failed', 'error');
      setUploadProgress(null);
    }
  };

  const getYoutubeThumbnail = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : null;
  };

  return (
    <div className="cloudinary-image-input space-y-2">
      <div className="flex justify-between items-center mb-1">
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (!value.includes('youtube')) {
                onChange('https://www.youtube.com/watch?v=');
              }
              setShowUrlInput(true);
            }}
            className={`text-[10px] px-2 py-1 rounded flex items-center gap-1 transition-colors ${
              isYoutube 
              ? 'bg-red-500/10 text-red-500' 
              : 'bg-gray-100 dark:bg-white/5 text-gray-500'
            }`}
          >
            <Youtube size={10} />
            YouTube Mode
          </button>
          <button
            type="button"
            onClick={() => setShowUrlInput(!showUrlInput)}
            className={`text-[10px] px-2 py-1 rounded flex items-center gap-1 transition-colors ${
              showUrlInput && !isYoutube
              ? 'bg-luxury-gold/10 text-luxury-gold' 
              : 'bg-gray-100 dark:bg-white/5 text-gray-500'
            }`}
          >
            <Link size={10} />
            {showUrlInput ? 'Hide Link' : 'Edit Link'}
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Preview & Actions */}
        <div className="flex-1 space-y-4">
          {!isYoutube && (
            <div className="flex gap-4">
              {/* Upload Button */}
              <div className="relative flex-1">
                <input
                  type="file"
                  id={`file-upload-${label}`}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileUpload}
                  disabled={loading}
                />
                <label
                  htmlFor={`file-upload-${label}`}
                  className={`
                    flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed
                    cursor-pointer transition-all duration-200 w-full h-full min-h-[50px]
                    ${loading 
                      ? 'bg-gray-50 dark:bg-white/5 border-gray-200 opacity-50 cursor-not-allowed' 
                      : 'bg-luxury-gold/5 border-luxury-gold/30 hover:bg-luxury-gold/10 hover:border-luxury-gold text-luxury-gold'}
                  `}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs">Uploading {uploadProgress}%</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span className="text-xs font-medium">Upload Image</span>
                    </>
                  )}
                </label>
              </div>
            </div>
          )}

          {showUrlInput && (
            <div className="relative">
              <input
                type="url"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={isYoutube ? "Paste YouTube Link..." : placeholder}
                required={required}
                className={`w-full px-4 py-2 border rounded-lg bg-gray-50 dark:bg-white/5 focus:outline-none transition-colors text-sm ${
                  isYoutube ? 'border-red-500/30 focus:border-red-500' : 'border-gray-300 dark:border-white/10 focus:border-luxury-gold'
                }`}
              />
              {isYoutube && <Youtube size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500 opacity-50" />}
            </div>
          )}
        </div>

        {/* Thumbnail Preview */}
        <div className={`w-full md:w-32 h-24 rounded-lg overflow-hidden border bg-gray-100 dark:bg-white/5 flex items-center justify-center relative group transition-colors ${
          isYoutube ? 'border-red-500/20' : 'border-gray-200 dark:border-white/10'
        }`}>
          {value ? (
            <>
              <img 
                src={isYoutube ? (getYoutubeThumbnail(value) || '') : (value.includes('cloudinary.com') ? value.replace('/upload/', '/upload/w_200,f_auto,q_auto/') : value)} 
                alt="Preview" 
                className="w-full h-full object-cover" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                 {isYoutube ? <Play size={20} className="text-white fill-white" /> : <span className="text-[10px] text-white font-bold uppercase tracking-wider">Preview</span>}
              </div>
              {isYoutube && (
                <div className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-sm shadow-lg">
                  <Youtube size={10} />
                </div>
              )}
            </>
          ) : (
            <div className="text-gray-400 flex flex-col items-center">
              <Upload size={20} className="mb-1 opacity-50" />
              <span className="text-[10px]">No Content</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CloudinaryImageInput;
