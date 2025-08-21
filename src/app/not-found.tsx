export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="max-w-md w-full text-center space-y-4">
        <h1 className="text-2xl font-bold">Página no encontrada</h1>
        <p className="text-gray-600">La página que buscas no existe o fue movida.</p>
        <a className="text-blue-600 underline" href="/">
          Volver al inicio
        </a>
      </div>
    </div>
  )
}
