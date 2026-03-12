import { type NextRequest, NextResponse } from 'next/server'
import { getAdminSession } from '@/modules/auth/server'
import { getPluginSettings } from '@/modules/plugins/utils'
import logger from '@/server/observability/logger'

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession()
    if (!session) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { prompt } = await req.json()

    // Get AI configuration
    const { enabled, config } = await getPluginSettings('google-gemini')
    const provider = config.provider || 'google'
    const apiKey =
      provider === 'google' ? config.googleApiKey || config.apiKey : config.openRouterApiKey

    if (!enabled || !apiKey) {
      return NextResponse.json(
        {
          success: false,
          error: 'AI Assistant not configured. Please provide an API key in settings.',
        },
        { status: 400 },
      )
    }

    let text = ''

    if (provider === 'google') {
      const model = config.googleModel || config.model || 'gemini-1.5-flash'

      // Determine API version (stable models use v1, preview/2.0+ use v1beta)
      const isPreview = model.includes('2.0') || model.includes('3.0') || model.includes('preview')
      const apiVersion = isPreview ? 'v1beta' : 'v1'

      const response = await fetch(
        `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: prompt,
                  },
                ],
              },
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 4000,
            },
          }),
        },
      )

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}) as any)
        const msg = errorData?.error?.message || 'Unknown error'
        logger.error('Gemini API error', { status: response.status, message: msg })
        throw new Error(`Gemini Error: ${msg}`)
      }

      const data = await response.json()
      text = data.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || ''
    } else {
      // OpenRouter Implementation
      const model = config.openRouterModel || 'google/gemini-2.0-flash-001'
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
          'X-Title': 'Nova CMS',
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
          max_tokens: 4000,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}) as any)
        const msg = errorData?.error?.message || 'Unknown error'
        logger.error('OpenRouter API error', { status: response.status, message: msg })
        throw new Error(`OpenRouter Error: ${msg}`)
      }

      const data = await response.json()
      text = data.choices?.[0]?.message?.content?.trim() || ''
    }

    return NextResponse.json({ success: true, text })
  } catch (error: any) {
    logger.error('AI Generation Route error', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Internal server error' },
      { status: 502 },
    )
  }
}
