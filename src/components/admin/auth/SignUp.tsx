// components/admin/auth/SignUp.tsx - Notion-style design identical to SignIn with first admin verification
'use client'

// Basic components without external dependencies
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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-600" />
          <p className="text-gray-600">Checking configuration...</p>
        </div>
      </div>
    )
  }

  // If admin already exists, show message that registration is disabled
  if (hasAdmin) {
    return (
      <div className="min-h-screen bg-white relative">
        {/* Back to home button */}
        <div className="absolute top-8 left-8 z-20">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </a>
        </div>

        <div className="flex min-h-screen items-center justify-center p-8">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="flex items-center justify-center gap-3 mb-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 text-green-600">
                  <CheckCircle className="h-5 w-5" strokeWidth={2} />
                </div>
                <div className="text-left">
                  <h1 className="text-xl font-bold text-gray-900 tracking-tight">Nova CMS</h1>
                  <p className="text-sm text-gray-500">System Configured</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 border border-gray-200 shadow-sm">
              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-green-600" />
                </div>

                <h2 className="text-lg font-bold text-gray-900 mb-2">Registration Disabled</h2>

                <p className="text-gray-600 mb-6 text-sm leading-relaxed">
                  The main administrator has already been created. Registration of new users is
                  disabled for security.
                </p>

                <div className="space-y-3">
                  <a
                    href="/admin/login"
                    className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors font-medium"
                  >
                    Sign In
                  </a>

                  <p className="text-sm text-gray-500">
                    Need to create more users? Do it from the admin panel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Registration form (only if no admin exists) - NOTION-STYLE DESIGN
  return (
    <div className="min-h-screen theme-bg relative">
      {/* Clean editorial background */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-gray-100/50 dark:from-gray-950 dark:to-gray-900/50" />

      {/* Subtle floating elements */}
      <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-blue-500/8 to-transparent rounded-full blur-3xl animate-pulse opacity-60" />
      <div
        className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-tl from-purple-500/6 to-transparent rounded-full blur-3xl animate-pulse opacity-40"
        style={{ animationDelay: '2s' }}
      />

      {/* Back to home button */}
      <div className="absolute top-8 left-8 z-20">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm theme-text-secondary hover:theme-text transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to home
        </a>
      </div>

      <div className="relative z-10 flex min-h-screen items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl theme-accent-bg theme-text">
                <Package className="h-6 w-6" strokeWidth={2} />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-semibold theme-text tracking-tight">Nova CMS</h1>
                <p className="text-sm theme-text-secondary font-medium">
                  Create First Administrator
                </p>
              </div>
            </div>
            <p className="text-lg theme-text-secondary font-light">
              Set up your administrator account
            </p>
          </div>

          {/* Form Card */}
          <div className="theme-card rounded-xl p-8 theme-border shadow-sm">
            <form onSubmit={signUp} className="space-y-6">
              {/* Name Field */}
              <div className="space-y-3">
                <label htmlFor={nameId} className="text-sm font-medium theme-text">
                  Full name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  </div>
                  <Input
                    id={nameId}
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`pl-10 rounded-lg theme-border focus:theme-border-focus focus:ring-theme-accent ${
                      errors.name ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                    }`}
                    autoComplete="name"
                    disabled={isLoading}
                  />
                </div>
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-3">
                <label htmlFor={emailId} className="text-sm font-medium theme-text">
                  Email address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  </div>
                  <Input
                    id={emailId}
                    name="email"
                    type="email"
                    placeholder="admin@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 rounded-lg theme-border focus:theme-border-focus focus:ring-theme-accent ${
                      errors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                    }`}
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-3">
                <label htmlFor={passwordId} className="text-sm font-medium theme-text">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-gray-400" strokeWidth={1.5} />
                  </div>
                  <Input
                    id={passwordId}
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 rounded-lg theme-border focus:theme-border-focus focus:ring-theme-accent ${
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
                variant="default"
                size="lg"
                className="w-full font-medium py-3 rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
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
            <p className="text-sm theme-text-secondary">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push('/admin/login')}
                className="theme-accent hover:theme-accent-hover font-medium"
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
