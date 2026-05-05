import { useState, useCallback } from 'react';
import { db } from '../lib/firebase';
import { collection, addDoc, deleteDoc, doc, query, orderBy, onSnapshot } from 'firebase/firestore';
import { CloudinaryMedia } from '../types';

const API_BASE_URL = 'http://localhost:5000/api/cloudinary'; // Adjust based on your server config

export const useCloudinary = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getSignature = async (folder?: string, public_id?: string) => {
    const response = await fetch(`${API_BASE_URL}/sign`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ folder, public_id }),
    });
    return response.json();
  };

  const uploadToCloudinary = async (file: File, folder?: string, onProgress?: (progress: number) => void, publicId?: string) => {
    try {
      setLoading(true);
      setError(null);

      // 1. Get signature from backend
      const data = await getSignature(folder, publicId);
      
      if (!data || data.error) {
        throw new Error(data?.error || 'Failed to get upload signature');
      }

      const { signature, timestamp, api_key, cloud_name, folder: signedFolder, public_id: signedPublicId } = data;

      if (!cloud_name) {
        throw new Error('Cloudinary Cloud Name is not configured');
      }

      // 2. Prepare upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', api_key);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      
      // Use exactly what was signed by the backend to avoid 401 errors
      if (signedFolder) formData.append('folder', signedFolder);
      if (signedPublicId) formData.append('public_id', signedPublicId);

      // 3. Upload using XHR for progress tracking
      return new Promise<CloudinaryMedia>((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`);

        xhr.upload.onprogress = (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        };

        xhr.onload = async () => {
          if (xhr.status === 200) {
            const result = JSON.parse(xhr.responseText);
            
            // 4. Save to Firebase
            const mediaData: Omit<CloudinaryMedia, 'id'> = {
              url: result.secure_url,
              public_id: result.public_id,
              bytes: result.bytes,
              width: result.width,
              height: result.height,
              format: result.format,
              resource_type: result.resource_type, // Save this
              createdAt: Date.now(),
              tags: result.tags || [],
              folder: result.folder || '',
            };

            const docRef = await addDoc(collection(db, 'media'), mediaData);
            resolve({ id: docRef.id, ...mediaData });
          } else {
            reject(new Error('Upload failed'));
          }
        };

        xhr.onerror = () => reject(new Error('Upload error'));
        xhr.send(formData);
      });
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteFromCloudinary = async (id: string, public_id: string, resource_type: string = 'image', retries = 3) => {
    try {
      setLoading(true);
      
      let attempt = 0;
      let success = false;
      
      while (attempt < retries && !success) {
        try {
          const response = await fetch('/api/cloudinary/delete', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              public_id: public_id,
              resource_type: resource_type || 'image'
            }),
          });

          if (response.ok) {
            success = true;
          } else {
            attempt++;
            if (attempt < retries) await new Promise(r => setTimeout(r, 1000 * attempt));
          }
        } catch (e) {
          attempt++;
          if (attempt < retries) await new Promise(r => setTimeout(r, 1000 * attempt));
        }
      }

      if (!success) throw new Error('Cloudinary deletion failed after retries');

      // 3. Delete from Firebase
      await deleteDoc(doc(db, 'media', id));
      
      return true;
    } catch (err: any) {
      setError(err.message);
      console.error('Delete error:', err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    uploadToCloudinary,
    deleteFromCloudinary,
    loading,
    error
  };
};
