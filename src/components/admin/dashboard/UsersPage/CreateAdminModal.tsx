'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Plus, UserPlus } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'

const createAdminSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
})

type CreateAdminFormData = z.infer<typeof createAdminSchema>

interface CreateAdminModalProps {
  onUserCreated?: () => void
  currentUserId?: string
  users?: any[]
}

export function CreateAdminModal({
  onUserCreated,
  currentUserId,
  users = [],
}: CreateAdminModalProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()

  // Verificar si el usuario actual es el primer admin
  const adminUsers = users.filter((user) => user.role === 'admin' || user.role === 'ADMIN')

  console.log('🔍 Admin users check:', {
    allUsers: users.map((u) => ({ id: u.id, role: u.role, createdAt: u.createdAt })),
    adminUsers: adminUsers.map((u) => ({ id: u.id, role: u.role, createdAt: u.createdAt })),
    currentUserId,
  })

  const firstAdmin =
    adminUsers.length > 0
      ? adminUsers.reduce((oldest, current) =>
          new Date(oldest.createdAt) < new Date(current.createdAt) ? oldest : current,
        )
      : null

  const isFirstAdmin = firstAdmin?.id === currentUserId

  console.log('👑 First admin calculation:', {
    firstAdmin,
    isFirstAdmin,
    currentUserId,
  })

  const form = useForm<CreateAdminFormData>({
    resolver: zodResolver(createAdminSchema),
    defaultValues: {
      email: '',
      password: '',
      name: '',
    },
  })

  // Si no es el primer admin, no mostrar el botón
  if (!isFirstAdmin) {
    return null
  }

  const onSubmit = async (data: CreateAdminFormData) => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/admin/create-user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.error || 'Error al crear usuario')
      }

      toast({
        title: 'Usuario creado exitosamente',
        description: `${result.user.email} ha sido creado como administrador`,
        variant: 'default',
      })

      form.reset()
      setOpen(false)
      onUserCreated?.()
    } catch (error) {
      toast({
        title: 'Error al crear usuario',
        description: error instanceof Error ? error.message : 'Error desconocido',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 dark:border-gray-800 bg-white/60 dark:bg-gray-900/60 backdrop-blur-sm hover:bg-white/80 dark:hover:bg-gray-900/80 text-gray-700 dark:text-gray-300 transition-colors">
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Crear Admin</span>
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="max-w-md mx-4 sm:mx-auto bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl shadow-2xl">
        <AlertDialogHeader>
          <div className="flex items-start sm:items-center gap-3">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/20">
              <UserPlus
                className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400"
                strokeWidth={1.5}
              />
            </div>
            <div className="flex-1 min-w-0">
              <AlertDialogTitle className="text-gray-900 dark:text-gray-100 text-base sm:text-lg font-semibold">
                Crear Nuevo Administrador
              </AlertDialogTitle>
            </div>
          </div>
          <AlertDialogDescription className="pt-2 text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
            Ingresa los datos del nuevo usuario administrador. Se creará con permisos completos.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                    Nombre completo
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Juan Pérez"
                      className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                    Email
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="admin@ejemplo.com"
                      className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-900 dark:text-gray-100 text-sm font-medium">
                    Contraseña
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Mínimo 6 caracteres"
                        className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 pr-10"
                        {...field}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-gray-500 dark:text-gray-400"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <AlertDialogFooter className="pt-6 flex flex-col sm:flex-row gap-3">
          <AlertDialogCancel asChild onClick={() => setOpen(false)}>
            <Button
              variant="outline"
              className="border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 w-full sm:w-auto"
            >
              Cancelar
            </Button>
          </AlertDialogCancel>
          <AlertDialogAction asChild>
            <Button
              onClick={form.handleSubmit(onSubmit)}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white border-blue-600 hover:border-blue-700 w-full sm:w-auto"
            >
              {isLoading ? 'Creando...' : 'Crear Admin'}
            </Button>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
