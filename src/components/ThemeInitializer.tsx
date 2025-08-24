import Script from 'next/script'

export function ThemeInitializer() {
  return (
    // biome-ignore lint/correctness/useUniqueElementIds: This is a unique script that runs once
    <Script
      id="theme-initializer"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            try {
              // No-op: theming is applied inside AdminLayout container, not on <html>/<body>.
              // Keeping script to avoid breaking order, but it intentionally does nothing now.
            } catch (_) {}
          })();
        `,
      }}
    />
  )
}
