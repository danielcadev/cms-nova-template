'use client'

interface MediaPickerModalProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (mediaUrl: string) => void
}

export function MediaPickerModal({ isOpen, onClose }: MediaPickerModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <button
        type="button"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
        aria-label="Close modal"
      />
      <div className="relative w-full max-w-4xl mx-4 theme-card theme-border border rounded-2xl shadow-xl">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold theme-text">Select Media</h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg theme-card-hover theme-text-secondary hover:theme-text"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <title>Close</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full theme-bg-secondary flex items-center justify-center">
              <svg
                className="w-8 h-8 theme-text-secondary"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Media Library</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold theme-text mb-2">Media Picker Coming Soon</h3>
            <p className="theme-text-secondary">The media picker is currently under development.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
