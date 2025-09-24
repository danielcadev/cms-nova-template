'use client'

import { CheckCircle2, XCircle, Youtube } from 'lucide-react'
import { memo } from 'react'
import { useFormContext } from 'react-hook-form'
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
  const { control, watch } = useFormContext()
  // Use watch array to get stable reference instead of useWatch
  const [videoUrl] = watch(['videoUrl'])
  const currentVideoUrl = videoUrl || ''
  const embedUrl = getYoutubeEmbedUrl(currentVideoUrl)
  const isValid = isValidYoutubeUrl(currentVideoUrl)

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center">
        <h3 className="text-xl sm:text-2xl font-bold theme-text mb-2 sm:mb-3">Promotional Video</h3>
        <p className="text-xs sm:text-sm theme-text-secondary max-w-2xl mx-auto leading-relaxed px-4">
          Add a YouTube video to showcase the best of your plan. Videos significantly increase
          conversions.
        </p>
      </div>

      <div className="theme-card rounded-xl p-4 sm:p-6 lg:p-8 theme-border">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 items-start">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                <Youtube className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 dark:text-red-400" />
              </div>
              <h4 className="text-lg sm:text-xl font-semibold theme-text">Video Configuration</h4>
            </div>

            <FormField
              control={control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-base sm:text-lg font-semibold theme-text">
                    YouTube Video URL
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Youtube className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 theme-text-secondary" />
                      <Input
                        {...field}
                        placeholder="https://youtube.com/watch?v=..."
                        className={cn(
                          'pl-10 sm:pl-12 text-sm sm:text-base py-2 sm:py-3',
                          currentVideoUrl &&
                            (isValid
                              ? 'border-green-500 focus:border-green-500'
                              : 'border-red-500 focus:border-red-500'),
                        )}
                      />
                      {currentVideoUrl && (
                        <div className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2">
                          {isValid ? (
                            <CheckCircle2 className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
                          )}
                        </div>
                      )}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="theme-bg-secondary/50 rounded-lg p-3 sm:p-4">
              <p className="text-xs sm:text-sm theme-text-secondary leading-relaxed">
                <strong>Video tips:</strong>
                <br />• Ideal duration: 1-3 minutes
                <br />• Show the best moments of the destination
                <br />• Include customer testimonials if possible
                <br />• Make sure it has good image quality
              </p>
            </div>
          </div>

          <div className="w-full">
            <div className="space-y-3 sm:space-y-4">
              <h4 className="text-base sm:text-lg font-semibold theme-text">Preview</h4>
              {embedUrl && isValid ? (
                <div className="aspect-video w-full rounded-xl overflow-hidden theme-border shadow-lg">
                  <iframe
                    src={embedUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Promotional video"
                  />
                </div>
              ) : (
                <div className="aspect-video w-full rounded-xl theme-bg-secondary flex items-center justify-center theme-border">
                  <div className="text-center px-4">
                    <Youtube className="h-10 w-10 sm:h-12 sm:w-12 theme-text-secondary mx-auto mb-2 sm:mb-3" />
                    <p className="theme-text-secondary font-medium text-sm sm:text-base">
                      Video preview
                    </p>
                    <p className="text-xs sm:text-sm theme-text-secondary mt-1">
                      Paste a valid YouTube URL to see the video here
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
