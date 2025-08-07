// components/admin/auth/SignUp.tsx - Diseño idéntico al SignIn con verificación de primer admin
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
// Componentes básicos sin dependencias externas
import { Loader2, Package, User, Mail, Lock, ArrowLeft, Shield, CheckCircle } from 'lucide-react';

export default function SignUp() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true);
  const [hasAdmin, setHasAdmin] = useState(false);

  // Verificar si ya existe un administrador
  useEffect(() => {
    const checkExistingAdmin = async () => {
      try {
        const response = await fetch('/api/admin/check-first-admin');
        const data = await response.json();
        setHasAdmin(data.hasAdmin);
      } catch (error) {
        console.error('Error checking admin:', error);
        // En caso de error, permitir el registro
        setHasAdmin(false);
      } finally {
        setIsCheckingAdmin(false);
      }
    };

    checkExistingAdmin();
  }, []);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { name: '', email: '', password: '' };

    // Validar nombre
    if (!formData.name) {
      newErrors.name = 'El nombre es requerido';
      isValid = false;
    }

    // Validar email
    if (!formData.email) {
      newErrors.email = 'El email es requerido';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
      isValid = false;
    }

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
      isValid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    
    // Limpiar error al cambiar el valor
    if (errors[id as keyof typeof errors]) {
      setErrors(prev => ({
        ...prev,
        [id]: ''
      }));
    }
  };

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/admin/create-first-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // Éxito - redirigir al login
        alert('¡Administrador creado exitosamente! Ahora puedes iniciar sesión.');
        router.push('/admin/login');
      } else {
        // Error del servidor
        alert(data.error || 'Error al crear el administrador');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  // Mostrar loading mientras verifica si hay admin
  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600 dark:text-gray-400">Verificando configuración...</p>
        </div>
      </div>
    );
  }

  // Si ya existe un admin, mostrar mensaje de que el registro está deshabilitado
  if (hasAdmin) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50" />

        {/* Back to home button */}
        <div className="absolute top-8 left-8 z-20">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al inicio
          </a>
        </div>

        <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-400">
                  <CheckCircle className="h-6 w-6" strokeWidth={2} />
                </div>
                <div className="text-left">
                  <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                    CMS Nova
                  </h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                    Sistema Configurado
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-green-600 dark:text-green-400" />
                </div>

                <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">
                  Registro Deshabilitado
                </h2>

                <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                  El administrador principal ya ha sido creado. El registro de nuevos usuarios está deshabilitado por seguridad.
                </p>

                <div className="space-y-3">
                  <a
                    href="/admin/login"
                    className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors font-medium"
                  >
                    Iniciar Sesión
                  </a>

                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    ¿Necesitas crear más usuarios? Hazlo desde el panel de administración.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Formulario de registro (solo si no hay admin) - DISEÑO IDÉNTICO AL LOGIN
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative">
      {/* Clean editorial background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50" />
      
      {/* Subtle floating elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-500/8 to-transparent rounded-full blur-3xl animate-pulse opacity-60" />
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-purple-500/6 to-transparent rounded-full blur-3xl animate-pulse opacity-40" style={{ animationDelay: '2s' }} />

      {/* Back to home button */}
      <div className="absolute top-8 left-8 z-20">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al inicio
        </a>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-md">


          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-900 dark:bg-gray-100 text-white dark:text-gray-900">
                <Package className="h-6 w-6" strokeWidth={2} />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 tracking-tight">
                  CMS Nova
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Crear Primer Administrador
                </p>
              </div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light">
              Configura tu cuenta de administrador
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
            <form onSubmit={signUp} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-3">
                <label htmlFor="name" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Nombre completo
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  </div>
                  <input
                    id="name"
                    type="text"
                    placeholder="Tu nombre completo"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${
                      errors.name
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                        : 'border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-gray-400 dark:focus:ring-gray-500'
                    }`}
                    autoComplete="name"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && (
                  <p className="text-sm text-red-500 dark:text-red-400">{errors.name}</p>
                )}
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Correo electrónico
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  </div>
                  <input
                    id="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${
                      errors.email
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                        : 'border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-gray-400 dark:focus:ring-gray-500'
                    }`}
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && (
                  <p className="text-sm text-red-500 dark:text-red-400">{errors.email}</p>
                )}
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Contraseña
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  </div>
                  <input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full pl-10 pr-3 py-2 rounded-lg border bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 ${
                      errors.password
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                        : 'border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-gray-400 dark:focus:ring-gray-500'
                    }`}
                    autoComplete="new-password"
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gray-900 hover:bg-gray-800 dark:bg-gray-100 dark:hover:bg-gray-200 text-white dark:text-gray-900 font-medium py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creando cuenta...
                  </>
                ) : (
                  'Crear cuenta de administrador'
                )}
              </button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              ¿Ya tienes una cuenta?{' '}
              <button
                onClick={() => router.push('/admin/login')}
                className="text-gray-900 dark:text-gray-100 hover:underline font-medium"
              >
                Inicia sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
