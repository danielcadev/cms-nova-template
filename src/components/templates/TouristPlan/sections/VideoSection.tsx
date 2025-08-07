'use client';

import { useFormContext, useWatch } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Youtube, CheckCircle2, XCircle } from 'lucide-react';
import { memo } from 'react';
import { cn } from '@/lib/utils';

const isValidYoutubeUrl = (url: string) => {
    if (!url) return true;
    const youtubeRegExp = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})$/;
    return youtubeRegExp.test(url);
};

const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
    const match = url.match(regExp);
    const videoId = (match && match[2].length === 11) ? match[2] : null;
    return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
};

export const VideoSection = memo(function VideoSection() {
    const { control } = useFormContext();
    const videoUrl = useWatch({ control, name: 'videoUrl' }) || '';
    const embedUrl = getYoutubeEmbedUrl(videoUrl);
    const isValid = isValidYoutubeUrl(videoUrl);

    return (
        <Card className="shadow-none border border-slate-200 bg-white rounded-xl">
            <CardHeader>
                <div className="space-y-1">
                    <CardTitle>Video Promocional</CardTitle>
                    <p className="text-sm text-slate-500">
                        Añade un video de YouTube para mostrar lo mejor de tu plan.
                    </p>
                </div>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
                <div className="space-y-4">
                     <FormField
                        control={control}
                        name="videoUrl"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>URL del Video de YouTube</FormLabel>
                                <FormControl>
                                    <div className="relative">
                                        <Youtube className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                                        <Input
                                            {...field}
                                            placeholder="https://youtube.com/watch?v=..."
                                            className={cn("pl-10", videoUrl && (isValid ? "border-green-500" : "border-red-500"))}
                                        />
                                        {videoUrl && (
                                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                                {isValid ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <XCircle className="h-5 w-5 text-red-500" />}
                                            </div>
                                        )}
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                     <p className="text-xs text-slate-500">Pega la URL completa de un video de YouTube. El reproductor aparecerá a la derecha para que puedas previsualizarlo.</p>
                </div>
                <div className="w-full">
                    {embedUrl && isValid ? (
                        <div className="aspect-video w-full rounded-lg overflow-hidden border">
                            <iframe
                                src={embedUrl}
                                className="w-full h-full"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                                title="Video promocional"
                            />
                        </div>
                    ) : (
                         <div className="aspect-video w-full rounded-lg bg-slate-100 flex items-center justify-center">
                            <p className="text-slate-500">Previsualización del video</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    );
}); 
