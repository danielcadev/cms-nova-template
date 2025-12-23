'use client'

import { CheckCircle2, XCircle, Youtube } from 'lucide-react'
import { memo } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslations } from 'next-intl'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

const isValidYoutubeUrl = (url: string) => {
  if (!url) return true
  const youtubeRegExp =
    /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?([a-zA-Z0-9_-]{11})$/
  return youtubeRegExp.test(url)
}

const getYoutubeEmbedUrl = (url: string) => {
  if (!url) return ''
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/
  const match = url.match(regExp)
  const videoId = match && match[2].length === 11 ? match[2] : null
  return videoId ? `https://www.youtube.com/embed/${videoId}` : ''
}

export const VideoSection = memo(function VideoSection() {
  const t = useTranslations('templates.tourism.edit.sections.video')
  const { control, watch } = useFormContext()
  // Use watch array to get stable reference instead of useWatch
  const [videoUrl] = watch(['videoUrl'])
  const currentVideoUrl = videoUrl || ''
  const embedUrl = getYoutubeEmbedUrl(currentVideoUrl)
  const isValid = isValidYoutubeUrl(currentVideoUrl)

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-xl p-8 border border-zinc-200 shadow-sm">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                <Youtube className="h-5 w-5 text-red-600" />
              </div>
              <h4 className="text-xl font-semibold text-zinc-900">{t('title')}</h4>
            </div>

            <FormField
              control={control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base font-semibold text-zinc-900">
                    {t('fields.videoUrl')}
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Youtube className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-zinc-400" />
                      <Input
                        {...field}
                        placeholder="https://youtube.com/watch?v=..."
                        className={cn(
                          'pl-12 text-base py-3',
                          currentVideoUrl &&
                          (isValid
                            ? 'border-green-500 focus:border-green-500 focus:ring-green-500'
                            : 'border-red-500 focus:border-red-500 focus:ring-red-500'),
                        )}
                      />
                      {currentVideoUrl && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          {isValid ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-5 w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-zinc-50 rounded-lg p-4 border border-zinc-100">
              <p className="text-sm text-zinc-600 leading-relaxed">
                <strong className="text-zinc-900">{t('fields.tipsTitle')}</strong>
                <br />{t('fields.tipsList')}
              </p>
            </div>
          </div>

          <div className="w-full">
            <div className="space-y-4">
              <h4 className="text-lg font-semibold text-zinc-900">{t('fields.preview')}</h4>
              {embedUrl && isValid ? (
                <div className="aspect-video w-full rounded-xl overflow-hidden border border-zinc-200 shadow-lg bg-black">
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Promotional video"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-xl bg-zinc-50 flex items-center justify-center border border-zinc-200">
                  <div className="text-center px-4">
                    <Youtube className="h-12 w-12 text-zinc-300 mx-auto mb-3" />
                    <p className="text-zinc-500 font-medium text-base">{t('fields.preview')}</p>
                    <p className="text-sm text-zinc-400 mt-1">
                      {t('fields.previewPlaceholder')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})
