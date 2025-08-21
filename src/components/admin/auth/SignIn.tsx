// components/admin/auth/SignIn.tsx - Notion Style Design
'use client'

import { Loader2, Lock, Mail, Package } from 'lucide-react'
import { useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuthContext } from '@/contexts/AuthContext'

export default function LoginForm() {
  const { isLoading, handleAuth } = useAuthContext()
  const emailId = useId()
  const passwordId = useId()
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({
    email: '',
    password: '',
  })

  const validateForm = () => {
    let isValid = true
    const newErrors = { email: '', password: '' }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required'
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is not valid'
      isValid = false
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required'
      isValid = false
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      await handleAuth(formData)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Limpiar error al cambiar el valor
    if (errors[id as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [id]: '',
      }))
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 relative">
      {/* Clean editorial background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50" />

      {/* Subtle floating elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-500/8 to-transparent rounded-full blur-3xl animate-pulse opacity-60" />
      <div
        className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-purple-500/6 to-transparent rounded-full blur-3xl animate-pulse opacity-40"
        style={{ animationDelay: '2s' }}
      />

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
                  Nova CMS
                </h1>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">Admin Panel</p>
              </div>
            </div>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-light">
              If this is your first time, you need to create an administrator first.
              <a
                href="/admin/signup"
                className="underline hover:text-gray-800 dark:hover:text-gray-200 ml-1"
              >
                Create administrator
              </a>
            </p>
          </div>

          {/* Form Card */}
          <div className="bg-white dark:bg-gray-900 rounded-xl p-8 border border-gray-200 dark:border-gray-800 shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-3">
                <label
                  htmlFor={emailId}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  </div>
                  <Input
                    id={emailId}
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 rounded-lg border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-gray-400 dark:focus:ring-gray-500 ${
                      errors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
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
                <label
                  htmlFor={passwordId}
                  className="text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  </div>
                  <Input
                    id={passwordId}
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 rounded-lg border-gray-200 dark:border-gray-700 focus:border-gray-400 dark:focus:border-gray-500 focus:ring-gray-400 dark:focus:ring-gray-500 ${
                      errors.password
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                        : ''
                    }`}
                    autoComplete="current-password"
                    disabled={isLoading}
                  />
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500 dark:text-red-400">{errors.password}</p>
                )}
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                variant="default"
                size="lg"
                className="w-full font-medium py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Exclusive access for administrators
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
