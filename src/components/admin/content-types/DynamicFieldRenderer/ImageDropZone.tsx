'use client'

import { Image as ImageIcon, Upload } from 'lucide-react'
import { useState } from 'react'
import type { ImageDropZoneProps } from './data'

export function ImageDropZone({
    fieldId,
    isUploading,
    onFileSelect,
    variant = 'default',
}: ImageDropZoneProps) {
    const [isDragOver, setIsDragOver] = useState(false)

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(true)
    }

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setIsDragOver(false)

        const files = Array.from(e.dataTransfer.files)
        const imageFile = files.find((file) => file.type.startsWith('image/'))

        if (imageFile) {
            onFileSelect(imageFile)
        }
    }

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            onFileSelect(file)
        }
    }

    const outerClasses = variant === 'compact' ? 'p-4 rounded-xl' : 'p-6 rounded-2xl min-h-[200px]'

    const handleClick = () => {
        if (!isUploading) {
            document.getElementById(`file-${fieldId}`)?.click()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
        }
    }

    return (
        <button
            type="button"
            className={`relative border-2 border-dashed ${outerClasses} transition-all duration-200 ${isDragOver
                    ? 'border-gray-400 bg-gray-50/70 dark:bg-gray-800/40 scale-[1.01]'
                    : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600'
                } ${isUploading ? 'pointer-events-none opacity-75' : 'cursor-pointer bg-white/60 dark:bg-gray-900/60 hover:bg-white/80 dark:hover:bg-gray-900/80'}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
        >
            {/* Loading overlay */}
            {isUploading && (
                <div className="absolute inset-0 bg-white/80 dark:bg-gray-900/80 rounded-xl flex items-center justify-center z-10">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-blue-600 mx-auto mb-3"></div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            Uploading image...
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            This may take a few seconds
                        </p>
                    </div>
                </div>
            )}

            <div className="text-center">
                {/* Icon with animation */}
                <div
                    className={`mx-auto mb-4 transition-transform duration-200 ${isDragOver ? 'scale-105' : ''}`}
                >
                    <div
                        className={`${variant === 'compact' ? 'w-12 h-12' : 'w-16 h-16'} mx-auto bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800/40 dark:to-gray-700/40 rounded-2xl flex items-center justify-center`}
                    >
                        <ImageIcon
                            className={`${variant === 'compact' ? 'h-6 w-6' : 'h-8 w-8'} transition-colors duration-200 ${isDragOver ? 'text-gray-700 dark:text-gray-300' : 'text-gray-500 dark:text-gray-400'
                                }`}
                        />
                    </div>
                </div>

                {/* Main text */}
                <div className="mb-4">
                    <h3
                        className={`text-lg font-semibold mb-2 transition-colors duration-200 text-gray-900 dark:text-gray-100`}
                    >
                        {isDragOver ? 'Drop the image here!' : 'Upload image'}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        {isDragOver ? 'Drop the file to upload' : 'Drag and drop an image or click to select'}
                    </p>
                </div>

                {/* Action button */}
                <div className="mb-4">
                    <div
                        className={`inline-flex items-center ${variant === 'compact' ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'} rounded-lg font-medium transition-all duration-200 ${isDragOver
                                ? 'bg-gray-900 text-white shadow'
                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                            }`}
                    >
                        <Upload className="h-4 w-4 mr-2" />
                        {isDragOver ? 'Soltar archivo' : 'Seleccionar archivo'}
                    </div>
                </div>

                {/* File info */}
                <div className="space-y-1">
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                        Supported formats: PNG, JPG, GIF, WebP
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Max size: 10MB</p>
                    <div className="flex items-center justify-center gap-1 mt-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <p className="text-xs text-green-600 dark:text-green-400 font-medium">
                            Stored in AWS S3
                        </p>
                    </div>
                </div>
            </div>

            {/* Hidden file input */}
            <input
                id={`file-${fieldId}`}
                type="file"
                className="sr-only"
                accept="image/*"
                disabled={isUploading}
                onChange={handleFileChange}
            />
        </button>
    )
}
