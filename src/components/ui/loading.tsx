// components/ui/loading.tsx - Estilo Notion minimalista

export function Loading() {
  return (
    <div className="fixed inset-0 bg-[#191919] z-50">
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-center space-y-8">
          {/* Spinner minimalista estilo Notion */}
          <div className="flex justify-center">
            <div
              className="w-6 h-6 border-2 border-white/20 border-t-white/60 rounded-full animate-spin"
              style={{ animationDuration: '0.8s' }}
            />
          </div>

          {/* Texto simple */}
          <div className="space-y-2">
            <div className="text-lg font-medium text-white/90">Loading</div>
            <div className="text-white/50 text-sm">Please wait...</div>
          </div>
        </div>
      </div>
    </div>
  )
}
