import { useCallback, useEffect, useState } from 'react'

interface RawS3Config {
  bucket?: string | null
  region?: string | null
  accessKeyId?: string | null
}

interface S3ConfigState {
  loading: boolean
  error: string | null
  isConfigured: boolean
  config: RawS3Config | null
  refresh: () => Promise<void>
}

interface CachedValue {
  config: RawS3Config | null
  isConfigured: boolean
  error: string | null
  timestamp: number
}

const CACHE_TTL = 60_000 // 60 seconds

let cached: CachedValue | null = null
let ongoingRequest: Promise<CachedValue> | null = null

async function fetchS3Config(): Promise<CachedValue> {
  if (ongoingRequest) {
    return ongoingRequest
  }

  ongoingRequest = fetch('/api/plugins/s3', { cache: 'no-store' })
    .then(async (response) => {
      if (!response.ok) {
        throw new Error(`Failed to load S3 configuration (${response.status})`)
      }

      const json = await response.json().catch(() => ({}))
      const rawConfig = (json?.config ?? null) as RawS3Config | null

      const isConfigured = Boolean(rawConfig?.bucket && rawConfig?.region)

      const nextValue: CachedValue = {
        config: rawConfig,
        isConfigured,
        error: json?.success === false ? json?.error || 'Unknown error' : null,
        timestamp: Date.now(),
      }

      cached = nextValue
      return nextValue
    })
    .catch((error: unknown) => {
      const message = error instanceof Error ? error.message : 'Unable to load S3 config'
      const nextValue: CachedValue = {
        config: null,
        isConfigured: false,
        error: message,
        timestamp: Date.now(),
      }
      cached = nextValue
      return nextValue
    })
    .finally(() => {
      ongoingRequest = null
    })

  return ongoingRequest
}

export function useS3Config(): S3ConfigState {
  const [state, setState] = useState<S3ConfigState>(() => ({
    loading: true,
    error: null,
    isConfigured: false,
    config: null,
    refresh: async () => {},
  }))

  const refresh = useCallback(async () => {
    setState((prev) => ({ ...prev, loading: true, error: null }))
    const result = await fetchS3Config()
    setState({
      loading: false,
      error: result.error,
      isConfigured: result.isConfigured,
      config: result.config,
      refresh,
    })
  }, [])

  useEffect(() => {
    const now = Date.now()
    if (cached && now - cached.timestamp < CACHE_TTL) {
      setState({
        loading: false,
        error: cached.error,
        isConfigured: cached.isConfigured,
        config: cached.config,
        refresh,
      })
      return
    }

    let mounted = true

    fetchS3Config().then((result) => {
      if (!mounted) return
      setState({
        loading: false,
        error: result.error,
        isConfigured: result.isConfigured,
        config: result.config,
        refresh,
      })
    })

    return () => {
      mounted = false
    }
  }, [refresh])

  return state
}
