import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../lib/firebase';

/**
 * Compresses an image file before upload
 * @param file - The image file to compress
 * @param maxSizeMB - Maximum file size in MB (default 1MB)
 * @param maxWidthOrHeight - Maximum width or height in pixels (default 1920)
 * @returns Compressed image file
 */
export const compressImage = async (
    file: File,
    maxSizeMB: number = 1,
    maxWidthOrHeight: number = 1920
): Promise<File> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = (event) => {
            const img = new Image();
            img.src = event.target?.result as string;
            img.onload = () => {
                const canvas = document.createElement('canvas');
                let width = img.width;
                let height = img.height;

                // Calculate new dimensions
                if (width > height) {
                    if (width > maxWidthOrHeight) {
                        height *= maxWidthOrHeight / width;
                        width = maxWidthOrHeight;
                    }
                } else {
                    if (height > maxWidthOrHeight) {
                        width *= maxWidthOrHeight / height;
                        height = maxWidthOrHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;

                const ctx = canvas.getContext('2d');
                ctx?.drawImage(img, 0, 0, width, height);

                // Compress with quality adjustment
                canvas.toBlob(
                    (blob) => {
                        if (blob) {
                            const compressedFile = new File([blob], file.name, {
                                type: 'image/jpeg',
                                lastModified: Date.now(),
                            });
                            resolve(compressedFile);
                        } else {
                            reject(new Error('Canvas to Blob conversion failed'));
                        }
                    },
                    'image/jpeg',
                    0.8 // Quality 0-1
                );
            };
            img.onerror = () => reject(new Error('Image load failed'));
        };
        reader.onerror = () => reject(new Error('File read failed'));
    });
};

/**
 * Uploads an image to Firebase Storage
 * @param file - The image file to upload
 * @param path - Storage path (e.g., 'projects/image.jpg')
 * @param onProgress - Optional callback for upload progress (0-100)
 * @returns Promise with the download URL
 */
export const uploadImage = async (
    file: File,
    path: string,
    onProgress?: (progress: number) => void
): Promise<string> => {
    try {
        // Compress image first
        const compressedFile = await compressImage(file);

        // Create storage reference
        const timestamp = Date.now();
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const fullPath = `images/${path}/${timestamp}_${sanitizedName}`;
        const storageRef = ref(storage, fullPath);

        // Upload with resumable upload
        const uploadTask = uploadBytesResumable(storageRef, compressedFile);

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    onProgress?.(Math.round(progress));
                },
                (error) => {
                    console.error('Upload error:', error);
                    reject(error);
                },
                async () => {
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                        resolve(downloadURL);
                    } catch (error) {
                        reject(error);
                    }
                }
            );
        });
    } catch (error) {
        console.error('Image upload failed:', error);
        throw error;
    }
};

/**
 * Deletes an image from Firebase Storage by URL
 * @param url - The full download URL of the image
 */
export const deleteImage = async (url: string): Promise<void> => {
    try {
        // Only delete if it's a Firebase Storage URL
        if (!url.includes('firebasestorage.googleapis.com')) {
            console.log('Not a Firebase Storage URL, skipping delete');
            return;
        }

        // Extract the path from the URL
        const urlObj = new URL(url);
        const pathMatch = urlObj.pathname.match(/\/o\/(.*?)\?/);

        if (pathMatch && pathMatch[1]) {
            const decodedPath = decodeURIComponent(pathMatch[1]);
            const storageRef = ref(storage, decodedPath);
            await deleteObject(storageRef);
            console.log('Image deleted successfully');
        }
    } catch (error) {
        console.error('Error deleting image:', error);
        // Don't throw - deletion failures shouldn't block the UI
    }
};

/**
 * Validates if a file is an image
 * @param file - File to validate
 * @returns true if file is a valid image type
 */
export const isValidImageFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    return validTypes.includes(file.type);
};

/**
 * Validates file size
 * @param file - File to validate
 * @param maxSizeMB - Maximum size in MB
 * @returns true if file size is within limit
 */
export const isValidFileSize = (file: File, maxSizeMB: number = 5): boolean => {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
};
