import React, { useState, useEffect } from 'react';
import { Link, Image as ImageIcon, Check, AlertCircle } from 'lucide-react';

interface ImageUploaderProps {
    onUpload: (url: string) => void;
    existingUrl?: string;
    path?: string; // Deprecated: kept for compatibility
    aspectRatio?: number; // Deprecated
    maxSizeMB?: number; // Deprecated
    label?: string;
    className?: string;
}

export default function ImageUploader({
    onUpload,
    existingUrl,
    label = 'Image URL',
    className = '',
}: ImageUploaderProps) {
    const [url, setUrl] = useState(existingUrl || '');
    const [isValid, setIsValid] = useState(true);
    const [isChecking, setIsChecking] = useState(false);

    useEffect(() => {
        setUrl(existingUrl || '');
    }, [existingUrl]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newUrl = e.target.value;
        setUrl(newUrl);

        // optimistic update
        onUpload(newUrl);

        if (newUrl) {
            setIsChecking(true);
        } else {
            setIsValid(true);
            setIsChecking(false);
        }
    };

    const handleImageLoad = () => {
        setIsValid(true);
        setIsChecking(false);
    };

    const handleImageError = () => {
        // Don't mark as invalid for submission, just show preview error
        // blocking submission for CORS/Hotlink protection is annoying
        setIsValid(false);
        setIsChecking(false);
    };

    return (
        <div className={`space-y-3 ${className}`}>
            {label && (
                <label className="block text-[10px] uppercase tracking-widest text-stone-500 font-bold">
                    {label}
                </label>
            )}

            <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Link className="h-4 w-4 text-stone-500" />
                </div>
                <input
                    type="text"
                    value={url}
                    onChange={handleChange}
                    className={`block w-full pl-10 pr-3 py-3 bg-white/5 border ${isValid ? 'border-white/10 focus:border-luxury-gold/50' : 'border-yellow-500/50 focus:border-yellow-500'} rounded-xl text-white placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-luxury-gold/50 transition-all text-sm font-medium`}
                    placeholder="https://example.com/image.jpg"
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    {url && !isChecking && isValid && <Check className="h-4 w-4 text-green-500" />}
                    {url && !isChecking && !isValid && <AlertCircle className="h-4 w-4 text-yellow-500" />}
                </div>
            </div>

            {url && (
                <div className="relative aspect-video w-full rounded-xl overflow-hidden bg-stone-900 border border-white/5 group">
                    <img
                        src={url}
                        alt="Preview"
                        className={`w-full h-full object-cover transition-opacity duration-300 ${isValid ? 'opacity-100' : 'opacity-20'}`}
                        onLoad={handleImageLoad}
                        onError={handleImageError}
                        referrerPolicy="no-referrer"
                    />
                    {!isValid && !isChecking && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-yellow-500 p-4 text-center">
                            <AlertCircle className="w-6 h-6 mb-2" />
                            <span className="text-xs uppercase tracking-widest font-bold">Preview Unavailable</span>
                            <span className="text-[10px] opacity-60 mt-1">URL saved, but image prevented external loading.</span>
                        </div>
                    )}
                    {isValid && (
                        <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <span className="bg-stone-950/80 text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1 rounded-full backdrop-blur-sm">
                                Preview
                            </span>
                        </div>
                    )}
                </div>
            )}

            {!url && (
                <div className="flex items-center justify-center h-24 border border-dashed border-white/10 rounded-xl bg-white/5">
                    <div className="text-center">
                        <ImageIcon className="mx-auto h-6 w-6 text-stone-600 mb-1" />
                        <span className="text-[10px] text-stone-600 uppercase tracking-widest block">No Image</span>
                    </div>
                </div>
            )}
        </div>
    );
}
