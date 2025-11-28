'use client'

import { ArrowLeft, CheckCircle, Loader2, Lock, Mail, Package, Shield, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useEffect, useId, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function SignUp() {
  const router = useRouter()

  const nameId = useId()
  const emailId = useId()
  const passwordId = useId()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState({
    name: '',
    email: '',
    password: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isCheckingAdmin, setIsCheckingAdmin] = useState(true)
  const [hasAdmin, setHasAdmin] = useState(false)

  // Check if admin already exists
  useEffect(() => {
    const checkExistingAdmin = async () => {
      try {
        const response = await fetch('/api/admin/check-first-admin')
        const data = await response.json()
        setHasAdmin(data.hasAdmin)
      } catch (error) {
        console.error('Error checking admin:', error)
        // In case of error, allow registration
        setHasAdmin(false)
      } finally {
        setIsCheckingAdmin(false)
      }
    }

    checkExistingAdmin()
  }, [])

  const validateForm = () => {
    let isValid = true
    const newErrors = { name: '', email: '', password: '' }

    // Validate name
    if (!formData.name) {
      newErrors.name = 'Name is required'
      isValid = false
    }

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

  const signUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/create-first-admin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        // Success - redirect to login
        alert('Administrator created successfully! You can now sign in.')
        router.push('/admin/login')
      } else {
        // Server error
        alert(data.error || 'Error creating administrator')
      }
    } catch (error) {
      console.error('Error:', error)
      alert('Connection error. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Show loading while checking if admin exists
  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-zinc-400" />
          <p className="text-zinc-500 font-medium">Checking configuration...</p>
        </div>
      </div>
    )
  }

  // If admin already exists, show message that registration is disabled
  if (hasAdmin) {
    return (
      <div className="min-h-screen bg-zinc-50 relative">
        {/* Back to home button */}
        <div className="absolute top-8 left-8 z-20">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors bg-white/50 backdrop-blur-sm rounded-lg border border-zinc-200/50 hover:bg-white hover:border-zinc-200"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </a>
        </div>

        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-lg shadow-zinc-900/20">
                  <CheckCircle className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="text-left">
                  <h1 className="text-xl font-bold text-zinc-900 tracking-tight">Nova CMS</h1>
                  <p className="text-sm text-zinc-500 font-medium">System Configured</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm">
              <div className="text-center">
                <div className="w-16 h-16 bg-zinc-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-zinc-200">
                  <Shield className="h-8 w-8 text-zinc-400" />
                </div>

                <h2 className="text-xl font-bold text-zinc-900 mb-3">Registration Disabled</h2>

                <p className="text-zinc-500 mb-8 text-sm leading-relaxed">
                  The main administrator has already been created. Registration of new users is
                  disabled for security.
                </p>

                <div className="space-y-4">
                  <a
                    href="/admin/login"
                    className="w-full inline-flex items-center justify-center px-4 py-3 bg-zinc-900 text-white rounded-xl hover:bg-zinc-800 transition-all shadow-lg shadow-zinc-900/10 font-medium"
                  >
                    Sign In to Dashboard
                  </a>

                  <p className="text-xs text-zinc-400">
                    Need to create more users? You can do it from the admin panel after signing in.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Registration form (only if no admin exists) - BENTO DESIGN
  return (
    <div className="min-h-screen bg-zinc-50 relative">
      {/* Back to home button */}
      <div className="absolute top-8 left-8 z-20">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors bg-white/50 backdrop-blur-sm rounded-lg border border-zinc-200/50 hover:bg-white hover:border-zinc-200"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </a>
      </div>

      <div className="flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-zinc-900 text-white shadow-lg shadow-zinc-900/20">
                <Package className="h-6 w-6" strokeWidth={2} />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">Nova CMS</h1>
                <p className="text-sm text-zinc-500 font-medium">Create First Administrator</p>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-zinc-900">Set up your account</h2>
            <p className="text-sm text-zinc-500 mt-2">Create the main administrator account</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm">
            <form onSubmit={signUp} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-2">
                <label htmlFor={nameId} className="text-sm font-medium text-zinc-900">
                  Full name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
                  </div>
                  <Input
                    id={nameId}
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`pl-10 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 ${
                      errors.name ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                    }`}
                    autoComplete="name"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

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
                      errors.password
                        ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                        : ''
                    }`}
                    autoComplete="new-password"
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
                    Creating account...
                  </>
                ) : (
                  'Create administrator account'
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-zinc-500">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/admin/login')}
                className="text-zinc-900 font-medium hover:underline decoration-zinc-900/30 underline-offset-4"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
