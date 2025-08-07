export const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export type AcceptedImageType = typeof ACCEPTED_IMAGE_TYPES[number];

export interface ImageDimensions {
    width: number;
    height: number;
}

export interface ImageFile {
    file: File;
    url: string;
    dimensions: ImageDimensions;
}

export interface ImageMetadata {
    src: string;
    alt: string;
    width: number;
    height: number;
}

export interface ImageFileMetadata {
    width: number;
    height: number;
    size: number;
    type: AcceptedImageType;
}

export interface OptimizedImage {
    src: string;
    url?: string;
    key?: string;
    alt?: string;
    caption?: string;
    width: number;
    height: number;
    blurDataURL?: string;
} 
