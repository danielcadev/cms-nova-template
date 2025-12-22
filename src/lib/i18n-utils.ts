'use client'

/**
 * Sets the NEXT_LOCALE cookie and reloads the page to apply changes.
 * This is the recommended way to change language when not using middleware-based routing.
 */
export function setUserLocale(locale: string) {
    document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; SameSite=Lax`
    window.location.reload()
}

export function getUserLocale() {
    const match = document.cookie.match(/NEXT_LOCALE=([^;]+)/)
    return match ? match[1] : 'es'
}
