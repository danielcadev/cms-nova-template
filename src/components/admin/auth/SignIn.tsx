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
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when value changes
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }))
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-8">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-lg shadow-zinc-900/20">
              <Package className="h-6 w-6" strokeWidth={2} />
            </div>
            <div className="text-left">
              <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Nova CMS</h1>
              <p className="text-sm text-zinc-500 font-medium">Admin Panel</p>
            </div>
          </div>
          <h2 className="text-xl font-semibold text-zinc-900">Sign in to your workspace</h2>
          <p className="text-sm text-zinc-500 mt-2">Enter your details to access the dashboard</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div className="space-y-2">
              <label htmlFor={emailId} className="text-sm font-medium text-zinc-900">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
                </div>
                <Input
                  id={emailId}
                  name="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className={`pl-10 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 ${
                    errors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                  }`}
                  autoComplete="email"
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor={passwordId} className="text-sm font-medium text-zinc-900">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
                </div>
                <Input
                  id={passwordId}
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className={`pl-10 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 ${
                    errors.password ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                  }`}
                  autoComplete="current-password"
                  disabled={isLoading}
                />
              </div>
              {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              size="lg"
              className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-medium py-3 rounded-xl shadow-lg shadow-zinc-900/10 transition-all duration-200"
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
        <div className="text-center mt-8 space-y-4">
          <p className="text-sm text-zinc-500">
            Don't have an account?{' '}
            <a
              href="/admin/signup"
              className="text-zinc-900 font-medium hover:underline decoration-zinc-900/30 underline-offset-4"
            >
              Create administrator
            </a>
          </p>
          <p className="text-xs text-zinc-400">
            &copy; {new Date().getFullYear()} Nova CMS. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
