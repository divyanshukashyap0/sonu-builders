import React, { useState, useCallback, useEffect } from 'react';
import { useCloudinary } from '../../../hooks/useCloudinary';
import { CloudinaryMedia, MediaUsage } from '../../../types';
import { db } from '../../../lib/firebase';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, increment, arrayUnion, arrayRemove, getDoc } from 'firebase/firestore';
import { Upload, X, Image as ImageIcon, Trash2, CheckCircle, Loader2, Search } from 'lucide-react';
import { useToast } from '../../../context/ToastContext';
import { useConfirmDelete } from '../../../hooks/useConfirmDelete';
import './CloudinaryUploader.css';

interface UploadingFile {
  file: File;
  preview: string;
  progress: number;
  status: 'uploading' | 'success' | 'error';
}

interface CloudinaryUploaderProps {
  onSelect?: (url: string) => void;
  onSelectMultiple?: (urls: string[]) => void;
  multiple?: boolean;
  usageContext?: MediaUsage;
}

const CloudinaryUploader: React.FC<CloudinaryUploaderProps> = ({ 
  onSelect, 
  onSelectMultiple, 
  multiple = false,
  usageContext
}) => {
  const { uploadToCloudinary, deleteFromCloudinary } = useCloudinary();
  const { showToast } = useToast();
  const { confirmDelete } = useConfirmDelete();
  const [uploadingFiles, setUploadingFiles] = useState<{ [key: string]: UploadingFile }>({});
  const [mediaList, setMediaList] = useState<CloudinaryMedia[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Lasso selection state
  const [lassoStart, setLassoStart] = useState<{ x: number, y: number } | null>(null);
  const [lassoEnd, setLassoEnd] = useState<{ x: number, y: number } | null>(null);
  const [isLassoing, setIsLassoing] = useState(false);
  const containerRef = React.useRef<HTMLDivElement>(null);

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

  const handleSelectAsset = async (item: CloudinaryMedia) => {
    if (!onSelect) return;
    
    try {
      // Increment usage count and add context in Firestore
      const mediaDocRef = doc(db, 'media', item.id);
      const updates: any = {
        usageCount: increment(1)
      };

      if (usageContext) {
        updates.usedIn = arrayUnion(usageContext);
      }

      await updateDoc(mediaDocRef, updates);
      onSelect(item.url);
    } catch (err) {
      console.error("Asset selection error:", err);
      showToast('Failed to select asset due to a database sync error.', 'error');
    }
  };

  const handleUnlink = async (item: CloudinaryMedia, usage: MediaUsage) => {
    try {
      showToast(`Unlinking from ${usage.title}...`, 'info');
      
      // 1. Remove from the actual service/project document
      const targetDocRef = doc(db, usage.type === 'service' ? 'services' : 'projects', usage.id);
      const targetDoc = await getDoc(targetDocRef);
      
      if (targetDoc.exists()) {
        const data = targetDoc.data();
        const updates: any = {};
        
        // Find where the URL is and remove it
        if (data.image === item.url) updates.image = "";
        if (data.heroImage === item.url) updates.heroImage = "";
        if (data.symbolUrl === item.url) updates.symbolUrl = "";
        if (data.gallery && data.gallery.includes(item.url)) {
          updates.gallery = arrayRemove(item.url);
        }
        if (data.beforeImages && data.beforeImages.includes(item.url)) {
            updates.beforeImages = arrayRemove(item.url);
        }
        if (data.afterImages && data.afterImages.includes(item.url)) {
            updates.afterImages = arrayRemove(item.url);
        }

        if (Object.keys(updates).length > 0) {
            await updateDoc(targetDocRef, updates);
        }
      }

      // 2. Update the media document: decrement usage and remove usage record
      const mediaDocRef = doc(db, 'media', item.id);
      await updateDoc(mediaDocRef, {
        usageCount: increment(-1),
        usedIn: arrayRemove(usage)
      });

      showToast(`Successfully unlinked from ${usage.title}`, 'success');
    } catch (err) {
      console.error("Unlink error:", err);
      showToast('Failed to unlink asset.', 'error');
    }
  };

  const toggleSelection = (item: CloudinaryMedia, isMulti: boolean = false) => {
    if (!multiple) {
        handleSelectAsset(item);
        return;
    }

    // Check usage count limit if selecting
    if (!selectedIds.has(item.id) && (item.usageCount || 0) >= 2) {
      showToast('This asset has reached its maximum usage limit (2).', 'error');
      return;
    }

    setSelectedIds(prev => {
        const next = new Set(prev);
        if (next.has(item.id)) {
            next.delete(item.id);
        } else {
            next.add(item.id);
        }
        return next;
    });
  };

  const handleBulkSelect = async () => {
    if (!onSelectMultiple || selectedIds.size === 0) return;

    try {
      const selectedItems = mediaList.filter(item => selectedIds.has(item.id));
      const urls = selectedItems.map(item => item.url);

      // Increment usage count for all selected items
      const promises = selectedItems.map(item => {
          const mediaDocRef = doc(db, 'media', item.id);
          const updates: any = {
            usageCount: increment(1)
          };
          if (usageContext) {
            updates.usedIn = arrayUnion(usageContext);
          }
          return updateDoc(mediaDocRef, updates);
      });

      await Promise.all(promises);
      onSelectMultiple(urls);
      setSelectedIds(new Set());
    } catch (err) {
      console.error("Bulk selection error:", err);
      showToast('Failed to update asset usage. Some items may not have been saved.', 'error');
    }
  };

  // Keyboard shortcut: Enter to confirm selection
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && multiple && selectedIds.size > 0) {
        // Prevent accidental submission if focus is on an input
        if (document.activeElement?.tagName === 'INPUT' || document.activeElement?.tagName === 'TEXTAREA') {
          return;
        }
        e.preventDefault();
        handleBulkSelect();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [multiple, selectedIds, handleBulkSelect]);

  // Lasso Selection Logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!multiple) return;
    if (e.button !== 0) return; // Only left click
    
    // If clicking directly on an action button or search, don't start lasso
    if ((e.target as HTMLElement).closest('button, input')) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    setLassoStart({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setLassoEnd({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    setIsLassoing(true);

    // If not holding Ctrl/Shift, clear existing selection
    if (!e.ctrlKey && !e.shiftKey) {
        // setSelectedIds(new Set()); // Maybe keep selection? Windows usually clears it.
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isLassoing || !lassoStart) return;

    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    setLassoEnd({ x: currentX, y: currentY });

    // Real-time selection update (optional, but feels better)
    const box = {
        left: Math.min(lassoStart.x, currentX),
        right: Math.max(lassoStart.x, currentX),
        top: Math.min(lassoStart.y, currentY),
        bottom: Math.max(lassoStart.y, currentY)
    };

    const newSelection = new Set(e.ctrlKey || e.shiftKey ? selectedIds : []);
    
    // Find all item elements and check if they intersect the box
    const items = containerRef.current?.querySelectorAll('.asset-card');
    items?.forEach((itemEl) => {
        const id = itemEl.getAttribute('data-id');
        if (!id) return;

        const mediaItem = mediaList.find(m => m.id === id);
        if (!mediaItem || (mediaItem.usageCount || 0) >= 2) return;

        const itemRect = (itemEl as HTMLElement).getBoundingClientRect();
        const containerRect = containerRef.current!.getBoundingClientRect();
        
        const relativeItem = {
            left: itemRect.left - containerRect.left,
            right: itemRect.right - containerRect.left,
            top: itemRect.top - containerRect.top,
            bottom: itemRect.bottom - containerRect.top
        };

        // Check intersection
        if (
            box.left < relativeItem.right &&
            box.right > relativeItem.left &&
            box.top < relativeItem.bottom &&
            box.bottom > relativeItem.top
        ) {
            newSelection.add(id);
        }
    });

    setSelectedIds(newSelection);
  };

  const handleMouseUp = () => {
    setIsLassoing(false);
    setLassoStart(null);
    setLassoEnd(null);
  };

  const handleDelete = (item: CloudinaryMedia) => {
    confirmDelete(
        async () => {
            await deleteFromCloudinary(item.id, item.public_id, item.resource_type || 'image');
        },
        {
            firstMessage: "Delete this architectural asset from Cloudinary?",
            secondMessage: "FINAL CONFIRMATION: This will permanently remove the file from your media library and Cloudinary storage.",
            successMessage: "Asset deleted."
        }
    );
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
    <div 
        ref={containerRef}
        className={`cloudinary-uploader p-8 select-none relative ${isLassoing ? 'cursor-crosshair' : ''}`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
    >
      {/* Lasso Selection Box */}
      {isLassoing && lassoStart && lassoEnd && (
          <div 
            className="absolute border-2 border-luxury-gold bg-luxury-gold/10 z-50 pointer-events-none rounded-sm shadow-glow-gold/20"
            style={{
                left: Math.min(lassoStart.x, lassoEnd.x),
                top: Math.min(lassoStart.y, lassoEnd.y),
                width: Math.abs(lassoStart.x - lassoEnd.x),
                height: Math.abs(lassoStart.y - lassoEnd.y)
            }}
          />
      )}

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
        {filteredMedia.map((item) => {
          const isSelected = selectedIds.has(item.id);
          const isLimitReached = (item.usageCount || 0) >= 2;
          
          return (
            <div 
                key={item.id} 
                data-id={item.id}
                onClick={(e) => {
                    if (multiple) {
                        e.stopPropagation();
                        toggleSelection(item, true);
                    }
                }}
                className={`asset-card group relative aspect-square rounded-2xl overflow-hidden border transition-all duration-300 shadow-xl cursor-pointer ${
                    isSelected 
                        ? 'border-luxury-gold ring-2 ring-luxury-gold ring-offset-4 ring-offset-luxury-obsidian scale-95 shadow-glow-gold' 
                        : 'border-white/5 bg-white/5 hover:border-luxury-gold/30'
                } ${isLimitReached && !isSelected ? 'opacity-40 grayscale' : ''}`}
            >
              <img 
                src={item.url.replace('/upload/', '/upload/f_auto,q_auto,w_400/')} 
                alt="Media" 
                className={`w-full h-full object-cover transition-transform duration-700 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}
                loading="lazy"
              />
              
              {/* Selection Badge */}
              {isSelected && (
                  <div className="absolute top-3 right-3 bg-luxury-gold text-white p-1.5 rounded-full shadow-lg z-20 animate-scaleIn">
                      <CheckCircle size={16} fill="currentColor" className="text-luxury-obsidian" />
                  </div>
              )}

              {/* Hover Actions */}
              <div className={`absolute inset-0 bg-black/60 transition-opacity flex flex-col items-center justify-center gap-3 p-4 ${
                  multiple ? (isSelected ? 'opacity-0 hover:opacity-100' : 'opacity-0') : 'opacity-0 group-hover:opacity-100'
              }`}>
                  {!multiple && onSelect ? (
                      <button 
                          onClick={() => handleSelectAsset(item)}
                          disabled={isLimitReached}
                          className={`w-full py-2 text-[10px] font-bold uppercase tracking-widest rounded-lg transition-all shadow-glow-gold ${
                            isLimitReached 
                            ? 'bg-gray-500 text-gray-300 cursor-not-allowed shadow-none' 
                            : 'bg-luxury-gold text-white hover:bg-white hover:text-luxury-charcoal'
                          }`}
                      >
                          {isLimitReached ? 'Limit Reached' : 'Select Asset'}
                      </button>
                  ) : !multiple && (
                      <>
                          <button 
                              onClick={(e) => { e.stopPropagation(); copyToClipboard(item.url); }}
                              className="w-full py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest rounded-lg hover:bg-luxury-gold hover:text-white transition-all"
                          >
                              Copy Asset URL
                          </button>
                          <button 
                              onClick={(e) => { e.stopPropagation(); handleDelete(item); }}
                              className="w-full py-2 bg-red-500/20 text-red-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-red-500/30 hover:bg-red-500 hover:text-white transition-all"
                          >
                              Delete Asset
                          </button>
                      </>
                  )}
              </div>

            <div className="absolute bottom-2 left-2 right-2 flex justify-between items-center bg-black/60 backdrop-blur-md px-2 py-1.5 rounded-lg border border-white/10">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-white uppercase tracking-tighter truncate max-w-[80px]">{item.public_id.split('/').pop()}</span>
                <span className={`text-[8px] font-bold uppercase ${isLimitReached && !isSelected ? 'text-red-400' : 'text-gray-400'}`}>
                  Used: {item.usageCount || 0}/2
                </span>
              </div>
              <span className="text-[9px] text-luxury-gold font-bold bg-luxury-gold/10 px-1.5 py-0.5 rounded border border-luxury-gold/20">{(item.bytes / 1024).toFixed(0)}KB</span>
            </div>

            {/* Usage Details Overlay for Limit Reached */}
            {isLimitReached && !isSelected && item.usedIn && item.usedIn.length > 0 && (
                <div className="absolute inset-0 bg-luxury-obsidian/95 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all p-4 flex flex-col z-30">
                    <h5 className="text-[10px] font-bold text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                        <X size={12} /> Allocation Limit Reached
                    </h5>
                    <div className="flex-1 space-y-3 overflow-y-auto no-scrollbar">
                        {item.usedIn.map((usage, uidx) => (
                            <div key={uidx} className="bg-white/5 border border-white/10 rounded-lg p-2 flex justify-between items-center group/usage">
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-white truncate max-w-[120px]">{usage.title}</span>
                                    <span className="text-[8px] text-gray-500 uppercase">{usage.type}</span>
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handleUnlink(item, usage); }}
                                    className="p-1.5 bg-red-500/10 text-red-500 rounded-md hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover/usage:opacity-100"
                                    title="Unlink from this location"
                                >
                                    <Trash2 size={12} />
                                </button>
                            </div>
                        ))}
                    </div>
                    <p className="text-[8px] text-gray-500 mt-2 italic">* Unlink from an old location to reuse this asset.</p>
                </div>
            )}
          </div>
          );
        })}
      </div>

      {/* Multi-Selection Bar */}
      {multiple && selectedIds.size > 0 && (
          <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-luxury-obsidian/90 backdrop-blur-xl border border-luxury-gold/30 px-8 py-4 rounded-2xl shadow-glow-gold/20 flex items-center gap-8 z-[100] animate-slideUp">
              <div className="flex flex-col">
                  <span className="text-white font-serif font-bold text-lg">{selectedIds.size} Assets Selected</span>
                  <span className="text-[10px] text-gray-400 uppercase tracking-widest">Multi-Select Mode Active</span>
              </div>
              <div className="flex gap-3">
                  <button 
                    onClick={() => setSelectedIds(new Set())}
                    className="px-4 py-2 text-xs font-bold text-gray-500 hover:text-white transition-colors"
                  >
                    Clear All
                  </button>
                  <button 
                    onClick={handleBulkSelect}
                    className="bg-luxury-gold text-white px-6 py-2 rounded-xl text-xs font-bold uppercase tracking-widest shadow-luxury hover:scale-105 transition-all"
                  >
                    Confirm Selection
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

export default CloudinaryUploader;
