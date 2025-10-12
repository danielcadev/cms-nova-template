'use client'

// Inspired by react-hot-toast library
import * as React from 'react'

import type { ToastActionElement, ToastProps } from '@/components/ui/toast'

const TOAST_LIMIT = 3
const TOAST_REMOVE_DELAY = 5000

type ToasterToast = ToastProps & {
  id: string
  title?: React.ReactNode
  description?: React.ReactNode
  action?: ToastActionElement
  icon?: React.ReactNode
}

let count = 0

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER
  return count.toString()
}

type Action =
  | {
      type: 'ADD_TOAST'
      toast: ToasterToast
    }
  | {
      type: 'UPDATE_TOAST'
      toast: Partial<ToasterToast>
    }
  | {
      type: 'DISMISS_TOAST'
      toastId?: ToasterToast['id']
    }
  | {
      type: 'REMOVE_TOAST'
      toastId?: ToasterToast['id']
    }

interface State {
  toasts: ToasterToast[]
}

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>()

const addToRemoveQueue = (toastId: string) => {
  if (toastTimeouts.has(toastId)) {
    return
  }

  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId)
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    })
  }, TOAST_REMOVE_DELAY)

  toastTimeouts.set(toastId, timeout)
}

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      }

    case 'UPDATE_TOAST':
      return {
        ...state,
        toasts: state.toasts.map((t) => (t.id === action.toast.id ? { ...t, ...action.toast } : t)),
      }

    case 'DISMISS_TOAST': {
      const { toastId } = action

      // ! Side effects ! - This could be extracted into a dismissToast() action,
      // but I'll keep it here for simplicity
      if (toastId) {
        addToRemoveQueue(toastId)
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id)
        })
      }

      return {
        ...state,
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? {
                ...t,
                open: false,
              }
            : t,
        ),
      }
    }
    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        return {
          ...state,
          toasts: [],
        }
      }
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      }
  }
}

const listeners: Array<(state: State) => void> = []

let memoryState: State = { toasts: [] }

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action)
  listeners.forEach((listener) => {
    listener(memoryState)
  })
}

type ToastOptions = Omit<ToasterToast, 'id'> & { id?: string }

type ToastReturn = {
  id: string
  dismiss: () => void
  update: (props: Partial<ToasterToast>) => void
}

type ToastHandler = {
  (props: ToastOptions): ToastReturn
  success: (props: Omit<ToastOptions, 'variant'>) => ToastReturn
  info: (props: Omit<ToastOptions, 'variant'>) => ToastReturn
  warning: (props: Omit<ToastOptions, 'variant'>) => ToastReturn
  error: (props: Omit<ToastOptions, 'variant'>) => ToastReturn
  dismiss: (toastId?: string) => void
  dismissAll: () => void
}

const createToast = ({ id: providedId, ...props }: ToastOptions): ToastReturn => {
  const id = providedId ?? genId()
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id })

  const existingToast = memoryState.toasts.find((toast) => toast.id === id)

  const toastPayload: ToasterToast = {
    ...existingToast,
    ...props,
    id,
    open: true,
    duration: props.duration ?? TOAST_REMOVE_DELAY,
    onOpenChange: (open) => {
      if (!open) dismiss()
      existingToast?.onOpenChange?.(open)
      props.onOpenChange?.(open)
    },
  }

  if (existingToast) {
    dispatch({ type: 'UPDATE_TOAST', toast: toastPayload })
  } else {
    dispatch({ type: 'ADD_TOAST', toast: toastPayload })
  }

  return {
    id,
    dismiss,
    update: (nextProps) =>
      dispatch({
        type: 'UPDATE_TOAST',
        toast: {
          ...toastPayload,
          ...nextProps,
          id,
        },
      }),
  }
}

const toast = Object.assign(createToast as ToastHandler, {
  success: (props: Omit<ToastOptions, 'variant'>) => createToast({ variant: 'success', ...props }),
  info: (props: Omit<ToastOptions, 'variant'>) => createToast({ variant: 'info', ...props }),
  warning: (props: Omit<ToastOptions, 'variant'>) => createToast({ variant: 'warning', ...props }),
  error: (props: Omit<ToastOptions, 'variant'>) =>
    createToast({ variant: 'destructive', ...props }),
  dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  dismissAll: () => dispatch({ type: 'DISMISS_TOAST' }),
})

function useToast() {
  const [state, setState] = React.useState<State>(memoryState)

  React.useEffect(() => {
    listeners.push(setState)
    return () => {
      const index = listeners.indexOf(setState)
      if (index > -1) {
        listeners.splice(index, 1)
      }
    }
  }, [])

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  }
}

export { useToast, toast }
