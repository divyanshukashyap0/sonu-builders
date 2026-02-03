import React, { useState, useRef } from 'react';
import { Download, Upload, Trash2, FileJson, AlertCircle, Check } from 'lucide-react';
import {
    exportToJSON,
    importFromJSON,
    clearCollection,
    downloadJSON,
    readJSONFile,
    generateSeedTemplates,
    SeedDataType
} from '../utils/dataSeeding';

interface DataSeederProps {
    collectionType: SeedDataType;
    onDataChanged?: () => void;
}

export default function DataSeeder({ collectionType, onDataChanged }: DataSeederProps) {
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
    const [showConfirmClear, setShowConfirmClear] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const collectionName = `${collectionType}`;

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage(null), 5000);
    };

    const handleExport = async () => {
        setIsExporting(true);
        try {
            const jsonData = await exportToJSON(collectionName);
            downloadJSON(jsonData, collectionName);
            showMessage('success', `Exported ${collectionType} successfully`);
        } catch (error) {
            console.error('Export error:', error);
            showMessage('error', `Failed to export ${collectionType}`);
        } finally {
            setIsExporting(false);
        }
    };

    const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsImporting(true);
        try {
            const data = await readJSONFile(file);
            await importFromJSON(collectionName, data, false);
            showMessage('success', `Imported ${data.length} items successfully`);
            onDataChanged?.();
        } catch (error: any) {
            console.error('Import error:', error);
            showMessage('error', `Import failed: ${error.message}`);
        } finally {
            setIsImporting(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    const handleClear = async () => {
        try {
            await clearCollection(collectionName);
            showMessage('success', `Cleared all ${collectionType}`);
            setShowConfirmClear(false);
            onDataChanged?.();
        } catch (error) {
            console.error('Clear error:', error);
            showMessage('error', `Failed to clear ${collectionType}`);
        }
    };

    const handleDownloadTemplate = () => {
        const templates = generateSeedTemplates(collectionType, 3);
        const jsonData = JSON.stringify(templates, null, 2);
        downloadJSON(jsonData, `${collectionType}_template`);
        showMessage('success', 'Template downloaded');
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white capitalize flex items-center gap-2">
                    <FileJson className="w-5 h-5" />
                    {collectionType} Data
                </h3>
            </div>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <button
                    onClick={handleExport}
                    disabled={isExporting}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isExporting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            Exporting...
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            Export to JSON
                        </>
                    )}
                </button>

                <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isImporting}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    {isImporting ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                            Importing...
                        </>
                    ) : (
                        <>
                            <Upload className="w-4 h-4" />
                            Import from JSON
                        </>
                    )}
                </button>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                />

                <button
                    onClick={handleDownloadTemplate}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                    <FileJson className="w-4 h-4" />
                    Download Template
                </button>

                <button
                    onClick={() => setShowConfirmClear(true)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    <Trash2 className="w-4 h-4" />
                    Clear All
                </button>
            </div>

            {/* Confirmation Dialog */}
            {showConfirmClear && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
                        <div className="flex items-start gap-3 mb-4">
                            <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-full">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                    Clear All {collectionType}?
                                </h3>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    This will permanently delete all {collectionType} from the database.
                                    This action cannot be undone. Consider exporting your data first.
                                </p>
                            </div>
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setShowConfirmClear(false)}
                                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleClear}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                Yes, Clear All
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Messages */}
            {message && (
                <div
                    className={`flex items-center gap-2 p-3 rounded-lg ${message.type === 'success'
                            ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
                        }`}
                >
                    {message.type === 'success' ? (
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0" />
                    ) : (
                        <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    )}
                    <p
                        className={`text-sm ${message.type === 'success'
                                ? 'text-green-700 dark:text-green-400'
                                : 'text-red-700 dark:text-red-400'
                            }`}
                    >
                        {message.text}
                    </p>
                </div>
            )}

            {/* Instructions */}
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">
                    How to use:
                </h4>
                <ul className="text-sm text-blue-700 dark:text-blue-300 space-y-1 list-disc list-inside">
                    <li>Export current data to create a backup</li>
                    <li>Download template to see the required data format</li>
                    <li>Import JSON files to bulk add/update items</li>
                    <li>Clear all to remove all items (use with caution!)</li>
                </ul>
            </div>
        </div>
    );
}
