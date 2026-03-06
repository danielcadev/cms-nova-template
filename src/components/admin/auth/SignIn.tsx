'use client'

import { ArrowLeft, Loader2, Lock, Mail, Package } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useId, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { LanguageSwitcher } from '@/components/admin/shared/LanguageSwitcher'
import { useAuthContext } from '@/contexts/AuthContext'

export default function SignIn() {
  const t = useTranslations('auth.signIn')
  const vt = useTranslations('auth.validation')
  const router = useRouter()
  const { handleAuth: contextHandleAuth } = useAuthContext()

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
  const [isLoading, setIsLoading] = useState(false)

  const validateForm = () => {
    let isValid = true
    const newErrors = { email: '', password: '' }

    // Validate email
    if (!formData.email) {
      newErrors.email = vt('emailRequired')
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = vt('emailInvalid')
      isValid = false
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = vt('passwordRequired')
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

  const signIn = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    try {
      await contextHandleAuth(formData)
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 relative">
      {/* Language Switcher Overlay */}
      <div className="absolute top-8 right-8 z-20">
        <LanguageSwitcher />
      </div>

      {/* Back to home button */}
      <div className="absolute top-8 left-8 z-20">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 text-sm text-zinc-500 hover:text-zinc-900 transition-colors bg-white/50 backdrop-blur-sm rounded-lg border border-zinc-200/50 hover:bg-white hover:border-zinc-200"
        >
          <ArrowLeft className="h-4 w-4" />
          {t('backToHome')}
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
                <p className="text-sm text-zinc-500 font-medium">{t('title')}</p>
              </div>
            </div>
            <h2 className="text-xl font-semibold text-zinc-900">{t('subtitle')}</h2>
            <p className="text-sm text-zinc-500 mt-2">{t('description')}</p>
          </div>

          {/* Form Card */}
          <div className="bg-white rounded-2xl p-8 border border-zinc-200 shadow-sm">
            <form onSubmit={signIn} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <label htmlFor={emailId} className="text-sm font-medium text-zinc-900">
                  {t('emailLabel')}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
                  </div>
                  <Input
                    id={emailId}
                    name="email"
                    type="email"
                    placeholder={t('emailPlaceholder')}
                    value={formData.email}
                    onChange={handleChange}
                    className={`pl-10 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 ${errors.email ? 'border-red-300 focus:border-red-400 focus:ring-red-400' : ''
                      }`}
                    autoComplete="email"
                    disabled={isLoading}
                  />
                </div>
                {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label htmlFor={passwordId} className="text-sm font-medium text-zinc-900">
                    {t('passwordLabel')}
                  </label>
                  {/* Forgot password link could go here */}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-4 w-4 text-zinc-400" strokeWidth={1.5} />
                  </div>
                  <Input
                    id={passwordId}
                    name="password"
                    type="password"
                    placeholder={t('passwordPlaceholder')}
                    value={formData.password}
                    onChange={handleChange}
                    className={`pl-10 bg-zinc-50 border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900 ${errors.password
                      ? 'border-red-300 focus:border-red-400 focus:ring-red-400'
                      : ''
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
                    {t('buttonLoading')}
                  </>
                ) : (
                  t('button')
                )}
              </Button>
            </form>
          </div>

          {/* Footer */}
          <div className="text-center mt-8">
            <p className="text-sm text-zinc-500">
              {t('noAccount')}{' '}
              <button
                type="button"
                onClick={() => router.push('/admin/signup')}
                className="text-zinc-900 font-medium hover:underline decoration-zinc-900/30 underline-offset-4"
              >
                {t('createAdmin')}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}


