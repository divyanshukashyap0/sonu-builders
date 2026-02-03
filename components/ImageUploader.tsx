import React, { useState, useRef, DragEvent } from 'react';
import { Upload, X, Check, Loader, Image as ImageIcon } from 'lucide-react';
import { uploadImage, isValidImageFile, isValidFileSize } from '../utils/imageUpload';

interface ImageUploaderProps {
    onUpload: (url: string) => void;
    existingUrl?: string;
    path?: string;
    aspectRatio?: number;
    maxSizeMB?: number;
    label?: string;
    className?: string;
}

export default function ImageUploader({
    onUpload,
    existingUrl,
    path = 'general',
    maxSizeMB = 5,
    label = 'Upload Image',
    className = '',
}: ImageUploaderProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [previewUrl, setPreviewUrl] = useState<string | null>(existingUrl || null);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = Array.from(e.dataTransfer.files);
        if (files.length > 0 && files[0]) {
            await handleFile(files[0]);
        }
    };

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            await handleFile(files[0]);
        }
    };

    const handleFile = async (file: File) => {
        setError(null);
        setSuccess(false);

        // Validate file type
        if (!isValidImageFile(file)) {
            setError('Please upload a valid image file (JPEG, PNG, GIF, or WebP)');
            return;
        }

        // Validate file size
        if (!isValidFileSize(file, maxSizeMB)) {
            setError(`File size must be less than ${maxSizeMB}MB`);
            return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onload = (e) => {
            setPreviewUrl(e.target?.result as string);
        };
        reader.readAsDataURL(file);

        // Upload file
        setIsUploading(true);
        setUploadProgress(0);

        try {
            const url = await uploadImage(file, path, (progress) => {
                setUploadProgress(progress);
            });

            setPreviewUrl(url);
            setSuccess(true);
            onUpload(url);

            // Clear success message after 2 seconds
            setTimeout(() => setSuccess(false), 2000);
        } catch (err) {
            console.error('Upload error:', err);
            setError('Upload failed. Please try again.');
            setPreviewUrl(existingUrl || null);
        } finally {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleRemove = () => {
        setPreviewUrl(null);
        setError(null);
        setSuccess(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <div className={`space-y-2 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    {label}
                </label>
            )}

            <div
                className={`relative border-2 border-dashed rounded-lg transition-all ${isDragging
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : previewUrl
                        ? 'border-gray-300 dark:border-gray-600'
                        : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                    } ${isUploading ? 'cursor-wait' : 'cursor-pointer'}`}
                onDragEnter={handleDragEnter}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={!isUploading ? handleClick : undefined}
            >
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                    onChange={handleFileSelect}
                    className="hidden"
                    disabled={isUploading}
                />

                {previewUrl ? (
                    <div className="relative group">
                        <img
                            src={previewUrl}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                            <button
                                type="button"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                                className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                                disabled={isUploading}
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                        {success && (
                            <div className="absolute top-2 right-2 p-2 bg-green-600 text-white rounded-full">
                                <Check className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
                        {isUploading ? (
                            <>
                                <Loader className="w-12 h-12 text-blue-600 animate-spin mb-3" />
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Uploading... {uploadProgress}%
                                </p>
                                <div className="w-full max-w-xs mt-3 bg-gray-200 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="bg-blue-600 h-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="mb-3 p-3 bg-gray-100 dark:bg-gray-700 rounded-full">
                                    {isDragging ? (
                                        <ImageIcon className="w-8 h-8 text-blue-600" />
                                    ) : (
                                        <Upload className="w-8 h-8 text-gray-400" />
                                    )}
                                </div>
                                <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    {isDragging ? 'Drop image here' : 'Drag & drop an image'}
                                </p>
                                <p className="text-xs text-gray-500">
                                    or click to browse • Max {maxSizeMB}MB
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                    JPEG, PNG, GIF, or WebP
                                </p>
                            </>
                        )}
                    </div>
                )}
            </div>

            {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                    <X className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
                </div>
            )}

            {success && !error && (
                <div className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                    <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <p className="text-sm text-green-700 dark:text-green-400">
                        Upload successful!
                    </p>
                </div>
            )}
        </div>
    );
}
