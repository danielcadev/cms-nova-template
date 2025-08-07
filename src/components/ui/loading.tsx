// components/ui/loading.tsx

export function Loading() {
  return (
    <div className="fixed inset-0 bg-white z-50">
      {/* Grid decorativo de fondo */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,.02)_1px,transparent_1px),linear-gradient(to_right,rgba(0,0,0,.02)_1px,transparent_1px)] bg-[size:3rem_3rem]" />

      {/* Gradientes decorativos */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-teal-50 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-50 rounded-full blur-3xl opacity-30 animate-pulse" />
      </div>

      {/* Contenedor principal */}
      <div className="relative flex flex-col items-center justify-center min-h-screen gap-8">
        {/* Spinner animado */}
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-4 border-gray-100" />
          <div className="absolute inset-0 rounded-full border-4 border-teal-500 border-t-transparent animate-spin" />
        </div>

        {/* Texto animado */}
        <div className="text-center space-y-3">
          <div className="text-2xl font-semibold text-gray-900">
            Cargando
          </div>
          <div className="flex items-center gap-1 justify-center">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-teal-500 animate-pulse"
                style={{ animationDelay: `${i * 0.2}s` }}
              />
            ))}
          </div>
        </div>

        {/* Texto descriptivo */}
        <div className="text-gray-500 text-sm">
          Preparando todo para ti...
        </div>
      </div>
    </div>
  );
}
