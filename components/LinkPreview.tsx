import React, { useState, useEffect } from 'react';
import { ExternalLink, Copy, Check, AlertCircle, Loader } from 'lucide-react';
import { validateUrl, getDomainFromUrl } from '../utils/linkValidation';

interface LinkPreviewProps {
    url: string;
    onValidate?: (isValid: boolean) => void;
    showPreview?: boolean;
}

export default function LinkPreview({ url, onValidate, showPreview = true }: LinkPreviewProps) {
    const [isValidating, setIsValidating] = useState(false);
    const [isValid, setIsValid] = useState<boolean | null>(null);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (!url) {
            setIsValid(null);
            return;
        }

        const validate = async () => {
            setIsValidating(true);
            const valid = validateUrl(url);
            setIsValid(valid);
            onValidate?.(valid);
            setIsValidating(false);
        };

        validate();
    }, [url, onValidate]);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(url);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy:', err);
        }
    };

    if (!url) return null;

    const domain = getDomainFromUrl(url);

    return (
        <div className="space-y-2">
            {showPreview && (
                <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600">
                    {/* Status Icon */}
                    <div className="flex-shrink-0 mt-0.5">
                        {isValidating ? (
                            <Loader className="w-4 h-4 text-gray-400 animate-spin" />
                        ) : isValid === true ? (
                            <Check className="w-4 h-4 text-green-600" />
                        ) : isValid === false ? (
                            <AlertCircle className="w-4 h-4 text-red-600" />
                        ) : null}
                    </div>

                    {/* Link Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                                {domain || 'Invalid URL'}
                            </p>
                            {isValid && (
                                <a
                                    href={url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex-shrink-0 text-blue-600 hover:text-blue-700"
                                    title="Open in new tab"
                                >
                                    <ExternalLink className="w-3 h-3" />
                                </a>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {url}
                        </p>
                    </div>

                    {/* Copy Button */}
                    <button
                        onClick={handleCopy}
                        className="flex-shrink-0 p-2 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                        title="Copy URL"
                    >
                        {copied ? (
                            <Check className="w-4 h-4 text-green-600" />
                        ) : (
                            <Copy className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        )}
                    </button>
                </div>
            )}

            {/* Validation Status */}
            {!showPreview && (
                <div className="flex items-center gap-2">
                    {isValidating ? (
                        <Loader className="w-4 h-4 text-gray-400 animate-spin" />
                    ) : isValid === true ? (
                        <>
                            <Check className="w-4 h-4 text-green-600" />
                            <span className="text-xs text-green-600">Valid URL</span>
                        </>
                    ) : isValid === false ? (
                        <>
                            <AlertCircle className="w-4 h-4 text-red-600" />
                            <span className="text-xs text-red-600">Invalid URL</span>
                        </>
                    ) : null}
                </div>
            )}
        </div>
    );
}
