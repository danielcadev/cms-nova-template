'use client';

import { useFormContext, useController } from 'react-hook-form';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, Trash2, Image as ImageIcon, AlertTriangle, Settings, ExternalLink } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { type PlanFormValues } from '@/schemas/plan';
import { Skeleton } from '@/components/ui/skeleton';

interface ItineraryDayImageProps {
  fieldIndex: number;
}

export function ItineraryDayImage({ fieldIndex }: ItineraryDayImageProps) {
    const { control, setValue } = useFormContext<PlanFormValues>();
    const fieldName = `itinerary.${fieldIndex}.image` as const;

    const { field } = useController({ name: fieldName, control });
    const [imageUrl, setImageUrl] = useState(field.value || '');
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [s3Config, setS3Config] = useState<any>(null);
    const [isLoadingConfig, setIsLoadingConfig] = useState(true);

    useEffect(() => {
        const fetchS3Config = async () => {
            try {
                const response = await fetch('/api/plugins/s3');
                const data = await response.json();
                if (data.success && data.config) {
                    setS3Config(data.config);
                }
            } catch (error) {
                // No mostramos error, simplemente el componente no se activará
                console.error("No se pudo cargar la configuración de S3", error);
            } finally {
                setIsLoadingConfig(false);
            }
        };
        fetchS3Config();
    }, []);

    const handleUpload = async (file: File) => {
        setIsUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/plugins/s3', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(result.error || 'Error al subir la imagen');
            }

            const newImageUrl = result.url;
            setValue(fieldName, newImageUrl, { shouldDirty: true });
            setImageUrl(newImageUrl);

        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
            setError(errorMessage);
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleDelete = () => {
        setValue(fieldName, '', { shouldDirty: true });
        setImageUrl('');
        setError(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            handleUpload(file);
        }
    };

    if (isLoadingConfig) {
        return <Skeleton className="h-48 w-full" />;
    }

    if (!s3Config) {
        return (
            <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4 text-center text-amber-800 space-y-3">
                    <Settings className="h-8 w-8 mx-auto" />
                    <h4 className="font-semibold">Plugin S3 no configurado</h4>
                    <p className="text-sm">Para subir imágenes, primero debes configurar tus credenciales de S3.</p>
                    <Link href="/admin/dashboard/plugins">
                        <Button variant="link" className="text-amber-800 h-auto p-0">
                            Ir a configurar <ExternalLink className="ml-2 h-4 w-4" />
                        </Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardContent className="p-4 space-y-4">
                {imageUrl ? (
                    <div className="relative group w-full aspect-video rounded-md overflow-hidden">
                        <Image src={imageUrl} alt={`Imagen del día ${fieldIndex + 1}`} layout="fill" objectFit="cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button variant="destructive" size="icon" onClick={handleDelete}>
                                <Trash2 className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-slate-50 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-500">
                            <Upload className="w-8 h-8 mb-4" />
                            <p className="mb-2 text-sm font-semibold">Subir una imagen</p>
                            <p className="text-xs">PNG, JPG, GIF hasta 10MB</p>
                        </div>
                        <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    </label>
                )}
                {isUploading && (
                     <div className="text-sm text-blue-600 flex items-center"><ImageIcon className="h-4 w-4 mr-2 animate-pulse" /> Subiendo...</div>
                )}
                {error && (
                    <div className="text-sm text-red-600 flex items-center"><AlertTriangle className="h-4 w-4 mr-2" /> {error}</div>
                )}
            </CardContent>
        </Card>
    );
} 
