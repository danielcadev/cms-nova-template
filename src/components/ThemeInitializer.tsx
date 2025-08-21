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
              var path = window.location.pathname || '';
              if (path.indexOf('/admin') === -1) return;
              var savedTheme = localStorage.getItem('nova-theme') || 'light';
              var themeClasses = ['theme-light', 'theme-dark', 'theme-blue', 'theme-green', 'theme-purple', 'theme-orange', 'theme-beige'];
              var darkThemes = ['dark', 'blue', 'green', 'purple', 'orange'];
              var root = document.documentElement;
              var body = document.body;

              themeClasses.forEach(function(cls){ root.classList.remove(cls); body.classList.remove(cls); });
              root.classList.add('theme-' + savedTheme);
              body.classList.add('theme-' + savedTheme);

              if (darkThemes.indexOf(savedTheme) !== -1) { root.classList.add('dark'); body.classList.add('dark'); } else { root.classList.remove('dark'); body.classList.remove('dark'); }
              root.setAttribute('data-theme', savedTheme);
              body.setAttribute('data-theme', savedTheme);
            } catch (_) {}
          })();
        `,
      }}
    />
  )
}
